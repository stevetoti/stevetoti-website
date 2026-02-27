"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  X,
  Mic,
  MicOff,
  PhoneOff,
  MessageCircle,
  Send,
  Bot,
  Sparkles,
  Loader2,
  Volume2,
  VolumeX,
  Calendar,
  AlertCircle,
  User,
  Phone,
  FileText,
  ArrowRight,
  Camera,
  CameraOff,
} from "lucide-react";

// Types for Anam SDK
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnamCallback = (...args: any[]) => void;

interface AnamClient {
  streamToVideoElement: (elementId: string) => Promise<void>;
  stopStreaming: () => Promise<void>;
  addListener: (event: string, callback: AnamCallback) => void;
  removeListener: (event: string, callback: AnamCallback) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface LeadFormData {
  name: string;
  phone: string;
  reason: string;
}

// View states
type ViewState = "chat" | "lead-form" | "video";

const greetings = [
  "👋 Hi there! I'm Toti, Steve's AI assistant.",
  "I can help you learn about our services, answer questions about AI automation, or connect you for a face-to-face video chat.",
  "What brings you here today?",
];

const quickReplies = [
  "Tell me about AI automation",
  "What services do you offer?",
  "Book a discovery call",
  "View portfolio",
];

const callReasons = [
  "Discussing a new project",
  "AI automation consultation",
  "Web development inquiry",
  "Partnership opportunity",
  "General questions",
  "Other",
];

// Helper function to parse links in text
function parseLinks(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0;
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-vibrantorange hover:underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default function AnamVideoAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("chat");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [sessionId] = useState(() => `visitor-${Date.now()}`);

  // Lead form state
  const [leadForm, setLeadForm] = useState<LeadFormData>({
    name: "",
    phone: "",
    reason: callReasons[0],
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const anamClientRef = useRef<AnamClient | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (anamClientRef.current) {
        anamClientRef.current.stopStreaming().catch(console.error);
      }
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Show greeting when chat opens
  const showGreeting = useCallback(() => {
    if (hasGreeted) return;
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages(
        greetings.map((content, i) => ({
          id: `greeting-${i}`,
          role: "assistant" as const,
          content,
          timestamp: new Date(),
        }))
      );
      setIsTyping(false);
      setHasGreeted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [hasGreeted]);

  // Get session token from API
  const getSessionToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/anam/session", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to get session token");
      }

      const data = await response.json();
      return data.sessionToken;
    } catch (err) {
      console.error("Session token error:", err);
      return null;
    }
  };

  // Start user's camera
  const startUserCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      userStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsCameraOn(false);
    }
  };

  // Stop user's camera
  const stopUserCamera = () => {
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach((track) => track.stop());
      userStreamRef.current = null;
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
  };

  // Toggle user camera
  const toggleCamera = () => {
    if (isCameraOn) {
      stopUserCamera();
      setIsCameraOn(false);
    } else {
      startUserCamera();
    }
  };

  // Initialize video connection
  const startVideoChat = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Start user camera
      await startUserCamera();

      // Dynamic import of Anam SDK
      const { createClient, AnamEvent } = await import("@anam-ai/js-sdk");

      const sessionToken = await getSessionToken();
      if (!sessionToken) {
        throw new Error("Could not obtain session token");
      }

      const client = createClient(sessionToken) as AnamClient;
      anamClientRef.current = client;

      // Set up event listeners
      client.addListener(AnamEvent.CONNECTION_ESTABLISHED, () => {
        setIsConnected(true);
        setIsConnecting(false);
      });

      client.addListener(AnamEvent.CONNECTION_CLOSED, (...args: unknown[]) => {
        console.log("Connection closed:", args);
        setIsConnected(false);
        setIsConnecting(false);
      });

      client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (msgs: unknown) => {
        const messages = msgs as Message[];
        setMessages(
          messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(),
          }))
        );
      });

      client.addListener(AnamEvent.MIC_PERMISSION_DENIED, () => {
        setError("Microphone access is required for voice chat");
        setIsConnecting(false);
      });

      // Start streaming to video element
      await client.streamToVideoElement("anam-video");
    } catch (err) {
      console.error("Failed to start video chat:", err);
      setError(
        "Failed to connect to video chat. You can continue with text chat."
      );
      setViewState("chat");
      setIsConnecting(false);
    }
  }, []);

  // Stop video chat
  const stopVideoChat = useCallback(async () => {
    if (anamClientRef.current) {
      try {
        await anamClientRef.current.stopStreaming();
      } catch (err) {
        console.error("Error stopping stream:", err);
      }
      anamClientRef.current = null;
    }
    stopUserCamera();
    setIsConnected(false);
  }, []);

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = isMuted;
        });
      }
    }
  };

  // Toggle video audio
  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isAudioMuted;
    }
  };

  // Handle opening/closing
  const handleOpen = () => {
    setIsOpen(true);
    setViewState("chat");
    showGreeting();
  };

  const handleClose = () => {
    setIsOpen(false);
    stopVideoChat();
  };

  // Handle text chat send
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionId,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            data.message ||
            "Sorry, I couldn't process that. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please try again or book a call directly at cal.com/stevetotibooking/discovery-call-toti",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle upgrade to video
  const handleUpgradeToVideo = () => {
    setViewState("lead-form");
  };

  // Handle lead form submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      return;
    }

    setIsSubmittingLead(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName: leadForm.name,
          visitorPhone: leadForm.phone,
          callReason: leadForm.reason,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save info");
      }

      // Start video chat
      setViewState("video");
      startVideoChat();
    } catch (err) {
      console.error("Lead submission error:", err);
      // Still allow video even if lead save fails
      setViewState("video");
      startVideoChat();
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Switch back to chat
  const switchToChat = () => {
    stopVideoChat();
    setViewState("chat");
    setError(null);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        data-toti-chat
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-vibrantorange to-orange-500 
                   text-white shadow-lg shadow-vibrantorange/30 hover:shadow-xl hover:shadow-vibrantorange/40
                   transition-all ${isOpen ? "hidden" : "flex"} items-center gap-2`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1 }}
      >
        <MessageCircle size={28} />
        <motion.span
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] 
                       flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10
                       bg-gray-950/95 backdrop-blur-xl"
            style={{ height: viewState === "video" ? "650px" : "600px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-vibrantorange to-orange-500 p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {viewState === "video" && isConnected ? (
                    <Sparkles size={24} className="text-white" />
                  ) : (
                    <Bot size={28} className="text-white" />
                  )}
                </div>
                {(viewState === "chat" || isConnected) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Toti AI
                  {viewState === "video" && <Video size={14} />}
                  {viewState === "chat" && <MessageCircle size={14} />}
                </h3>
                <p className="text-white/80 text-sm">
                  {isConnecting
                    ? "Connecting..."
                    : isConnected
                      ? "Video Chat Active"
                      : "Steve's AI Assistant"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Chat View */}
            {viewState === "chat" && (
              <>
                {/* Upgrade to Video CTA */}
                <div className="p-3 bg-gradient-to-r from-deepblue/50 to-deepblue/30 border-b border-white/10">
                  <button
                    onClick={handleUpgradeToVideo}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                             bg-vibrantorange hover:bg-vibrantorange/90 
                             rounded-xl text-white font-medium transition-colors"
                  >
                    <Video size={18} />
                    <span>Upgrade to Video Call</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-vibrantorange text-white rounded-br-md"
                            : "bg-white/10 text-white rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {parseLinks(message.content)}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 p-3 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Quick Replies */}
                  {messages.length > 0 && !isTyping && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleSend(reply)}
                          className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 
                                   rounded-full text-gray-300 hover:text-white transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Book Call CTA */}
                <div className="px-4 pb-2">
                  <a
                    href="https://cal.com/stevetotibooking/discovery-call-toti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 
                             bg-white/5 hover:bg-white/10 border border-white/10
                             rounded-xl text-gray-300 text-sm transition-colors"
                  >
                    <Calendar size={16} />
                    <span>Or schedule a call for later</span>
                  </a>
                </div>

                {/* Input */}
                <div className="p-4 bg-gray-900 border-t border-white/10">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend(input);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                               placeholder-gray-500 focus:outline-none focus:border-vibrantorange transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="p-3 bg-vibrantorange hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
                               rounded-xl text-white transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* Lead Capture Form */}
            {viewState === "lead-form" && (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vibrantorange/20 flex items-center justify-center">
                    <Video size={32} className="text-vibrantorange" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ready for Video?
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Quick info so I know who I&apos;m chatting with!
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User size={14} className="inline mr-2" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={leadForm.name}
                      onChange={(e) =>
                        setLeadForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="John Smith"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                               placeholder-gray-500 focus:outline-none focus:border-vibrantorange transition-colors"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone size={14} className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) =>
                        setLeadForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+1 (555) 123-4567"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                               placeholder-gray-500 focus:outline-none focus:border-vibrantorange transition-colors"
                    />
                  </div>

                  {/* Reason Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FileText size={14} className="inline mr-2" />
                      Reason for Call
                    </label>
                    <select
                      value={leadForm.reason}
                      onChange={(e) =>
                        setLeadForm((prev) => ({ ...prev, reason: e.target.value }))
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                               focus:outline-none focus:border-vibrantorange transition-colors appearance-none
                               cursor-pointer"
                    >
                      {callReasons.map((reason) => (
                        <option key={reason} value={reason} className="bg-gray-900">
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingLead || !leadForm.name || !leadForm.phone}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 
                             bg-vibrantorange hover:bg-vibrantorange/90 disabled:opacity-50
                             rounded-xl text-white font-medium transition-colors mt-6"
                  >
                    {isSubmittingLead ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Starting Video...</span>
                      </>
                    ) : (
                      <>
                        <Video size={20} />
                        <span>Start Video Call</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {/* Back to Chat */}
                  <button
                    type="button"
                    onClick={() => setViewState("chat")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 
                             text-gray-400 hover:text-white transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span>Back to text chat</span>
                  </button>
                </form>
              </div>
            )}

            {/* Video View - 50/50 Split */}
            {viewState === "video" && (
              <div className="flex-1 flex flex-col">
                {/* Video Container - 50/50 Split */}
                <div className="flex-1 flex flex-col md:flex-row">
                  {/* Toti Avatar - 50% */}
                  <div className="relative flex-1 bg-black flex items-center justify-center min-h-[200px]">
                    {isConnecting && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900/90 z-10">
                        <Loader2
                          size={48}
                          className="text-vibrantorange animate-spin"
                        />
                        <p className="text-white/80 text-sm">
                          Connecting to Toti AI...
                        </p>
                        <p className="text-white/50 text-xs">
                          Please allow microphone access
                        </p>
                      </div>
                    )}

                    {error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900/90 z-10 p-4">
                        <AlertCircle size={48} className="text-red-400" />
                        <p className="text-white/80 text-sm text-center">{error}</p>
                        <button
                          onClick={switchToChat}
                          className="px-4 py-2 bg-vibrantorange hover:bg-vibrantorange/80 rounded-lg text-white text-sm transition-colors"
                        >
                          Back to Text Chat
                        </button>
                      </div>
                    )}

                    <video
                      ref={videoRef}
                      id="anam-video"
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Toti Label */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-white text-xs flex items-center gap-1">
                      <Bot size={12} />
                      Toti AI
                    </div>
                  </div>

                  {/* User Camera - 50% */}
                  <div className="relative flex-1 bg-gray-900 flex items-center justify-center min-h-[200px]">
                    {isCameraOn ? (
                      <video
                        ref={userVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <CameraOff size={48} />
                        <p className="text-sm">Camera off</p>
                      </div>
                    )}

                    {/* User Label */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-white text-xs flex items-center gap-1">
                      <User size={12} />
                      You
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="p-4 bg-gray-900 border-t border-white/10">
                  <div className="flex items-center justify-center gap-3">
                    {/* Mic Toggle */}
                    <button
                      onClick={toggleMute}
                      className={`p-3 rounded-full transition-colors ${
                        isMuted
                          ? "bg-red-500/20 text-red-400"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    {/* Camera Toggle */}
                    <button
                      onClick={toggleCamera}
                      className={`p-3 rounded-full transition-colors ${
                        !isCameraOn
                          ? "bg-red-500/20 text-red-400"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                      title={isCameraOn ? "Turn camera off" : "Turn camera on"}
                    >
                      {isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
                    </button>

                    {/* End Call */}
                    <button
                      onClick={handleClose}
                      className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                      title="End Chat"
                    >
                      <PhoneOff size={24} />
                    </button>

                    {/* Audio Toggle */}
                    <button
                      onClick={toggleAudio}
                      className={`p-3 rounded-full transition-colors ${
                        isAudioMuted
                          ? "bg-red-500/20 text-red-400"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                      title={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    {/* Switch to Text */}
                    <button
                      onClick={switchToChat}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                      title="Switch to Text Chat"
                    >
                      <MessageCircle size={20} />
                    </button>
                  </div>

                  {/* Book Call Button */}
                  <a
                    href="https://cal.com/stevetotibooking/discovery-call-toti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 
                             bg-vibrantorange/20 hover:bg-vibrantorange/30 border border-vibrantorange/50
                             rounded-xl text-vibrantorange transition-colors text-sm"
                  >
                    <Calendar size={16} />
                    <span>Schedule a follow-up call</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
