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
  role: "user" | "persona";
  content: string;
  timestamp: Date;
}

// Fallback text chat responses
const fallbackResponses: Record<string, string> = {
  "ai automation":
    "Stephen specializes in AI automation that saves businesses 20+ hours per week! This includes custom chatbots, workflow automation, and AI-powered content generation. Would you like to book a free consultation to discuss your needs?",
  services:
    "Stephen offers 5 core services:\n\n🤖 AI Automation\n💻 Web Development\n📊 Business Systems\n🎯 Consulting\n🎓 Training\n\nEach is tailored to help businesses scale efficiently. Which interests you most?",
  consultation:
    "Great choice! You can book a free 30-minute discovery call with Stephen. Click here to schedule: https://cal.com/stevetotibooking\n\nOr send a message via the contact form!",
  portfolio:
    "Stephen has delivered 100+ projects across 15+ countries! Some highlights:\n\n• Trade Farm - AI agricultural platform ($2M+ transactions)\n• Pacific Resort Group - 40% booking increase\n• Healthcare Simulation - 2,000+ medical students\n\nVisit /portfolio for the full showcase!",
  book: "You can book a free discovery call with Stephen right now! Visit: https://cal.com/stevetotibooking",
  hello:
    "👋 Hi there! I'm Toti AI, Stephen's virtual assistant. How can I help you today?",
  hi: "👋 Hello! I'm Toti AI. I can help you learn about Stephen's services, book a consultation, or answer questions about AI automation and web development.",
};

const quickReplies = [
  "Tell me about AI automation",
  "What services do you offer?",
  "Book a discovery call",
  "View portfolio",
];

// Helper function to parse links in text
function parseLinks(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Reset regex lastIndex
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
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const anamClientRef = useRef<AnamClient | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (anamClientRef.current) {
        anamClientRef.current.stopStreaming().catch(console.error);
      }
    };
  }, []);

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

  // Initialize video connection
  const startVideoChat = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
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

      client.addListener(
        AnamEvent.CONNECTION_CLOSED,
        (...args: unknown[]) => {
          console.log("Connection closed:", args);
          setIsConnected(false);
          setIsConnecting(false);
        }
      );

      client.addListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        (msgs: unknown) => {
          const messages = msgs as Message[];
          setMessages(
            messages.map((m: Message) => ({
              ...m,
              timestamp: new Date(),
            }))
          );
        }
      );

      client.addListener(AnamEvent.MIC_PERMISSION_DENIED, () => {
        setError("Microphone access is required for voice chat");
        setIsConnecting(false);
      });

      // Start streaming to video element
      await client.streamToVideoElement("anam-video");
    } catch (err) {
      console.error("Failed to start video chat:", err);
      setError("Failed to connect to video chat. Falling back to text chat.");
      setIsVideoMode(false);
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
    setIsConnected(false);
  }, []);

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      // Find audio track and mute/unmute
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
    if (isVideoMode) {
      startVideoChat();
    } else if (!hasGreeted) {
      showGreeting();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    stopVideoChat();
  };

  // Text chat greeting
  const showGreeting = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages([
        {
          id: "greeting-1",
          role: "persona",
          content: "👋 Hi there! I'm Toti AI, Stephen's virtual assistant.",
          timestamp: new Date(),
        },
        {
          id: "greeting-2",
          role: "persona",
          content:
            "I can help you learn about Stephen's services, book a consultation, or answer questions about AI automation and web development.",
          timestamp: new Date(),
        },
        {
          id: "greeting-3",
          role: "persona",
          content: "How can I help you today?",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setHasGreeted(true);
    }, 1000);
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

    // Simulate response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response =
        "Thanks for your message! Stephen typically responds within 24 hours. For immediate assistance, you can:\n\n• Book a call at cal.com/stevetotibooking\n• Email totinarh24@gmail.com\n• Check the FAQ on the contact page";

      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (lowerText.includes(key)) {
          response = value;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "persona",
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  // Switch to text mode
  const switchToTextMode = () => {
    stopVideoChat();
    setIsVideoMode(false);
    setError(null);
    if (!hasGreeted) {
      showGreeting();
    }
  };

  // Switch to video mode
  const switchToVideoMode = () => {
    setIsVideoMode(true);
    startVideoChat();
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
        <Video size={28} />
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
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] 
                       flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10
                       bg-gray-950/95 backdrop-blur-xl"
            style={{ height: isVideoMode ? "550px" : "600px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-vibrantorange to-orange-500 p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {isVideoMode && isConnected ? (
                    <Sparkles size={24} className="text-white" />
                  ) : (
                    <Bot size={28} className="text-white" />
                  )}
                </div>
                {isConnected && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Toti AI
                  {isVideoMode && <Video size={14} />}
                  {!isVideoMode && <MessageCircle size={14} />}
                </h3>
                <p className="text-white/80 text-sm">
                  {isConnecting
                    ? "Connecting..."
                    : isConnected
                      ? "Video Chat Active"
                      : "Stephen's Virtual Assistant"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Video Mode */}
            {isVideoMode && (
              <div className="flex-1 flex flex-col">
                {/* Video Container */}
                <div className="relative flex-1 bg-black flex items-center justify-center">
                  {isConnecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900/90 z-10">
                      <Loader2 size={48} className="text-vibrantorange animate-spin" />
                      <p className="text-white/80 text-sm">Connecting to Toti AI...</p>
                      <p className="text-white/50 text-xs">Please allow microphone access</p>
                    </div>
                  )}

                  {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900/90 z-10 p-4">
                      <AlertCircle size={48} className="text-red-400" />
                      <p className="text-white/80 text-sm text-center">{error}</p>
                      <button
                        onClick={switchToTextMode}
                        className="px-4 py-2 bg-vibrantorange hover:bg-vibrantorange/80 rounded-lg text-white text-sm transition-colors"
                      >
                        Switch to Text Chat
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
                </div>

                {/* Video Controls */}
                <div className="p-4 bg-gray-900 border-t border-white/10">
                  <div className="flex items-center justify-center gap-4">
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
                      onClick={switchToTextMode}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                      title="Switch to Text Chat"
                    >
                      <MessageCircle size={20} />
                    </button>
                  </div>

                  {/* Book Call Button */}
                  <a
                    href="https://cal.com/stevetotibooking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 
                             bg-vibrantorange/20 hover:bg-vibrantorange/30 border border-vibrantorange/50
                             rounded-xl text-vibrantorange transition-colors"
                  >
                    <Calendar size={18} />
                    <span>Book a Discovery Call</span>
                  </a>
                </div>
              </div>
            )}

            {/* Text Mode */}
            {!isVideoMode && (
              <>
                {/* Mode Switch */}
                <div className="p-2 bg-gray-900/50 border-b border-white/10 flex justify-center">
                  <button
                    onClick={switchToVideoMode}
                    className="flex items-center gap-2 px-4 py-2 bg-vibrantorange/20 hover:bg-vibrantorange/30 
                             border border-vibrantorange/50 rounded-full text-vibrantorange text-sm transition-colors"
                  >
                    <Video size={16} />
                    <span>Switch to Video Chat</span>
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
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-vibrantorange text-white rounded-br-md"
                            : "bg-white/10 text-white rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{parseLinks(message.content)}</p>
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
                </div>

                {/* Book Call CTA */}
                <div className="px-4 pb-2">
                  <a
                    href="https://cal.com/stevetotibooking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 
                             bg-vibrantorange/20 hover:bg-vibrantorange/30 border border-vibrantorange/50
                             rounded-xl text-vibrantorange text-sm transition-colors"
                  >
                    <Calendar size={16} />
                    <span>Book a Discovery Call</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
