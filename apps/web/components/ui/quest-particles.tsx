"use client";

import React, { useState, useEffect } from "react";

export function QuestParticles() {
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

  useEffect(() => {
    // Reduced particle count for better performance
    const newParticles = Array(8)
      .fill(null)
      .map(() => ({
        width: `${Math.random() * 5 + 2}px`,
        height: `${Math.random() * 5 + 2}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 15 + 10}s`,
        animationDelay: `${Math.random() * 5}s`,
      }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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
  );
}