"use client ";

import React from "react";
import { Clock, Check, Shield, Sword, Target, Flame } from "lucide-react";

import { useRouter } from "next/navigation";
import { Card, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { QuestInstance } from "@questly/types";

const QuestCard = () => {
  const router = useRouter();
  const { data: dailyQuests = [], isLoading } = useQuery({
    queryKey: ["dailyQuests"],
    queryFn: questApi.fetchDailyQuest,
    select: (data) => data.dailyQuests || [],
  });

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-700/10 pointer-events-none" />
      <div className="relative">
        <div className="flex w-full px-6 pt-6 pb-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/10">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white/90">
                Daily Quests
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs mt-0.5">
                Complete these quests every day to stay aligned to your main
                quest.
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/30 border-zinc-800 hover:bg-black/50 text-white gap-1.5 text-sm"
          >
            <span>Add Quest</span>
          </Button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {dailyQuests.map((quest: QuestInstance) => (
            <Card
              key={quest.instanceId}
              className="bg-black/20 border-zinc-800 hover:bg-black/30 transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-orange-500/80 text-xs font-medium tracking-wide">
                      DAILY QUEST
                    </span>
                  </div>
                  <h3 className="text-white/90 font-medium text-sm">
                    {quest.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="text-orange-400 text-xs font-medium">
                      {/* +{quest.xp} XP */}
                    </div>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors ring-1 ring-white/5 group-hover:ring-orange-500/30">
                  <Check className="h-4 w-4 text-zinc-400 group-hover:text-orange-400" />
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
