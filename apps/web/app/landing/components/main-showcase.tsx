"use client";

import React from "react";
import { motion } from "framer-motion";
import { SwordsIcon, Shield, Medal } from "lucide-react";

// Import modularized components
import { MainQuestCard } from "./main-showcase/main-quest-card";
import { RankProgression } from "./main-showcase/rank-progression";
import { AchievementsSection } from "./main-showcase/achievements-section";

const MainShowcase = () => {
  return (
    <div
      id="gamification"
      className="relative min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 overflow-hidden"
    >
      {/* Epic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/4 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/2 to-amber-500/2 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl md:text-7xl font-bold font-medieval bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Epic Gamified System
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Embark on legendary main quests, climb the ranks of greatness, and
            unlock epic achievements on your journey to mastery.
          </motion.p>
        </div>

        {/* Main Quest Hero Section */}
        <MainQuestCard />

        {/* Section Headers Centered */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid lg:grid-cols-2 gap-16"
          >
            <div>
              <h2 className="text-4xl font-bold font-medieval text-blue-300 mb-4">
                Rank Progression
              </h2>
              <p className="text-zinc-400 text-lg">
                Climb the ladder of greatness
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold font-medieval text-purple-300 mb-4">
                Epic Achievements
              </h2>
              <p className="text-zinc-400 text-lg">
                Unlock legendary accomplishments
              </p>
            </div>
          </motion.div>
        </div>

        {/* Ranks and Achievements Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Rank Progression Section */}
          <RankProgression />

          {/* Achievements Section */}
          <AchievementsSection />
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/6 text-amber-400/20"
        animate={{
          rotate: 360,
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <SwordsIcon size={120} />
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/6 text-purple-400/20"
        animate={{
          rotate: -360,
          scale: [1, 0.7, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Shield size={48} />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/4 text-blue-400/15"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Medal size={40} />
      </motion.div>
    </div>
  );
};

export default MainShowcase;
