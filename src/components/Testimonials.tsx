"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Jean-Paul Rousseau",
    role: "CEO, Trade Farm",
    content: "Stephen transformed our entire operation with AI automation. What used to take our team days now happens in minutes. The ROI has been incredible.",
    avatar: "/images/avatar-placeholder.jpg",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Operations Manager, Resort Group",
    content: "The booking system Stephen built for us has streamlined our entire customer journey. Bookings are up 40% and our staff loves how easy it is to use.",
    avatar: "/images/avatar-placeholder.jpg",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Founder, Tech Startup",
    content: "Working with Stephen was a game-changer. His expertise in web development and AI helped us launch our MVP in record time. Highly recommend!",
    avatar: "/images/avatar-placeholder.jpg",
    rating: 5,
  },
  {
    name: "Amara Okafor",
    role: "Director, Education Platform",
    content: "Stephen's training program upskilled our entire dev team. They're now building things we never thought possible. Investment well made.",
    avatar: "/images/avatar-placeholder.jpg",
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
            <span className="text-white">Client </span>
            <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="section-subheading">
            Don&apos;t just take my word for it. Here&apos;s what clients say about working together.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
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
                  <Quote size={48} />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-vibrantorange text-vibrantorange"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 relative z-10 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vibrantorange to-deepblue 
                                flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
