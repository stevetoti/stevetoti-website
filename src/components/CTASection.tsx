"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-deepblue via-gray-900 to-deepblue" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-vibrantorange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-deepblue/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Ready to </span>
            <span className="gradient-text">Transform</span>
            <span className="text-white"> Your Business?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Let&apos;s discuss how AI automation and modern web solutions can help 
            you achieve your goals. Book a free consultation call today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              <Calendar size={20} />
              Book a Free Call
            </Link>
            <Link href="/contact#form" className="btn-secondary inline-flex items-center gap-2">
              <MessageCircle size={20} />
              Send a Message
            </Link>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Usually responds within 24 hours
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-vibrantorange" />
              Free initial consultation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              No commitment required
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
