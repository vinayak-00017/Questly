"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const [currentTip, setCurrentTip] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const loadingTips = [
    "⚔️ Sharpen your sword while we prepare your quests...",
    "🏰 Gathering resources from distant realms...",
    "📜 Consulting the ancient quest scrolls...",
    "✨ Weaving magic into your adventure...",
    "🗺️ Charting your path through unknown lands...",
    "💎 Collecting mystical gems for your journey...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Set dimensions after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      {dimensions.width > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
              initial={{
                x: Math.random() * dimensions.width,
                y: dimensions.height + 20,
              }}
              animate={{
                y: -20,
                x: Math.random() * dimensions.width,
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 8,
              }}
            />
          ))}

          {/* Magical sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      {/* Main loading content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Enhanced spinning logo */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer magical ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-amber-400/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Middle pulsing ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-sky-500/60"
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Inner glowing ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-4 border-purple-500/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Central emblem */}
          <motion.div
            className="absolute inset-6 flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-4xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-2xl font-medieval">
              Q
            </span>
          </motion.div>

          {/* Magical aura */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-purple-500/20 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Title with typewriter effect */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-3xl font-bold text-white mb-4 font-medieval tracking-wider"
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-amber-400"
          >
            Questly
          </motion.span>
        </motion.h2>

        {/* Animated loading tips */}
        <motion.div
          key={currentTip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-slate-400 text-sm mb-6 text-center max-w-md px-4"
        >
          {loadingTips[currentTip]}
        </motion.div>

        {/* Progress indicator */}
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-sky-500 to-purple-500"
            animate={{
              x: ["-100%", "100%"],
              background: [
                "linear-gradient(90deg, #f59e0b, #0ea5e9, #a855f7)",
                "linear-gradient(90deg, #0ea5e9, #a855f7, #f59e0b)",
                "linear-gradient(90deg, #a855f7, #f59e0b, #0ea5e9)",
              ],
            }}
            transition={{
              x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              background: { duration: 6, repeat: Infinity },
            }}
          />
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-amber-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom decorative elements */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 text-center text-slate-500 text-xs"
      >
        <p>🏰 Preparing your legendary adventure...</p>
      </motion.div>
    </div>
  );
}
