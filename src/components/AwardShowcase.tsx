"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, ChevronLeft, ChevronRight, Award, MapPin, Calendar, Expand } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/ghana-ai-summit/award-trophy.jpg",
    alt: "AI Personality of the Year 2026 award trophy - Stephen Narh Junior Totimeh",
    caption: "AI Personality of the Year 2026 — awarded to Stephen Totimeh, Digi Assist AI Ghana Limited",
  },
  {
    src: "/images/ghana-ai-summit/receiving-award.jpg",
    alt: "Stephen Totimeh receiving the AI Personality of the Year award on stage",
    caption: "Receiving the award on stage at the Ghana AI Summit & Awards 2026",
  },
  {
    src: "/images/ghana-ai-summit/stage-celebration.jpg",
    alt: "Award presentation moment with celebratory sparklers at the Ghana AI Summit",
    caption: "The award presentation moment — College of Physicians, Accra",
  },
  {
    src: "/images/ghana-ai-summit/team-celebration.jpg",
    alt: "Stephen Totimeh celebrating the award with colleagues",
    caption: "Celebrating the win with the team",
  },
  {
    src: "/images/ghana-ai-summit/winners-group.jpg",
    alt: "Group photo of all award winners at the Ghana AI Summit & Awards 2026",
    caption: "All the winners of the Ghana AI Summit & Awards 2026",
  },
];

export default function AwardShowcase() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      setLightboxIndex((current) => {
        if (current === null) return current;
        return (current + direction + galleryImages.length) % galleryImages.length;
      });
    },
    []
  );

  // Keyboard navigation + scroll lock while the lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, navigate]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-vibrantorange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-deepblue/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vibrantorange/10 border border-vibrantorange/30 text-vibrantorange text-sm font-medium mb-6">
            <Trophy size={16} />
            Award-Winning
          </div>
          <h2 className="section-heading">
            <span className="text-white">Awards & </span>
            <span className="gradient-text">Recognition</span>
          </h2>
          <p className="section-subheading">
            Honoured on the national stage for contributions to artificial intelligence in Ghana.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Featured award image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-vibrantorange/30 to-deepblue/30 rounded-3xl blur-2xl transform scale-95" />
              <button
                onClick={() => setLightboxIndex(0)}
                className="relative block w-full rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl group cursor-zoom-in"
                aria-label="View award gallery"
              >
                <Image
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  width={800}
                  height={800}
                  className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-gray-950/60 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Expand size={18} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                  <div className="flex items-center gap-2 text-vibrantorange text-sm font-semibold mb-1">
                    <Award size={16} />
                    WINNER 2026
                  </div>
                  <p className="text-white font-bold text-lg leading-snug">
                    AI Personality of the Year
                  </p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Award details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI Personality of the Year{" "}
              <span className="gradient-text">2026</span>
            </h3>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 mb-6">
              <span className="flex items-center gap-2">
                <Trophy size={16} className="text-vibrantorange" />
                Ghana AI Summit &amp; Awards
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-vibrantorange" />
                Accra, Ghana
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-vibrantorange" />
                July 2026
              </span>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              At the Ghana AI Summit &amp; Awards — held under the theme{" "}
              <em>&ldquo;Artificial Intelligence for Economic Growth and Job Creation&rdquo;</em> —
              I was named <strong className="text-white">AI Personality of the Year</strong> for
              my work with Digi Assist AI Ghana Limited, celebrating success, impact, and
              contributions to AI in Ghana.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              This recognition reflects years of building AI solutions that solve real problems
              for businesses and communities — from Vanuatu to Ghana and beyond — and fuels the
              mission to make AI accessible to every entrepreneur.
            </p>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.slice(1).map((image, index) => (
                <motion.button
                  key={image.src}
                  onClick={() => setLightboxIndex(index + 1)}
                  whileHover={{ y: -4 }}
                  className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-vibrantorange/50 transition-colors group cursor-zoom-in"
                  aria-label={`View photo: ${image.caption}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 25vw, 12vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gray-950/30 group-hover:bg-transparent transition-colors" />
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Tap any photo to view the full gallery.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lightbox carousel */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 z-10 text-gray-400 text-sm font-medium">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>

            {/* Prev / Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-3 md:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-vibrantorange/80 text-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="absolute right-3 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-vibrantorange/80 text-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>

            {/* Image */}
            <div
              className="relative w-full max-w-5xl px-4 md:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                >
                  <Image
                    src={galleryImages[lightboxIndex].src}
                    alt={galleryImages[lightboxIndex].alt}
                    width={1920}
                    height={1280}
                    className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
                    priority
                  />
                  <p className="text-center text-gray-300 mt-4 text-sm md:text-base px-4">
                    {galleryImages[lightboxIndex].caption}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail strip */}
            <div
              className="flex gap-2 mt-6 px-4 overflow-x-auto max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.map((image, index) => (
                <button
                  key={image.src}
                  onClick={() => setLightboxIndex(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    index === lightboxIndex
                      ? "border-vibrantorange opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
