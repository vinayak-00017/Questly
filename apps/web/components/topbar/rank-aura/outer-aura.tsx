import React from "react";
import { motion } from "framer-motion";
import { getHexAlpha } from "../utils";

interface OuterAuraProps {
  rankColor: string;
  auraIntensity: number;
  animationKey: number;
}

export function OuterAura({ rankColor, auraIntensity, animationKey }: OuterAuraProps) {
  return (
    <>
      {/* Outer aura that grows gradually with level */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          transform: `scale(${1.05 + auraIntensity * 0.6})`,
          background: `radial-gradient(ellipse 150% 150% at center, ${rankColor}${getHexAlpha(2 + auraIntensity * 20)} 0%, transparent 70%)`,
          filter: `blur(${4 + auraIntensity * 12}px)`,
          zIndex: -1,
        }}
        animate={{
          scale: [1.05 + auraIntensity * 0.6, 1.15 + auraIntensity * 0.8, 1.0 + auraIntensity * 0.5, 1.1 + auraIntensity * 0.7, 1.05 + auraIntensity * 0.6],
          opacity: [0.1 + auraIntensity * 0.4, 0.3 + auraIntensity * 0.5, 0.05 + auraIntensity * 0.2, 0.2 + auraIntensity * 0.4, 0.1 + auraIntensity * 0.4],
        }}
        transition={{
          duration: 4 + auraIntensity * 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      
      {/* Outer smoke wisps - fewer at low levels, more at high levels */}
      {auraIntensity > 0.15 && [...Array(Math.floor(1 + auraIntensity * 3))].map((_, i) => (
        <motion.div
          key={`outer-wisp${i}-${animationKey}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${0.4 + i * 0.15 + auraIntensity * 0.4}rem`,
            height: `${0.4 + i * 0.15 + auraIntensity * 0.4}rem`,
            background: `radial-gradient(circle, ${rankColor}${getHexAlpha(5 + auraIntensity * 20 - i * 1)} 0%, transparent 80%)`,
            filter: `blur(${1 + auraIntensity * 2.5 + i * 0.3}px)`,
            left: `${-20 + Math.random() * 140}%`,
            top: `${80 + Math.random() * 40}%`,
            zIndex: -1,
          }}
          animate={{
            x: [0, -8 + (Math.random() - 0.5) * 25 * (0.5 + auraIntensity), -16 + (Math.random() - 0.5) * 40 * (0.5 + auraIntensity), -25 + (Math.random() - 0.5) * 60 * (0.5 + auraIntensity)],
            y: [0, -12 - Math.random() * 8 * (0.5 + auraIntensity), -25 - Math.random() * 15 * (0.5 + auraIntensity), -40 - Math.random() * 25 * (0.5 + auraIntensity)],
            scale: [0.1, 0.4 + Math.random() * 0.4 * (0.5 + auraIntensity), 0.7 + Math.random() * 0.6 * (0.5 + auraIntensity), 0.1 + Math.random() * 0.2],
            opacity: [0, 0.3 + auraIntensity * 0.4, 0.1 + auraIntensity * 0.2, 0],
          }}
          transition={{
            duration: 6 + auraIntensity * 3 + i * 0.8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </>
  );
}