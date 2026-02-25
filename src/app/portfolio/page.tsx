"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, Code2, BarChart3 } from "lucide-react";

const projects = [
  {
    title: "Trade Farm Platform",
    category: "AI Automation",
    description:
      "An AI-powered agricultural trading platform connecting farmers with buyers across the Pacific. Features automated pricing, inventory management, and smart matching.",
    tags: ["AI", "Next.js", "Supabase", "Automation"],
    icon: Bot,
    color: "from-vibrantorange to-orange-400",
    stats: [
      { label: "Users", value: "500+" },
      { label: "Transactions", value: "$2M+" },
      { label: "Time Saved", value: "80%" },
    ],
  },
  {
    title: "Resort Booking System",
    category: "Business Systems",
    description:
      "Custom booking and management system for a luxury resort group. Streamlined reservations, integrated payments, and automated guest communications.",
    tags: ["React", "Node.js", "Stripe", "CRM"],
    icon: BarChart3,
    color: "from-purple-500 to-pink-400",
    stats: [
      { label: "Bookings/mo", value: "1,200+" },
      { label: "Revenue Increase", value: "40%" },
      { label: "Staff Hours Saved", value: "25/wk" },
    ],
  },
  {
    title: "E-Learning Platform",
    category: "Web Development",
    description:
      "A comprehensive e-learning platform with video courses, quizzes, certifications, and progress tracking. Built for scale with thousands of concurrent users.",
    tags: ["Next.js", "Prisma", "Video Streaming", "LMS"],
    icon: Code2,
    color: "from-blue-500 to-cyan-400",
    stats: [
      { label: "Students", value: "10,000+" },
      { label: "Courses", value: "150+" },
      { label: "Completion Rate", value: "78%" },
    ],
  },
  {
    title: "AI Customer Service Bot",
    category: "AI Automation",
    description:
      "Custom AI chatbot handling 80% of customer inquiries automatically. Integrated with existing CRM and support systems for seamless escalation.",
    tags: ["OpenAI", "Webhooks", "Integration", "NLP"],
    icon: Bot,
    color: "from-emerald-500 to-teal-400",
    stats: [
      { label: "Queries/day", value: "500+" },
      { label: "Auto-resolved", value: "80%" },
      { label: "Response Time", value: "<2s" },
    ],
  },
  {
    title: "Inventory Management",
    category: "Business Systems",
    description:
      "Real-time inventory tracking system for a multi-location retail business. Automated reordering, stock alerts, and comprehensive reporting.",
    tags: ["React", "PostgreSQL", "Real-time", "Analytics"],
    icon: BarChart3,
    color: "from-amber-500 to-yellow-400",
    stats: [
      { label: "Products Tracked", value: "50,000+" },
      { label: "Stockouts Reduced", value: "95%" },
      { label: "Cost Savings", value: "30%" },
    ],
  },
  {
    title: "Healthcare Simulation",
    category: "Web Development",
    description:
      "Medical education platform with AI-powered patient simulations. Students practice clinical scenarios in a safe, interactive environment.",
    tags: ["Next.js", "AI", "WebRTC", "Healthcare"],
    icon: Code2,
    color: "from-red-500 to-pink-400",
    stats: [
      { label: "Med Students", value: "2,000+" },
      { label: "Simulations", value: "50+" },
      { label: "Satisfaction", value: "96%" },
    ],
  },
];

export default function PortfolioPage() {
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
              <span className="text-white">Featured </span>
              <span className="gradient-text">Work</span>
            </h1>
            <p className="section-subheading">
              A selection of projects that showcase my expertise in AI automation, 
              web development, and business systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-card h-full overflow-hidden group"
                >
                  {/* Header */}
                  <div className={`p-6 bg-gradient-to-r ${project.color} relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <project.icon size={32} className="text-white" />
                        <span className="text-sm text-white/80 font-medium">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-400 mb-6">{project.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 
                                   border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                      {project.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-xl font-bold gradient-text">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Industries Served</h2>
            <p className="text-gray-400">
              Experience across diverse sectors, each with unique challenges and solutions.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Healthcare",
              "E-commerce",
              "Education",
              "Hospitality",
              "Agriculture",
              "Finance",
              "Real Estate",
              "Non-profit",
              "Retail",
              "Technology",
            ].map((industry, index) => (
              <motion.div
                key={industry}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 glass-card text-gray-300 hover:text-vibrantorange 
                         hover:border-vibrantorange/30 transition-colors cursor-default"
              >
                {industry}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-deepblue/10 to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading">
              <span className="text-white">Have a Project in </span>
              <span className="gradient-text">Mind?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Let&apos;s discuss how I can help bring your vision to life with the right technology.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Start a Conversation
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
