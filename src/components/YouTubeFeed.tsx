"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Youtube, ExternalLink, Play, Sparkles, Bell } from "lucide-react";

// Featured videos with embed capability
// These can be updated with real video IDs from @stevetoti channel
const featuredVideos = [
  {
    id: "video1",
    videoId: "dQw4w9WgXcQ", // Placeholder - replace with real video ID
    title: "Getting Started with AI Automation",
    description: "Learn how to leverage AI tools to automate your business",
    category: "AI Automation",
  },
  {
    id: "video2", 
    videoId: "dQw4w9WgXcQ", // Placeholder - replace with real video ID
    title: "Building Modern Web Apps with Next.js",
    description: "Step-by-step guide to creating scalable web applications",
    category: "Web Development",
  },
  {
    id: "video3",
    videoId: "dQw4w9WgXcQ", // Placeholder - replace with real video ID
    title: "Scaling Tech Business Globally",
    description: "Insights from building international tech companies",
    category: "Entrepreneurship",
  },
];

// Content topics for when videos aren't available
const contentTopics = [
  {
    icon: "🤖",
    title: "AI Automation",
    description: "Automate repetitive tasks and scale your business with AI",
  },
  {
    icon: "💻",
    title: "Web Development",
    description: "Modern web apps with Next.js, React, and cutting-edge tools",
  },
  {
    icon: "🌏",
    title: "Global Business",
    description: "Build international tech companies from anywhere",
  },
];

export default function YouTubeFeed() {
  // Toggle this to show video embeds vs topic cards
  const showVideoEmbeds = false; // Set to true when real video IDs are added

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] 
                     bg-red-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 text-red-500 mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Youtube size={24} />
            <span className="text-sm font-medium uppercase tracking-wider">YouTube Channel</span>
          </motion.div>
          <h2 className="section-heading">
            <span className="text-white">Learn & </span>
            <span className="gradient-text">Grow</span>
          </h2>
          <p className="section-subheading">
            Free tutorials, insights, and behind-the-scenes content on building digital businesses.
          </p>
        </motion.div>

        {/* Featured Channel Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/10 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Channel Avatar */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-600 to-red-700 
                            flex items-center justify-center shadow-xl shadow-red-500/30">
                <Youtube size={48} className="text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-950 
                          flex items-center justify-center"
              >
                <span className="text-[8px] font-bold text-white">LIVE</span>
              </motion.div>
            </motion.div>

            {/* Channel Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2 
                           justify-center md:justify-start">
                @stevetoti
                <Sparkles size={20} className="text-vibrantorange" />
              </h3>
              <p className="text-gray-400 mb-4 max-w-xl">
                AI automation tutorials, web development guides, and insights on building 
                global tech businesses from the Pacific Islands.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Play size={16} className="text-red-500" />
                  <span>Practical Tutorials</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Bell size={16} className="text-red-500" />
                  <span>Weekly Content</span>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://www.youtube.com/@stevetoti?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 
                         text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/30
                         hover:shadow-xl hover:shadow-red-500/40"
              >
                <Youtube size={20} />
                Subscribe
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Video Grid or Topic Cards */}
        {showVideoEmbeds ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-card overflow-hidden group"
                >
                  {/* Video Embed */}
                  <div className="aspect-video relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">
                      {video.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-3 group-hover:text-vibrantorange 
                                 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{video.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contentTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card p-8 h-full group cursor-pointer relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/10 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.span 
                      className="text-5xl block mb-4"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {topic.icon}
                    </motion.span>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-vibrantorange 
                                 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-gray-400">{topic.description}</p>
                    
                    {/* Play indicator */}
                    <div className="mt-4 flex items-center gap-2 text-red-400 opacity-0 group-hover:opacity-100 
                                  transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Play size={16} />
                      <span className="text-sm">Watch on YouTube</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">
            New content dropping regularly. Don&apos;t miss out!
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="https://www.youtube.com/@stevetoti?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 
                       text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/30"
            >
              <Youtube size={20} />
              Subscribe Now
              <ExternalLink size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
