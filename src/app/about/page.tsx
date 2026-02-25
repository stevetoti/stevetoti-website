"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Lightbulb,
  Target,
  Users
} from "lucide-react";

const timeline = [
  {
    year: "2017",
    title: "Started Web Development",
    description: "Began my journey in tech, building websites and learning the fundamentals of digital solutions.",
  },
  {
    year: "2019",
    title: "Founded Rapid Entrepreneurs",
    description: "Launched my first company in Ghana to help local entrepreneurs go digital.",
  },
  {
    year: "2021",
    title: "Pacific Wave Digital",
    description: "Established Pacific Wave Digital in Vanuatu, bringing world-class digital services to the Pacific.",
  },
  {
    year: "2023",
    title: "Global Digital Prime",
    description: "Expanded internationally with Global Digital Prime, serving clients in USA and Indonesia.",
  },
  {
    year: "2024",
    title: "AI-First Approach",
    description: "Pivoted to AI automation, helping businesses leverage cutting-edge technology for growth.",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Always pushing boundaries and exploring new technologies to deliver cutting-edge solutions.",
  },
  {
    icon: Target,
    title: "Results Driven",
    description: "Every project is measured by its impact on your business growth and efficiency.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description: "We work as an extension of your team, understanding your goals and challenges deeply.",
  },
  {
    icon: Globe,
    title: "Global Mindset",
    description: "Building solutions that work across cultures, time zones, and markets.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="section-heading text-left">
                <span className="text-white">About </span>
                <span className="gradient-text">Stephen</span>
              </h1>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                I&apos;m Stephen Totimeh, a tech entrepreneur and digital solutions architect 
                based in Port Vila, Vanuatu. With 7+ years of experience building digital 
                products and leading technology companies, I&apos;ve helped businesses across 
                15+ countries transform their operations through technology.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                My mission is simple: leverage technology to create meaningful impact. 
                Whether it&apos;s automating repetitive tasks with AI, building scalable web 
                platforms, or training teams to embrace digital transformation—I&apos;m 
                passionate about helping businesses thrive in the digital age.
              </p>
              <div className="flex items-center gap-4 text-gray-400">
                <MapPin size={20} className="text-vibrantorange" />
                <span>Port Vila, Vanuatu • Working Globally</span>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative max-w-md mx-auto">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-vibrantorange/30 to-deepblue/30 
                              rounded-3xl blur-2xl transform scale-95" />
                {/* Rotated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-vibrantorange/20 to-deepblue/20 
                              rounded-3xl transform rotate-6" />
                {/* Image container */}
                <div className="relative rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl">
                  <Image
                    src="/images/steve-headshot.jpg"
                    alt="Stephen Totimeh - CEO & Digital Solutions Expert"
                    width={450}
                    height={550}
                    className="object-cover"
                    priority
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/30 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">
              <span className="text-white">My </span>
              <span className="gradient-text">Journey</span>
            </h2>
            <p className="section-subheading">
              From learning to code to leading multiple tech companies.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b 
                          from-vibrantorange via-deepblue to-transparent hidden lg:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 
                            ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="glass-card p-6 inline-block">
                      <span className="text-vibrantorange font-bold text-lg">{item.year}</span>
                      <h3 className="text-xl font-semibold text-white mt-2">{item.title}</h3>
                      <p className="text-gray-400 mt-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex w-4 h-4 rounded-full bg-vibrantorange 
                                border-4 border-gray-950 z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">
              <span className="text-white">Core </span>
              <span className="gradient-text">Values</span>
            </h2>
            <p className="section-subheading">
              The principles that guide every project and partnership.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 h-full text-center"
                >
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-vibrantorange to-orange-600 mb-4">
                    <value.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
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
              <span className="text-white">Companies I </span>
              <span className="gradient-text">Lead</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Pacific Wave Digital",
                location: "Port Vila, Vanuatu",
                description: "Full-service digital agency providing web development, AI automation, and digital marketing to businesses across the Pacific region.",
                icon: Briefcase,
              },
              {
                name: "Global Digital Prime",
                location: "USA & Indonesia",
                description: "International technology solutions company specializing in enterprise software and AI-powered business systems.",
                icon: Globe,
              },
              {
                name: "Rapid Entrepreneurs",
                location: "Accra, Ghana",
                description: "Startup acceleration and tech training organization helping African entrepreneurs build digital businesses.",
                icon: GraduationCap,
              },
            ].map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-card p-8 h-full"
                >
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-deepblue to-blue-800 mb-6">
                    <company.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{company.name}</h3>
                  <div className="flex items-center gap-2 text-vibrantorange text-sm mb-4">
                    <MapPin size={14} />
                    {company.location}
                  </div>
                  <p className="text-gray-400">{company.description}</p>
                </motion.div>
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
              <span className="text-white">Let&apos;s Work </span>
              <span className="gradient-text">Together</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Ready to transform your business with AI and modern web solutions?
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Get in Touch
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
