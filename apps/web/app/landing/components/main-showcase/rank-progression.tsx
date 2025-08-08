"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Shield } from "lucide-react";

// Mock data for ranks with proper colors from RankCard
const mockRanks = [
  {
    id: "1",
    name: "Novice",
    icon: "🗡️",
    color: "#64748b", // Slate
    minLevel: 2,
    maxLevel: 3,
    currentLevel: null,
    description:
      "Every hero starts somewhere. Begin your journey with determination.",
    isUnlocked: true,
    isCurrentRank: false,
  },
  {
    id: "2",
    name: "Pathfinder",
    icon: "🧭",
    color: "#20B2AA", // Light Sea Green
    minLevel: 9,
    maxLevel: 11,
    currentLevel: null,
    description:
      "You've proven yourself capable. The path ahead grows more challenging.",
    isUnlocked: true,
    isCurrentRank: true,
  },
  {
    id: "3",
    name: "Champion",
    icon: "👑",
    color: "#f59e0b", // Amber
    minLevel: 35,
    maxLevel: 39,
    currentLevel: null,
    description: "A true champion emerges. Your legend begins to spread.",
    isUnlocked: false,
    isCurrentRank: false,
  },
];

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 0.5, -0.5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const staggeredFloat = {
  animate: {
    y: [0, -12, 0],
    x: [0, 3, -3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

export const RankProgression = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <div className="space-y-6">
        {mockRanks.map((rank, index) => (
          <motion.div
            key={rank.id}
            variants={index % 2 === 0 ? floatingVariants : staggeredFloat}
            animate="animate"
            className="relative group"
          >
            {/* Current rank aura */}
            {rank.isCurrentRank && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `radial-gradient(ellipse at center, ${rank.color}15 0%, transparent 70%)`,
                  filter: "blur(8px)",
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <div
              className="relative backdrop-blur-sm rounded-xl border-2 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${rank.color}08, ${rank.color}03)`,
                borderColor: rank.isCurrentRank
                  ? rank.color + "60"
                  : rank.color + "25",
                boxShadow: rank.isCurrentRank
                  ? `0 0 20px ${rank.color}30`
                  : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${rank.color}15, ${rank.color}05)`,
                    border: `2px solid ${rank.color}30`,
                  }}
                >
                  {rank.isUnlocked ? rank.icon : "🔒"}
                </div>

                {rank.isCurrentRank && (
                  <motion.div
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: rank.color + "20",
                      color: rank.color,
                      border: `1px solid ${rank.color}40`,
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    CURRENT
                  </motion.div>
                )}
              </div>

              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily:
                    'var(--font-eb-garamond), "Times New Roman", serif',
                  color: rank.color,
                }}
              >
                {rank.name}
              </h3>

              <div className="flex items-center gap-2 mb-3 text-sm">
                <Star
                  className="w-4 h-4"
                  style={{ color: rank.color + "80" }}
                />
                <span style={{ color: rank.color + "CC" }}>
                  Level {rank.minLevel}
                  {rank.maxLevel !== rank.minLevel && rank.maxLevel !== 999
                    ? ` - ${rank.maxLevel}`
                    : rank.maxLevel === 999
                      ? "+"
                      : ""}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: rank.color + "99" }}
              >
                {rank.description}
              </p>

              {!rank.isUnlocked && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-slate-700/60 px-3 py-2 rounded-lg text-sm">
                    <Shield className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-400">
                      Unlock at Level {rank.minLevel}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
