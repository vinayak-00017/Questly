"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scroll, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onCreateQuest: () => void;
}

export function EmptyState({ onCreateQuest }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black/30 border border-zinc-800/50 rounded-lg p-8 text-center relative overflow-hidden"
    >
      {/* Static corner elements */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg"></div>

      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-amber-600/5"></div>

      {/* Content with minimal animations */}
      <div className="relative z-10">
        <div className="w-20 h-20 mx-auto mb-4 bg-black/40 rounded-full flex items-center justify-center ring-1 ring-purple-500/30 pulse-glow">
          <Scroll className="w-10 h-10 text-purple-400" />
        </div>

        <h3 className="text-2xl font-medieval text-white/90 mb-3">
          The Beginning of Your Epic
        </h3>

        <p className="text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
          Every legend begins with a single quest. Chart your course, track your
          achievements, and become the hero of your own tale.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-20"
        >
          <Button
            className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white gap-2 shadow-lg shadow-purple-900/20 border-0 px-6 py-6"
            onClick={() => {
              console.log("Empty state button clicked");
              onCreateQuest();
            }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medieval text-lg">Begin Your Journey</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
