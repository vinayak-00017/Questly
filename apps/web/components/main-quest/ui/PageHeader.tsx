"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scroll, Sparkles } from "lucide-react";

interface PageHeaderProps {
  onCreateQuest: () => void;
}

export function PageHeader({ onCreateQuest }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/50 p-6 rounded-lg border border-zinc-800/50 shadow-xl overflow-hidden relative"
    >
      {/* Corner elements */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
      <motion.div
        className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg"
        animate={{
          borderColor: [
            "rgba(168, 85, 247, 0.3)",
            "rgba(217, 119, 6, 0.3)",
            "rgba(168, 85, 247, 0.3)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      ></motion.div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg"></div>

      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-amber-500/5 opacity-50"></div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-purple-500/30 pulse-glow"
            whileHover={{ scale: 1.1 }}
          >
            <Scroll className="h-5 w-5 text-purple-500" />
          </motion.div>
          <h1 className="text-2xl font-medieval text-white/90">
            Chronicle of Main Quests
          </h1>
        </div>
        <p className="text-zinc-400 ml-12">
          Embark on epic journeys and track your legendary achievements
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative z-20"
      >
        <Button
          className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white gap-2 shadow-lg shadow-purple-900/20 border-0"
          onClick={() => {
            console.log("Button clicked");
            onCreateQuest();
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Embark on New Quest</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
