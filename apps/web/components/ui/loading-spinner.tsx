"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  show: boolean;
  message?: string;
  fullscreen?: boolean;
  icon?: React.ReactNode;
}

const LoadingSpinner = ({
  show,
  message = "Preparing your adventure...",
  fullscreen = true,
  icon = <Sparkles className="h-8 w-8 text-purple-400" />,
}: LoadingSpinnerProps) => {
  const [particles, setParticles] = useState<
    Array<{
      width: string;
      height: string;
      left: string;
      top: string;
      animationDuration: string;
      animationDelay: string;
    }>
  >([]);

  // Generate particles on the client side only
  useEffect(() => {
    if (show) {
      const newParticles = Array(fullscreen ? 15 : 8)
        .fill(null)
        .map(() => ({
          width: `${Math.random() * 8 + 2}px`,
          height: `${Math.random() * 8 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }));
      setParticles(newParticles);
    }
  }, [show, fullscreen]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${fullscreen ? "fixed inset-0" : "absolute inset-0"} flex flex-col items-center justify-center ${fullscreen ? "bg-black/80" : "bg-black/60"} backdrop-blur-sm z-50`}
    >
      {/* Background gradient */}
      <div
        className={`${fullscreen ? "fixed" : "absolute"} inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-900/20 to-black/90 pointer-events-none`}
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 float-animation"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
              animationDuration: particle.animationDuration,
              animationDelay: particle.animationDelay,
            }}
          ></div>
        ))}
      </div>

      {/* Loading card */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-purple-900/30 shadow-xl overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg"></div>

        {/* Glowing effect at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-amber-500/50 to-purple-500/50 opacity-70 glow-animation"></div>

        <div className="flex flex-col items-center gap-5">
          {/* Icon container with pulse effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex justify-center mb-2"
          >
            <div className="bg-gradient-to-br from-purple-600/30 to-purple-700/30 p-5 rounded-full shadow-lg ring-2 ring-purple-500/40 pulse-glow">
              {icon}
            </div>
          </motion.div>

          {/* Loading text */}
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold font-medieval tracking-wide text-white"
          >
            Loading Your Quest
          </motion.h2>

          {/* Progress bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.4, duration: 3 }}
            className="w-full h-1.5 bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 rounded-full"
          />

          {/* Loading message */}
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-purple-400/90 text-sm mt-2 animate-pulse-subtle"
          >
            {message}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
