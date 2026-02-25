"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Building2 } from "lucide-react";

const companies = [
  {
    name: "Pacific Wave Digital",
    location: "Vanuatu",
    description: "Full-service digital agency",
  },
  {
    name: "Global Digital Prime",
    location: "USA & Indonesia",
    description: "International tech solutions",
  },
  {
    name: "Rapid Entrepreneurs",
    location: "Ghana",
    description: "Startup acceleration & training",
  },
];

export default function AboutPreview() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Placeholder for Stephen's image */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background shapes */}
              <div className="absolute inset-0 bg-gradient-to-br from-vibrantorange/20 to-deepblue/20 
                            rounded-3xl transform rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-deepblue to-gray-900 
                            rounded-3xl border border-white/10 overflow-hidden">
                {/* Avatar placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-vibrantorange to-deepblue 
                                  mx-auto mb-4 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">ST</span>
                    </div>
                    <p className="text-gray-400 text-sm">Photo coming soon</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-4 top-1/4 glass-card px-4 py-2"
              >
                <span className="text-vibrantorange font-semibold">7+ Years</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-4 bottom-1/4 glass-card px-4 py-2"
              >
                <span className="text-vibrantorange font-semibold">100+ Projects</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="section-heading text-left">
              <span className="text-white">Hi, I&apos;m </span>
              <span className="gradient-text">Stephen Totimeh</span>
            </h2>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              A tech entrepreneur and digital solutions architect with a passion for 
              transforming businesses through technology. From my base in Vanuatu, I work 
              with clients across 15+ countries, bringing innovative AI and web solutions 
              to businesses of all sizes.
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              I believe in building technology that matters—solutions that don&apos;t just work, 
              but truly transform how businesses operate and serve their customers.
            </p>

            {/* Companies */}
            <div className="space-y-4 mb-8">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Building2 size={20} className="text-vibrantorange" />
                Companies I Lead
              </h3>
              <div className="grid gap-3">
                {companies.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass-card p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">{company.name}</div>
                      <div className="text-sm text-gray-400">{company.description}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-vibrantorange">
                      <MapPin size={14} />
                      {company.location}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <Link href="/about" className="btn-primary inline-flex items-center gap-2">
              My Full Story
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
