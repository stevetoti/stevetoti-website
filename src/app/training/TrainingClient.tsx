"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Award,
  Bot,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Globe,
  GraduationCap,
  Megaphone,
  MonitorPlay,
  Phone,
  Rocket,
  Send,
  Trophy,
  User,
  Users,
  Video,
  Wrench,
  X,
} from "lucide-react";

/* ---------------------------------- Data ---------------------------------- */

type RegionKey = "ghana" | "vanuatu" | "international";

interface PackageInfo {
  name: string;
  duration: string;
  price: string;
  installment?: string;
  save?: string;
  highlight?: boolean;
}

interface Region {
  label: string;
  flag: string;
  currencyNote: string;
  flyer: string;
  packages: PackageInfo[];
}

const regions: Record<RegionKey, Region> = {
  ghana: {
    label: "Ghana",
    flag: "🇬🇭",
    currencyNote: "Prices in Ghanaian Cedi (GHS)",
    flyer: "/downloads/training-flyer-ghs.pdf",
    packages: [
      {
        name: "Phase 1 — Digital Business Foundations",
        duration: "3 months · 36 sessions",
        price: "GHS 4,500",
        installment: "or 3 × GHS 1,700 / month",
      },
      {
        name: "Full Program — Both Phases",
        duration: "6 months · 72 sessions",
        price: "GHS 10,000",
        save: "Save GHS 1,000",
        highlight: true,
      },
      {
        name: "Phase 2 — AI Mastery & Automation",
        duration: "3 months · 36 sessions",
        price: "GHS 6,500",
        installment: "or 3 × GHS 2,400 / month",
      },
    ],
  },
  vanuatu: {
    label: "Vanuatu",
    flag: "🇻🇺",
    currencyNote: "Prices in Vanuatu Vatu (VT)",
    flyer: "/downloads/training-flyer-vt.pdf",
    packages: [
      {
        name: "Phase 1 — Digital Business Foundations",
        duration: "3 months · 36 sessions",
        price: "VT 120,000",
        installment: "or 3 × VT 45,000 / month",
      },
      {
        name: "Full Program — Both Phases",
        duration: "6 months · 72 sessions",
        price: "VT 250,000",
        save: "Save VT 50,000",
        highlight: true,
      },
      {
        name: "Phase 2 — AI Mastery & Automation",
        duration: "3 months · 36 sessions",
        price: "VT 180,000",
        installment: "or 3 × VT 65,000 / month",
      },
    ],
  },
  international: {
    label: "International",
    flag: "🌍",
    currencyNote: "Prices in US Dollars (USD) — all other countries",
    flyer: "/downloads/training-flyer-usd.pdf",
    packages: [
      {
        name: "Phase 1 — Digital Business Foundations",
        duration: "3 months · 36 sessions",
        price: "$1,000",
        installment: "or 3 × $375 / month",
      },
      {
        name: "Full Program — Both Phases",
        duration: "6 months · 72 sessions",
        price: "$2,100",
        save: "Save $400",
        highlight: true,
      },
      {
        name: "Phase 2 — AI Mastery & Automation",
        duration: "3 months · 36 sessions",
        price: "$1,500",
        installment: "or 3 × $550 / month",
      },
    ],
  },
};

const phase1Modules = [
  {
    icon: Briefcase,
    title: "How to Set Up a Profitable Business",
    description: "Idea validation, company registration, pricing for profit",
  },
  {
    icon: MonitorPlay,
    title: "Website Development",
    description: "Build a professional site with AI — domain to launch",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Social media strategy, content, email & SEO",
  },
  {
    icon: Video,
    title: "Advertising & Video Production",
    description: "Facebook/Google ads + promo videos that sell",
  },
];

const phase2Modules = [
  {
    icon: Bot,
    title: "AI Automation for Businesses",
    description: "Chatbots, booking, CRM & workflow automation",
  },
  {
    icon: Wrench,
    title: "AI Automation Software Creation",
    description: "Build and sell your own AI tools & apps",
  },
  {
    icon: GraduationCap,
    title: "How to Train Institutions in AI",
    description: "Design & deliver AI training, win corporate contracts",
  },
];

const curriculum = [
  {
    phase: "Phase 1",
    weeks: "Weeks 1–3",
    title: "Profitable Business Setup",
    items: [
      "Find & validate a profitable idea",
      "Business models & pricing for profit",
      "Company registration, banking & legal basics",
      "Brand identity: name, logo, story",
    ],
  },
  {
    phase: "Phase 1",
    weeks: "Weeks 4–6",
    title: "Website Development",
    items: [
      "Domains, hosting & professional email",
      "Build your site with AI tools",
      "Copy & design that converts visitors",
      "SEO basics & getting found online",
    ],
  },
  {
    phase: "Phase 1",
    weeks: "Weeks 7–9",
    title: "Digital Marketing",
    items: [
      "Social media strategy & content calendar",
      "Creating content with AI",
      "Email marketing & customer follow-up",
      "Analytics: know what's working",
    ],
  },
  {
    phase: "Phase 1",
    weeks: "Weeks 10–12",
    title: "Advertising & Video Production",
    items: [
      "Facebook & Instagram ads that convert",
      "Google ads & retargeting",
      "Create promo videos with AI software",
      "CAPSTONE: launch your live campaign",
    ],
  },
  {
    phase: "Phase 2",
    weeks: "Weeks 1–4",
    title: "AI Automation for Businesses",
    items: [
      "AI fundamentals & prompt mastery",
      "Chatbots, bookings & CRM automation",
      "Automate marketing, invoicing & admin",
      "Sell automation audits as a service",
    ],
  },
  {
    phase: "Phase 2",
    weeks: "Weeks 5–8",
    title: "AI Automation Software Creation",
    items: [
      "No-code & AI app builders",
      "APIs & connecting systems together",
      "Build and ship your own AI tool",
      "Pricing, licensing & selling software",
    ],
  },
  {
    phase: "Phase 2",
    weeks: "Weeks 9–12",
    title: "How to Train Institutions in AI",
    items: [
      "Design an AI curriculum that lands",
      "Workshop delivery & facilitation skills",
      "Proposals: win corporate & govt contracts",
      "CAPSTONE: deliver a real mini-training",
    ],
  },
];

const included = [
  "All tools & templates",
  "WhatsApp support between sessions",
  "Capstone project",
  "Certificate of completion",
];

const steps = [
  {
    icon: Phone,
    title: "Book a Free Discovery Call",
    description: "Tell us your goals — we check you're a fit for the program.",
  },
  {
    icon: FileText,
    title: "Get Your Personal Plan",
    description: "Every session is built around YOUR real business, not theory.",
  },
  {
    icon: Rocket,
    title: "Train 3× a Week & Launch",
    description: "1 hour per session, homework between, capstone at the end.",
  },
];

/* -------------------------------- Component ------------------------------- */

export default function TrainingClient() {
  const [activeRegion, setActiveRegion] = useState<RegionKey>("international");
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentPlan: "full",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const region = regions[activeRegion];

  const openEnrolModal = (pkg: PackageInfo) => {
    setSelectedPackage(pkg);
    setSubmitted(false);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setSubmitted(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/training-enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          package: selectedPackage.name,
          price: selectedPackage.price,
          region: region.label,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enrolment");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", paymentPlan: "full", message: "" });
    } catch (error) {
      console.error("Enrolment submission error:", error);
      alert("Failed to submit. Please try again or email me directly at me@stevetoti.com");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24">
      {/* ================================ Hero ================================ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-vibrantorange/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-deepblue/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vibrantorange/10 border border-vibrantorange/30 text-vibrantorange text-sm font-medium mb-6">
                <Trophy size={16} />
                Trained by the AI Personality of the Year 2026
              </div>
              <h1 className="section-heading text-left">
                <span className="text-white">1-on-1 Digital Business &amp; </span>
                <span className="gradient-text">AI Mastery Program</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Personal training with Stephen Totimeh — build a profitable business,
                then master AI. Every session is hands-on and built around{" "}
                <strong className="text-white">your</strong> real business, not theory.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Calendar, label: "3 months per phase" },
                  { icon: Users, label: "3 sessions / week" },
                  { icon: Clock, label: "1 hour, 1-on-1" },
                  { icon: Globe, label: "In person or online" },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm"
                  >
                    <fact.icon size={16} className="text-vibrantorange" />
                    {fact.label}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#pricing" className="btn-primary inline-flex items-center justify-center gap-2">
                  View Pricing &amp; Enrol
                  <ArrowRight size={20} />
                </a>
                <Link
                  href="/contact"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  Book Free Discovery Call
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-vibrantorange/30 to-deepblue/30 rounded-3xl blur-2xl transform scale-95" />
                <div className="relative rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl">
                  <Image
                    src="/images/ghana-ai-summit/receiving-award.jpg"
                    alt="Stephen Totimeh receiving the AI Personality of the Year 2026 award at the Ghana AI Summit"
                    width={800}
                    height={534}
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 text-vibrantorange text-sm font-semibold mb-1">
                      <Award size={16} />
                      Ghana AI Summit &amp; Awards 2026
                    </div>
                    <p className="text-white font-semibold">
                      Learn directly from an award-winning AI entrepreneur
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ The Two Phases ========================== */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">
              <span className="text-white">Two Phases. </span>
              <span className="gradient-text">One Transformation.</span>
            </h2>
            <p className="section-subheading">
              Build the business first, then supercharge it with AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phase 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-bold">
                  PHASE 1
                </span>
                <span className="text-gray-500 text-sm">Months 1–3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Digital Business Foundations
              </h3>
              <div className="space-y-5 mb-8">
                {phase1Modules.map((module) => (
                  <div key={module.title} className="flex gap-4">
                    <div className="flex-shrink-0 p-2.5 rounded-lg bg-white/5 border border-white/10 h-fit">
                      <module.icon size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{module.title}</h4>
                      <p className="text-gray-400 text-sm">{module.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-gray-950/50 border border-white/10 p-4">
                <p className="text-vibrantorange text-xs font-bold uppercase tracking-wide mb-1">
                  You walk away with
                </p>
                <p className="text-gray-300 text-sm">
                  A registered business, live website &amp; running ad campaign.
                </p>
              </div>
            </motion.div>

            {/* Phase 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-vibrantorange/20 border border-vibrantorange/30 text-vibrantorange text-sm font-bold">
                  PHASE 2
                </span>
                <span className="text-gray-500 text-sm">Months 4–6</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">
                AI Mastery &amp; Automation
              </h3>
              <div className="space-y-5 mb-8">
                {phase2Modules.map((module) => (
                  <div key={module.title} className="flex gap-4">
                    <div className="flex-shrink-0 p-2.5 rounded-lg bg-white/5 border border-white/10 h-fit">
                      <module.icon size={18} className="text-vibrantorange" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{module.title}</h4>
                      <p className="text-gray-400 text-sm">{module.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-gray-950/50 border border-white/10 p-4">
                <p className="text-vibrantorange text-xs font-bold uppercase tracking-wide mb-1">
                  You walk away with
                </p>
                <p className="text-gray-300 text-sm">
                  Sellable AI services, your own AI product &amp; a trainer toolkit.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ Full Curriculum ========================= */}
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
              <span className="text-white">The Full 6-Month </span>
              <span className="gradient-text">Curriculum</span>
            </h2>
            <p className="section-subheading">
              36 one-hour sessions per phase — every session is hands-on, on your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {curriculum.map((block, index) => (
              <motion.div
                key={`${block.phase}-${block.weeks}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.08 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      block.phase === "Phase 1"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-vibrantorange/15 text-vibrantorange"
                    }`}
                  >
                    {block.phase}
                  </span>
                  <span className="text-gray-500 text-xs font-medium">{block.weeks}</span>
                </div>
                <h4 className="text-white font-semibold mb-3">{block.title}</h4>
                <ul className="space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2 text-gray-400 text-sm">
                      <Check size={14} className="text-vibrantorange flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== Pricing ============================== */}
      <section id="pricing" className="py-20 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-heading">
              <span className="text-white">Investment &amp; </span>
              <span className="gradient-text">Enrolment</span>
            </h2>
            <p className="section-subheading">
              Select your region to see pricing in your local currency.
            </p>
          </motion.div>

          {/* Region tabs */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10 gap-1">
              {(Object.keys(regions) as RegionKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveRegion(key)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeRegion === key
                      ? "bg-gradient-to-r from-vibrantorange to-orange-500 text-white shadow-lg shadow-vibrantorange/25"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="mr-1.5">{regions[key].flag}</span>
                  {regions[key].label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mb-12">{region.currencyNote}</p>

          {/* Pricing cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRegion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            >
              {region.packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative flex flex-col p-8 rounded-2xl border transition-all ${
                    pkg.highlight
                      ? "bg-gradient-to-b from-vibrantorange/15 to-transparent border-vibrantorange/40 shadow-xl shadow-vibrantorange/10 md:-mt-4 md:mb-[-1rem]"
                      : "glass-card border-white/10"
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-vibrantorange to-orange-500 text-white text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                      Best Value
                    </div>
                  )}
                  <h3 className="text-white font-semibold text-lg mb-1">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{pkg.duration}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold gradient-text">{pkg.price}</span>
                  </div>
                  {pkg.installment && (
                    <p className="text-gray-400 text-sm mb-6">{pkg.installment}</p>
                  )}
                  {pkg.save && (
                    <p className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold mb-6">
                      <CheckCircle size={15} />
                      {pkg.save}
                    </p>
                  )}
                  <ul className="space-y-2.5 mb-8 mt-auto">
                    {included.map((item) => (
                      <li key={item} className="flex gap-2 text-gray-400 text-sm">
                        <Check size={15} className="text-vibrantorange flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openEnrolModal(pkg)}
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                      pkg.highlight
                        ? "bg-gradient-to-r from-vibrantorange to-orange-500 text-white hover:shadow-lg hover:shadow-vibrantorange/30"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    Enrol Now
                  </button>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <a
              href={region.flyer}
              download
              className="inline-flex items-center gap-2 text-gray-400 hover:text-vibrantorange transition-colors text-sm font-medium"
            >
              <Download size={16} />
              Download the {region.label} program flyer (PDF)
            </a>
            <span className="hidden sm:block text-gray-700">•</span>
            <p className="text-gray-500 text-sm">
              Limited 1-on-1 spots each intake
            </p>
          </div>
        </div>
      </section>

      {/* ============================ How It Works =========================== */}
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
              <span className="text-white">How It </span>
              <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="glass-card p-8 text-center relative"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-vibrantorange to-orange-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="inline-flex p-4 rounded-xl bg-white/5 border border-white/10 mb-5 mt-4">
                  <step.icon size={26} className="text-vibrantorange" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 mt-12 text-center max-w-3xl mx-auto"
          >
            <h3 className="text-white font-bold text-lg mb-2">Who it&apos;s for</h3>
            <p className="text-gray-400">
              Entrepreneurs, professionals &amp; career-changers ready to build a real
              digital business. Phase 2 requires Phase 1 or existing business/tech
              experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================ CTA ================================ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading">
              <span className="text-white">Not Sure Which </span>
              <span className="gradient-text">Phase Fits You?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Book a free discovery call — we&apos;ll map your goals to the right
              starting point, no obligation.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Book Your Free Discovery Call
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================== Enrolment Modal ========================== */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg glass-card p-8 my-8 bg-gray-900/90"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex p-4 rounded-full bg-emerald-500/15 mb-6">
                    <CheckCircle size={40} className="text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Enrolment Request Received!
                  </h3>
                  <p className="text-gray-400 mb-2">
                    Thank you — I&apos;ll personally reach out within 24 hours to schedule
                    your free discovery call and share secure payment details.
                  </p>
                  <p className="text-gray-500 text-sm mb-8">
                    Check your inbox (and spam folder) for a confirmation.
                  </p>
                  <button onClick={closeModal} className="btn-primary">
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-1">Enrol Now</h3>
                  <p className="text-gray-400 text-sm mb-1">{selectedPackage.name}</p>
                  <p className="mb-6">
                    <span className="text-2xl font-bold gradient-text">
                      {selectedPackage.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      · {region.label} pricing
                    </span>
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="enrol-name" className="block text-sm text-gray-400 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          id="enrol-name"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none focus:ring-1 focus:ring-vibrantorange transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="enrol-email" className="block text-sm text-gray-400 mb-1.5">
                        Email *
                      </label>
                      <input
                        id="enrol-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none focus:ring-1 focus:ring-vibrantorange transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="enrol-phone" className="block text-sm text-gray-400 mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="enrol-phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+233 / +678 / +1 ..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none focus:ring-1 focus:ring-vibrantorange transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="enrol-plan" className="block text-sm text-gray-400 mb-1.5">
                        Payment Preference
                      </label>
                      <select
                        id="enrol-plan"
                        name="paymentPlan"
                        value={formData.paymentPlan}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-vibrantorange focus:outline-none focus:ring-1 focus:ring-vibrantorange transition-colors [&>option]:bg-gray-900"
                      >
                        <option value="full">Pay in full</option>
                        <option value="monthly">Monthly instalments</option>
                        <option value="discuss">Discuss on the call</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="enrol-message" className="block text-sm text-gray-400 mb-1.5">
                        Tell me about your goals (optional)
                      </label>
                      <textarea
                        id="enrol-message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="What business do you want to build?"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-vibrantorange focus:outline-none focus:ring-1 focus:ring-vibrantorange transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Submitting..." : "Reserve My Spot"}
                      {!isLoading && <Send size={18} />}
                    </button>
                    <p className="text-gray-500 text-xs text-center">
                      No payment is taken now. I&apos;ll confirm your spot on a free
                      discovery call, then send secure payment options for your region.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
