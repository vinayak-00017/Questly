import React from "react";
import { motion } from "framer-motion";
import { Star, Shield } from "lucide-react";

interface RankCardProps {
  rank: any;
  isCurrentRank: boolean;
  isUnlocked: boolean;
  isNextRank: boolean;
}

export const RankCard: React.FC<RankCardProps> = ({
  rank,
  isCurrentRank,
  isUnlocked,
  isNextRank,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative group"
  >
    {/* Card Background Aura for Current Rank */}
    {isCurrentRank && (
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(ellipse at center, ${rank.color}15 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )}

    <div
      className={`relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-xl border-2 p-6 transition-all duration-300 ${
        isUnlocked ? "hover:scale-105 hover:shadow-lg" : "opacity-60 grayscale"
      }`}
      style={{
        borderColor: isCurrentRank
          ? rank.color + "80"
          : isUnlocked
          ? rank.color + "30"
          : "#64748b30",
        boxShadow: isCurrentRank ? `0 0 25px ${rank.color}40` : undefined,
      }}
    >
      {/* Rank Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: isUnlocked
              ? `linear-gradient(135deg, ${rank.color}25, ${rank.color}08)`
              : "linear-gradient(135deg, #64748b25, #64748b08)",
            border: `2px solid ${isUnlocked ? rank.color + "50" : "#64748b50"}`,
          }}
        >
          {isUnlocked ? rank.icon : "🔒"}
        </div>

        {isCurrentRank && (
          <motion.div
            className="px-3 py-1 rounded-full text-sm font-bold"
            style={{
              backgroundColor: rank.color,
              color: "#000000",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CURRENT
          </motion.div>
        )}

        {isNextRank && !isCurrentRank && (
          <div className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm font-bold">
            NEXT
          </div>
        )}
      </div>

      {/* Rank Info */}
      <h3
        className="text-xl font-bold font-medieval mb-2"
        style={{ color: isUnlocked ? rank.color : "#64748b" }}
      >
        {rank.name}
      </h3>

      <div className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
        <Star className="w-4 h-4" />
        <span>
          Level {rank.minLevel}
          {rank.maxLevel !== rank.minLevel && rank.maxLevel !== 999
            ? ` - ${rank.maxLevel}`
            : rank.maxLevel === 999
            ? "+"
            : ""}
        </span>
      </div>

      <p className="text-sm text-zinc-300 leading-relaxed">{rank.description}</p>

      {/* Unlock Status */}
      {!isUnlocked && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-700/60 px-3 py-2 rounded-lg text-sm">
            <Shield className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400">Unlock at Level {rank.minLevel}</span>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);
