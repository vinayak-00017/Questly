"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { QuestInstance } from "@questly/types";
import { Trophy, Target, Flame } from "lucide-react";
import { motion } from "framer-motion";

const QuestProgressRing = () => {
  const { data: questData, isLoading } = useQuery({
    queryKey: ["todaysQuests"],
    queryFn: questApi.fetchTodaysQuests,
    select: (data) => ({
      dailyQuests: data.dailyQuests || [],
      sideQuests: data.sideQuests || [],
    }),
  });

  // Calculate progress based on base points
  const calculateProgress = () => {
    if (!questData) return { percentage: 0, completed: 0, total: 0 };

    const allQuests = [...questData.dailyQuests, ...questData.sideQuests];

    if (allQuests.length === 0) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    const totalBasePoints = allQuests.reduce(
      (sum: number, quest: QuestInstance) => sum + (quest.basePoints || 0),
      0
    );

    const completedBasePoints = allQuests
      .filter((quest: QuestInstance) => quest.completed)
      .reduce(
        (sum: number, quest: QuestInstance) => sum + (quest.basePoints || 0),
        0
      );

    const completedQuests = allQuests.filter(
      (quest: QuestInstance) => quest.completed
    ).length;
    const totalQuests = allQuests.length;

    const percentage =
      totalBasePoints > 0
        ? Math.round((completedBasePoints / totalBasePoints) * 100)
        : 0;

    return {
      percentage,
      completed: completedQuests,
      total: totalQuests,
      completedPoints: completedBasePoints,
      totalPoints: totalBasePoints,
    };
  };

  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset =
    circumference - (progress.percentage / 100) * circumference;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800/50 rounded-lg p-4">
        <div className="flex items-center justify-center h-32">
          <div className="text-zinc-400 text-sm">Loading progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800/50 rounded-lg p-4 relative overflow-hidden">
      {/* Epic gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-purple-600/5 to-amber-500/10 pointer-events-none" />

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 p-[1px]">
        <div className="h-full w-full rounded-lg bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-black/70 to-black/90 rounded-full flex items-center justify-center shadow-xl ring-2 ring-amber-500/30 w-8 h-8">
            <Target className="text-amber-500 h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medieval font-bold text-white text-sm">
              Today's Progress
            </h3>
            <p className="text-amber-300/80 text-xs">
              Quest completion by points
            </p>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg
              className="w-24 h-24 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-zinc-800/50"
              />

              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="drop-shadow-lg"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-2xl font-bold font-medieval text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              >
                {progress.percentage}%
              </motion.div>
              <div className="text-xs text-zinc-400">
                {progress.completed}/{progress.total}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1">
              <Trophy className="h-3 w-3 text-amber-500" />
              Completed
            </span>
            <span className="text-amber-300 font-medium">
              {progress.completedPoints || 0} pts
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1">
              <Flame className="h-3 w-3 text-purple-500" />
              Total
            </span>
            <span className="text-purple-300 font-medium">
              {progress.totalPoints || 0} pts
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-3 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-purple-500"
            style={{ width: `${progress.percentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        {/* Motivational message */}
        <div className="mt-3 text-center">
          {progress.percentage === 100 ? (
            <motion.p
              className="text-xs text-green-400 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              🎉 All quests completed!
            </motion.p>
          ) : progress.percentage >= 75 ? (
            <p className="text-xs text-amber-300">
              Almost there! Keep going! 💪
            </p>
          ) : progress.percentage >= 50 ? (
            <p className="text-xs text-purple-300">Great progress! 🚀</p>
          ) : progress.percentage > 0 ? (
            <p className="text-xs text-blue-300">Good start! ⚡</p>
          ) : (
            <p className="text-xs text-zinc-400">
              Ready to begin your journey? 🌟
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(251, 191, 36, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default QuestProgressRing;
