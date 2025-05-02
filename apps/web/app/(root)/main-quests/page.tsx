"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Scroll, TrendingUp, Trophy, Swords } from "lucide-react";
import { MainQuest } from "@questly/types";
import { mainQuestApi } from "@/services/main-quest-api";
import { AddQuestDialog } from "@/components/main-quest/add-main-quest-dialog";

// Import our new components
import { Particles } from "@/components/main-quest/ui/Particles";
import { StatCard } from "@/components/main-quest/ui/StatCard";
import { PageHeader } from "@/components/main-quest/ui/PageHeader";
import { SectionHeader } from "@/components/main-quest/ui/SectionHeader";
import { EmptyState } from "@/components/main-quest/ui/EmptyState";
import { QuestCard } from "@/components/main-quest/ui/QuestCard";
import {
  getCategoryIcon,
  getImportanceStyle,
  getQuestDetails,
} from "@/components/main-quest/ui/utils";

export default function MainQuestsPage() {
  const { data: mainQuests = [], isLoading } = useQuery({
    queryKey: ["mainQuests"],
    queryFn: mainQuestApi.fetchMainQuests,
    select: (data) => data.mainQuests || [],
  });

  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Calculate stats
  const totalQuests = mainQuests.length;
  const completedQuests = mainQuests.filter(
    (q: MainQuest) => q.completed
  ).length;
  const progressPercentage =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  const handleCreateQuest = () => {
    console.log("Opening dialog"); // Add logging
    setIsAddDialogOpen(true);
  };

  const handleQuestClick = (id: string) => {
    router.push(`/main-quests/${id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Scroll className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
          <p className="text-xl font-medieval">Loading your epic journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto p-6 space-y-8">
      {/* Background particles */}
      <Particles />

      {/* Page header */}
      <div className="relative z-10">
        <PageHeader onCreateQuest={handleCreateQuest} />
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Scroll}
          title="Total Quests"
          value={totalQuests}
          className="ring-indigo-500/30"
        />
        <StatCard
          icon={Trophy}
          title="Completed"
          value={completedQuests}
          className="ring-amber-500/30"
        />
        <StatCard
          icon={TrendingUp}
          title="Progress"
          value={`${progressPercentage}%`}
          className="ring-emerald-500/30"
        />
      </div>

      {/* Main quest list section */}
      <div className="relative z-10 space-y-6">
        <SectionHeader
          icon={Swords}
          title="Active Quests"
          subtitle="Your ongoing adventures await completion"
        />

        {mainQuests.length === 0 ? (
          <EmptyState onCreateQuest={handleCreateQuest} />
        ) : (
          <div className="space-y-4">
            {mainQuests.map((quest: MainQuest, index: number) => {
              const details = getQuestDetails(quest);
              const CategoryIcon = getCategoryIcon(details.category);

              return (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  categoryIcon={CategoryIcon}
                  progress={details.progress}
                  dailyQuestsCount={details.dailyQuestsCount}
                  category={details.category}
                  importanceStyle={getImportanceStyle(quest.importance)}
                  index={index}
                  onClick={handleQuestClick}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Add Quest Dialog */}
      <AddQuestDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          console.log("Dialog state changed:", open); // Add logging
          setIsAddDialogOpen(open);
        }}
        onSuccess={() => {
          // Handle success - could trigger a refetch if needed
        }}
      />
    </div>
  );
}
