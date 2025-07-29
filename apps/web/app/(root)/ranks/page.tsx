"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import { motion } from "framer-motion";
import {
  getPlayerRank,
  getPlayerRankIcon,
  getPlayerRankColor,
  getPlayerRankDescription,
  allRanks,
} from "@questly/utils";
import { CurrentRankSection } from "@/components/ranks/CurrentRankSection";
import { AllRanksGrid } from "@/components/ranks/AllRanksGrid";

export default function RanksPage() {
  const { data: session } = useSession();

  const { data } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => ({ userStats: data.userStats }),
    enabled: !!session,
  });

  const userStats = data?.userStats || {
    levelStats: {
      level: 1,
      currentLevelXp: 0,
      xpForThisLevel: 100,
      progressPercent: 0,
    },
    todaysXp: 0,
    streak: 0,
    isActiveToday: false,
    characterClass: "Adventurer",
    timezone: "UTC",
  };

  const currentLevel = userStats.levelStats.level;
  const currentRank = getPlayerRank(currentLevel);
  const currentRankIcon = getPlayerRankIcon(currentLevel);
  const currentRankColor = getPlayerRankColor(currentLevel);
  const currentRankDescription = getPlayerRankDescription(currentLevel);

  // Find current rank data
  const currentRankData = allRanks.find((rank) => rank.name === currentRank);
  const currentRankIndex = allRanks.findIndex(
    (rank) => rank.name === currentRank
  );
  const nextRankData = allRanks[currentRankIndex + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-zinc-900/60 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-transparent via-zinc-800/20 to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold font-medieval bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            ⚔️ Adventurer Ranks ⚔️
          </h1>
          <p className="text-lg text-zinc-300 max-w-4xl mx-auto">
            Ascend through the ranks of legend. Each rank represents your
            mastery and dedication to the quest.
          </p>
        </motion.div> */}

        {/* Current Rank Section */}
        <CurrentRankSection
          currentRank={currentRank}
          currentRankIcon={currentRankIcon}
          currentRankColor={currentRankColor}
          currentRankDescription={currentRankDescription}
          currentLevel={currentLevel}
          userStats={userStats}
          nextRankData={nextRankData}
        />

        {/* All Ranks Grid */}
        <AllRanksGrid
          allRanks={allRanks}
          currentRank={currentRank}
          currentRankIndex={currentRankIndex}
          currentLevel={currentLevel}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 py-8 border-t border-slate-700/60"
        >
          <p className="text-zinc-400 text-lg">
            🌟{" "}
            <span className="font-medieval">
              Every quest completed brings you closer to legend
            </span>{" "}
            🌟
          </p>
        </motion.div>
      </div>
    </div>
  );
}
