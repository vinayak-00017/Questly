import { QuestInstance } from "@questly/types";

import {
  LucideIcon,
  Sparkles,
  Check,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";

import React, { useState } from "react";

import { Card, CardContent } from "../ui/card";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { questApi } from "@/services/quest-api";

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
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const queryClient = useQueryClient();
  const [isQuestCompleted, setIsQuestCompleted] = useState(false);

  const completeQuestMutation = useMutation({
    mutationFn: (questInstanceId: string) =>
      questApi.completeQuest(questInstanceId, isQuestCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Quest completed!");
    },
  });
  // Toggle quest expansion
  const toggleExpand = (questId: string) => {
    setExpandedQuestId(expandedQuestId === questId ? null : questId);
    if (expandedQuestId !== questId) {
      setNewTaskTitle("");
    }
  };

  return (
    <div key={quest.instanceId} className="flex flex-col">
      <Card
        className={`bg-gradient-to-br from-black/40 to-black/60 border-zinc-800/50 ${colorStyles.cardHoverBorder} transition-all duration-300 cursor-pointer group relative overflow-hidden`}
      >
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

        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-2">
              <Icon className={`h-3.5 w-3.5 ${colorStyles.iconColor}`} />
              <span
                className={`${colorStyles.typeLabel} text-xs font-medieval tracking-wide`}
              >
                {questTypeLabel}
              </span>
            </div>
            <h3 className="text-white/90 font-medium text-sm">{quest.title}</h3>
            <div className="flex items-center gap-4">
              <div
                className={`${colorStyles.xpColor} text-xs font-medium flex items-center`}
              >
                <Sparkles className="h-3 w-3 mr-1" />+
                {quest.xpReward || (quest.type === "daily" ? 50 : 75)} XP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Complete quest directly button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                completeQuestMutation.mutate(quest.instanceId);
              }}
              className={`h-8 w-8 rounded-full bg-black/30 flex items-center justify-center ${colorStyles.iconHover} transition-colors ring-1 ring-white/5`}
              title="Mark quest as completed"
            >
              <Check
                className={`h-4 w-4 text-zinc-400 ${colorStyles.iconHoverText}`}
              />
            </button>

            {/* Expand/collapse button */}
            <button
              onClick={() => toggleExpand(quest.instanceId)}
              className={`h-8 w-8 rounded-full bg-black/30 flex items-center justify-center ${colorStyles.iconHover} transition-colors ring-1 ring-white/5`}
              title={
                expandedQuestId === quest.instanceId
                  ? "Collapse"
                  : "Expand to add tasks"
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
      {/* {expandedQuestId === quest.instanceId && <QuestInstanceTaskArea />} */}
    </div>
  );
};

export default QuestInstanceItem;
