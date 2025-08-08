import React from "react";
import { motion } from "framer-motion";
import { RankCard } from "./RankCard";

interface AllRanksGridProps {
  allRanks: any[];
  currentRank: string;
  currentRankIndex: number;
  currentLevel: number;
}

export const AllRanksGrid: React.FC<AllRanksGridProps> = ({
  allRanks,
  currentRank,
  currentRankIndex,
  currentLevel,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
      ----- Adventurer Ranks -----
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allRanks.map((rank, index) => {
        const isCurrentRank = rank.name === currentRank;
        const isUnlocked = currentLevel >= rank.minLevel;
        const isNextRank = index === currentRankIndex + 1;
        return (
          <RankCard
            key={rank.name}
            rank={rank}
            isCurrentRank={isCurrentRank}
            isUnlocked={isUnlocked}
            isNextRank={isNextRank}
          />
        );
      })}
    </div>
  </motion.div>
);
