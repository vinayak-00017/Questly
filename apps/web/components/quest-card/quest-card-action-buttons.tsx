import { cn } from "@/lib/utils";
import { questApi } from "@/services/quest-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Trophy,
  Star,
  Sparkles,
  Edit3,
  PlusCircle,
  Plus,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { QuestCacheData } from "./quest-instance-item";
import { QuestInstance } from "@questly/types";
import { useAchievements } from "@/contexts/achievement-context";

// Confetti component for celebration animation
const Confetti = ({ visible }: { visible: boolean }) => {
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{
      left: string;
      width: string;
      height: string;
      background: string;
      animationDelay: string;
      animationDuration: string;
    }>
  >([]);

  useEffect(() => {
    // Generate confetti pieces on the client side only
    const pieces = Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 8 + 5}px`,
      height: `${Math.random() * 8 + 5}px`,
      background: `hsl(${Math.random() * 360}, 100%, 50%)`,
      animationDelay: `${Math.random() * 0.5}s`,
      animationDuration: `${Math.random() * 1 + 2}s`,
    }));
    setConfettiPieces(pieces);
  }, []);

  if (!visible) return null;

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: piece.left,
            width: piece.width,
            height: piece.height,
            background: piece.background,
            animationDelay: piece.animationDelay,
            animationDuration: piece.animationDuration,
          }}
        />
      ))}
      <style jsx>{`
        .confetti-container {
          position: absolute;
          top: -20px;
          left: 0;
          width: 100%;
          height: 150%;
          overflow: hidden;
          pointer-events: none;
          z-index: 30;
        }
        .confetti-piece {
          position: absolute;
          opacity: 0;
          animation:
            confetti-fall linear forwards,
            confetti-fade-out linear forwards;
          transform: rotate(0);
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10%) rotate(0);
          }
          100% {
            transform: translateY(100%) rotate(360deg);
          }
        }
        @keyframes confetti-fade-out {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const QuestCardActionButtons = ({
  displayCompleted,
  queryKey,
  setIsQuestCompleted,
  colorStyles,
  quest,
  expandedQuestId,
  toggleExpand,
  onEditClick,
  isCollapsed = false,
}: {
  displayCompleted: boolean;
  queryKey: string[];
  setIsQuestCompleted: (completed: boolean) => void;
  colorStyles: any;
  quest: QuestInstance;
  expandedQuestId: string | null;
  toggleExpand: (questId: string) => void;
  onEditClick?: () => void;
  isCollapsed?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { checkForNewAchievements, showAchievement } = useAchievements();
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [xpAnimationActive, setXpAnimationActive] = useState(false);

  // Reset celebration effects when quest changes
  useEffect(() => {
    setShowConfetti(false);
    setCelebrationVisible(false);
    setXpAnimationActive(false);
  }, [quest.instanceId]);

  const completeQuestMutation = useMutation({
    mutationFn: ({
      questInstanceId,
      completed,
    }: {
      questInstanceId: string;
      completed: boolean;
    }) => questApi.completeQuest(questInstanceId, completed),
    onMutate: async (variables) => {
      const { questInstanceId, completed: nextCompletedStatus } = variables;

      // Trigger celebration animations when completing
      if (nextCompletedStatus) {
        setShowConfetti(true);
        setTimeout(() => setCelebrationVisible(true), 100);
        setTimeout(() => setXpAnimationActive(true), 300);

        // Hide celebrations after animation completes
        setTimeout(() => {
          setShowConfetti(false);
          setCelebrationVisible(false);
          setXpAnimationActive(false);
        }, 3000);
      }

      setIsQuestCompleted(nextCompletedStatus);
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<QuestCacheData>(queryKey);

      if (nextCompletedStatus) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      queryClient.setQueryData<QuestCacheData>(queryKey, (oldData) => {
        if (!oldData) {
          console.warn("Optimistic update: Cache data missing", oldData);
          return oldData;
        }
        let updatedDailyQuests = oldData.dailyQuests;
        let updatedSideQuests = oldData.sideQuests;
        let questFound = false;

        if (!questFound && Array.isArray(oldData.dailyQuests)) {
          updatedDailyQuests = oldData.dailyQuests.map((q) => {
            if (q.instanceId === questInstanceId) {
              questFound = true;
              return { ...q, completed: nextCompletedStatus };
            }
            return q;
          });
        }

        if (!questFound && Array.isArray(oldData.sideQuests)) {
          updatedSideQuests = oldData.sideQuests.map((q) => {
            if (q.instanceId === questInstanceId) {
              questFound = true;
              return { ...q, completed: nextCompletedStatus };
            }
            return q;
          });
        }

        if (!questFound) {
          console.warn(
            "Optimistic update: Quest ID not found in dailyQuests or sideQuests.",
            questInstanceId,
            oldData
          );
          return oldData;
        }

        return {
          ...oldData,
          dailyQuests: updatedDailyQuests,
          sideQuests: updatedSideQuests,
        };
      });
      setIsQuestCompleted(nextCompletedStatus);

      return { previousQuests: previousData };
    },

    onError: (error, variables, context) => {
      toast.error("Failed to update quest status.");
      console.error("Quest completion error:", error);

      if (context?.previousQuests) {
        queryClient.setQueryData(queryKey, context.previousQuests);
        setIsQuestCompleted(!variables.completed);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      if (
        Array.isArray(queryKey) &&
        queryKey.length === 1 &&
        queryKey[0] !== "todaysQuests"
      ) {
        queryClient.invalidateQueries({ queryKey: ["todaysQuests"] });
      }
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["questActivity"] });
      queryClient.invalidateQueries({ queryKey: ["performance"] });
    },
    onSuccess: async (data, variables) => {
      if (variables.completed) {
        toast.success("Quest completed! You earned XP!", {
          icon: <Trophy className="h-5 w-5 text-yellow-400" />,
          className:
            "bg-gradient-to-r from-green-900 to-emerald-800 border-green-600",
        });

        // Check if the backend returned achievements directly
        if (
          data?.newAchievements &&
          Array.isArray(data.newAchievements) &&
          data.newAchievements.length > 0
        ) {
          // Show achievements from backend response
          data.newAchievements.forEach((achievement: any, index: number) => {
            // Add a small delay between achievements to avoid conflicts
            setTimeout(() => {
              showAchievement(achievement);
            }, index * 100);
          });
        } else {
          // Fallback: Check for new achievements via API call
          try {
            await checkForNewAchievements();
          } catch (error) {
            console.error("Error checking for achievements:", error);
          }
        }
      } else {
        toast.success("Quest marked as incomplete");
      }
    },
  });

  // XP animation when quest is completed
  const XpAnimation = () => {
    if (!xpAnimationActive) return null;

    return (
      <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 flex items-center justify-center">
        <div className="relative">
          <div className="text-lg text-yellow-400 font-medieval font-bold xp-float flex items-center">
            <Trophy className="h-4 w-4 mr-1 text-yellow-400" />
            <span>+{quest.xpReward || 50} XP</span>
          </div>
          <style jsx>{`
            .xp-float {
              animation: float-up 2.5s forwards ease-out;
            }
            @keyframes float-up {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }
              10% {
                opacity: 1;
                transform: translateY(0);
              }
              80% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: translateY(-50px);
              }
            }
          `}</style>
        </div>
      </div>
    );
  };

  // If in collapsed mode, show only the complete button
  if (isCollapsed) {
    return (
      <div className="flex items-center gap-2 flex-shrink-0 relative">
        {/* Celebration animations */}
        <Confetti visible={showConfetti} />
        <XpAnimation />

        {celebrationVisible && (
          <div className="absolute -top-1 -right-1 celebration-star">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
            <style jsx>{`
              .celebration-star {
                animation: scale-in-out 1.5s ease forwards;
              }
              @keyframes scale-in-out {
                0% {
                  transform: scale(0) rotate(0deg);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.2) rotate(180deg);
                  opacity: 1;
                }
                100% {
                  transform: scale(1) rotate(360deg);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        )}

        {/* Complete quest button - smaller for collapsed view */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const nextCompletedStatus = !displayCompleted;
            completeQuestMutation.mutate({
              questInstanceId: quest.instanceId,
              completed: nextCompletedStatus,
            });
          }}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg transform hover:scale-110 active:scale-95",
            !displayCompleted
              ? `bg-gradient-to-br from-black/60 to-black/80 ring-2 ${colorStyles.cornerBorder} hover:bg-zinc-800/60 hover:ring-2 hover:ring-white/20`
              : "bg-gradient-to-br from-green-500/80 to-emerald-600/80 ring-2 ring-green-400/30 hover:from-green-400/80 hover:to-emerald-500/80"
          )}
          title={displayCompleted ? "Mark as incomplete" : "Mark as completed"}
          aria-label={
            displayCompleted ? "Mark as incomplete" : "Mark as completed"
          }
        >
          <Check
            className={`h-4 w-4 ${displayCompleted ? "text-white" : `text-zinc-400 ${colorStyles.iconHoverText}`}`}
          />
        </button>
      </div>
    );
  }

  // Full expanded view with all buttons
  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0 relative">
      {/* Celebration animations */}
      <Confetti visible={showConfetti} />
      <XpAnimation />

      {celebrationVisible && (
        <div className="absolute -top-1 -right-1 celebration-star">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>
          <style jsx>{`
            .celebration-star {
              animation: scale-in-out 1.5s ease forwards;
            }
            @keyframes scale-in-out {
              0% {
                transform: scale(0) rotate(0deg);
                opacity: 0;
              }
              50% {
                transform: scale(1.2) rotate(180deg);
                opacity: 1;
              }
              100% {
                transform: scale(1) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Complete quest button - enhanced design */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const nextCompletedStatus = !displayCompleted;
          completeQuestMutation.mutate({
            questInstanceId: quest.instanceId,
            completed: nextCompletedStatus,
          });
        }}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg transform hover:scale-110 active:scale-95",
          !displayCompleted
            ? `bg-gradient-to-br from-black/60 to-black/80 ring-2 ${colorStyles.cornerBorder} hover:bg-zinc-800/60 hover:ring-2 hover:ring-white/20`
            : "bg-gradient-to-br from-green-500/80 to-emerald-600/80 ring-2 ring-green-400/30 hover:from-green-400/80 hover:to-emerald-500/80"
        )}
        title={displayCompleted ? "Mark as incomplete" : "Mark as completed"}
        aria-label={
          displayCompleted ? "Mark as incomplete" : "Mark as completed"
        }
      >
        <Check
          className={`h-5 w-5 ${displayCompleted ? "text-white" : `text-zinc-400 ${colorStyles.iconHoverText}`}`}
        />
      </button>

      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditClick?.();
        }}
        className={cn(
          "h-9 w-9 rounded-full bg-black/40 flex items-center justify-center transition-all duration-300 hover:scale-105 ring-1 ring-white/10 hover:bg-zinc-800/60 hover:ring-zinc-400/80"
        )}
        title="Edit quest instance"
        aria-label="Edit quest instance"
      >
        <Edit3
          className={`h-4 w-4 text-zinc-400 ${colorStyles.iconHoverText}`}
        />
      </button>

      {/* Expand/collapse button - updated to match new style */}
      <button
        onClick={() => toggleExpand(quest.instanceId)}
        className={cn(
          "h-9 w-9 rounded-full bg-black/40 flex items-center justify-center transition-all duration-300 hover:scale-105 ring-1 ring-white/10 hover:bg-zinc-800/60 hover:ring-zinc-400/80"
        )}
        title={
          expandedQuestId === quest.instanceId
            ? "Collapse"
            : "Expand to manage tasks"
        }
        aria-label={
          expandedQuestId === quest.instanceId
            ? "Collapse"
            : "Expand to manage tasks"
        }
      >
        {expandedQuestId === quest.instanceId ? (
          <Plus
            className={`h-6 w-6 text-zinc-100 ${colorStyles.iconHoverText}`}
          />
        ) : (
          <Plus
            className={`h-6 w-6 text-zinc-400 ${colorStyles.iconHoverText}`}
          />
        )}
      </button>
    </div>
  );
};

export default QuestCardActionButtons;
