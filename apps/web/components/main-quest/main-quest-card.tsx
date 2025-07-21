"use client";

import React, { useState } from "react";
import {
  Clock,
  Star,
  Crown,
  ArrowUpRight,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CountdownTimer } from "../timer";
import { useRouter } from "next/navigation";
import { mainQuestApi } from "@/services/main-quest-api";
import { useQuery } from "@tanstack/react-query";
import { MainQuest, MainQuestImportance } from "@questly/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmptyState } from "./ui/EmptyState";
import { AddQuestDialog } from "./add-main-quest-dialog";

const MainQuestCard = () => {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { Legendary, Heroic, Rare, Common } = MainQuestImportance;

  const {
    data: rawMainQuests = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["mainQuests"],
    queryFn: mainQuestApi.fetchMainQuests,
    select: (data) => data.mainQuests || [],
  });

  // Sort quests: 1. By time left (if < 10 days), 2. By priority (if >= 10 days)
  const sortedMainQuests = [...rawMainQuests].sort((a, b) => {
    const now = new Date();
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const aTimeLeft = a.dueDate
      ? new Date(a.dueDate).getTime() - now.getTime()
      : Infinity;
    const bTimeLeft = b.dueDate
      ? new Date(b.dueDate).getTime() - now.getTime()
      : Infinity;

    const aHasUrgentDeadline =
      a.dueDate && new Date(a.dueDate) < tenDaysFromNow;
    const bHasUrgentDeadline =
      b.dueDate && new Date(b.dueDate) < tenDaysFromNow;

    // Priority mapping for importance levels
    const importancePriority = {
      [Legendary]: 4,
      [Heroic]: 3,
      [Rare]: 2,
      [Common]: 1,
    };

    // If both have urgent deadlines (< 10 days), sort by time left (ascending - least time first)
    if (aHasUrgentDeadline && bHasUrgentDeadline) {
      return aTimeLeft - bTimeLeft;
    }

    // If only one has urgent deadline, prioritize the urgent one
    if (aHasUrgentDeadline && !bHasUrgentDeadline) return -1;
    if (!aHasUrgentDeadline && bHasUrgentDeadline) return 1;

    // If neither has urgent deadline (both > 10 days or no deadline), sort by importance
    const aPriority =
      importancePriority[a.importance as keyof typeof importancePriority] || 0;
    const bPriority =
      importancePriority[b.importance as keyof typeof importancePriority] || 0;

    // Higher importance first (descending)
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    // If same importance, sort by time left (ascending)
    return aTimeLeft - bTimeLeft;
  });

  // Filter out quests with 0 or negative time remaining
  const mainQuests = sortedMainQuests.filter((quest) => {
    if (!quest.dueDate) return true; // Show quests without due date
    const now = new Date();
    const timeLeft = new Date(quest.dueDate).getTime() - now.getTime();
    return timeLeft > 0; // Only show quests with time remaining
  });

  const handleCreateQuest = () => {
    console.log("Opening dialog");
    setIsAddDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-lg relative">
        {/* Enhanced epic gradient background with better colors and animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/15 via-purple-600/10 to-amber-500/15 pointer-events-none" />

        {/* Animated light effect at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/50 via-purple-500/50 to-amber-500/50 glow-animation"></div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 border-t-2 border-l-2 border-amber-500/30 rounded-tl-lg w-4 h-4"></div>
        <div className="absolute top-0 right-0 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg w-4 h-4"></div>
        <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg w-4 h-4"></div>
        <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-amber-500/30 rounded-br-lg w-4 h-4"></div>

        <div className="relative">
          <div className="flex w-full items-center justify-between px-3 pt-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-black/70 to-black/90 rounded-full flex items-center justify-center shadow-xl ring-2 ring-amber-500/30 pulse-glow w-10 h-10">
                <Target className="text-amber-500 h-5 w-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-medieval font-bold text-white flex items-center gap-2 text-base">
                  Main Quests
                  <Crown className="text-amber-400 h-4 w-4" />
                </CardTitle>
                <CardDescription className="text-amber-300/80 mt-1 text-xs">
                  Epic long-term adventures
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-md hover:bg-amber-500/20 transition-colors text-amber-400"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {isExpanded && (
            <>
              {mainQuests.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full px-3 py-6">
                  <EmptyState onCreateQuest={handleCreateQuest} />
                </div>
              ) : (
                <motion.div
                  className="space-y-3 p-3 pt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {mainQuests.slice(0, 3).map((quest: MainQuest) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="bg-gradient-to-br from-black/60 to-black/40 border border-amber-900/30 hover:border-amber-700/50 transition-all duration-300 cursor-pointer group shadow-lg overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex items-start flex-col gap-2">
                            <div className="space-y-2 flex-1 w-full">
                              <div className="flex items-center gap-2">
                                <div className="bg-black/40 rounded-full flex items-center justify-center shadow-md ring-1 ring-amber-500/30 w-5 h-5">
                                  <Star className="text-amber-500 h-3 w-3" />
                                </div>
                                {/* Importance tag with dynamic styling */}
                                {quest.importance && (
                                  <span
                                    className={cn(
                                      "bg-gradient-to-r font-medieval uppercase rounded-md border shadow-inner tracking-wide text-xs px-2 py-0.5",
                                      quest.importance === Legendary &&
                                        "from-red-900/80 to-red-800/80 text-red-300 border-red-700/50 shadow-red-900/30",
                                      quest.importance === Heroic &&
                                        "from-amber-900/80 to-amber-800/80 text-amber-300 border-amber-700/50 shadow-amber-900/30",
                                      quest.importance === Rare &&
                                        "from-blue-900/80 to-blue-800/80 text-blue-300 border-blue-700/50 shadow-blue-900/30",
                                      quest.importance === Common &&
                                        "from-green-900/80 to-green-800/80 text-green-300 border-green-700/50 shadow-green-900/30"
                                    )}
                                  >
                                    {quest.importance}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-white font-medium leading-tight text-sm line-clamp-2">
                                {quest.title}
                              </h3>

                              {/* Timer section */}
                              {quest.dueDate && (
                                <div className="bg-gradient-to-r from-black/80 to-zinc-900/80 rounded-lg border border-amber-900/30 p-2">
                                  <div className="text-amber-300/90 mb-1 flex items-center gap-1.5 text-xs">
                                    <Clock className="h-3 w-3" />
                                    <span>TIME LEFT</span>
                                  </div>
                                  <div className="font-bold text-white text-sm">
                                    <CountdownTimer
                                      targetDate={new Date(quest.dueDate)}
                                      className="text-white font-medieval"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Show "View All" button at the bottom */}
                  {mainQuests.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-black/40 border-amber-800/50 hover:bg-black/60 hover:border-amber-600/50 text-white gap-2 text-sm transition-all py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/main-quests");
                      }}
                    >
                      <span>View All Quests</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </>
          )}
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
    </>
  );
};

export default MainQuestCard;
