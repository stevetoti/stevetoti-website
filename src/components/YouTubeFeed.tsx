"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Youtube, ExternalLink, Play, Sparkles } from "lucide-react";

// Featured video topics - these represent the content Stephen creates
const videoTopics = [
  {
    id: "1",
    title: "AI Automation for Business: Getting Started Guide",
    description: "Learn how to leverage AI tools to automate repetitive tasks and scale your business",
    category: "AI Automation",
    icon: "🤖",
  },
  {
    id: "2", 
    title: "Building Modern Web Apps with Next.js",
    description: "Step-by-step tutorials on creating fast, scalable web applications",
    category: "Web Development",
    icon: "💻",
  },
  {
    id: "3",
    title: "From Vanuatu to Global: Scaling Tech Businesses",
    description: "Insights on building international tech companies from the Pacific",
    category: "Entrepreneurship",
    icon: "🌏",
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

        {/* Featured Channel Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Channel Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-xl">
                <Youtube size={48} className="text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-950"
              />
            </div>

            {/* Channel Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">@stevetoti</h3>
              <p className="text-gray-400 mb-4 max-w-xl">
                AI automation tutorials, web development guides, and insights on building 
                global tech businesses from the Pacific Islands. New content coming soon!
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Sparkles size={16} className="text-vibrantorange" />
                  <span>Tech & Business Content</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Play size={16} className="text-vibrantorange" />
                  <span>Practical Tutorials</span>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            <Link
              href="https://www.youtube.com/@stevetoti"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 
                       text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              <Youtube size={20} />
              Subscribe
            </Link>
          </div>
        </motion.div>

        {/* Content Topics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {videoTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-card p-6 h-full group"
              >
                {/* Icon & Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{topic.icon}</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">
                    {topic.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-vibrantorange 
                             transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-400">{topic.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">
            Stay tuned for upcoming videos and tutorials!
          </p>
          <Link
            href="https://www.youtube.com/@stevetoti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 
                     text-white font-semibold rounded-xl transition-colors"
          >
            <Youtube size={20} />
            Visit Channel
            <ExternalLink size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
