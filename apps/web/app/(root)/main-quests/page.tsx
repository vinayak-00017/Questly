"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Scroll, TrendingUp, Trophy, Target, SwordsIcon } from "lucide-react";
import { MainQuest } from "@questly/types";
import { mainQuestApi } from "@/services/main-quest-api";
import { AddQuestDialog } from "@/components/main-quest/add-main-quest-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAchievements } from "@/contexts/achievement-context";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [completingQuestId, setCompletingQuestId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const { checkForNewAchievements, showAchievement } = useAchievements();

  // Utility function to check if a quest is expired
  const isQuestExpired = (quest: MainQuest): boolean => {
    if (!quest.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(quest.dueDate);
    return now > dueDate;
  };

  // Filter and sort quests by completion status
  const activeQuests = mainQuests
    .filter((q: MainQuest) => !q.completed)
    .sort((a: MainQuest, b: MainQuest) => {
      // Sort expired quests to the bottom
      const aExpired = isQuestExpired(a);
      const bExpired = isQuestExpired(b);

      if (aExpired && !bExpired) return 1;
      if (!aExpired && bExpired) return -1;

      // If both are expired or both are not expired, sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      return 0;
    });

  const completedQuests = mainQuests.filter((q: MainQuest) => q.completed);

  // Calculate stats
  const totalQuests = mainQuests.length;
  const completedQuestsCount = completedQuests.length;
  const progressPercentage =
    totalQuests > 0
      ? Math.round((completedQuestsCount / totalQuests) * 100)
      : 0;

  // Main quest completion mutation
  const completeMainQuestMutation = useMutation({
    mutationFn: ({
      questId,
      completed,
    }: {
      questId: string;
      completed: boolean;
    }) => mainQuestApi.completeMainQuest(questId, completed),
    onSuccess: async (data, variables) => {
      // If completing a quest, trigger animation and auto-switch tabs
      if (variables.completed) {
        // Wait for completion animation
        setTimeout(() => {
          setCompletingQuestId(null);
          // Auto-switch to completed tab after animation
          setActiveTab("completed");
        }, 1500);

        toast.success("Main quest completed! You earned XP!", {
          icon: <Trophy className="h-5 w-5 text-yellow-400" />,
          className:
            "bg-gradient-to-r from-green-900 to-emerald-800 border-green-600",
        });

        // Check if the backend returned achievements directly
        if (
          data?.newAchievements &&
          Array.isArray(data.newAchievements) &&
          data.newAchievements.length > 0
        ) {
          data.newAchievements.forEach((achievement: any, index: number) => {
            setTimeout(() => {
              showAchievement(achievement);
            }, index * 100);
          });
        } else {
          // Fallback: Check for new achievements via API call
          try {
            await checkForNewAchievements();
          } catch (error) {
            console.error("Error checking for achievements:", error);
          }
        }
      } else {
        setCompletingQuestId(null);
        toast.success("Main quest marked as incomplete");
      }

      queryClient.invalidateQueries({
        queryKey: ["activeMainQuests"],
      });
      // Invalidate and refetch main quests after animation delay
      setTimeout(
        () => {
          queryClient.invalidateQueries({
            queryKey: ["mainQuests"],
          });
        },
        variables.completed ? 1600 : 100
      );
    },
    onError: (error: any) => {
      setCompletingQuestId(null);
      toast.error(error.message || "Failed to update main quest");
    },
  });

  const handleCreateQuest = () => {
    console.log("Opening dialog");
    setIsAddDialogOpen(true);
  };

  const handleQuestClick = (id: string) => {
    router.push(`/main-quests/${id}`);
  };

  const handleCompleteQuest = (questId: string, completed: boolean) => {
    if (completed) {
      setCompletingQuestId(questId);
    }
    completeMainQuestMutation.mutate({ questId, completed });
  };

  setTimeout(() => {
    console.log("Delayed for 10 second.");
  }, 10000);

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
          value={completedQuestsCount}
          className="ring-amber-500/30"
        />
        <StatCard
          icon={TrendingUp}
          title="Progress"
          value={`${progressPercentage}%`}
          className="ring-emerald-500/30"
        />
      </div>

      {/* Main quest tabs section */}
      <div className="relative z-10 space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "active" | "completed")
          }
          className="w-full"
        >
          <div className="flex items-center justify-between mb-8">
            <SectionHeader
              icon={SwordsIcon}
              title="Quest Management"
              subtitle="Track your epic adventures and achievements"
            />
            <TabsList className="flex w-max min-w-[320px] h-14 bg-black/60 border border-zinc-700/50 rounded-xl p-1 backdrop-blur-sm">
              <TabsTrigger
                value="active"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-purple-200 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-white/5"
              >
                Active Quests ({activeQuests.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600/30 data-[state=active]:to-emerald-500/30 data-[state=active]:text-emerald-200 data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-white/5"
              >
                Completed Quests ({completedQuests.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="space-y-6">
            {activeQuests.length === 0 ? (
              <EmptyState onCreateQuest={handleCreateQuest} />
            ) : (
              <div className="grid gap-6 lg:gap-8">
                {activeQuests.map((quest: MainQuest, index: number) => {
                  const details = getQuestDetails(quest);
                  const CategoryIcon = getCategoryIcon(quest.category);
                  const questExpired = isQuestExpired(quest);

                  return (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      categoryIcon={CategoryIcon}
                      progress={details.progress}
                      questsCount={quest.attachedQuests.length}
                      category={quest.category}
                      importanceStyle={getImportanceStyle(quest.importance)}
                      index={index}
                      onClick={handleQuestClick}
                      onComplete={handleCompleteQuest}
                      isCompleting={completingQuestId === quest.id}
                      isExpired={questExpired}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedQuests.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative">
                  <Trophy className="mx-auto h-20 w-20 text-amber-500/30 mb-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-amber-500/5 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white/90 mb-3">
                  No Completed Quests Yet
                </h3>
                <p className="text-zinc-400 text-lg">
                  Complete your first quest to unlock achievements and track
                  your progress!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:gap-8">
                {completedQuests.map((quest: MainQuest, index: number) => {
                  const details = getQuestDetails(quest);
                  const CategoryIcon = getCategoryIcon(quest.category);

                  return (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      categoryIcon={CategoryIcon}
                      progress={details.progress}
                      questsCount={quest.attachedQuests.length}
                      category={quest.category}
                      importanceStyle={getImportanceStyle(quest.importance)}
                      index={index}
                      onClick={handleQuestClick}
                      onComplete={handleCompleteQuest}
                      isCompleting={completingQuestId === quest.id}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
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
