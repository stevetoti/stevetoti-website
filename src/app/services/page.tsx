"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bot,
  Code2,
  BarChart3,
  Users,
  GraduationCap,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const services = [
  {
    id: "ai-automation",
    icon: Bot,
    title: "AI Automation",
    tagline: "Work Smarter, Not Harder",
    description:
      "Transform your business operations with intelligent automation. From custom chatbots to workflow automation, I help you leverage AI to reduce manual work and increase efficiency.",
    features: [
      "Custom AI chatbots for customer support",
      "Workflow automation with n8n & Make",
      "Document processing & data extraction",
      "AI-powered content generation",
      "Integration with existing systems",
      "24/7 automated customer engagement",
    ],
    benefits: [
      { icon: Clock, text: "Save 20+ hours per week" },
      { icon: Zap, text: "Instant response times" },
      { icon: Shield, text: "Consistent quality" },
    ],
    color: "from-vibrantorange to-orange-400",
  },
  {
    id: "web-development",
    icon: Code2,
    title: "Web Development",
    tagline: "Modern, Fast, Scalable",
    description:
      "Build stunning, high-performance web applications using cutting-edge technologies. From landing pages to complex SaaS platforms, I deliver solutions that grow with your business.",
    features: [
      "Next.js & React applications",
      "E-commerce platforms",
      "Custom web applications",
      "API development & integration",
      "Database design & optimization",
      "Cloud deployment & DevOps",
    ],
    benefits: [
      { icon: Zap, text: "Lightning-fast performance" },
      { icon: Shield, text: "Secure & scalable" },
      { icon: Clock, text: "Quick time to market" },
    ],
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "business-systems",
    icon: BarChart3,
    title: "Business Systems",
    tagline: "Streamline Your Operations",
    description:
      "Custom internal tools, CRM systems, and business management platforms designed to fit your unique processes. Say goodbye to spreadsheets and hello to efficiency.",
    features: [
      "Custom CRM solutions",
      "Inventory management systems",
      "Project management tools",
      "Booking & scheduling systems",
      "Reporting & analytics dashboards",
      "Team collaboration platforms",
    ],
    benefits: [
      { icon: Clock, text: "Centralized operations" },
      { icon: Zap, text: "Real-time insights" },
      { icon: Shield, text: "Data-driven decisions" },
    ],
    color: "from-purple-500 to-pink-400",
  },
  {
    id: "consulting",
    icon: Users,
    title: "Consulting",
    tagline: "Strategic Technology Guidance",
    description:
      "Navigate the digital landscape with confidence. I provide strategic consulting on technology decisions, digital transformation, and scaling your business globally.",
    features: [
      "Digital transformation strategy",
      "Technology stack evaluation",
      "Process optimization",
      "Vendor selection & management",
      "Scaling strategy for global markets",
      "AI adoption roadmap",
    ],
    benefits: [
      { icon: Shield, text: "Expert guidance" },
      { icon: Zap, text: "Avoid costly mistakes" },
      { icon: Clock, text: "Accelerate growth" },
    ],
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: "training",
    icon: GraduationCap,
    title: "Training",
    tagline: "Upskill Your Team",
    description:
      "Empower your team with hands-on training in modern development, AI tools, and digital marketing. Custom programs designed for your specific needs and skill levels.",
    features: [
      "Web development bootcamps",
      "AI & automation workshops",
      "Digital marketing training",
      "Team-specific curricula",
      "Hands-on project-based learning",
      "Ongoing mentorship & support",
    ],
    benefits: [
      { icon: Clock, text: "Practical skills" },
      { icon: Zap, text: "Immediate application" },
      { icon: Shield, text: "Long-term capability" },
    ],
    color: "from-amber-500 to-yellow-400",
  },
];

export default function ServicesPage() {
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
              <span className="text-white">Services That </span>
              <span className="gradient-text">Transform</span>
            </h1>
            <p className="section-subheading">
              Comprehensive digital solutions tailored to help your business thrive in the modern world.
              From AI automation to web development, I&apos;ve got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 relative ${index % 2 === 1 ? "bg-white/[0.02]" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={index % 2 === 1 ? "lg:order-2" : ""}
              >
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} mb-6`}
                >
                  <service.icon size={32} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {service.title}
                </h2>
                <p className="text-vibrantorange font-medium mb-4">{service.tagline}</p>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  {service.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {service.benefits.map((benefit) => (
                    <div
                      key={benefit.text}
                      className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 
                               px-4 py-2 rounded-full"
                    >
                      <benefit.icon size={16} className="text-vibrantorange" />
                      {benefit.text}
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                  Get Started
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              {/* Features Card */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={index % 2 === 1 ? "lg:order-1" : ""}
              >
                <div className="glass-card p-8">
                  <h3 className="text-xl font-semibold text-white mb-6">What&apos;s Included</h3>
                  <ul className="space-y-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`p-1 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0 mt-0.5`}
                        >
                          <Check size={14} className="text-white" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Process */}
      <section className="py-20 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-deepblue/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">
              <span className="text-white">How I </span>
              <span className="gradient-text">Work</span>
            </h2>
            <p className="section-subheading">
              A proven process designed to deliver results efficiently and effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We discuss your goals, challenges, and vision to understand your needs.",
              },
              {
                step: "02",
                title: "Strategy",
                description: "I create a tailored plan with clear milestones and deliverables.",
              },
              {
                step: "03",
                title: "Execution",
                description: "Development begins with regular updates and feedback loops.",
              },
              {
                step: "04",
                title: "Launch",
                description: "Your solution goes live with ongoing support and optimization.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass-card p-6 h-full text-center relative">
                  <div className="text-6xl font-bold text-white/5 absolute top-4 right-4">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="text-vibrantorange font-bold text-sm mb-2">
                      STEP {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading">
              <span className="text-white">Ready to </span>
              <span className="gradient-text">Start?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Let&apos;s discuss how I can help transform your business with the right solution.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Book a Free Consultation
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
