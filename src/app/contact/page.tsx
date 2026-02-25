"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Send,
  Youtube,
  Linkedin,
  Twitter,
  CheckCircle,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "steve@stevetoti.com",
    href: "mailto:steve@stevetoti.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Port Vila, Vanuatu",
    href: "#",
  },
];

const socialLinks = [
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://www.youtube.com/@stevetoti",
    color: "hover:bg-red-600",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/stevetoti",
    color: "hover:bg-blue-600",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/stevetoti",
    color: "hover:bg-sky-500",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              <span className="text-white">Let&apos;s </span>
              <span className="gradient-text">Connect</span>
            </h1>
            <p className="section-subheading">
              Ready to transform your business? Book a free consultation or send me a message. 
              I typically respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calendar Booking */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-vibrantorange to-orange-600">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Book a Call</h2>
                    <p className="text-gray-400 text-sm">Free 30-minute consultation</p>
                  </div>
                </div>

                {/* Cal.com Placeholder */}
                <div className="aspect-[4/3] bg-gray-900/50 rounded-xl border border-white/10 
                              flex items-center justify-center">
                  <div className="text-center p-8">
                    <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">
                      Cal.com booking widget will be embedded here
                    </p>
                    <a
                      href="https://cal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"
                    >
                      <Calendar size={16} />
                      Schedule on Cal.com
                    </a>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-8 space-y-4">
                  {contactInfo.map((info) => (
                    <a
                      key={info.label}
                      href={info.href}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 
                               hover:bg-white/10 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-vibrantorange/20 text-vibrantorange 
                                    group-hover:bg-vibrantorange group-hover:text-white transition-colors">
                        <info.icon size={20} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{info.label}</div>
                        <div className="text-white">{info.value}</div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <p className="text-gray-400 text-sm mb-4">Connect on social</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white 
                                  transition-all ${social.color}`}
                      >
                        <social.icon size={24} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              id="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-deepblue to-blue-700">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                    <p className="text-gray-400 text-sm">I&apos;ll get back to you within 24 hours</p>
                  </div>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400">
                      Thanks for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                                   text-white placeholder-gray-500 focus:outline-none 
                                   focus:border-vibrantorange transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                                   text-white placeholder-gray-500 focus:outline-none 
                                   focus:border-vibrantorange transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                                 text-white placeholder-gray-500 focus:outline-none 
                                 focus:border-vibrantorange transition-colors"
                        placeholder="Your company name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Service Interested In
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                                   text-white focus:outline-none focus:border-vibrantorange 
                                   transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-gray-900">Select a service</option>
                          <option value="ai-automation" className="bg-gray-900">AI Automation</option>
                          <option value="web-development" className="bg-gray-900">Web Development</option>
                          <option value="business-systems" className="bg-gray-900">Business Systems</option>
                          <option value="consulting" className="bg-gray-900">Consulting</option>
                          <option value="training" className="bg-gray-900">Training</option>
                          <option value="other" className="bg-gray-900">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Budget Range
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                                   text-white focus:outline-none focus:border-vibrantorange 
                                   transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-gray-900">Select budget</option>
                          <option value="5-10k" className="bg-gray-900">$5,000 - $10,000</option>
                          <option value="10-25k" className="bg-gray-900">$10,000 - $25,000</option>
                          <option value="25-50k" className="bg-gray-900">$25,000 - $50,000</option>
                          <option value="50k+" className="bg-gray-900">$50,000+</option>
                          <option value="not-sure" className="bg-gray-900">Not sure yet</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                                 text-white placeholder-gray-500 focus:outline-none 
                                 focus:border-vibrantorange transition-colors resize-none"
                        placeholder="Tell me about your project or what you're looking to achieve..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-primary inline-flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "What is your typical project timeline?",
                a: "Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex systems may take 2-3 months. I'll provide a detailed timeline during our discovery call.",
              },
              {
                q: "Do you work with clients internationally?",
                a: "Absolutely! I work with clients across 15+ countries. I'm experienced in managing projects across different time zones and use modern collaboration tools for seamless communication.",
              },
              {
                q: "What technologies do you specialize in?",
                a: "I specialize in Next.js, React, Node.js, Supabase, and various AI tools including OpenAI and custom automation solutions. I choose the best tech stack based on your specific needs.",
              },
              {
                q: "Do you offer ongoing support after project completion?",
                a: "Yes! I offer various support packages including monthly retainers for ongoing development, maintenance, and technical support. We'll discuss options that fit your needs.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
