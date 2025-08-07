"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Crown,
  Shield,
  Zap,
  Flame,
  Medal,
  Gem,
  Award,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for achievements
const mockAchievements = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first quest",
    icon: "star",
    importance: "common",
    category: "Progress",
    progress: 1,
    criteria: { value: 1 },
    isUnlocked: true,
    unlockedAt: new Date(),
  },
  {
    id: "2",
    name: "Streak Master",
    description: "Complete quests for 7 days in a row",
    icon: "flame",
    importance: "rare",
    category: "Consistency",
    progress: 5,
    criteria: { value: 7 },
    isUnlocked: false,
  },
  {
    id: "3",
    name: "Legend Born",
    description: "Complete 50 quests total",
    icon: "crown",
    importance: "legendary",
    category: "Mastery",
    progress: 23,
    criteria: { value: 50 },
    isUnlocked: false,
  },
];

const iconMap = {
  star: Star,
  trophy: Trophy,
  medal: Medal,
  zap: Zap,
  flame: Flame,
  shield: Shield,
  crown: Crown,
  gem: Gem,
  award: Award,
  "check-circle": CheckCircle,
};

// Using the same color scheme as MainQuestCard
const importanceColors = {
  common: {
    bg: "from-slate-600 to-slate-700",
    border: "border-slate-500/30",
    text: "text-slate-300",
    glow: "shadow-slate-500/20",
  },
  rare: {
    bg: "from-blue-600 to-blue-700",
    border: "border-blue-500/30",
    text: "text-blue-300",
    glow: "shadow-blue-500/20",
  },
  epic: {
    bg: "from-purple-600 to-purple-700",
    border: "border-purple-500/30",
    text: "text-purple-300",
    glow: "shadow-purple-500/20",
  },
  legendary: {
    bg: "from-red-600 to-red-700",
    border: "border-red-500/30",
    text: "text-red-300",
    glow: "shadow-red-500/20",
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 0.5, -0.5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const staggeredFloat = {
  animate: {
    y: [0, -12, 0],
    x: [0, 3, -3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

export const AchievementsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
    >
      <div className="space-y-6">
        {mockAchievements.map((achievement, index) => {
          const Icon =
            iconMap[achievement.icon as keyof typeof iconMap] || Star;
          const colors =
            importanceColors[
              achievement.importance as keyof typeof importanceColors
            ];
          const progressPercentage = Math.min(
            (achievement.progress / achievement.criteria.value) * 100,
            100
          );

          return (
            <motion.div
              key={achievement.id}
              variants={index % 2 === 0 ? staggeredFloat : floatingVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  achievement.isUnlocked
                    ? cn(
                        "bg-black/50 border",
                        colors.border,
                        colors.glow,
                        "shadow-lg hover:shadow-xl"
                      )
                    : "bg-zinc-950/30 border-zinc-900/50 opacity-80"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                        achievement.isUnlocked
                          ? cn("bg-gradient-to-br", colors.bg)
                          : "bg-zinc-800/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-6 h-6",
                          achievement.isUnlocked
                            ? "text-white"
                            : "text-zinc-600"
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4
                            className={cn(
                              "font-semibold text-base",
                              achievement.isUnlocked
                                ? "text-white"
                                : "text-zinc-500"
                            )}
                          >
                            {achievement.name}
                          </h4>
                          <p
                            className={cn(
                              "text-sm",
                              achievement.isUnlocked
                                ? "text-zinc-400"
                                : "text-zinc-600"
                            )}
                          >
                            {achievement.description}
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs capitalize",
                            achievement.isUnlocked
                              ? colors.text
                              : "text-zinc-600",
                            achievement.isUnlocked
                              ? colors.border
                              : "border-zinc-700"
                          )}
                        >
                          {achievement.importance}
                        </Badge>
                      </div>

                      {!achievement.isUnlocked && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-zinc-500">
                            <span>Progress</span>
                            <span>
                              {achievement.progress} /{" "}
                              {achievement.criteria.value}
                            </span>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className="h-2"
                          />
                        </div>
                      )}

                      {achievement.isUnlocked && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs text-green-400">
                            Unlocked{" "}
                            {achievement.unlockedAt
                              ? new Date(
                                  achievement.unlockedAt
                                ).toLocaleDateString("en-US", {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                      )}

                      <div className="mt-2">
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            achievement.isUnlocked
                              ? "bg-zinc-800/50 text-zinc-400"
                              : "bg-zinc-900/50 text-zinc-600"
                          )}
                        >
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Legendary glow effect */}
                  {achievement.isUnlocked &&
                    achievement.importance === "legendary" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-500/10 to-red-500/10 animate-pulse" />
                    )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
