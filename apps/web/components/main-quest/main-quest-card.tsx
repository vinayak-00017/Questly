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
  Shield,
  Scroll,
  Sparkles,
  CalendarDays,
  Compass,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CountdownTimer } from "../timer";
import { useRouter } from "next/navigation";
import { mainQuestApi } from "@/services/main-quest-api";
import { useQuery } from "@tanstack/react-query";
import {
  MainQuest,
  MainQuestImportance,
  MainQuestCategory,
} from "@questly/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmptyState } from "./ui/EmptyState";
import { AddQuestDialog } from "./add-main-quest-dialog";

const MainQuestCard = () => {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { Legendary, Heroic, Rare, Common } = MainQuestImportance;
  const { Challenge, Combat, Creation, Exploration, Knowledge, Social } =
    MainQuestCategory;

  // Function to get category-based icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case Challenge:
        return Target;
      case Combat:
        return SwordsIcon;
      case Creation:
        return Sparkles;
      case Exploration:
        return Compass;
      case Knowledge:
        return Scroll;
      case Social:
        return CalendarDays;
      default:
        return Shield; // Default fallback icon
    }
  };

  // Function to get rarity-based styling
  const getRarityStyles = (importance: string) => {
    switch (importance) {
      case Legendary:
        return {
          cardClass:
            "bg-gradient-to-br from-red-950/50 via-rose-950/40 to-red-900/50 border-red-800/70 ring-2 ring-red-700/40 hover:ring-red-600/60 hover:shadow-red-950/40 shadow-red-950/30",
          accentClass:
            "bg-gradient-to-b from-red-700/70 to-red-800/80 group-hover:w-2 animate-pulse",
          glowClass: "shadow-lg shadow-red-950/50 hover:shadow-red-900/70",
          iconBg:
            "bg-gradient-to-br from-red-800/60 to-red-900/50 border-red-700/60",
        };
      case Heroic:
        return {
          cardClass:
            "bg-gradient-to-br from-purple-950/40 via-purple-900/30 to-blue-950/40 border-purple-500/60 ring-2 ring-purple-400/30 hover:ring-purple-300/50 hover:shadow-purple-900/30 shadow-purple-950/20",
          accentClass:
            "bg-gradient-to-b from-purple-400/80 to-purple-600/80 group-hover:w-2",
          glowClass:
            "shadow-lg shadow-purple-900/40 hover:shadow-purple-800/60",
          iconBg:
            "bg-gradient-to-br from-purple-700/50 to-purple-800/40 border-purple-500/50",
        };
      case Rare:
        return {
          cardClass:
            "bg-gradient-to-br from-blue-950/40 via-blue-900/30 to-cyan-950/40 border-blue-500/60 ring-2 ring-blue-400/30 hover:ring-blue-300/50 hover:shadow-blue-900/30 shadow-blue-950/20",
          accentClass:
            "bg-gradient-to-b from-blue-400/80 to-blue-600/80 group-hover:w-2",
          glowClass: "shadow-lg shadow-blue-900/40 hover:shadow-blue-800/60",
          iconBg:
            "bg-gradient-to-br from-blue-700/50 to-blue-800/40 border-blue-500/50",
        };
      case Common:
      default:
        return {
          cardClass:
            "bg-gradient-to-br from-slate-950/40 via-slate-900/30 to-zinc-950/40 border-slate-500/60 ring-2 ring-slate-400/30 hover:ring-slate-300/50 hover:shadow-slate-900/30 shadow-slate-950/20",
          accentClass:
            "bg-gradient-to-b from-slate-400/80 to-slate-600/80 group-hover:w-2",
          glowClass: "shadow-lg shadow-slate-900/40 hover:shadow-slate-800/60",
          iconBg:
            "bg-gradient-to-br from-slate-700/50 to-slate-800/40 border-slate-500/50",
        };
    }
  };

  // Function to get time urgency styling
  const getTimeUrgencyStyles = (dueDate: string | null) => {
    if (!dueDate) return "";

    const now = new Date();
    const timeLeft = new Date(dueDate).getTime() - now.getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);

    if (hoursLeft <= 24) {
      return "animate-pulse ring-red-400/50 bg-red-950/20 border-red-500/30";
    } else if (hoursLeft <= 72) {
      return "animate-pulse ring-orange-400/30 bg-orange-950/15 border-orange-500/20";
    }
    return "";
  };

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
      <Card className="w-full overflow-hidden bg-card/95 border border-amber-600/30 ring-2 ring-amber-500/20 shadow-2xl shadow-amber-900/20 relative backdrop-blur-sm hover:border-amber-500/60 hover:ring-amber-400/40 hover:shadow-amber-900/40 transition-all duration-500 p-0 rounded-2xl group">
        {/* Epic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-orange-800/5 to-red-900/10 pointer-events-none" />
        {/* Animated top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-600/70 via-orange-500/90 to-amber-600/70 animate-pulse"></div>{" "}
        <div className="relative">
          <div className="flex w-full items-center justify-between p-4 pb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-gradient-to-br from-amber-700/60 to-amber-800/50 rounded-xl flex items-center justify-center shadow-xl border border-amber-500/50 w-12 h-12 epic-glow">
                <SwordsIcon className="text-amber-200 h-6 w-6 drop-shadow-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="font-bold text-foreground flex items-center gap-3 text-xl tracking-wide">
                  Main Quests
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm font-medium tracking-wide">
                  Epic long-term storyline adventures
                </CardDescription>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-zinc-700/30 transition-colors text-muted-foreground hover:text-zinc-300 border border-zinc-600/30 hover:border-zinc-500/50"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {isExpanded && (
            <>
              {mainQuests.length === 0 ? (
                <div className="px-4 pb-4">
                  <EmptyState onCreateQuest={handleCreateQuest} />
                </div>
              ) : (
                <motion.div
                  className="space-y-3 px-4 pb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {mainQuests.slice(0, 3).map((quest: MainQuest) => {
                    const rarityStyles = getRarityStyles(
                      quest.importance || Common
                    );
                    const urgencyStyles = getTimeUrgencyStyles(quest.dueDate);
                    const CategoryIcon = getCategoryIcon(
                      quest.category || Challenge
                    );

                    return (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="w-full"
                      >
                        <Card
                          className={cn(
                            "border transition-all duration-300 cursor-pointer group overflow-hidden relative backdrop-blur-sm w-full p-0 rounded-2xl hover:scale-[1.01]",
                            rarityStyles.cardClass,
                            rarityStyles.glowClass,
                            urgencyStyles
                          )}
                        >
                          {/* Dynamic side accent line based on rarity */}
                          <div
                            className={cn(
                              "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                              rarityStyles.accentClass
                            )}
                          ></div>

                          <div className="p-4 pl-6 relative w-full">
                            <div className="flex flex-col gap-3 w-full min-h-[120px]">
                              {/* Header with title and importance */}
                              <div className="flex items-start justify-between w-full gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div
                                    className={cn(
                                      "rounded-lg flex items-center justify-center border w-8 h-8 flex-shrink-0 shadow-md",
                                      rarityStyles.iconBg
                                    )}
                                  >
                                    <CategoryIcon className="text-white h-4 w-4 drop-shadow-sm" />
                                  </div>
                                  <h3 className="text-foreground font-semibold leading-relaxed text-base flex-1 min-w-0 line-clamp-2 drop-shadow-sm">
                                    {quest.title}
                                  </h3>
                                </div>
                                {/* Enhanced importance tag */}
                                {quest.importance && (
                                  <div className="flex-shrink-0 pt-1">
                                    <span
                                      className={cn(
                                        "bg-gradient-to-r border rounded-2xl text-xs px-3 py-1.5 font-bold uppercase tracking-wider whitespace-nowrap shadow-lg drop-shadow-md",
                                        quest.importance === Legendary &&
                                          "from-red-800/90 to-red-900/90 text-red-100 border-red-700/70 shadow-red-950/60 animate-pulse",
                                        quest.importance === Heroic &&
                                          "from-purple-600/90 to-purple-700/90 text-purple-50 border-purple-400/60 shadow-purple-900/50",
                                        quest.importance === Rare &&
                                          "from-blue-600/90 to-blue-700/90 text-blue-50 border-blue-400/60 shadow-blue-900/50",
                                        quest.importance === Common &&
                                          "from-slate-600/90 to-slate-700/90 text-slate-50 border-slate-400/60 shadow-slate-900/50"
                                      )}
                                    >
                                      {quest.importance}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Enhanced timer section with urgency indicators */}
                              {quest.dueDate && (
                                <div
                                  className={cn(
                                    "rounded-2xl border p-4 w-full backdrop-blur-sm mt-auto transition-all duration-300",
                                    urgencyStyles ||
                                      "bg-muted/50 border-border/50"
                                  )}
                                >
                                  <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                    <Clock
                                      className={cn(
                                        "h-4 w-4",
                                        urgencyStyles
                                          ? "text-red-400 animate-pulse"
                                          : "text-zinc-400"
                                      )}
                                    />
                                    <span>TIME REMAINING</span>
                                  </div>
                                  <div
                                    className={cn(
                                      "font-bold text-lg leading-tight drop-shadow-sm",
                                      urgencyStyles
                                        ? "text-red-200 glow-timer-urgent"
                                        : "text-foreground glow-timer-normal"
                                    )}
                                  >
                                    <CountdownTimer
                                      targetDate={new Date(quest.dueDate)}
                                      className={
                                        urgencyStyles
                                          ? "text-red-200"
                                          : "text-foreground"
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}

                  {/* Enhanced "View All" button */}
                  {mainQuests.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-600/50 hover:bg-gradient-to-r hover:from-amber-800/30 hover:to-orange-800/30 hover:border-amber-500/70 text-amber-100 gap-2 text-sm transition-all py-3 font-semibold shadow-lg hover:shadow-amber-900/30 hover:scale-[1.02]"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/main-quests");
                      }}
                    >
                      <span>View All Epic Quests</span>
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

          /* Epic quest card animations */
          .epic-glow {
            animation: epic-glow 4s infinite ease-in-out;
          }

          @keyframes epic-glow {
            0%,
            100% {
              box-shadow:
                0 0 20px rgba(251, 191, 36, 0.2),
                0 0 40px rgba(251, 191, 36, 0.1);
            }
            50% {
              box-shadow:
                0 0 30px rgba(251, 191, 36, 0.4),
                0 0 60px rgba(251, 191, 36, 0.2);
            }
          }

          .legendary-pulse {
            animation: legendary-pulse 2s infinite ease-in-out;
          }

          @keyframes legendary-pulse {
            0%,
            100% {
              box-shadow:
                0 0 15px rgba(239, 68, 68, 0.3),
                0 0 30px rgba(239, 68, 68, 0.1);
            }
            50% {
              box-shadow:
                0 0 25px rgba(239, 68, 68, 0.6),
                0 0 50px rgba(239, 68, 68, 0.3);
            }
          }

          .heroic-shimmer {
            animation: heroic-shimmer 3s infinite ease-in-out;
          }

          @keyframes heroic-shimmer {
            0%,
            100% {
              box-shadow:
                0 0 15px rgba(147, 51, 234, 0.3),
                0 0 30px rgba(147, 51, 234, 0.1);
            }
            50% {
              box-shadow:
                0 0 25px rgba(147, 51, 234, 0.5),
                0 0 50px rgba(147, 51, 234, 0.2);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          /* Timer glow effects */
          .glow-timer-normal {
            animation: timer-glow-normal 4s infinite ease-in-out;
          }

          .glow-timer-urgent {
            animation: timer-glow-urgent 2s infinite ease-in-out;
          }

          @keyframes timer-glow-normal {
            0%,
            100% {
              text-shadow:
                0 0 5px rgba(59, 130, 246, 0.3),
                0 0 10px rgba(59, 130, 246, 0.2),
                0 0 15px rgba(59, 130, 246, 0.1);
            }
            50% {
              text-shadow:
                0 0 10px rgba(59, 130, 246, 0.5),
                0 0 20px rgba(59, 130, 246, 0.3),
                0 0 30px rgba(59, 130, 246, 0.2);
            }
          }

          @keyframes timer-glow-urgent {
            0%,
            100% {
              text-shadow:
                0 0 8px rgba(239, 68, 68, 0.5),
                0 0 15px rgba(239, 68, 68, 0.3),
                0 0 25px rgba(239, 68, 68, 0.2);
            }
            50% {
              text-shadow:
                0 0 15px rgba(239, 68, 68, 0.8),
                0 0 25px rgba(239, 68, 68, 0.5),
                0 0 40px rgba(239, 68, 68, 0.3);
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
