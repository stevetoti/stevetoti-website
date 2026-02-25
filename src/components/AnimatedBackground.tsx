"use client";

import { motion } from "framer-motion";

interface BlobProps {
  className?: string;
  color: "orange" | "blue" | "purple";
  size?: "sm" | "md" | "lg" | "xl";
  delay?: number;
}

const colorClasses = {
  orange: "bg-vibrantorange/30",
  blue: "bg-deepblue/40",
  purple: "bg-purple-600/30",
};

const sizeClasses = {
  sm: "w-48 h-48",
  md: "w-72 h-72",
  lg: "w-96 h-96",
  xl: "w-[500px] h-[500px]",
};

function Blob({ className = "", color, size = "md", delay = 0 }: BlobProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, delay }}
      className={`blob-gradient ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 animated-gradient-bg" />

      {/* Animated blobs */}
      <Blob
        color="orange"
        size="xl"
        className="top-[-10%] right-[-10%]"
        delay={0}
      />
      <Blob
        color="blue"
        size="lg"
        className="top-[20%] left-[-5%]"
        delay={0.5}
      />
      <Blob
        color="purple"
        size="md"
        className="bottom-[10%] right-[20%]"
        delay={1}
      />
      <Blob
        color="orange"
        size="lg"
        className="bottom-[-10%] left-[30%]"
        delay={1.5}
      />
      <Blob
        color="blue"
        size="md"
        className="top-[50%] right-[10%]"
        delay={2}
      />

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/70 to-gray-950/90" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}

// Export a simpler version for section backgrounds
export function SectionBackground({ variant = "default" }: { variant?: "default" | "alt" }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {variant === "default" ? (
        <>
          <Blob color="orange" size="lg" className="top-[-20%] right-[-10%]" />
          <Blob color="blue" size="md" className="bottom-[-10%] left-[-5%]" delay={0.5} />
        </>
      ) : (
        <>
          <Blob color="blue" size="lg" className="top-[-10%] left-[-10%]" />
          <Blob color="orange" size="md" className="bottom-[-20%] right-[-5%]" delay={0.5} />
        </>
      )}
      <div className="absolute inset-0 bg-gray-950/80" />
    </div>
  );
}
