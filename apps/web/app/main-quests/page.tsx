"use client";

import React, { useState } from "react";
import { Shield, Calendar, Link, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CountdownTimer } from "@/components/timer";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddQuestDialog } from "@/components/main-quest/add-quest-dialog";
import { MainQuest, MainQuestImportance } from "@questly/types";
import { useQuery } from "@tanstack/react-query";
import { mainQuestApi } from "@/services/main-quest-api";

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
  <Card className="flex-1 bg-zinc-900/50 p-6 flex flex-col items-center justify-center gap-3">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${className}`}
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
  const { Epic, High, Medium, Low } = MainQuestImportance;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const totalQuests = mainQuests.length;
  const completedQuests = mainQuests.filter(
    (q: MainQuest) => q.completed
  ).length;
  // const averageProgress = Math.round(
  //   quests.reduce((acc, q) => acc + q.progress, 0) / totalQuests
  // );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Main Quests</h1>
          <p className="text-zinc-400">
            Track your major life quests and associated daily challenges
          </p>
        </div>
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Main Quest
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Shield}
          title="Total Quests"
          value={totalQuests}
          className="bg-indigo-500/10 text-indigo-400"
        />
        <StatCard
          icon={Link}
          title="Completed"
          value={completedQuests}
          className="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          icon={TrendingUp}
          title="Average Progress"
          value={10}
          // value={`${averageProgress}%`}
          className="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      <div className="relative space-y-4">
        <div className="fixed inset-0 bg-gradient-to-br from-amber-400/[0.2] via-transparent to-purple-500/[0.05] pointer-events-none" />
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Active Main Quests</h2>
        </div>

        <div className="space-y-4">
          {mainQuests.map((quest: MainQuest) => (
            <Card
              key={quest.id}
              className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 transition-all cursor-pointer p-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{quest.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          quest.importance === "high"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        • {quest.importance}
                      </span>
                    </div>
                    <p className="text-zinc-400">{quest.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {/* {quest.progress}% */}
                          {10}%
                        </span>
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
                          // strokeDashoffset={
                          //   30 * 2 * Math.PI * (1 - quest.progress / 100)
                          // }
                          strokeDashoffset={10}
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
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    <span>{} daily quests linked</span>
                  </div>
                </div>

                <Button variant="outline" className="text-sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AddQuestDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default MainQuestsPage;
