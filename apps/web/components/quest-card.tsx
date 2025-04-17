"use client ";

import React from "react";
import { Clock, Check, Shield, Sword, Target, Flame } from "lucide-react";

import { useRouter } from "next/navigation";
import { Card, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { QuestTemplate } from "@questly/types";

const { data: dailyQuests = [], isLoading } = useQuery({
  queryKey: ["dailyQuests"],
  queryFn: questApi.fetchDailyQuest,
  select: (data) => data.dailyQuests || [],
});

const QuestCard = () => {
  const router = useRouter();
  return (
    <Card className="w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-800/90 via-zinc-900/95 to-black/95 border-0 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-700/[0.2] via-transparent to-orange-900/[0.1] pointer-events-none" />
      <div className="relative">
        <div className="flex w-full px-6 pt-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-1 ring-white/10">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-white/90">
                Daily Quests
              </CardTitle>
              <CardDescription className="text-zinc-400 text-sm">
                Complete these quests every day to stay aligned to your main
                quest.
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 text-white gap-2"
          >
            <span>+ Add</span>
          </Button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {dailyQuests.map((quest: QuestTemplate) => (
            <Card
              key={quest.id}
              className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-all cursor-pointer"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500/80 text-sm font-sans">
                      DAILY QUEST
                    </span>
                    {/* <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        quest.priority === "critical"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {quest.priority}
                    </span> */}
                  </div>
                  <h3 className="text-white/90 font-medium">{quest.title}</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-orange-500 font-medium">
                      {/* +{quest.xp} XP */}
                    </div>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                  <Check className="h-4 w-4 text-zinc-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default QuestCard;
