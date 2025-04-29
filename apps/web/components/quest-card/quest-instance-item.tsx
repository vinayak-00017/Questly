import { QuestInstance } from "@questly/types";

import { LucideIcon, CalendarDays, Trophy } from "lucide-react";
import { numberToQuestTag } from "@questly/utils";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";

import QuestInstanceTaskArea from "./quest-instance-task-area";
import { cn } from "@/lib/utils";
import QuestTasks from "./quest-tasks";
import QuestCardActionButtons from "./quest-card-action-buttons";

export type QuestCacheData = {
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
  const [isQuestCompleted, setIsQuestCompleted] = useState(quest.completed);

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
                {/* Quest priority tag with enhanced RPG styling */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider border flex items-center gap-1 ${
                    numberToQuestTag(Number(quest.basePoints)) === "optional"
                      ? "bg-gradient-to-r from-slate-800/80 to-slate-700/80 text-slate-200 border-slate-600 shadow-inner shadow-slate-700/30"
                      : numberToQuestTag(Number(quest.basePoints)) === "minor"
                        ? "bg-gradient-to-r from-blue-800/80 to-blue-700/80 text-blue-200 border-blue-600 shadow-inner shadow-blue-700/30"
                        : numberToQuestTag(Number(quest.basePoints)) ===
                            "standard"
                          ? "bg-gradient-to-r from-emerald-800/80 to-emerald-700/80 text-emerald-200 border-emerald-600 shadow-inner shadow-emerald-700/30"
                          : numberToQuestTag(Number(quest.basePoints)) ===
                              "important"
                            ? "bg-gradient-to-r from-amber-800/80 to-amber-700/80 text-amber-200 border-amber-600 shadow-inner shadow-amber-700/30"
                            : "bg-gradient-to-r from-rose-800/80 to-rose-700/80 text-rose-200 border-rose-600 shadow-inner shadow-rose-700/30" // critical
                  } animate-pulse-subtle transition-all duration-300 hover:scale-105 transform`}
                >
                  {/* Small decorative element */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      numberToQuestTag(Number(quest.basePoints)) === "optional"
                        ? "bg-slate-400"
                        : numberToQuestTag(Number(quest.basePoints)) === "minor"
                          ? "bg-blue-400"
                          : numberToQuestTag(Number(quest.basePoints)) ===
                              "standard"
                            ? "bg-emerald-400"
                            : numberToQuestTag(Number(quest.basePoints)) ===
                                "important"
                              ? "bg-amber-400"
                              : "bg-rose-400" // critical
                    }`}
                  ></span>
                  {numberToQuestTag(Number(quest.basePoints))}
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
          <QuestCardActionButtons
            displayCompleted={displayCompleted}
            queryKey={queryKey}
            setIsQuestCompleted={setIsQuestCompleted}
            colorStyles={colorStyles}
            quest={quest}
            expandedQuestId={expandedQuestId}
            toggleExpand={toggleExpand}
          />
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
