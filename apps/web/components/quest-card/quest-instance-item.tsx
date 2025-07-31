import { QuestInstance } from "@questly/types";

import {
  LucideIcon,
  CalendarDays,
  Trophy,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { numberToQuestTag } from "@questly/utils";

import React, { useState, useEffect, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "@/services/task-api";
import { Card, CardContent } from "../ui/card";

import QuestInstanceTaskArea from "./quest-instance-task-area";
import { cn } from "@/lib/utils";
import QuestTasks from "./quest-tasks";
import QuestCardActionButtons from "./quest-card-action-buttons";
import EditQuestInstanceDialog from "./edit-quest-instance-dialog";

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
  globalCollapseState,
}: {
  quest: QuestInstance;
  colorStyles: any;
  questTypeLabel: string;
  Icon: LucideIcon;
  queryKey: string[];
  globalCollapseState?: "collapsed" | "expanded" | null;
}) => {
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);
  const [isQuestCompleted, setIsQuestCompleted] = useState(quest.completed);
  const [completionAnimation, setCompletionAnimation] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const displayCompleted = isQuestCompleted;

  // Check if quest has tasks to determine if it should be collapsed by default
  const { data: taskData } = useQuery({
    queryKey: ["taskInstances", quest.instanceId],
    queryFn: () => taskApi.fetchTasks({ questInstanceId: quest.instanceId }),
    enabled: !!quest.instanceId,
  });

  const hasTasks = taskData?.taskInstances?.length > 0;
  const shouldShowCollapsed = isCollapsed;

  // Track completion state changes for animations
  useEffect(() => {
    if (isQuestCompleted !== quest.completed) {
      setIsQuestCompleted(quest.completed);
      if (quest.completed) {
        setCompletionAnimation(true);
        setTimeout(() => setCompletionAnimation(false), 2000);
      }
    }
  }, [quest.completed]);

  // Handle global collapse/expand state
  useEffect(() => {
    if (globalCollapseState === "collapsed") {
      setIsCollapsed(true);
    } else if (globalCollapseState === "expanded") {
      setIsCollapsed(false);
    }
  }, [globalCollapseState]);

  // Toggle quest expansion
  const toggleExpand = (questId: string) => {
    setExpandedQuestId(expandedQuestId === questId ? null : questId);
  };

  // Handle edit click
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  // Toggle collapsed state
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Collapsed stub view
  if (shouldShowCollapsed) {
    return (
      <>
        <div key={quest.instanceId} className="flex flex-col group relative">
          {/* Success overlay animation */}
          {completionAnimation && (
            <div className="absolute inset-0 bg-green-500/10 z-10 rounded-lg success-pulse" />
          )}

          <Card
            className={cn(
              "bg-gradient-to-br border shadow-lg shadow-black/10 transition-all duration-200 cursor-pointer relative overflow-hidden",
              displayCompleted
                ? "from-black/30 to-black/50 border-green-500/40"
                : "from-black/40 to-black/60 border-zinc-700/60",
              colorStyles.cardHoverBorder,
              displayCompleted && "completed-quest"
            )}
            onClick={toggleCollapsed}
          >
            {/* Status indicator - enhanced */}
            {displayCompleted && (
              <div className="absolute top-0 right-0 w-full h-1.5 bg-green-500/50 completion-indicator">
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-green-400/80 to-emerald-500/80 shimmer"></div>
              </div>
            )}

            {/* Status badge */}
            {displayCompleted && (
              <div
                className={`
                absolute top-2 right-2 px-2 py-0.5 rounded-full 
                text-xs font-medium border shadow-glow z-10
                bg-gradient-to-r from-green-600/50 to-emerald-500/50
                text-white border-green-400/50 flex items-center gap-1
                animate-pulse-subtle
              `}
              >
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </div>
            )}

            <CardContent className="p-4">
              {/* Single row layout */}
              <div className="flex items-center gap-3">
                {/* Left side - Icon and quest info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-1 ${
                      displayCompleted
                        ? "bg-green-900/40 ring-green-500/50"
                        : `bg-black/40 ${colorStyles.iconBg}`
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        displayCompleted
                          ? "text-green-400"
                          : colorStyles.iconColor
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Quest priority tag - balanced visibility */}
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wide flex items-center gap-1 bg-zinc-800/50 ${
                          numberToQuestTag(Number(quest.basePoints)) ===
                          "optional"
                            ? "text-slate-200"
                            : numberToQuestTag(Number(quest.basePoints)) ===
                                "minor"
                              ? "text-blue-200"
                              : numberToQuestTag(Number(quest.basePoints)) ===
                                  "standard"
                                ? "text-emerald-200"
                                : numberToQuestTag(Number(quest.basePoints)) ===
                                    "important"
                                  ? "text-amber-200"
                                  : "text-rose-200"
                        } ${displayCompleted ? "opacity-70" : ""}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            numberToQuestTag(Number(quest.basePoints)) ===
                            "optional"
                              ? "bg-slate-400"
                              : numberToQuestTag(Number(quest.basePoints)) ===
                                  "minor"
                                ? "bg-blue-400"
                                : numberToQuestTag(Number(quest.basePoints)) ===
                                    "standard"
                                  ? "bg-emerald-400"
                                  : numberToQuestTag(
                                        Number(quest.basePoints)
                                      ) === "important"
                                    ? "bg-amber-400"
                                    : "bg-rose-400"
                          }`}
                        ></span>
                        {numberToQuestTag(Number(quest.basePoints))}
                      </span>

                      {/* Task count indicator */}
                      {hasTasks && (
                        <span className="text-xs text-zinc-400 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                          {taskData?.taskInstances?.length} task
                          {taskData?.taskInstances?.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`${
                        displayCompleted ? "text-green-300/80" : "text-white"
                      } font-bold text-xl truncate leading-tight`}
                    >
                      {quest.title}
                    </h3>
                  </div>
                </div>

                {/* Center - XP display */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div
                    className={`${
                      displayCompleted ? "text-green-400" : colorStyles.xpColor
                    } text-sm font-medium flex items-center gap-1.5`}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>+{quest.xpReward}</span>
                  </div>

                  <ChevronDown className="h-4 w-4 text-zinc-400 hover:text-white transition-colors" />
                </div>

                {/* Far right - Complete quest button */}
                <div className="flex-shrink-0">
                  <QuestCardActionButtons
                    displayCompleted={displayCompleted}
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

          {/* Animation styles */}
          <style jsx>{`
            .completed-quest {
              transform: scale(0.98);
            }
            .success-pulse {
              animation: pulse-success 2s ease-in-out;
            }
            .completion-indicator {
              position: relative;
              overflow: hidden;
            }
            .progress-animation {
              animation: slide-in 1.5s ease-out;
            }
            .shadow-glow {
              box-shadow: 0 0 8px rgba(74, 222, 128, 0.3);
            }
            @keyframes pulse-success {
              0% {
                opacity: 0;
              }
              10% {
                opacity: 0.7;
              }
              100% {
                opacity: 0;
              }
            }
            @keyframes slide-in {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(0);
              }
            }
          `}</style>
        </div>

        {/* Edit Quest Instance Dialog */}
        <EditQuestInstanceDialog
          questInstance={quest}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          queryKey={queryKey}
        />
      </>
    );
  }

  // Full expanded view (original layout)
  return (
    <>
      <div key={quest.instanceId} className="flex flex-col group relative">
        {/* Success overlay animation */}
        {completionAnimation && (
          <div className="absolute inset-0 bg-green-500/10 z-10 rounded-lg success-pulse" />
        )}

        <Card
          className={cn(
            "bg-gradient-to-br border transition-all duration-500 cursor-pointer relative overflow-hidden hover-glow shadow-lg shadow-black/10",
            displayCompleted
              ? "from-black/30 to-black/50 border-green-500/40"
              : "from-black/40 to-black/60 border-zinc-700/60",
            colorStyles.cardHoverBorder,
            displayCompleted && "completed-quest"
          )}
        >
          {/* Collapse button for all quests */}
          {!displayCompleted && (
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
          )}

          {/* Status indicator - enhanced */}
          {displayCompleted && (
            <div className="absolute top-0 right-0 w-full h-1.5 bg-green-500/50 completion-indicator">
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-green-400/80 to-emerald-500/80 shimmer"></div>
            </div>
          )}

          {/* Status badge */}
          {displayCompleted && (
            <div
              className={`
              absolute top-2 right-2 px-2 py-0.5 rounded-full 
              text-xs font-medium border shadow-glow z-10
              bg-gradient-to-r from-green-600/50 to-emerald-500/50
              text-white border-green-400/50 flex items-center gap-1
              animate-pulse-subtle
            `}
            >
              <CheckCircle className="h-3 w-3" />
              <span>Completed</span>
            </div>
          )}

          {/* Background glow effect when hovered or completed */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
              "group-hover:opacity-100",
              displayCompleted
                ? "bg-gradient-to-br from-green-900/20 to-emerald-800/20"
                : `bg-gradient-to-br ${colorStyles.gradient}`
            )}
          ></div>

          {/* Quest card decorative corner elements */}
          <div
            className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${
              displayCompleted
                ? "border-green-500/50"
                : colorStyles.cornerBorder
            }`}
          ></div>
          <div
            className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${
              displayCompleted
                ? "border-green-500/50"
                : colorStyles.cornerBorder
            }`}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${
              displayCompleted
                ? "border-green-500/50"
                : colorStyles.cornerBorder
            }`}
          ></div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${
              displayCompleted
                ? "border-green-500/50"
                : colorStyles.cornerBorder
            }`}
          ></div>

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
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ring-1 ${
                      displayCompleted
                        ? "bg-green-900/40 ring-green-500/50"
                        : `bg-black/40 ${colorStyles.iconBg}`
                    }`}
                  >
                    <Icon
                      className={`h-3 w-3 ${
                        displayCompleted
                          ? "text-green-400"
                          : colorStyles.iconColor
                      }`}
                    />
                  </div>
                  <span
                    className={`${
                      displayCompleted
                        ? "text-green-500"
                        : colorStyles.typeLabel
                    } text-xs font-medieval tracking-wide`}
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
                    } ${
                      displayCompleted ? "opacity-70" : "animate-pulse-subtle"
                    } transition-all duration-300 hover:scale-105 transform`}
                  >
                    {/* Small decorative element */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        numberToQuestTag(Number(quest.basePoints)) ===
                        "optional"
                          ? "bg-slate-400"
                          : numberToQuestTag(Number(quest.basePoints)) ===
                              "minor"
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
                <h3
                  className={`$
                    displayCompleted ? "text-green-300/80" : "text-white/90"
                  } font-medium text-base leading-tight transition-colors max-w-xs break-words`}
                >
                  {quest.title}
                </h3>
                {quest.description && (
                  <p
                    className={`${
                      displayCompleted ? "text-green-200/50" : "text-zinc-400"
                    } text-xs mt-1 line-clamp-2 transition-colors`}
                  >
                    {quest.description}
                  </p>
                )}
              </div>

              {/* Tasks summary */}
              <QuestTasks
                questInstanceId={quest.instanceId}
                colorStyles={
                  displayCompleted
                    ? {
                        progressBg: "bg-green-900/30",
                        progressFill: "bg-green-500",
                        expandedBg: "bg-green-900/10",
                        cornerBorder: "ring-green-500/50",
                        xpColor: "text-green-400",
                      }
                    : colorStyles
                }
              />

              {/* Quest metadata */}
              <div className="flex items-center gap-4 pt-1">
                <div
                  className={`${
                    displayCompleted ? "text-green-400" : colorStyles.xpColor
                  } text-xs font-medium flex items-center gap-1`}
                >
                  <Trophy className="h-3 w-3" />

                  <span>+{quest.xpReward} XP</span>
                </div>

                {quest.date && (
                  <div
                    className={`${
                      displayCompleted ? "text-green-200/50" : "text-zinc-400"
                    } text-xs flex items-center gap-1`}
                  >
                    <CalendarDays className="h-3 w-3" />
                    <span>{new Date(quest.date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side action buttons */}
            <div className="flex flex-col gap-2 ml-2">
              {/* Remove group-hover from buttons, add button-specific hover styles */}
              <QuestCardActionButtons
                displayCompleted={displayCompleted}
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
              displayCompleted
                ? {
                    expandedBg: "bg-green-900/10",
                    inputBorder: "border-green-600/50",
                    addButtonBg:
                      "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500",
                  }
                : colorStyles
            }
            expandedQuestId={expandedQuestId}
            quest={quest}
            onTaskAdded={() => setExpandedQuestId(null)}
          />
        )}

        {/* Animation styles */}
        <style jsx>{`
          .completed-quest {
            transform: scale(0.98);
          }
          .success-pulse {
            animation: pulse-success 2s ease-in-out;
          }
          .completion-indicator {
            position: relative;
            overflow: hidden;
          }
          .progress-animation {
            animation: slide-in 1.5s ease-out;
          }
          .shadow-glow {
            box-shadow: 0 0 8px rgba(74, 222, 128, 0.3);
          }
          @keyframes pulse-success {
            0% {
              opacity: 0;
            }
            10% {
              opacity: 0.7;
            }
            100% {
              opacity: 0;
            }
          }
          @keyframes slide-in {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>

      {/* Edit Quest Instance Dialog */}
      <EditQuestInstanceDialog
        questInstance={quest}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        queryKey={queryKey}
      />
    </>
  );
};

export default memo(QuestInstanceItem);
