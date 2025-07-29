import React from "react";
import { motion } from "framer-motion";
import { getHexAlpha } from "../utils";

interface SmokeAnimationsProps {
  rankColor: string;
  auraIntensity: number;
  animationKey: number;
}

export function SmokeAnimations({ rankColor, auraIntensity, animationKey }: SmokeAnimationsProps) {
  return (
    <>
      {/* Inner smoke layers - very subtle at low levels */}
      {auraIntensity > 0.1 && (
        <motion.div
          key={`smoke1-${animationKey}`}
          className="absolute inset-0 rounded-lg"
          style={{
            background: `radial-gradient(ellipse 120% 80% at 40% 80%, ${rankColor}${getHexAlpha(4 + auraIntensity * 20)} 0%, transparent 60%)`,
            filter: `blur(${2 + auraIntensity * 6}px)`,
          }}
          animate={{
            x: [0, -2 + (Math.random() - 0.5) * 8 * (0.3 + auraIntensity), -4 + (Math.random() - 0.5) * 15 * (0.3 + auraIntensity), -6 + (Math.random() - 0.5) * 20 * (0.3 + auraIntensity)],
            y: [0, -3 - Math.random() * 4 * (0.3 + auraIntensity), -8 - Math.random() * 6 * (0.3 + auraIntensity), -12 - Math.random() * 8 * (0.3 + auraIntensity)],
            rotate: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 160, (Math.random() - 0.5) * 240],
            scale: [0.9, 1 + Math.random() * 0.3 * (0.3 + auraIntensity), 1.1 + Math.random() * 0.4 * (0.3 + auraIntensity), 1.2 + Math.random() * 0.6 * (0.3 + auraIntensity)],
            opacity: [0, 0.2 + auraIntensity * 0.4, 0.1 + auraIntensity * 0.3, 0],
          }}
          transition={{
            duration: 7 + auraIntensity * 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
          }}
        />
      )}
      
      {auraIntensity > 0.2 && (
        <motion.div
          key={`smoke2-${animationKey}`}
          className="absolute inset-0 rounded-lg"
          style={{
            background: `radial-gradient(ellipse 100% 120% at 60% 85%, ${rankColor}${getHexAlpha(3 + auraIntensity * 15)} 0%, transparent 50%)`,
            filter: `blur(${3 + auraIntensity * 8}px)`,
          }}
          animate={{
            x: [0, -1 + (Math.random() - 0.5) * 6 * (0.3 + auraIntensity), -3 + (Math.random() - 0.5) * 12 * (0.3 + auraIntensity), -5 + (Math.random() - 0.5) * 18 * (0.3 + auraIntensity)],
            y: [0, -2 - Math.random() * 3 * (0.3 + auraIntensity), -6 - Math.random() * 5 * (0.3 + auraIntensity), -10 - Math.random() * 7 * (0.3 + auraIntensity)],
            rotate: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 180],
            scale: [0.95, 1.05 + Math.random() * 0.2 * (0.3 + auraIntensity), 1.15 + Math.random() * 0.3 * (0.3 + auraIntensity), 1.25 + Math.random() * 0.4 * (0.3 + auraIntensity)],
            opacity: [0, 0.15 + auraIntensity * 0.3, 0.08 + auraIntensity * 0.2, 0],
          }}
          transition={{
            duration: 8 + auraIntensity * 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
            delay: 1.5,
          }}
        />
      )}
      
      {/* Inner smoke wisps - only appear at higher levels */}
      {auraIntensity > 0.3 && [...Array(Math.floor(1 + auraIntensity * 2))].map((_, i) => (
        <motion.div
          key={`inner-wisp${i}-${animationKey}`}
          className="absolute rounded-full"
          style={{
            width: `${0.8 + i * 0.2}rem`,
            height: `${0.8 + i * 0.2}rem`,
            background: `radial-gradient(circle, ${rankColor}${getHexAlpha(6 + auraIntensity * 15 - i * 2)} 0%, transparent 70%)`,
            filter: `blur(${1 + auraIntensity * 2 - i * 0.2}px)`,
            left: `${25 + i * 20}%`,
            bottom: `${15 + i * 8}%`,
          }}
          animate={{
            x: [0, -2 + (Math.random() - 0.5) * 8 * (0.3 + auraIntensity), -4 + (Math.random() - 0.5) * 12 * (0.3 + auraIntensity), -6 + (Math.random() - 0.5) * 18 * (0.3 + auraIntensity)],
            y: [0, -4 - Math.random() * 2 * (0.3 + auraIntensity), -8 - Math.random() * 4 * (0.3 + auraIntensity), -12 - Math.random() * 6 * (0.3 + auraIntensity)],
            scale: [0.3, 0.5 + Math.random() * 0.2 * (0.3 + auraIntensity), 0.7 + Math.random() * 0.3 * (0.3 + auraIntensity), 0.2 + Math.random() * 0.2],
            opacity: [0, 0.25 + auraIntensity * 0.3, 0.12 + auraIntensity * 0.2, 0],
          }}
          transition={{
            duration: 5 + auraIntensity * 2 + i * 0.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
            delay: i * 0.6,
          }}
        />
      ))}
    </>
  );
}