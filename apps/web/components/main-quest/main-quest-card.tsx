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
  SwordsIcon,
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
    queryKey: ["activeMainQuests"],
    queryFn: mainQuestApi.fetchActiveMainQuests,
    select: (data) => data.activeMainQuests || [],
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
    const aPriority =
      importancePriority[a.importance as keyof typeof importancePriority] || 0;
    const bPriority =
      importancePriority[b.importance as keyof typeof importancePriority] || 0;

    // If both have urgent deadlines (< 10 days)
    if (aHasUrgentDeadline && bHasUrgentDeadline) {
      if (aTimeLeft !== bTimeLeft) {
        return aTimeLeft - bTimeLeft; // Least time first
      }
      // If same time left, sort by importance (higher first)
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      return 0;
    }

    // If only one has urgent deadline, prioritize the urgent one
    if (aHasUrgentDeadline && !bHasUrgentDeadline) return -1;
    if (!aHasUrgentDeadline && bHasUrgentDeadline) return 1;

    // If neither has urgent deadline (both > 10 days or no deadline), sort by importance

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
      <Card className="w-full overflow-hidden bg-gradient-to-br from-purple-900/10 via-black/60 to-black/80 border border-zinc-700/50 shadow-lg relative ring-1 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300">
        {/* Subtle accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/60 via-purple-400/60 to-purple-500/60"></div>

        <div className="relative">
          <div className="flex w-full items-center justify-between px-3 pt-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-full flex items-center justify-center shadow-lg border border-purple-400/40 w-10 h-10">
                <SwordsIcon className="text-purple-200 h-5 w-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-bold text-white flex items-center gap-2 text-base">
                  Main Quests
                  <Crown className="text-yellow-400 h-4 w-4" />
                </CardTitle>
                <CardDescription className="text-purple-200/80 mt-1 text-xs">
                  Epic long-term adventures
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-md hover:bg-purple-500/20 transition-colors text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400/50"
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
                      <Card className="bg-gradient-to-br from-purple-900/10 via-black/60 to-black/80 border border-purple-500/40 hover:border-purple-400/50 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden relative ring-1 ring-zinc-700/50 hover:ring-purple-500/40">
                        {/* Side accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-purple-600 group-hover:w-1.5 transition-all duration-200"></div>

                        <CardContent className="p-3 relative">
                          <div className="flex items-start flex-col gap-2">
                            <div className="space-y-2 flex-1 w-full">
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-purple-400/30 w-5 h-5">
                                  <Star className="text-purple-200 h-3 w-3" />
                                </div>
                                {/* Importance tag with simplified styling */}
                                {quest.importance && (
                                  <span
                                    className={cn(
                                      "bg-gradient-to-r border rounded-md tracking-wide text-xs px-2 py-0.5 font-medium uppercase",
                                      quest.importance === Legendary &&
                                        "from-red-600/70 to-red-500/70 text-red-200 border-red-400/50",
                                      quest.importance === Heroic &&
                                        "from-orange-600/70 to-yellow-500/70 text-orange-200 border-orange-400/50",
                                      quest.importance === Rare &&
                                        "from-purple-600/70 to-purple-500/70 text-purple-200 border-purple-400/50",
                                      quest.importance === Common &&
                                        "from-green-600/70 to-emerald-500/70 text-green-200 border-green-400/50"
                                    )}
                                  >
                                    {quest.importance}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-white font-medium leading-tight text-sm line-clamp-2">
                                {quest.title}
                              </h3>

                              {/* Timer section - Enhanced contrast and visibility */}
                              {quest.dueDate && (
                                <div className="bg-black rounded-lg border-2 border-purple-400/60 p-3 shadow-lg shadow-purple-500/10">
                                  <div className="text-purple-300 mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                                    <Clock className="h-4 w-4 text-purple-400" />
                                    <span>TIME LEFT</span>
                                  </div>
                                  <div className="font-bold text-white text-lg leading-tight">
                                    <CountdownTimer
                                      targetDate={new Date(quest.dueDate)}
                                      className="text-white drop-shadow-lg"
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
                      className="w-full bg-gradient-to-r from-purple-600/20 to-purple-600/20 border border-purple-400/40 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-purple-500/30 hover:border-purple-400/60 text-white gap-2 text-sm transition-all py-2"
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
              box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
            }
            50% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
            }
            100% {
              box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
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
