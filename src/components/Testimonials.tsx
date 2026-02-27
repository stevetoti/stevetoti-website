"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Quote, Star, ArrowRight, Building2 } from "lucide-react";

// These represent real project outcomes - testimonials collection in progress
const projectHighlights = [
  {
    company: "Trade Farm",
    industry: "Agricultural Trading",
    outcome: "AI-powered platform connecting Pacific farmers with international buyers. Automated pricing and inventory management reduced processing time by 80%.",
    metrics: ["500+ Users", "$2M+ Transactions", "80% Time Saved"],
    rating: 5,
  },
  {
    company: "Pacific Resort Group",
    industry: "Hospitality",
    outcome: "Custom booking and management system streamlined reservations and guest communications. Increased booking efficiency by 40%.",
    metrics: ["1,200+ Bookings/mo", "40% More Bookings", "25hrs/wk Saved"],
    rating: 5,
  },
  {
    company: "Healthcare Education Platform",
    industry: "Medical Training",
    outcome: "AI-powered patient simulation platform for medical students. Interactive clinical scenarios with 96% student satisfaction rate.",
    metrics: ["2,000+ Students", "50+ Simulations", "96% Satisfaction"],
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-[800px] h-[800px] bg-deepblue/20 rounded-full blur-3xl" />
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
          <h2 className="section-heading">
            <span className="text-white">Proven </span>
            <span className="gradient-text">Results</span>
          </h2>
          <p className="section-subheading">
            Real outcomes from projects delivered across multiple industries.
          </p>
        </motion.div>

        {/* Project Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {projectHighlights.map((project, index) => (
            <motion.div
              key={project.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-card p-8 h-full relative"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 text-vibrantorange/20">
                  <Quote size={40} />
                </div>

                {/* Company Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-vibrantorange/20">
                    <Building2 size={20} className="text-vibrantorange" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{project.company}</div>
                    <div className="text-xs text-gray-500">{project.industry}</div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(project.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-vibrantorange text-vibrantorange"
                    />
                  ))}
                </div>

                {/* Outcome */}
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  {project.outcome}
                </p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-2">
                  {project.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 text-vibrantorange 
                               border border-vibrantorange/20"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link 
            href="/portfolio" 
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Projects
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
