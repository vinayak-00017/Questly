"use client ";

import React from "react";
import { Clock, Check, Swords } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CountdownTimer } from "../timer";
import { useRouter } from "next/navigation";
import { mainQuestApi } from "@/services/main-quest-api";
import { useQuery } from "@tanstack/react-query";
import { MainQuest } from "@questly/types";

const MainQuestCard = () => {
  const router = useRouter();

  const {
    data: mainQuests = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["mainQuests"],
    queryFn: mainQuestApi.fetchMainQuests,
    select: (data) => data.mainQuests || [],
  });
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 pointer-events-none" />
      <div className="relative">
        <div className="flex w-full px-6 pt-6 pb-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/10">
              <Swords className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white/90">
                Main Quests
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs mt-0.5">
                Long-term quests that build toward major life goals
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/30 border-zinc-800 hover:bg-black/50 text-white gap-1.5 text-sm"
            onClick={(e) => {
              e.stopPropagation;
              router.push("/main-quests");
            }}
          >
            <span>Details</span>
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {mainQuests.map((quest: MainQuest) => (
            <Card
              key={quest.id}
              className="bg-black/20 border-zinc-800 hover:bg-black/30 transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Swords className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-500/80 text-xs font-medium tracking-wide">
                      MAIN QUEST
                    </span>
                    {/* <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        quest.status === "due"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {quest.status === "due"
                        ? "Due today!"
                        : `${Math.ceil((quest.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`}
                    </span> */}
                  </div>
                  <h3 className="text-white/90 font-medium text-sm">
                    {quest.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      {quest.dueDate && (
                        <CountdownTimer targetDate={new Date(quest.dueDate)} />
                      )}
                    </div>
                    <div className="text-amber-400 font-medium">
                      +{quest.xpReward} XP
                    </div>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors ring-1 ring-white/5 group-hover:ring-amber-500/30">
                  <Check className="h-4 w-4 text-zinc-400 group-hover:text-amber-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MainQuestCard;
