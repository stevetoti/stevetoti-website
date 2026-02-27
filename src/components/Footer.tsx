"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Youtube, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  ArrowUp 
} from "lucide-react";

const footerLinks = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/services#ai-automation", label: "AI Automation" },
    { href: "/services#web-development", label: "Web Development" },
    { href: "/services#business-systems", label: "Business Systems" },
    { href: "/services#consulting", label: "Consulting" },
    { href: "/services#training", label: "Training" },
  ],
  companies: [
    { href: "#", label: "Pacific Wave Digital" },
    { href: "#", label: "Global Digital Prime" },
    { href: "#", label: "Rapid Entrepreneurs" },
  ],
};

const socialLinks = [
  { href: "https://www.youtube.com/@stevetoti", icon: Youtube, label: "YouTube" },
  { href: "https://linkedin.com/in/stevetoti", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com/stevetoti", icon: Twitter, label: "Twitter" },
  { href: "mailto:totinarh24@gmail.com", icon: Mail, label: "Email" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-950 border-t border-white/10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-deepblue/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold">
                <span className="text-white">Steve</span>
                <span className="gradient-text">Toti</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Building Digital Solutions for Global Impact. Transforming businesses 
              through AI automation and innovative technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-3 rounded-lg bg-white/5 hover:bg-vibrantorange/20 
                           text-gray-400 hover:text-vibrantorange transition-all"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-vibrantorange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-vibrantorange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-vibrantorange flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  Port Vila, Vanuatu<br />
                  USA &amp; Indonesia<br />
                  Accra, Ghana
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-vibrantorange flex-shrink-0" />
                <a
                  href="mailto:totinarh24@gmail.com"
                  className="text-gray-400 hover:text-vibrantorange transition-colors"
                >
                  totinarh24@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/contact" className="btn-primary text-sm py-2 px-4">
                Book a Call
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Stephen Totimeh. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm">
              Terms of Service
            </Link>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-vibrantorange/20 text-vibrantorange hover:bg-vibrantorange hover:text-white transition-all"
            >
              <ArrowUp size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
