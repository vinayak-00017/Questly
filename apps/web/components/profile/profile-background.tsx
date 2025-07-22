"use client";

import React from "react";

export const ProfileBackground: React.FC = () => {
  return (
    <>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/5 animate-pulse"
            style={{
              width: `${Math.random() * 10 + 3}px`,
              height: `${Math.random() * 10 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black pointer-events-none" />
    </>
  );
};