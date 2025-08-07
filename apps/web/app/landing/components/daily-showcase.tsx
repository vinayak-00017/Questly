"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Zap } from "lucide-react";

// Import modularized components
import { MockQuestProgressRing } from "./daily-showcase/mock-quest-progress-ring";
import { QuestItemsList } from "./daily-showcase/quest-items-list";

const DailyShowcase = () => {
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      id="daily"
      className="relative min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 overflow-hidden "
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-r from-orange-500/3 to-red-500/3 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-6xl font-bold font-medieval bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Demolish Your Daily Quests
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform your daily routine into an epic adventure. Track progress,
            complete quests, focus on what's important to you.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Mock Quest Progress Ring */}
          <div className="flex justify-center">
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="relative transform scale-150"
            >
              <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-xl" />
              <div className="relative">
                <MockQuestProgressRing />
              </div>
            </motion.div>
          </div>

          {/* Right side - Quest Items */}
          <QuestItemsList />
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-orange-400/20"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Target size={48} />
        </motion.div>

        <motion.div
          className="absolute top-3/4 right-1/4 text-red-400/20"
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Zap size={36} />
        </motion.div>
      </div>
    </div>
  );
};

export default DailyShowcase;
