"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Youtube, ExternalLink, Play } from "lucide-react";

// Placeholder videos - these would be populated from YouTube API
const placeholderVideos = [
  {
    id: "1",
    title: "How to Build AI Automation for Your Business",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "12:34",
    views: "15K",
  },
  {
    id: "2",
    title: "Next.js 14 Tutorial for Beginners",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "24:15",
    views: "8.2K",
  },
  {
    id: "3",
    title: "Building SaaS Products That Scale",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "18:42",
    views: "12K",
  },
];

export default function YouTubeFeed() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-red-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-red-500 mb-4">
            <Youtube size={24} />
            <span className="text-sm font-medium uppercase tracking-wider">YouTube Channel</span>
          </div>
          <h2 className="section-heading">
            <span className="text-white">Learn & </span>
            <span className="gradient-text">Grow</span>
          </h2>
          <p className="section-subheading">
            Free tutorials, insights, and behind-the-scenes content on building digital businesses.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {placeholderVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-800">
                  {/* Placeholder thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-deepblue to-gray-900">
                    <div className="text-center">
                      <Play size={48} className="text-white/50 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm">Video thumbnail</span>
                    </div>
                  </div>
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                                transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center 
                                  transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={28} className="text-white ml-1" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white group-hover:text-vibrantorange 
                               transition-colors line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400">{video.views} views</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="https://www.youtube.com/@stevetoti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 
                     text-white font-semibold rounded-xl transition-colors"
          >
            <Youtube size={20} />
            Subscribe on YouTube
            <ExternalLink size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
