"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Trophy, Flame } from "lucide-react";
import { QuestInstance } from "@questly/types";

// Mock quest data for demonstration
const mockQuests: QuestInstance[] = [
  {
    id: "1",
    title: "Morning Workout",
    description: "Complete 30 minutes of exercise",
    basePoints: 8, // Important priority
    xpReward: 90,
    type: "daily",
    completed: true,
    questId: "workout-1",
    userId: "demo-user",
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
    tasks: [
      {
        id: "task-1",
        title: "Warm up",
        completed: true,
        questInstanceId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-2",
        title: "Main workout",
        completed: true,
        questInstanceId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "2",
    title: "Read for 20 minutes",
    description: "Expand your knowledge through reading",
    basePoints: 3, // Standard priority
    xpReward: 50,
    type: "daily",
    completed: false,
    questId: "reading-1",
    userId: "demo-user",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [
      {
        id: "task-3",
        title: "Choose a book",
        completed: true,
        questInstanceId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-4",
        title: "Read 20 minutes",
        completed: false,
        questInstanceId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "3",
    title: "Drink 8 glasses of water",
    type: "side",
    description: "Stay hydrated throughout the day",
    basePoints: 2, // Minor priority
    xpReward: 25,
    completed: false,
    questId: "hydration-1",
    userId: "demo-user",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  },
];

export const MockQuestProgressRing = () => {
  // Calculate progress based on mock quest data
  const totalPoints = mockQuests.reduce(
    (sum, quest) => sum + quest.basePoints,
    0
  );
  const completedPoints = mockQuests
    .filter((quest) => quest.completed)
    .reduce((sum, quest) => sum + quest.basePoints, 0);

  const completedQuests = mockQuests.filter((quest) => quest.completed).length;
  const totalQuests = mockQuests.length;
  const percentage = Math.round((completedPoints / totalPoints) * 100);

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-950 border border-zinc-700/50 rounded-lg p-4 relative overflow-hidden">
      {/* Subtle accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-red-600/5 pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-orange-500/40 via-red-500/40 to-orange-500/40"></div>

      <div className="relative z-10 p-2">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full flex items-center justify-center shadow-lg border border-orange-400/30 w-8 h-8">
            <Target className="text-orange-300 h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Today's Progress</h3>
            <p className="text-orange-200/70 text-xs">
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
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#dc2626" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-2xl font-bold text-white"
                style={{
                  fontFamily:
                    'var(--font-eb-garamond), "Times New Roman", serif',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              >
                {percentage}%
              </motion.div>
              <div className="text-xs text-zinc-400">
                {completedQuests}/{totalQuests}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1">
              <Trophy className="h-3 w-3 text-orange-400" />
              Completed
            </span>
            <span className="text-orange-300 font-medium">
              {completedPoints} pts
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1">
              <Flame className="h-3 w-3 text-red-400" />
              Total
            </span>
            <span className="text-red-300 font-medium">{totalPoints} pts</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-3 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            style={{ width: `${percentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        {/* Motivational message */}
        <div className="mt-3 text-center">
          {percentage === 100 ? (
            <motion.p
              className="text-xs text-green-400 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              🎉 All quests completed!
            </motion.p>
          ) : percentage >= 75 ? (
            <p className="text-xs text-orange-300">
              Almost there! Keep going! 💪
            </p>
          ) : percentage >= 50 ? (
            <p className="text-xs text-red-300">Great progress! 🚀</p>
          ) : percentage > 0 ? (
            <p className="text-xs text-orange-300">Good start! ⚡</p>
          ) : (
            <p className="text-xs text-zinc-400">
              Ready to begin your journey? 🌟
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
