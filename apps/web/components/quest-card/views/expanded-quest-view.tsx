import React from "react";
import { LucideIcon, ChevronUp } from "lucide-react";
import { QuestInstance } from "@questly/types";
import { Card, CardContent } from "../../ui/card";
import { cn } from "@/lib/utils";

import QuestPriorityTag from "../components/quest-priority-tag";
import QuestIcon from "../components/quest-icon";
import QuestMetadata from "../components/quest-metadata";
import CornerBorders from "../components/corner-borders";
import {
  StatusBadge,
  CompletionIndicator,
  SuccessOverlay,
} from "../components/quest-status-indicators";
import QuestCardActionButtons from "../quest-card-action-buttons";
import QuestTasks from "../quest-tasks";
import QuestInstanceTaskArea from "../quest-instance-task-area";

interface ExpandedQuestViewProps {
  quest: QuestInstance;
  colorStyles: any;
  questTypeLabel: string;
  Icon: LucideIcon;
  isCompleted: boolean;
  completionAnimation: boolean;
  hasTasks: boolean;
  queryKey: string[];
  expandedQuestId: string | null;
  setExpandedQuestId: (questId: string | null) => void;
  toggleExpand: (questId: string) => void;
  handleEditClick: () => void;
  toggleCollapsed: () => void;
  setIsQuestCompleted: (completed: boolean) => void;
}

const ExpandedQuestView = ({
  quest,
  colorStyles,
  questTypeLabel,
  Icon,
  isCompleted,
  completionAnimation,
  hasTasks,
  queryKey,
  expandedQuestId,
  setExpandedQuestId,
  toggleExpand,
  handleEditClick,
  toggleCollapsed,
  setIsQuestCompleted,
}: ExpandedQuestViewProps) => (
  <div className="flex flex-col group relative">
    <SuccessOverlay show={completionAnimation} />

    <Card
      className={cn(
        "bg-gradient-to-br border transition-all duration-500 cursor-pointer relative overflow-hidden hover-glow shadow-lg shadow-black/10",
        isCompleted
          ? `from-black/30 to-black/50 ${colorStyles.cornerBorder}`
          : "from-black/40 to-black/60 border-zinc-700/60",
        colorStyles.cardHoverBorder,
        isCompleted && "completed-quest"
      )}
    >
      {/* Collapse button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleCollapsed();
        }}
        className="absolute top-2 left-2 z-20 p-1 rounded-md hover:bg-black/30 transition-colors text-zinc-400 hover:text-white"
        title="Collapse quest"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      {isCompleted && <CompletionIndicator />}
      {isCompleted && <StatusBadge />}

      {/* Background glow effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100",
          isCompleted
            ? colorStyles.expandedBg
            : `bg-gradient-to-br ${colorStyles.gradient}`
        )}
      />

      <CornerBorders isCompleted={isCompleted} colorStyles={colorStyles} />

      <CardContent
        className={cn(
          "flex items-start gap-4 relative",
          !hasTasks ? "p-3" : "p-5"
        )}
      >
        {/* Left content area */}
        <div className="space-y-3 flex-1">
          {/* Header with type and title */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <QuestIcon
                Icon={Icon}
                isCompleted={isCompleted}
                colorStyles={colorStyles}
                size="sm"
              />
              <span
                className={cn(
                  "text-xs font-medieval tracking-wide",
                  isCompleted ? colorStyles.iconColor : colorStyles.typeLabel
                )}
              >
                {questTypeLabel}
              </span>
              <QuestPriorityTag
                basePoints={quest.basePoints}
                isCompleted={isCompleted}
                variant="full"
              />
            </div>

            <h3
              className={cn(
                "font-medium text-base leading-tight transition-colors max-w-xs break-words",
                isCompleted ? `${colorStyles.iconColor}/80` : "text-white/90"
              )}
            >
              {quest.title}
            </h3>

            {quest.description && (
              <p
                className={cn(
                  "text-xs mt-1 line-clamp-2 transition-colors",
                  isCompleted ? `${colorStyles.iconColor}/50` : "text-zinc-400"
                )}
              >
                {quest.description}
              </p>
            )}
          </div>

          {/* Tasks summary */}
          <QuestTasks
            questInstanceId={quest.instanceId}
            colorStyles={
              isCompleted
                ? {
                    progressBg: `${colorStyles.expandedBg}`,
                    progressFill: colorStyles.iconColor.replace("text-", "bg-"),
                    expandedBg: colorStyles.expandedBg,
                    cornerBorder: colorStyles.cornerBorder.replace(
                      "border-",
                      "ring-"
                    ),
                    xpColor: colorStyles.iconColor,
                  }
                : colorStyles
            }
          />

          <QuestMetadata
            quest={quest}
            isCompleted={isCompleted}
            colorStyles={colorStyles}
            variant="full"
          />
        </div>

        {/* Right side action buttons */}
        <div className="flex flex-col gap-2 ml-2">
          <QuestCardActionButtons
            displayCompleted={isCompleted}
            queryKey={queryKey}
            setIsQuestCompleted={setIsQuestCompleted}
            colorStyles={colorStyles}
            quest={quest}
            expandedQuestId={expandedQuestId}
            toggleExpand={toggleExpand}
            onEditClick={handleEditClick}
          />
        </div>
      </CardContent>
    </Card>

    {/* Expandable task area */}
    {expandedQuestId === quest.instanceId && (
      <QuestInstanceTaskArea
        colorStyles={
          isCompleted
            ? {
                expandedBg: colorStyles.expandedBg,
                inputBorder: colorStyles.inputBorder,
                addButtonBg: colorStyles.completeButtonBg,
              }
            : colorStyles
        }
        expandedQuestId={expandedQuestId}
        quest={quest}
        onTaskAdded={() => setExpandedQuestId(null)}
      />
    )}
  </div>
);

export default ExpandedQuestView;
