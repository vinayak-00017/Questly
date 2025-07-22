"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Zap, Flame, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  userStats: any;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ userStats }) => {
  const levelStats = userStats?.levelStats || {};
  const level = levelStats.level || 1;
  const currentLevelXp = levelStats.currentLevelXp || 0;
  const todaysXp = userStats?.todaysXp || 0;

  const stats = [
    { icon: Trophy, label: "Level", value: level, color: "text-amber-400" },
    {
      icon: Zap,
      label: "Total XP",
      value: (levelStats.totalXpForCurrentLevel || 0) + currentLevelXp,
      color: "text-blue-400",
    },
    {
      icon: Flame,
      label: "Today's XP",
      value: todaysXp,
      color: "text-orange-400",
    },
    {
      icon: Target,
      label: "XP to Next Level",
      value: levelStats.xpToNextLevel || 0,
      color: "text-purple-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 * index }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-black/50 border border-zinc-800/50 hover:border-purple-500/30 transition-all duration-300 group relative overflow-hidden">
            <CardContent className="p-6 text-center">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>

              <div
                className={cn(
                  "w-12 h-12 rounded-full bg-black/40 ring-1 ring-white/10 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform",
                  stat.color
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-zinc-400 text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold font-medieval",
                  stat.color
                )}
              >
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};