"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle, Sparkles, Zap } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    
    // Simulate API call - in production, this would send to a backend/email service
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For now, we'll open the user's email client with a pre-filled message
    window.location.href = `mailto:totinarh24@gmail.com?subject=Newsletter Signup&body=Please add me to your newsletter: ${email}`;
    
    setStatus("success");
    setEmail("");
    
    // Reset status after 5 seconds
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-deepblue/10 via-transparent to-deepblue/10" />
        <motion.div
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-vibrantorange/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-deepblue/20 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-vibrantorange/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-deepblue/20 to-transparent rounded-tr-full" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                          bg-gradient-to-br from-vibrantorange to-orange-600 mb-4 shadow-lg shadow-vibrantorange/30"
              >
                <Mail size={28} className="text-white" />
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stay in the Loop
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Get exclusive insights on AI automation, web development tips, and business 
                growth strategies delivered straight to your inbox.
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { icon: Sparkles, text: "Exclusive content" },
                { icon: Zap, text: "Early access" },
                { icon: Mail, text: "No spam, ever" },
              ].map((benefit) => (
                <div
                  key={benefit.text}
                  className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full"
                >
                  <benefit.icon size={14} className="text-vibrantorange" />
                  {benefit.text}
                </div>
              ))}
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">You&apos;re In!</h3>
                  <p className="text-gray-400">
                    Thanks for subscribing. Check your email for confirmation!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                >
                  <div className="flex-1 relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl 
                               text-white placeholder-gray-500 focus:outline-none focus:border-vibrantorange 
                               transition-colors"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-vibrantorange to-orange-500 text-white 
                             font-semibold rounded-xl hover:shadow-lg hover:shadow-vibrantorange/30 
                             transition-all disabled:opacity-70 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Subscribe
                        <Send size={18} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Privacy note */}
            <p className="text-center text-xs text-gray-500 mt-6">
              By subscribing, you agree to receive emails from Stephen Totimeh. 
              Unsubscribe anytime with one click.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
