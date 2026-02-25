"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Bot, 
  Code2, 
  BarChart3, 
  Users, 
  GraduationCap,
  ArrowRight 
} from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "AI Automation",
    description: "Streamline your operations with intelligent automation. From chatbots to workflow automation, I help businesses work smarter.",
    href: "/services#ai-automation",
    color: "from-vibrantorange to-orange-400",
  },
  {
    icon: Code2,
    title: "Web Development",
    description: "Modern, fast, and scalable web applications built with cutting-edge technologies. React, Next.js, and beyond.",
    href: "/services#web-development",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: BarChart3,
    title: "Business Systems",
    description: "Custom CRM, ERP, and internal tools that transform how your team works. Built for scale and efficiency.",
    href: "/services#business-systems",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: Users,
    title: "Consulting",
    description: "Strategic guidance on digital transformation, technology stack decisions, and scaling your business globally.",
    href: "/services#consulting",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: GraduationCap,
    title: "Training",
    description: "Upskill your team with hands-on training in modern development, AI tools, and digital marketing strategies.",
    href: "/services#training",
    color: "from-amber-500 to-yellow-400",
  },
];

export default function ServicesOverview() {
  return (
    <section className="relative py-24 overflow-hidden">
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
            <span className="text-white">What I </span>
            <span className="gradient-text">Do</span>
          </h2>
          <p className="section-subheading">
            Comprehensive digital solutions to help your business thrive in the modern world.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={service.href}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-card p-8 h-full group cursor-pointer relative overflow-hidden"
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 
                                 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} 
                                  mb-6 shadow-lg`}>
                    <service.icon size={28} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-vibrantorange 
                               transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>

                  {/* Link */}
                  <div className="inline-flex items-center text-vibrantorange opacity-0 
                                group-hover:opacity-100 transition-all transform 
                                translate-x-0 group-hover:translate-x-2">
                    <span className="mr-2">Learn more</span>
                    <ArrowRight size={16} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn-primary inline-flex items-center gap-2">
            Explore All Services
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
