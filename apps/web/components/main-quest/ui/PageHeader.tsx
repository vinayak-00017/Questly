"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scroll, Sparkles, SwordsIcon } from "lucide-react";

interface PageHeaderProps {
  onCreateQuest: () => void;
}

export function PageHeader({ onCreateQuest }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* Main container with enhanced background */}
      <div className="relative bg-gradient-to-br from-purple-950/40 via-black/60 to-amber-950/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-amber-600/10 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-6 right-6 w-1 h-1 bg-amber-400/60 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-purple-300/40 rounded-full animate-ping delay-500"></div>

        {/* Content container */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative bg-gradient-to-br from-purple-600/20 to-amber-600/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-purple-400/30 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SwordsIcon className="h-8 w-8 text-purple-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-amber-400/20 rounded-2xl animate-pulse"></div>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent leading-tight">
                  Main Quests
                </h1>
                <div className="text-purple-300/90 font-medium text-lg tracking-wide">
                  Your Epic Life Goals
                </div>
              </div>
            </div>
            <p className="text-zinc-200/90 text-lg leading-relaxed max-w-2xl font-light">
              Main quests are the major life goals that you want to achieve in
              the future. Transform your biggest aspirations into actionable
              adventures and track your legendary progress.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-20 flex-shrink-0"
          >
            <Button
              className="bg-gradient-to-r from-white/15 to-white/10 hover:from-white/25 hover:to-white/20 text-white border border-white/30 hover:border-white/50 gap-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-white/10 px-8 py-4 h-auto font-semibold text-base rounded-xl"
              onClick={() => {
                console.log("Button clicked");
                onCreateQuest();
              }}
            >
              <Sparkles className="w-5 h-5" />
              <span>Create New Quest</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
