"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Zap,
  Flame,
  Shield,
  Compass,
  CheckCircle,
  Medal,
  Crown,
  Gem,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Achievement } from "@questly/utils";

interface AchievementProgress {
  achievementId: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  achievement: Achievement;
}

interface AchievementCardProps {
  achievementProgress: AchievementProgress;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const iconMap = {
  star: Star,
  trophy: Trophy,
  medal: Medal,
  zap: Zap,
  flame: Flame,
  shield: Shield,
  compass: Compass,
  "check-circle": CheckCircle,
  crown: Crown,
  gem: Gem,
  award: Award,
};

const importanceColors = {
  common: {
    bg: "from-gray-600 to-gray-700",
    border: "border-gray-500/30",
    text: "text-gray-300",
    glow: "shadow-gray-500/20",
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
    bg: "from-amber-600 to-orange-600",
    border: "border-amber-500/30",
    text: "text-amber-300",
    glow: "shadow-amber-500/20",
  },
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievementProgress,
  showProgress = true,
  size = "md",
  className,
}) => {
  const { achievement, progress, isUnlocked, unlockedAt } = achievementProgress;
  const Icon = iconMap[achievement.icon as keyof typeof iconMap] || Star;
  const colors = importanceColors[achievement.importance];

  const progressPercentage = Math.min(
    (progress / achievement.criteria.value) * 100,
    100
  );

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          isUnlocked
            ? cn(
                "bg-black/50 border",
                colors.border,
                colors.glow,
                "shadow-lg hover:shadow-xl"
              )
            : "bg-zinc-950/30 border-zinc-900/50 opacity-60",
          className
        )}
      >
        <CardContent className={sizeClasses[size]}>
          <div className="flex items-start gap-3">
            {/* Achievement Icon */}
            <div
              className={cn(
                "rounded-full flex items-center justify-center flex-shrink-0",
                isUnlocked
                  ? cn("bg-gradient-to-br", colors.bg)
                  : "bg-zinc-800/50"
              )}
            >
              <Icon
                className={cn(
                  iconSizes[size],
                  isUnlocked ? "text-white" : "text-zinc-600"
                )}
              />
            </div>

            {/* Achievement Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4
                    className={cn(
                      "font-semibold",
                      size === "sm"
                        ? "text-sm"
                        : size === "lg"
                          ? "text-lg"
                          : "text-base",
                      isUnlocked ? "text-white" : "text-zinc-500"
                    )}
                  >
                    {achievement.name}
                  </h4>
                  <p
                    className={cn(
                      size === "sm" ? "text-xs" : "text-sm",
                      isUnlocked ? "text-zinc-400" : "text-zinc-600"
                    )}
                  >
                    {achievement.description}
                  </p>
                </div>

                {/* Importance Badge */}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs capitalize",
                    isUnlocked ? colors.text : "text-zinc-600",
                    isUnlocked ? colors.border : "border-zinc-700"
                  )}
                >
                  {achievement.importance}
                </Badge>
              </div>

              {/* Progress Section */}
              {showProgress && !isUnlocked && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Progress</span>
                    <span>
                      {progress} / {achievement.criteria.value}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              {/* Unlocked Status */}
              {isUnlocked && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400">
                    Unlocked{" "}
                    {unlockedAt
                      ? new Date(unlockedAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              )}

              {/* Category */}
              <div className="mt-2">
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    isUnlocked
                      ? "bg-zinc-800/50 text-zinc-400"
                      : "bg-zinc-900/50 text-zinc-600"
                  )}
                >
                  {achievement.category}
                </span>
              </div>
            </div>
          </div>

          {/* Legendary Glow Effect */}
          {isUnlocked && achievement.importance === "legendary" && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 animate-pulse" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
