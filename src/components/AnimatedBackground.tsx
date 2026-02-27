"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface BlobProps {
  className?: string;
  color: "orange" | "blue" | "purple" | "cyan";
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  delay?: number;
  duration?: number;
}

const colorClasses = {
  orange: "bg-vibrantorange/20",
  blue: "bg-deepblue/30",
  purple: "bg-purple-600/20",
  cyan: "bg-cyan-500/15",
};

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-72 h-72",
  xl: "w-96 h-96",
  xxl: "w-[600px] h-[600px]",
};

function Blob({ className = "", color, size = "md", delay = 0, duration = 7 }: BlobProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [0.8, 1, 1.1, 1, 0.8],
        opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
      }}
      transition={{ 
        duration, 
        delay, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute rounded-full mix-blend-screen filter blur-3xl ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
    />
  );
}

function FloatingParticle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-vibrantorange/40 rounded-full"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const blob3Y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Generate particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
  }));

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 30%, rgba(35, 60, 111, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 30%, rgba(35, 60, 111, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 70%, rgba(35, 60, 111, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 30%, rgba(35, 60, 111, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated blobs with parallax */}
      <motion.div style={{ y: blob1Y }}>
        <Blob
          color="orange"
          size="xxl"
          className="top-[-15%] right-[-10%]"
          delay={0}
          duration={10}
        />
      </motion.div>
      
      <motion.div style={{ y: blob2Y }}>
        <Blob
          color="blue"
          size="xl"
          className="top-[30%] left-[-8%]"
          delay={2}
          duration={12}
        />
      </motion.div>
      
      <motion.div style={{ y: blob3Y }}>
        <Blob
          color="purple"
          size="lg"
          className="bottom-[20%] right-[15%]"
          delay={4}
          duration={8}
        />
      </motion.div>
      
      <Blob
        color="cyan"
        size="md"
        className="top-[60%] left-[20%]"
        delay={3}
        duration={9}
      />
      
      <Blob
        color="orange"
        size="lg"
        className="bottom-[-5%] left-[40%]"
        delay={1}
        duration={11}
      />
      
      <Blob
        color="blue"
        size="md"
        className="top-[10%] right-[30%]"
        delay={5}
        duration={7}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          delay={particle.delay}
        />
      ))}

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-gray-950/60 to-gray-950/90" />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
}

// Export a simpler version for section backgrounds
export function SectionBackground({ variant = "default" }: { variant?: "default" | "alt" | "subtle" }) {
  const variants = {
    default: (
      <>
        <Blob color="orange" size="lg" className="top-[-20%] right-[-10%]" />
        <Blob color="blue" size="md" className="bottom-[-10%] left-[-5%]" delay={0.5} />
      </>
    ),
    alt: (
      <>
        <Blob color="blue" size="lg" className="top-[-10%] left-[-10%]" />
        <Blob color="orange" size="md" className="bottom-[-20%] right-[-5%]" delay={0.5} />
      </>
    ),
    subtle: (
      <>
        <Blob color="purple" size="md" className="top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
      </>
    ),
  };

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {variants[variant]}
      <div className="absolute inset-0 bg-gray-950/80" />
    </div>
  );
}
