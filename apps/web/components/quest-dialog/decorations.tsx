"use client";

import { useState, useEffect } from "react";
import { getQuestColorStyles } from "./types";

interface QuestDialogDecorationsProps {
  themeColor: "blue" | "orange" | "purple"; // Added "purple"
  opacity?: number; // Optional opacity control for background elements
}

export function QuestDialogDecorations({
  themeColor,
  opacity = 1,
}: QuestDialogDecorationsProps) {
  const colorStyles = getQuestColorStyles(themeColor);
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
    const newParticles = Array(15)
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
  }, []);

  return (
    <>
      {/* Corner decorations */}
      <div
        className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${colorStyles.cornerBorder} rounded-tl-lg`}
      ></div>
      <div
        className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${colorStyles.cornerBorder} rounded-tr-lg`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${colorStyles.cornerBorder} rounded-bl-lg`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${colorStyles.cornerBorder} rounded-br-lg`}
      ></div>

      {/* Floating particles background */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity }}
      >
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${colorStyles.particles} float-animation`}
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
    </>
  );
}
