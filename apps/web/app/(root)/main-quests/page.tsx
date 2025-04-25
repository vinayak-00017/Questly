"use client";

import React, { useState } from "react";
import {
  Calendar,
  Link,
  TrendingUp,
  Plus,
  Swords,
  Trophy,
  Compass,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CountdownTimer } from "@/components/timer";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddQuestDialog } from "@/components/main-quest/add-main-quest-dialog";
import { MainQuest, MainQuestImportance } from "@questly/types";
import { useQuery } from "@tanstack/react-query";
import { mainQuestApi } from "@/services/main-quest-api";
import {
  Expandable,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/expandable-card";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  className?: string;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  className = "",
}: StatCardProps) => (
  <Card
    className={`bg-black/30 border-zinc-800/50 hover:bg-black/40 transition-all duration-300 flex-1 p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden ${className}`}
  >
    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-500/30"></div>
    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/30"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-purple-500/30"></div>
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-purple-500/30"></div>

    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ring-1 ring-purple-500/30 bg-black/40 ${className}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-center">
      <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
      <p className="text-4xl font-bold mt-1">{value}</p>
    </div>
  </Card>
);

const MainQuestsPage = () => {
  const { data: mainQuests = [], isLoading } = useQuery({
    queryKey: ["mainQuests"],
    queryFn: mainQuestApi.fetchMainQuests,
    select: (data) => data.mainQuests || [],
  });
  const router = useRouter();
  const { Legendary, Heroic, Rare, Common } = MainQuestImportance;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const totalQuests = mainQuests.length;
  const completedQuests = mainQuests.filter(
    (q: MainQuest) => q.completed
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 relative">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600/[0.03] via-transparent to-amber-500/[0.03] pointer-events-none" />

      {/* Floating particles for visual interest */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 float-animation"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-purple-500/30 pulse-glow">
            <Swords className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medieval font-bold text-white/90">
              Main Quests
            </h1>
            <p className="text-zinc-400 text-sm">
              Track your major life quests and associated daily challenges
            </p>
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white gap-2 border-0 shadow-lg shadow-purple-900/20"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Main Quest
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Swords}
          title="Total Quests"
          value={totalQuests}
          className="bg-indigo-500/10 text-indigo-400"
        />
        <StatCard
          icon={Trophy}
          title="Completed"
          value={completedQuests}
          className="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          icon={TrendingUp}
          title="Average Progress"
          value={`${completedQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0}%`}
          className="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      <div className="space-y-4 relative">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-medieval font-semibold">
            Active Main Quests
          </h2>
        </div>

        <div className="space-y-4">
          {mainQuests.length > 0 ? (
            mainQuests.map((quest: MainQuest) => (
              <QuestWithLinkedQuestsCount key={quest.id} quest={quest} />
            ))
          ) : (
            <div className="p-12 text-center bg-black/20 rounded-lg border border-zinc-800/40">
              <Swords className="h-12 w-12 text-purple-500/30 mx-auto mb-3" />
              <h3 className="text-white/90 font-medieval text-lg mb-1">
                No Main Quests Yet
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Create your first main quest to begin your epic journey
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-purple-700/50 to-amber-700/50 hover:from-purple-600/50 hover:to-amber-600/50 text-white border-purple-800/50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Main Quest
              </Button>
            </div>
          )}
        </div>
      </div>

      <AddQuestDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .float-animation {
          animation: float infinite ease-in-out;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(168, 85, 247, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
          }
        }
        .pulse-glow {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

interface QuestWithLinkedQuestsCountProps {
  quest: MainQuest;
}

const QuestWithLinkedQuestsCount = ({
  quest,
}: QuestWithLinkedQuestsCountProps) => {
  const { data: linkedQuests, isLoading } = useQuery({
    queryKey: ["linkedQuests", quest.id],
    queryFn: () => mainQuestApi.fetchLinkedQuests(quest.id),
    enabled: !!quest.id,
  });

  const dailyQuestsCount = linkedQuests?.dailyQuests?.length || 0;
  const sideQuestsCount = linkedQuests?.sideQuests?.length || 0;

  // Calculate progress (this is a placeholder, replace with real calculation)
  const progress = linkedQuests
    ? Math.round(
        ((linkedQuests.dailyQuests?.filter((q: any) => q.completed)?.length ||
          0) /
          (linkedQuests.dailyQuests?.length || 1)) *
          100
      )
    : 10;

  const importanceStyles = {
    legendary: "bg-red-500/20 text-red-400 border-red-500/30",
    heroic: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    rare: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    common: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  const style = importanceStyles[quest.importance] || importanceStyles.common;

  return (
    <Card className="bg-gradient-to-br from-black/40 to-black/60 border-zinc-800/50 hover:bg-black/50 transition-all cursor-pointer p-6 relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-purple-500/30"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-purple-500/30"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-purple-500/30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/30"></div>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white/90">
                {quest.title}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs border ${style}`}
              >
                • {quest.importance}
              </span>
            </div>
            <p className="text-zinc-400">{quest.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{progress}%</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-zinc-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
                <circle
                  className="text-purple-500"
                  strokeWidth="4"
                  strokeDasharray={30 * 2 * Math.PI}
                  strokeDashoffset={
                    ((100 - progress) / 100) * (30 * 2 * Math.PI)
                  }
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Due: </span>
            {quest.dueDate && (
              <CountdownTimer targetDate={new Date(quest.dueDate)} />
            )}
          </div>

          {/* Daily Quests Expandable Trigger */}
          <Expandable>
            <ExpandableTrigger>
              <div className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer">
                <Calendar className="w-4 h-4" />
                <span>{dailyQuestsCount} daily quests linked</span>
              </div>
            </ExpandableTrigger>

            {/* Expandable Content for Daily Quests */}
            <ExpandableContent preset="slide-down" className="mt-4 mb-2">
              <div className="space-y-2 pl-6 border-l-2 border-purple-500/20">
                {linkedQuests?.dailyQuests?.length > 0 ? (
                  linkedQuests.dailyQuests.map((daily: any) => (
                    <div
                      key={daily.id}
                      className="bg-black/30 p-3 rounded-md border border-zinc-800/50 hover:border-orange-500/30 transition-all flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span className="text-white/80 text-sm">
                          {daily.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-orange-400 flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />+
                          {daily.xpReward || 50} XP
                        </div>
                        <div className="h-6 w-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-orange-500/20 transition-colors ring-1 ring-white/5 hover:ring-orange-500/30">
                          <Check className="h-3 w-3 text-zinc-400 group-hover:text-orange-400" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-500 italic text-sm">
                    No daily quests linked yet
                  </div>
                )}
              </div>
            </ExpandableContent>
          </Expandable>

          {/* Side Quests Expandable Trigger */}
          <Expandable>
            <ExpandableTrigger>
              <div className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer">
                <Compass className="w-4 h-4" />
                <span>{sideQuestsCount} side quests linked</span>
              </div>
            </ExpandableTrigger>

            {/* Expandable Content for Side Quests */}
            <ExpandableContent preset="slide-down" className="mt-4 mb-2">
              <div className="space-y-2 pl-6 border-l-2 border-blue-500/20">
                {linkedQuests?.sideQuests?.length > 0 ? (
                  linkedQuests.sideQuests.map((side: any) => (
                    <div
                      key={side.id}
                      className="bg-black/30 p-3 rounded-md border border-zinc-800/50 hover:border-blue-500/30 transition-all flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-blue-500" />
                        <span className="text-white/80 text-sm">
                          {side.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-blue-400 flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />+
                          {side.xpReward || 75} XP
                        </div>
                        <div className="h-6 w-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-blue-500/20 transition-colors ring-1 ring-white/5 hover:ring-blue-500/30">
                          <Check className="h-3 w-3 text-zinc-400 group-hover:text-blue-400" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-500 italic text-sm">
                    No side quests linked yet
                  </div>
                )}
              </div>
            </ExpandableContent>
          </Expandable>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 bg-black/30 hover:bg-black/40 text-white/80 border-zinc-800 hover:border-purple-500/30 transition-all"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            className="bg-black/30 hover:bg-purple-500/20 hover:border-purple-500/30 text-white/80 border-zinc-800 w-10 h-10 p-0 flex items-center justify-center rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="bg-black/30 hover:bg-green-500/20 hover:border-green-500/30 text-white/80 border-zinc-800 w-10 h-10 p-0 flex items-center justify-center rounded-full"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MainQuestsPage;
