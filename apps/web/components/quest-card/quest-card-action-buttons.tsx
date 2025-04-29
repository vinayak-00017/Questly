import { cn } from "@/lib/utils";
import { questApi } from "@/services/quest-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { QuestCacheData } from "./quest-instance-item";
import { QuestInstance } from "@questly/types";

const QuestCardActionButtons = ({
  displayCompleted,
  queryKey,
  setIsQuestCompleted,
  colorStyles,
  quest,
  expandedQuestId,
  toggleExpand,
}: {
  displayCompleted: boolean;
  queryKey: string[];
  setIsQuestCompleted: (completed: boolean) => void;
  colorStyles: any;
  quest: QuestInstance;
  expandedQuestId: string | null;
  toggleExpand: (questId: string) => void;
}) => {
  const queryClient = useQueryClient();
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

  return (
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
        title={displayCompleted ? "Mark as incomplete" : "Mark as completed"}
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
  );
};

export default QuestCardActionButtons;
