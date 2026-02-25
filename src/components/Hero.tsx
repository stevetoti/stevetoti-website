"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Video Background (placeholder - will use gradient for now) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-deepblue via-gray-950 to-gray-900" />
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(239, 94, 51, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(239, 94, 51, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(239, 94, 51, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(239, 94, 51, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <Sparkles size={16} className="text-vibrantorange" />
          <span className="text-sm text-gray-300">AI-Powered Solutions for Modern Businesses</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">Transform Your Business</span>
          <br />
          <span className="gradient-text">with AI</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10"
        >
          I help businesses leverage cutting-edge AI automation, modern web development, 
          and innovative digital solutions to scale globally. From Vanuatu to the world.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-0"
        >
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            Start Your Project
            <ArrowRight size={20} />
          </Link>
          <Link
            href="https://www.youtube.com/@stevetoti"
            target="_blank"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Play size={20} />
            Watch My Content
          </Link>
        </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-vibrantorange/30 to-deepblue/30 rounded-3xl blur-3xl transform scale-95" />
              
              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <Image
                  src="/images/steve-headshot.jpg"
                  alt="Stephen Totimeh - CEO & Digital Solutions Expert"
                  width={500}
                  height={600}
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-4 top-1/4 glass-card px-4 py-2 shadow-xl"
              >
                <span className="text-vibrantorange font-semibold">7+ Years</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-4 bottom-1/4 glass-card px-4 py-2 shadow-xl"
              >
                <span className="text-vibrantorange font-semibold">100+ Projects</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mt-16"
        >
          {[
            { number: "7+", label: "Years Experience" },
            { number: "100+", label: "Projects Delivered" },
            { number: "3", label: "Global Companies" },
            { number: "15+", label: "Countries Served" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="glass-card p-4 md:p-6 text-center hover-lift"
            >
              <div className="text-2xl md:text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-3 bg-vibrantorange rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
