import React from "react";
import { motion } from "framer-motion";
import { Crown, Zap } from "lucide-react";
import { getAuraIntensity, getHexAlpha } from "@/utils/rankUtils";

interface CurrentRankSectionProps {
  currentRank: string;
  currentRankIcon: React.ReactNode;
  currentRankColor: string;
  currentRankDescription: string;
  currentLevel: number;
  userStats: any;
  nextRankData: any;
}

export const CurrentRankSection: React.FC<CurrentRankSectionProps> = ({
  currentRank,
  currentRankIcon,
  currentRankColor,
  currentRankDescription,
  currentLevel,
  userStats,
  nextRankData,
}) => {
  const auraIntensity = getAuraIntensity(currentLevel);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-16"
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Animated background aura */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse 120% 120% at center, ${currentRankColor}${getHexAlpha(3 + auraIntensity * 25)} 0%, transparent 70%)`,
            filter: `blur(${8 + auraIntensity * 15}px)`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div
          className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl border-2 p-8"
          style={{
            borderColor: currentRankColor + "60",
            boxShadow: `0 0 ${10 + auraIntensity * 20}px ${currentRankColor}30`,
          }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Rank Icon */}
            <div className="relative">
              <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl relative"
                style={{
                  background: `linear-gradient(135deg, ${currentRankColor}25, ${currentRankColor}08)`,
                  border: `3px solid ${currentRankColor}50`,
                  boxShadow: `0 0 ${15 + auraIntensity * 25}px ${currentRankColor}40`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 ${15 + auraIntensity * 25}px ${currentRankColor}40`,
                    `0 0 ${25 + auraIntensity * 35}px ${currentRankColor}60`,
                    `0 0 ${15 + auraIntensity * 25}px ${currentRankColor}40`,
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Floating particles around icon */}
                {[...Array(Math.floor(2 + auraIntensity * 4))].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: currentRankColor,
                      filter: `blur(${1 + auraIntensity}px)`,
                    }}
                    animate={{
                      x: [0, Math.cos(i * 60) * 60, 0],
                      y: [0, Math.sin(i * 60) * 60, 0],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
                <span className="relative z-10">{currentRankIcon}</span>
              </motion.div>
            </div>

            {/* Rank Info */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h2
                className="text-4xl font-bold mb-2"
                style={{ color: currentRankColor }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentRank}
              </motion.h2>

              <motion.div
                className="flex items-center justify-center lg:justify-start gap-4 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 bg-slate-700/60 px-4 py-2 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-lg font-semibold">
                    Level {currentLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-700/60 px-4 py-2 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg">{userStats.characterClass}</span>
                </div>
              </motion.div>

              <motion.p
                className="text-lg text-zinc-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {currentRankDescription}
              </motion.p>

              {/* Progress to Next Rank */}
              {nextRankData && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">
                      Progress to {nextRankData.name}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {currentLevel}/{nextRankData.minLevel} levels
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/80 h-3 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (currentLevel / nextRankData.minLevel) * 100)}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (currentLevel / nextRankData.minLevel) * 100)}%`,
                      }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                  <p className="text-sm text-zinc-400 mt-2">
                    {nextRankData.minLevel - currentLevel > 0
                      ? `${nextRankData.minLevel - currentLevel} levels until ${nextRankData.name}`
                      : `You've achieved ${nextRankData.name}!`}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
