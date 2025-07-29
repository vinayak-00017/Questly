"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Trophy, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { useQuery } from "@tanstack/react-query";
import { achievementsApi } from "@/services/achievements-api";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AchievementProgress {
  achievementId: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    importance: "common" | "rare" | "epic" | "legendary";
    criteria: {
      type: string;
      value: number;
    };
    hidden?: boolean;
  };
}

interface ProfileAchievementsProps {
  userStats: any;
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
  userStats,
}) => {
  // Fetch recent achievements using React Query
  const {
    data: recentAchievementsData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["recentAchievements", 4],
    queryFn: () => achievementsApi.getRecentAchievements(4),
  });

  const recentAchievements = recentAchievementsData?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-black/50 border border-zinc-800/50 h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-medieval text-white">
                Recent Achievements
              </h2>
            </div>
            <Link href="/achievements">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Trophy className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">
                Failed to load achievements
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Please try again later
              </p>
            </div>
          ) : recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.achievementId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <AchievementCard
                    achievementProgress={achievement}
                    size="sm"
                    showProgress={false}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">
                No achievements unlocked yet
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Complete quests to earn achievements!
              </p>
            </div>
          )}

          {recentAchievements.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              <Link href="/achievements">
                <Button variant="outline" size="sm" className="w-full">
                  View All Achievements
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
