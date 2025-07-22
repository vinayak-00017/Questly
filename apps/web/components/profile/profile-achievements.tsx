"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Target, Star, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfileAchievementsProps {
  userStats: any;
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
  userStats,
}) => {
  const level = userStats?.levelStats?.level || 1;
  const streak = userStats?.streak || 0;

  const achievements = [
    {
      title: "First Quest Complete",
      desc: "Completed your very first quest",
      icon: Target,
      color: "text-green-400",
      unlocked: level >= 1,
    },
    {
      title: "Level Up!",
      desc: `Reached level ${level}`,
      icon: Star,
      color: "text-amber-400",
      unlocked: level >= 2,
    },
    {
      title: "Daily Streak",
      desc: `Maintained a ${streak} day streak`,
      icon: Flame,
      color: "text-orange-400",
      unlocked: streak >= 3,
    },
    {
      title: "Dedicated Adventurer",
      desc: "Reached level 10",
      icon: Award,
      color: "text-purple-400",
      unlocked: level >= 10,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-black/50 border border-zinc-800/50 h-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-medieval text-white">
              Recent Achievements
            </h2>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border transition-all duration-300",
                  achievement.unlocked
                    ? "bg-zinc-900/50 border-zinc-800/30 hover:border-purple-500/30"
                    : "bg-zinc-950/30 border-zinc-900/50 opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    achievement.unlocked
                      ? cn("bg-black/50", achievement.color)
                      : "bg-zinc-800/50 text-zinc-600"
                  )}
                >
                  <achievement.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4
                    className={cn(
                      "font-semibold text-sm",
                      achievement.unlocked ? "text-white" : "text-zinc-500"
                    )}
                  >
                    {achievement.title}
                  </h4>
                  <p
                    className={cn(
                      "text-xs",
                      achievement.unlocked ? "text-zinc-400" : "text-zinc-600"
                    )}
                  >
                    {achievement.desc}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};