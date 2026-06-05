"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Calendar } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "👋 Hi, I'm Toti — Steve's AI assistant. I can tell you about his AI automation, web, and consulting work, or book you a free 30-minute discovery call. What brings you here today?";

const quickReplies = [
  "What does Steve do?",
  "I need AI automation",
  "Book a discovery call",
  "See the portfolio",
];

const CAL_LINK = "https://cal.com/stevetotibooking/discovery-call-toti";

export default function AnamChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gentle nudge bubble after a few seconds (once).
  useEffect(() => {
    const t = setTimeout(() => setShowNudge(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: "greeting", role: "assistant", content: GREETING }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || isTyping) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsTyping(true);

    try {
      // Send only the real conversation (from the first user turn onward).
      const firstUser = next.findIndex((m) => m.role === "user");
      const history = next.slice(firstUser).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: data.message || "Sorry, I had trouble there — could you try again?" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: "I couldn't reach the server just now. You can book directly at " + CAL_LINK },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const open = () => { setIsOpen(true); setShowNudge(false); };

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", delay: 0.8 }}
          >
            <AnimatePresence>
              {showNudge && (
                <motion.button
                  onClick={open}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="max-w-[230px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-left text-sm text-gray-800 shadow-xl"
                >
                  👋 Need help or want to book a call with Steve? Chat with me!
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              onClick={open}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/30 shadow-2xl shadow-vibrantorange/40 ring-2 ring-vibrantorange/60"
              aria-label="Chat with Toti"
            >
              <Image src="/images/toti-avatar.jpg" alt="Toti" fill className="object-cover" />
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-green-400" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 26 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] max-h-[calc(100vh-3rem)] w-[390px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-gray-950 shadow-2xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden px-5 py-4">
              <div className="absolute inset-0 bg-gradient-to-br from-deepblue via-deepblue-600 to-vibrantorange" />
              <div className="relative flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/40">
                  <Image src="/images/toti-avatar.jpg" alt="Toti" fill className="object-cover" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-deepblue bg-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="flex items-center gap-1.5 font-semibold text-white">
                    Toti <Sparkles size={14} className="text-amber-200" />
                  </h3>
                  <p className="text-xs text-white/80">Steve&apos;s AI Assistant · Online</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-white/90 transition-colors hover:bg-white/20" aria-label="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-gray-950 to-gray-900 p-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-vibrantorange text-white"
                        : "rounded-bl-md border border-white/10 bg-white/[0.06] text-gray-100 backdrop-blur-xl"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="h-2 w-2 rounded-full bg-gray-400"
                          animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick replies (only at the start) */}
              {messages.length <= 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickReplies.map((q) => (
                    <button key={q} onClick={() => send(q)}
                      className="rounded-full border border-vibrantorange/40 bg-vibrantorange/10 px-3 py-1.5 text-xs text-orange-200 transition-colors hover:bg-vibrantorange/20">
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book CTA + input */}
            <div className="border-t border-white/10 bg-gray-900 p-3">
              <a href={CAL_LINK} target="_blank" rel="noopener noreferrer"
                className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
                <Calendar size={14} className="text-vibrantorange" /> Or book a free 30-min discovery call →
              </a>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Toti anything…"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-vibrantorange focus:outline-none"
                />
                <button type="submit" disabled={!input.trim() || isTyping}
                  className="rounded-xl bg-vibrantorange p-3 text-white transition-colors hover:bg-vibrantorange-500 disabled:cursor-not-allowed disabled:opacity-50">
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
