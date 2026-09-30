import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BadgeCheck, Bot, Globe2, HeartHandshake, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { getPublishedTools } from "@/lib/affiliate-tools";
import ToolsGrid from "./ToolsGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Recommended Tools | Stephen Totimeh",
  description:
    "The hosting, domain, AI and business tools Stephen Totimeh uses and recommends to run companies across the Pacific, Africa and the USA.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "The tools I use to build and run businesses | Stephen Totimeh",
    description: "Hand-picked hosting, domain, AI and business tools, recommended from real use.",
    images: ["/images/tools/hero.jpg"],
  },
};

const DISCLOSURE =
  "Some links on this page are affiliate links. If you sign up through them I may earn a commission, at no extra cost to you. I only recommend tools I use, including products from my own companies.";

export default async function ToolsPage() {
  const tools = await getPublishedTools();

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-deepblue/40 blur-3xl" aria-hidden />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-vibrantorange/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-vibrantorange/30 bg-vibrantorange/10 px-4 py-1.5 text-sm font-medium text-vibrantorange">
              <Sparkles className="h-4 w-4" /> My toolkit
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              The tools I use to <span className="gradient-text">build and run businesses</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-400">
              I run companies in Vanuatu, Ghana, the USA and Indonesia. These are the platforms I trust for hosting, domains, AI, payments and
              everyday operations, and the same ones I set up for my clients.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#tools" className="btn-primary inline-flex items-center gap-2">
                Browse the tools <ArrowDown className="h-5 w-5" />
              </a>
              <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
                Get setup help
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <Image
                src="/images/steve-headshot.jpg"
                alt="Stephen Totimeh"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border-2 border-vibrantorange object-cover"
              />
              <div>
                <p className="font-semibold text-white">Curated by Stephen Totimeh</p>
                <p className="text-sm text-gray-400">Founder, Pacific Wave Digital · AI Personality of the Year 2026</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-deepblue/40">
              <Image
                src="/images/tools/hero.jpg"
                alt="Laptop workspace on a veranda overlooking a Pacific lagoon"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-deepblue-900/50 via-transparent to-transparent" />
            </div>
            <div className="glass-card absolute -bottom-6 left-4 flex items-center gap-3 px-5 py-4 sm:-left-6">
              <Globe2 className="h-8 w-8 text-vibrantorange" />
              <div>
                <p className="font-bold text-white">3 companies · 4 countries</p>
                <p className="text-sm text-gray-400">Run on these tools every day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="scroll-mt-24 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="section-heading">
              Recommended <span className="gradient-text">tools</span>
            </h2>
            <p className="section-subheading">Tap any tool to visit its website and get started.</p>
          </div>
          <ToolsGrid tools={tools} />
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs text-gray-500">{DISCLOSURE}</p>
        </div>
      </section>

      {/* Get online */}
      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/images/tools/section-online.jpg"
              alt="Small business owner smiling at her new online store"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <Rocket className="h-10 w-10 text-vibrantorange" />
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Get your business online the right way</h2>
            <p className="mt-4 text-gray-400">
              Most businesses I meet overpay for hosting or lose their domain name to a reseller. Start with foundations you
              own and control.
            </p>
            <ol className="mt-6 space-y-4">
              {[
                ["Secure your name", "Register your domain in your own account, not your developer's."],
                ["Choose reliable hosting", "Fast, secure hosting with free SSL and backups."],
                ["Launch and grow", "Put up a clean website, then add email, bookings and payments."],
              ].map(([title, body], index) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vibrantorange font-bold text-gray-950">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm text-gray-400">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="lg:order-2 relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/images/tools/section-ai.jpg"
              alt="Entrepreneur working with AI tools on a laptop"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:order-1">
            <Bot className="h-10 w-10 text-vibrantorange" />
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Let AI take care of the busywork</h2>
            <p className="mt-4 text-gray-400">
              Answering the same questions, sending invoices and chasing follow-ups eats your week. The right AI tools
              handle it around the clock, so you can spend your time on customers and growth.
            </p>
            <ul className="mt-6 space-y-3">
              {["Reply to customers instantly, day and night", "Automate invoices, reminders and follow-ups", "Create content and campaigns in minutes"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <BadgeCheck className="h-5 w-5 shrink-0 text-brandgreen" /> {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Why trust */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card grid items-center gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-2">
              <Image
                src="/images/ghana-ai-summit/receiving-award.jpg"
                alt="Stephen Totimeh receiving the AI Personality of the Year award"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold md:text-4xl">Why you can trust these picks</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: "Used for real", body: "Every tool here runs one of my businesses or client projects." },
                  { icon: HeartHandshake, title: "Same price for you", body: "Signing up through my links never costs you more." },
                  { icon: BadgeCheck, title: "Honest advice", body: "If a tool stops being good, it comes off this page." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title}>
                    <Icon className="h-8 w-8 text-vibrantorange" />
                    <p className="mt-3 font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-gray-400">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-heading">
            Not sure where to <span className="gradient-text">start?</span>
          </h2>
          <p className="section-subheading">
            Tell me about your business and I will point you to the right tools, or my team can set everything up for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Talk to me <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/training" className="btn-secondary">
              Learn it yourself
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
