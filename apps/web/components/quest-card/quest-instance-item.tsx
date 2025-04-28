import { QuestInstance, TaskInstance } from "@questly/types";

import {
  LucideIcon,
  Sparkles,
  Check,
  ChevronUp,
  ChevronDown,
  ListChecks,
  Clock,
  CalendarDays,
  Trophy,
} from "lucide-react";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { questApi } from "@/services/quest-api";
import QuestInstanceTaskArea from "./quest-instance-task-area";
import { cn } from "@/lib/utils";
import QuestTasks from "./quest-tasks";

type QuestCacheData = {
  dailyQuests?: QuestInstance[];
  sideQuests?: QuestInstance[];
  message: string;
};

const QuestInstanceItem = ({
  quest,
  colorStyles,
  questTypeLabel,
  Icon,
  queryKey,
}: {
  quest: QuestInstance;
  colorStyles: any;
  questTypeLabel: string;
  Icon: LucideIcon;
  queryKey: string[];
}) => {
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const [isQuestCompleted, setIsQuestCompleted] = useState(quest.completed);

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

      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<QuestCacheData>(queryKey);

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
    },
    onSuccess: () => {
      toast.success("Quest updated!");
    },
  });

  const displayCompleted = isQuestCompleted;

  // Toggle quest expansion
  const toggleExpand = (questId: string) => {
    setExpandedQuestId(expandedQuestId === questId ? null : questId);
  };

  return (
    <div key={quest.instanceId} className="flex flex-col group">
      <Card
        className={cn(
          "bg-gradient-to-br from-black/40 to-black/60 border-zinc-800/50",
          colorStyles.cardHoverBorder,
          "transition-all duration-300 cursor-pointer relative overflow-hidden",
          displayCompleted && "opacity-75"
        )}
      >
        {/* Status indicator */}
        {displayCompleted && (
          <div
            className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30 z-10`}
          >
            Completed
          </div>
        )}

        {/* Background glow effect when hovered */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${colorStyles.gradient} transition-opacity duration-500 pointer-events-none`}
        ></div>

        {/* Quest card decorative corner elements */}
        <div
          className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${colorStyles.cornerBorder}`}
        ></div>
        <div
          className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${colorStyles.cornerBorder}`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${colorStyles.cornerBorder}`}
        ></div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${colorStyles.cornerBorder}`}
        ></div>

        <CardContent className="p-5 flex items-start gap-4">
          {/* Left content area */}
          <div className="space-y-3 flex-1">
            {/* Header with type and title */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`h-5 w-5 rounded-full bg-black/40 flex items-center justify-center ring-1 ${colorStyles.iconBg}`}
                >
                  <Icon className={`h-3 w-3 ${colorStyles.iconColor}`} />
                </div>
                <span
                  className={`${colorStyles.typeLabel} text-xs font-medieval tracking-wide`}
                >
                  {questTypeLabel}
                </span>
              </div>
              <h3 className="text-white/90 font-medium text-base leading-tight">
                {quest.title}
              </h3>
              {quest.description && (
                <p className="text-zinc-400 text-xs mt-1 line-clamp-2">
                  {quest.description}
                </p>
              )}
            </div>

            {/* Tasks summary */}
            <QuestTasks
              questInstanceId={quest.instanceId}
              colorStyles={colorStyles}
              displayCompleted={displayCompleted}
            />

            {/* Quest metadata */}
            <div className="flex items-center gap-4 pt-1">
              <div
                className={`${colorStyles.xpColor} text-xs font-medium flex items-center gap-1`}
              >
                <Trophy className="h-3 w-3" />
                <span>
                  +{quest.xpReward || (quest.type === "daily" ? 50 : 75)} XP
                </span>
              </div>

              {quest.date && (
                <div className="text-zinc-400 text-xs flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>{new Date(quest.date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side action buttons */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            {/* Complete quest button */}
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
                "h-8 w-8 rounded-full bg-black/30 flex items-center justify-center",
                colorStyles.iconHover,
                "transition-colors ring-1 ring-white/5",
                displayCompleted && "bg-green-500/20 ring-green-500/30"
              )}
              title={
                displayCompleted ? "Mark as incomplete" : "Mark as completed"
              }
              aria-label={
                displayCompleted ? "Mark as incomplete" : "Mark as completed"
              }
            >
              <Check
                className={`h-4 w-4 ${displayCompleted ? "text-green-400" : "text-zinc-400"} ${colorStyles.iconHoverText}`}
              />
            </button>

            {/* Expand/collapse button */}
            <button
              onClick={() => toggleExpand(quest.instanceId)}
              className={`h-8 w-8 rounded-full bg-black/30 flex items-center justify-center ${colorStyles.iconHover} transition-colors ring-1 ring-white/5`}
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
                <ChevronUp
                  className={`h-4 w-4 text-zinc-400 ${colorStyles.iconHoverText}`}
                />
              ) : (
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 ${colorStyles.iconHoverText}`}
                />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Expandable task area */}
      {expandedQuestId === quest.instanceId && (
        <QuestInstanceTaskArea
          colorStyles={colorStyles}
          expandedQuestId={expandedQuestId}
          quest={quest}
        />
      )}
    </div>
  );
};

export default QuestInstanceItem;
