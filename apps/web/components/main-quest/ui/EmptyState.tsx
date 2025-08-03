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
      className="bg-muted/30 border border-border/50 rounded-xl p-6 text-center relative overflow-hidden backdrop-blur-sm"
    >
      {/* Static corner elements */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-xl"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-xl"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/30 rounded-bl-xl"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/30 rounded-br-xl"></div>

      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>

      {/* Content with minimal animations */}
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center ring-1 ring-primary/30 backdrop-blur-sm">
          <Scroll className="w-8 h-8 text-primary" />
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2">
          Begin Your Epic Journey
        </h3>

        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6 leading-relaxed">
          Create your first main quest to start tracking long-term goals and
          epic achievements.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-20"
        >
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 border-0 px-4 py-2 font-medium"
            onClick={() => {
              console.log("Empty state button clicked");
              onCreateQuest();
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Main Quest</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
