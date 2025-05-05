"use client";

import React from "react";
import { Mirage } from "ldrs/react";
import "ldrs/react/Mirage.css";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 to-black">
      <div className="relative">
        <Mirage size="120" speed="2" color="#d4af37" />
        <div className="absolute inset-0 animate-pulse-slow opacity-70 blur-xl">
          <Mirage size="120" speed="2" color="#d4af37" />
        </div>
      </div>
      <h2 className="mt-8 text-xl font-medieval text-amber-400/90 animate-pulse">
        Loading your quest...
      </h2>
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
