import React from "react";
import { LucideIcon, ChevronDown } from "lucide-react";
import { QuestInstance } from "@questly/types";
import { Card, CardContent } from "../../ui/card";
import { cn } from "@/lib/utils";

import QuestPriorityTag from "../components/quest-priority-tag";
import QuestIcon from "../components/quest-icon";
import QuestMetadata from "../components/quest-metadata";
import {
  StatusBadge,
  CompletionIndicator,
  SuccessOverlay,
} from "../components/quest-status-indicators";
import QuestCardActionButtons from "../quest-card-action-buttons";

interface CollapsedQuestViewProps {
  quest: QuestInstance;
  colorStyles: any;
  Icon: LucideIcon;
  isCompleted: boolean;
  completionAnimation: boolean;
  hasTasks: boolean;
  taskData: any;
  queryKey: string[];
  expandedQuestId: string | null;
  toggleExpand: (questId: string) => void;
  handleEditClick: () => void;
  toggleCollapsed: () => void;
  setIsQuestCompleted: (completed: boolean) => void;
}

const CollapsedQuestView = ({
  quest,
  colorStyles,
  Icon,
  isCompleted,
  completionAnimation,
  hasTasks,
  taskData,
  queryKey,
  expandedQuestId,
  toggleExpand,
  handleEditClick,
  toggleCollapsed,
  setIsQuestCompleted,
}: CollapsedQuestViewProps) => (
  <div className="flex flex-col group relative" title="Expand quest">
    <SuccessOverlay show={completionAnimation} />

    <Card
      className={cn(
        "bg-gradient-to-br border shadow-lg shadow-black/10 transition-all duration-200 cursor-pointer relative overflow-hidden group",
        isCompleted
          ? "from-black/30 to-black/50 border-green-500/40"
          : "from-black/40 to-black/60 border-zinc-700/60",
        colorStyles.cardHoverBorder,
        isCompleted && "completed-quest"
      )}
      onClick={toggleCollapsed}
    >
      {/* Hover overlay with expand indicator */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center",
          `bg-gradient-to-br ${colorStyles.gradient}/20`
        )}
      >
        <ChevronDown
          className={cn("h-8 w-8", colorStyles.iconColor, "drop-shadow-lg")}
        />
      </div>

      {isCompleted && <CompletionIndicator />}
      {isCompleted && <StatusBadge />}

      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Left side - Icon and quest info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <QuestIcon
              Icon={Icon}
              isCompleted={isCompleted}
              colorStyles={colorStyles}
              size="md"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1 gap-2">
                <span
                  className={cn(
                    "text-base font-medieval tracking-wide capitalize",
                    isCompleted ? "text-green-500" : colorStyles.typeLabel
                  )}
                >
                  {quest.type} Quest
                </span>

                <div className="flex items-center gap-2 mb-1">
                  <QuestPriorityTag
                    basePoints={quest.basePoints}
                    isCompleted={isCompleted}
                    variant="compact"
                  />

                  {/* Task count indicator */}
                  {hasTasks && (
                    <span className="text-xs text-zinc-400 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                      {taskData?.taskInstances?.length} task
                      {taskData?.taskInstances?.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              <h3
                className={cn(
                  "font-bold text-xl truncate leading-tight capitalize",
                  isCompleted ? "text-green-300/80" : "text-white"
                )}
              >
                {quest.title}
              </h3>
            </div>
          </div>

          {/* Center - XP display */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <QuestMetadata
              quest={quest}
              isCompleted={isCompleted}
              colorStyles={colorStyles}
              variant="compact"
            />
          </div>

          {/* Far right - Action buttons */}
          <div className="flex-shrink-0" title="">
            <QuestCardActionButtons
              displayCompleted={isCompleted}
              queryKey={queryKey}
              setIsQuestCompleted={setIsQuestCompleted}
              colorStyles={colorStyles}
              quest={quest}
              expandedQuestId={expandedQuestId}
              toggleExpand={toggleExpand}
              onEditClick={handleEditClick}
              isCollapsed={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default CollapsedQuestView;
