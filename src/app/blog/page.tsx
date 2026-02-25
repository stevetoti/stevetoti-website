"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Tag, Youtube } from "lucide-react";

const blogPosts = [
  {
    slug: "getting-started-with-ai-automation",
    title: "Getting Started with AI Automation for Your Business",
    excerpt:
      "A beginner's guide to understanding how AI automation can transform your business operations and save you hours every week.",
    category: "AI Automation",
    readTime: "8 min read",
    date: "Coming Soon",
    featured: true,
  },
  {
    slug: "next-js-14-features",
    title: "Next.js 14: The Features That Matter for Business Apps",
    excerpt:
      "Exploring the latest Next.js features and how they can help you build faster, more scalable web applications.",
    category: "Web Development",
    readTime: "6 min read",
    date: "Coming Soon",
    featured: false,
  },
  {
    slug: "building-custom-crm",
    title: "Why Your Business Needs a Custom CRM (Not Another SaaS)",
    excerpt:
      "The hidden costs of off-the-shelf CRM systems and why building custom might be your best investment.",
    category: "Business Systems",
    readTime: "10 min read",
    date: "Coming Soon",
    featured: false,
  },
  {
    slug: "ai-chatbots-customer-service",
    title: "AI Chatbots: The Future of Customer Service",
    excerpt:
      "How modern AI chatbots are revolutionizing customer support and why your business should consider implementing one.",
    category: "AI Automation",
    readTime: "7 min read",
    date: "Coming Soon",
    featured: false,
  },
  {
    slug: "scaling-globally-from-vanuatu",
    title: "Scaling a Tech Business Globally from Vanuatu",
    excerpt:
      "Lessons learned from building international tech companies from a small Pacific island nation.",
    category: "Entrepreneurship",
    readTime: "12 min read",
    date: "Coming Soon",
    featured: false,
  },
  {
    slug: "supabase-vs-firebase",
    title: "Supabase vs Firebase: Which Should You Choose in 2024?",
    excerpt:
      "A detailed comparison of two popular backend-as-a-service platforms and when to use each one.",
    category: "Web Development",
    readTime: "9 min read",
    date: "Coming Soon",
    featured: false,
  },
];

const categories = [
  "All",
  "AI Automation",
  "Web Development",
  "Business Systems",
  "Entrepreneurship",
];

export default function BlogPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-heading">
              <span className="text-white">Insights & </span>
              <span className="gradient-text">Tutorials</span>
            </h1>
            <p className="section-subheading">
              Practical guides, industry insights, and lessons learned from building 
              digital solutions for businesses around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-vibrantorange/10 to-deepblue/10" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">
                📝 Blog Coming Soon!
              </h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                I&apos;m working on detailed tutorials and insights. In the meantime, 
                check out my YouTube channel for video content on AI, web development, 
                and building digital businesses.
              </p>
              <Link
                href="https://www.youtube.com/@stevetoti"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 
                         text-white font-semibold rounded-xl transition-colors"
              >
                <Youtube size={20} />
                Visit YouTube Channel
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                          ${
                            index === 0
                              ? "bg-vibrantorange text-white"
                              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                          }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.article
                  whileHover={{ y: -5 }}
                  className="glass-card h-full flex flex-col overflow-hidden group cursor-pointer"
                >
                  {/* Thumbnail placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-deepblue to-gray-900 
                                relative flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                    {post.featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-vibrantorange 
                                    text-white text-xs font-medium rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category & Read Time */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white group-hover:text-vibrantorange 
                                 transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Date */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span className="text-sm text-vibrantorange">{post.date}</span>
                    </div>
                  </div>
                </motion.article>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-vibrantorange/5 to-deepblue/5" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Get Notified When Posts Go Live
              </h2>
              <p className="text-gray-400 mb-8">
                Join the newsletter for exclusive content, tutorials, and insights 
                delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                           text-white placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
                />
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
