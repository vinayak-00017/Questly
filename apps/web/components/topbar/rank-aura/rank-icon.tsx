import React from "react";
import { motion } from "framer-motion";
import { getHexAlpha } from "../utils";

interface RankIconProps {
  rankIcon: string;
  rankColor: string;
  auraIntensity: number;
}

export function RankIcon({ rankIcon, rankColor, auraIntensity }: RankIconProps) {
  return (
    <div
      className="h-6 w-6 flex items-center justify-center relative"
      style={{
        backgroundColor: rankColor + "33",
        borderRadius: "9999px",
      }}
    >
      {/* Icon smoke aura - subtle scaling */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rankColor}${getHexAlpha(6 + auraIntensity * 25)} 0%, transparent 60%)`,
          filter: `blur(${1.5 + auraIntensity * 4}px)`,
        }}
        animate={{
          scale: [1, 1.05 + auraIntensity * 0.2, 0.95, 1.02 + auraIntensity * 0.15, 1],
          opacity: [0.4, 0.6 + auraIntensity * 0.3, 0.3, 0.5 + auraIntensity * 0.2, 0.4],
        }}
        transition={{
          duration: 4 + auraIntensity * 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      <span className="text-lg relative z-10" style={{ color: rankColor }}>
        {rankIcon}
      </span>
    </div>
  );
}