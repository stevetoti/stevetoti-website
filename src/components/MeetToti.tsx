"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Bot, Video, Calendar, MessageCircle, ArrowRight } from "lucide-react";

export default function MeetToti() {
  const features = [
    {
      icon: MessageCircle,
      title: "24/7 Available",
      description: "I'm always here to answer your questions about Stephen's services",
    },
    {
      icon: Video,
      title: "Discovery Calls",
      description: "I'll handle your initial discovery call to understand your needs",
    },
    {
      icon: Calendar,
      title: "Connect to Stephen",
      description: "For qualified projects, I'll schedule a follow-up with Stephen directly",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-vibrantorange/5 rounded-full blur-3xl -z-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glowing ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-vibrantorange to-deepblue blur-2xl opacity-30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <Image
                  src="/images/toti-avatar.jpg"
                  alt="Toti - AI Business Assistant"
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                
                {/* AI Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full border border-vibrantorange/50">
                  <Bot size={18} className="text-vibrantorange" />
                  <span className="text-white text-sm font-medium">AI Assistant</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-vibrantorange/10 rounded-full border border-vibrantorange/30 mb-6">
              <Bot size={16} className="text-vibrantorange" />
              <span className="text-vibrantorange text-sm font-medium">Meet Your First Point of Contact</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Hi, I&apos;m </span>
              <span className="gradient-text">Toti</span>
            </h2>

            <p className="text-xl text-gray-300 mb-6">
              I&apos;m Stephen&apos;s AI Business Assistant, powered by advanced AI technology. 
              I&apos;m here to help you explore how we can transform your business.
            </p>

            <p className="text-gray-400 mb-8">
              When you book a discovery call, <strong className="text-white">I&apos;ll be the one meeting with you first</strong>. 
              I&apos;ll learn about your project, answer your questions about our services, and help determine 
              if we&apos;re a good fit. For qualified projects, I&apos;ll connect you directly with Stephen 
              for a deeper conversation.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-vibrantorange/10 text-vibrantorange">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="https://cal.com/stevetotibooking/discovery-call-toti"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Video size={20} />
                Book a Discovery Call with Me
                <ArrowRight size={18} />
              </motion.a>
              
              <motion.button
                onClick={() => {
                  // Trigger the chat widget
                  const chatButton = document.querySelector('[data-toti-chat]') as HTMLButtonElement;
                  if (chatButton) chatButton.click();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 
                         transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Chat with Me Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
