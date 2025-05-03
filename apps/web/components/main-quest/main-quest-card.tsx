"use client";

import React from "react";
import {
  Clock,
  Check,
  Swords,
  Star,
  Crown,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CountdownTimer } from "../timer";
import { useRouter } from "next/navigation";
import { mainQuestApi } from "@/services/main-quest-api";
import { useQuery } from "@tanstack/react-query";
import { MainQuest } from "@questly/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-2xl relative">
      {/* Enhanced epic gradient background with better colors and animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/15 via-purple-600/10 to-amber-500/15 pointer-events-none" />

      {/* Animated light effect at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/50 via-purple-500/50 to-amber-500/50 glow-animation"></div>

      {/* Corner decorations to make it look more epic */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/30 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/30 rounded-br-lg"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-500/10 float-animation"
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

      <div className="relative">
        <div className="flex w-full px-8 pt-8 pb-6 items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-black/70 to-black/90 w-14 h-14 rounded-full flex items-center justify-center shadow-xl ring-2 ring-amber-500/30 pulse-glow">
              <Swords className="h-7 w-7 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-medieval font-bold text-white flex items-center gap-2">
                Main Quests
                <Crown className="h-5 w-5 text-amber-400" />
              </CardTitle>
              <CardDescription className="text-amber-300/80 text-sm mt-1">
                Epic long-term quests that forge your legend
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/40 border-amber-800/50 hover:bg-black/60 hover:border-amber-600/50 text-white gap-1.5 text-sm transition-all"
            onClick={(e) => {
              e.stopPropagation();
              router.push("/main-quests");
            }}
          >
            <span>View All</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {mainQuests.map((quest: MainQuest) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="bg-gradient-to-br from-black/60 to-black/40 border border-amber-900/30 hover:border-amber-700/50 transition-all duration-300 cursor-pointer group shadow-lg overflow-hidden">
                {/* Removed progress indicator bar */}

                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="bg-black/40 w-6 h-6 rounded-full flex items-center justify-center shadow-md ring-1 ring-amber-500/30">
                          <Star className="h-3 w-3 text-amber-500" />
                        </div>
                        {/* Redesigned EPIC QUEST tag */}
                        <span className="bg-gradient-to-r from-amber-900/80 to-amber-800/80 text-amber-300 text-xs font-medieval uppercase px-2.5 py-1 rounded-md border border-amber-700/50 shadow-inner shadow-amber-900/30 tracking-wide">
                          EPIC QUEST
                        </span>
                      </div>

                      <h3 className="text-white font-medium text-lg leading-tight">
                        {quest.title}
                      </h3>

                      {/* Timer section with enhanced prominence */}
                      {quest.dueDate && (
                        <div className="bg-gradient-to-r from-black/80 to-zinc-900/80 rounded-lg border border-amber-900/30 p-3 mt-2">
                          <div className="text-amber-300/90 text-xs mb-1 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>TIME REMAINING</span>
                          </div>
                          <div className="text-lg font-bold text-white">
                            <CountdownTimer
                              targetDate={new Date(quest.dueDate)}
                              className="text-white font-medieval"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 bg-amber-900/20 px-2.5 py-1 rounded-full">
                          <Trophy className="h-4 w-4 text-amber-400" />
                          <span className="text-amber-300 font-medium text-sm">
                            +{quest.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-300 ring-1 ring-white/10 group-hover:ring-amber-500/50 shadow-lg">
                      <Check className="h-5 w-5 text-zinc-400 group-hover:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pulse-glow {
          animation: pulse-glow 3s infinite ease-in-out;
        }

        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 5px rgba(251, 191, 36, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
          }
          100% {
            box-shadow: 0 0 5px rgba(251, 191, 36, 0.2);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
          opacity: 0.6;
        }

        .glow-animation {
          animation: glow 4s infinite linear;
        }

        @keyframes glow {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Card>
  );
};

export default MainQuestCard;
