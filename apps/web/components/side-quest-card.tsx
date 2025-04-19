"use client";

import React from "react";
import { Clock, Check, Map, Scroll, Compass, Target } from "lucide-react";

import { useRouter } from "next/navigation";
import { Card, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { QuestInstance } from "@questly/types";

const SideQuestCard = () => {
  const router = useRouter();
  const { data: sideQuests = [], isLoading } = useQuery({
    queryKey: ["sideQuests"],
    queryFn: () =>
      questApi.fetchSideQuests?.() || Promise.resolve({ sideQuests: [] }),
    select: (data) => data.sideQuests || [],
    enabled: !!questApi.fetchSideQuests,
  });

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-700/10 pointer-events-none" />
      <div className="relative">
        <div className="flex w-full px-6 pt-6 pb-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/10">
              <Compass className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white/90">
                Side Quests
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs mt-0.5">
                Optional quests that enhance your journey and earn extra rewards
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
          {sideQuests.length > 0 ? (
            sideQuests.map((quest: QuestInstance) => (
              <Card
                key={quest.instanceId}
                className="bg-black/20 border-zinc-800 hover:bg-black/30 transition-all duration-200 cursor-pointer group"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Compass className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-blue-500/80 text-xs font-medium tracking-wide">
                        SIDE QUEST
                      </span>
                    </div>
                    <h3 className="text-white/90 font-medium text-sm">
                      {quest.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-blue-400 text-xs font-medium">
                        +{quest.xpReward || 75} XP
                      </div>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors ring-1 ring-white/5 group-hover:ring-blue-500/30">
                    <Check className="h-4 w-4 text-zinc-400 group-hover:text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 p-6 text-center">
              <Map className="h-12 w-12 text-blue-500/30 mx-auto mb-3" />
              <h3 className="text-white/90 font-medium mb-1">
                No Side Quests Available
              </h3>
              <p className="text-zinc-400 text-sm">
                Add some side quests to enhance your journey
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SideQuestCard;
