"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const greetings = [
  "👋 Hi there! I'm Toti AI, Stephen's virtual assistant.",
  "Welcome! I can help you learn about Stephen's services, book a consultation, or answer questions about AI automation and web development.",
  "How can I help you today?"
];

const quickReplies = [
  "Tell me about AI automation",
  "What services do you offer?",
  "Book a consultation",
  "View portfolio",
];

export default function AnamChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Show greeting when chat opens
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessages(greetings.map((content, i) => ({
          id: `greeting-${i}`,
          role: "assistant" as const,
          content,
          timestamp: new Date(),
        })));
        setIsTyping(false);
        setHasGreeted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasGreeted]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (in production, this would call Anam AI API)
    setTimeout(() => {
      const responses: Record<string, string> = {
        "ai automation": "Steve specializes in AI automation that saves businesses 20+ hours per week! This includes custom chatbots, workflow automation, and AI-powered content generation. Would you like to book a free consultation to discuss your needs?",
        "services": "Stephen offers 5 core services:\n\n🤖 AI Automation\n💻 Web Development\n📊 Business Systems\n🎯 Consulting\n🎓 Training\n\nEach is tailored to help businesses scale efficiently. Which interests you most?",
        "consultation": "Great choice! You can book a free 30-minute discovery call with Steve. Click here to schedule: https://cal.com/stevetotibooking/discovery-call-toti\n\nOr send a message via the contact form!",
        "portfolio": "Stephen has delivered 100+ projects across 15+ countries! Some highlights:\n\n• Trade Farm - AI agricultural platform ($2M+ transactions)\n• Pacific Resort Group - 40% booking increase\n• Healthcare Simulation - 2,000+ medical students\n\nVisit /portfolio for the full showcase!",
      };

      const lowerText = text.toLowerCase();
      let response = "Thanks for your message! Steve typically responds within 24 hours. For immediate assistance, you can:\n\n• Book a call at cal.com/stevetotibooking\n• Email totinarh24@gmail.com\n• Check the FAQ on the contact page";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerText.includes(key)) {
          response = value;
          break;
        }
      }

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-vibrantorange to-orange-500 
                   text-white shadow-lg shadow-vibrantorange/30 hover:shadow-xl hover:shadow-vibrantorange/40
                   transition-all ${isOpen ? 'hidden' : 'flex'}`}
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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)]
                       flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-vibrantorange to-orange-500 p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={28} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Toti AI
                  <Sparkles size={14} />
                </h3>
                <p className="text-white/80 text-sm">Stephen&apos;s Virtual Assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-vibrantorange text-white rounded-br-md"
                        : "bg-white/10 text-white rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
