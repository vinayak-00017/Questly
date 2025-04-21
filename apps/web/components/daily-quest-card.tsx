"use client ";

import React, { useState } from "react";
import {
  Clock,
  Check,
  Shield,
  Sword,
  Target,
  Flame,
  Plus,
  Sparkles,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Card, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { QuestInstance } from "@questly/types";
import { AddDailyQuestDialog } from "./add-daily-quest-dialog";

const DailyQuestCard = () => {
  const router = useRouter();
  const { data: dailyQuests = [], isLoading } = useQuery({
    queryKey: ["dailyQuests"],
    queryFn: questApi.fetchDailyQuest,
    select: (data) => data.dailyQuests || [],
  });
  const [isDailyQuestDialog, setIsDailyQuestDialog] = useState(false);

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-lg relative">
      {/* Enhanced background with animated particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-700/10 pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500/20 float-animation"
            style={{
              width: `${Math.random() * 10 + 3}px`,
              height: `${Math.random() * 10 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative">
        <div className="flex w-full px-6 pt-6 pb-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-orange-500/30 pulse-glow">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-medieval text-white/90">
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
            onClick={() => setIsDailyQuestDialog(true)}
            className="bg-black/30 border-orange-800/30 hover:bg-black/50 text-white gap-1.5 text-sm hover:border-orange-500/50 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            <span>Add Quest</span>
          </Button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {dailyQuests.length > 0 ? (
            dailyQuests.map((quest: QuestInstance) => (
              <Card
                key={quest.instanceId}
                className="bg-gradient-to-br from-black/40 to-black/60 border-zinc-800/50 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {/* Quest card decorative corner elements */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-orange-500/30"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-orange-500/30"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-orange-500/30"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-orange-500/30"></div>

                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      <span className="text-orange-500/80 text-xs font-medieval tracking-wide">
                        DAILY QUEST
                      </span>
                    </div>
                    <h3 className="text-white/90 font-medium text-sm">
                      {quest.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-orange-400 text-xs font-medium flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />+
                        {quest.xpReward || 50} XP
                      </div>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors ring-1 ring-white/5 group-hover:ring-orange-500/50">
                    <Check className="h-4 w-4 text-zinc-400 group-hover:text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center bg-black/20 rounded-lg border border-zinc-800/40">
              <Flame className="h-12 w-12 text-orange-500/30 mx-auto mb-3" />
              <h3 className="text-white/90 font-medieval text-lg mb-1">
                No Daily Quests Yet
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Add your first daily quest to begin your journey
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDailyQuestDialog(true)}
                className="bg-gradient-to-r from-orange-700/50 to-red-700/50 hover:from-orange-600/50 hover:to-red-600/50 border-orange-800/50 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Quest
              </Button>
            </div>
          )}
        </div>
      </div>
      <AddDailyQuestDialog
        open={isDailyQuestDialog}
        onOpenChange={setIsDailyQuestDialog}
      />
    </Card>
  );
};

export default DailyQuestCard;
