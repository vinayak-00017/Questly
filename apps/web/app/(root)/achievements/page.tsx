"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Filter, Search, TrendingUp, Award, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { achievementsApi } from "@/services/achievements-api";
import { cn } from "@/lib/utils";

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

interface AchievementStats {
  total: number;
  unlocked: number;
  percentage: number;
  byImportance: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  byCategory: Record<string, { total: number; unlocked: number }>;
}

export default function AchievementsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImportance, setSelectedImportance] = useState<string>("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  // Fetch achievements using React Query
  const {
    data: achievementsData,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useQuery({
    queryKey: ["achievements"],
    queryFn: achievementsApi.getAchievements,
  });

  // Fetch achievement stats using React Query
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["achievementStats"],
    queryFn: achievementsApi.getAchievementStats,
  });

  // Unlock achievement mutation (if needed)
  const unlockAchievementMutation = useMutation({
    mutationFn: achievementsApi.unlockAchievement,
    onSuccess: () => {
      // Invalidate and refetch achievements data
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({ queryKey: ["achievementStats"] });
    },
  });

  const achievements = achievementsData?.data || [];
  const stats = statsData?.data || null;
  const loading = achievementsLoading || statsLoading;

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = achievement.achievement.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      achievement.achievement.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      achievement.achievement.category === selectedCategory;
    
    const matchesImportance = selectedImportance === "all" || 
      achievement.achievement.importance === selectedImportance;
    
    const matchesUnlocked = !showUnlockedOnly || achievement.isUnlocked;

    return matchesSearch && matchesCategory && matchesImportance && matchesUnlocked;
  });

  const categories = Array.from(
    new Set(achievements.map((a) => a.achievement.category))
  );

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const recentAchievements = unlockedAchievements
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    })
    .slice(0, 6);

  // Handle error states
  if (achievementsError || statsError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">Failed to load achievements. Please try again.</p>
            <Button 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["achievements"] });
                queryClient.invalidateQueries({ queryKey: ["achievementStats"] });
              }}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Achievements</h1>
          <p className="text-zinc-400">Track your progress and unlock rewards</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-black/50 border-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.unlocked}
                  </div>
                  <div className="text-sm text-zinc-400">Unlocked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.total}
                  </div>
                  <div className="text-sm text-zinc-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {stats.percentage}%
                  </div>
                  <div className="text-sm text-zinc-400">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {stats.byImportance.legendary}
                  </div>
                  <div className="text-sm text-zinc-400">Legendary</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50">
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/50 border-zinc-800/50">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        placeholder="Search achievements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-zinc-900/50 border-zinc-700"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48 bg-zinc-900/50 border-zinc-700">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedImportance} onValueChange={setSelectedImportance}>
                    <SelectTrigger className="w-full md:w-48 bg-zinc-900/50 border-zinc-700">
                      <SelectValue placeholder="Importance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={showUnlockedOnly ? "default" : "outline"}
                    onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                    className="whitespace-nowrap"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Unlocked Only
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.achievementId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <AchievementCard achievementProgress={achievement} />
              </motion.div>
            ))}
          </motion.div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No achievements found matching your criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.achievementId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <AchievementCard achievementProgress={achievement} showProgress={false} />
              </motion.div>
            ))}
          </motion.div>

          {recentAchievements.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No recent achievements to display.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.byCategory).map(([category, categoryStats]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-black/50 border-zinc-800/50 hover:border-purple-500/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{category}</h3>
                        <Badge variant="outline" className="text-zinc-400">
                          {categoryStats.unlocked}/{categoryStats.total}
                        </Badge>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(categoryStats.unlocked / categoryStats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">
                        {Math.round((categoryStats.unlocked / categoryStats.total) * 100)}% complete
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}