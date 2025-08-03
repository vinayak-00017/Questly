"use client";

import React, { useState, useEffect, memo } from "react";
import { Card, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QuestInstance } from "@questly/types";
import {
  Compass,
  Flame,
  LucideIcon,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import QuestInstanceItem from "./quest-instance-item";
import { useQuestTheme } from "@/hooks/useQuestTheme";
import { QuestTypeChooserDialog } from "./quest-type-chooser-dialog";
import { AddDailyQuestDialog } from "../quest-dialog/add-daily-quest-dialog";
import { AddSideQuestDialog } from "../quest-dialog/add-side-quest-dialog";

export interface QuestCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  type: "daily" | "side" | "today";
  EmptyIcon: LucideIcon;
  themeColor: "blue" | "orange" | "purple"; // Added "purple"
  fetchFn: () => Promise<any>;
  queryKey: string[];
  dataSelector: (data: any) => QuestInstance[];

  emptyStateTitle: string;
  emptyStateDescription: string;
  addButtonLabel?: string;
  createButtonLabel?: string;
  defaultXpReward?: number;
  isLoading?: boolean;
  externalData?: QuestInstance[];
  onAddQuest?: () => void;
  // Add new props for task functionality
  fetchTasksFn?: (questInstanceId: string) => Promise<any>;
  addTaskFn?: (questInstanceId: string, taskData: any) => Promise<any>;
  completeTaskFn?: (taskId: string) => Promise<any>;
  completeQuestFn?: (questInstanceId: string) => Promise<any>;
}

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  Icon,
  EmptyIcon,
  type,
  themeColor,
  fetchFn,
  queryKey,
  dataSelector,
  emptyStateTitle,
  emptyStateDescription,
  isLoading: propIsLoading,
  externalData,
  onAddQuest,
  defaultXpReward,
  // Task-related props with defaults
  fetchTasksFn = async () => ({ tasks: [] }),
  addTaskFn = async () => ({}),
  completeTaskFn = async () => ({}),
  completeQuestFn = async () => ({}),
}) => {
  const colorStyles = useQuestTheme(themeColor);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isTypeChooserOpen, setIsTypeChooserOpen] = React.useState(false);
  const [selectedQuestType, setSelectedQuestType] = React.useState<
    "daily" | "side" | null
  >(null);
  const [particles, setParticles] = useState<
    Array<{
      width: string;
      height: string;
      left: string;
      top: string;
      animationDuration: string;
      animationDelay: string;
    }>
  >([]);

  // Collapse/Expand all state
  const [globalCollapseState, setGlobalCollapseState] = useState<
    "collapsed" | "expanded" | null
  >(null);
  const [areAllCollapsed, setAreAllCollapsed] = useState(true);

  // Generate particles on the client side only
  useEffect(() => {
    const newParticles = Array(10)
      .fill(null)
      .map(() => ({
        width: `${Math.random() * 10 + 3}px`,
        height: `${Math.random() * 10 + 3}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
      }));
    setParticles(newParticles);
  }, []);

  // Quest data

  const { data: quests = [], isLoading: queryIsLoading } = useQuery({
    queryKey,
    queryFn: fetchFn,
    select: dataSelector,
    enabled: !propIsLoading && !externalData,
  });

  const questData = externalData || quests || [];
  const isLoading = propIsLoading || queryIsLoading;

  // Sort quests: 1. completed (incompleted first), 2. basePoints (higher first)
  const sortedQuests = React.useMemo(() => {
    return [...questData].sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by baseValue (higher first)
      return Number(b.basePoints) - Number(a.basePoints);
    });
  }, [questData]);

  const handleAddQuest = async () => {
    if (onAddQuest) {
      onAddQuest();
    } else if (type === "today") {
      setIsTypeChooserOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleQuestTypeSelect = (questType: "daily" | "side") => {
    setIsTypeChooserOpen(false);
    setSelectedQuestType(questType);
    setIsDialogOpen(true);
  };

  const CurrentAddDialog =
    selectedQuestType === "daily" ? AddDailyQuestDialog : AddSideQuestDialog;

  // Handle toggle collapse/expand all
  const handleToggleAll = () => {
    if (areAllCollapsed) {
      setGlobalCollapseState("expanded");
      setAreAllCollapsed(false);
    } else {
      setGlobalCollapseState("collapsed");
      setAreAllCollapsed(true);
    }
    // Reset after a brief moment to allow individual control again
    setTimeout(() => setGlobalCollapseState(null), 100);
  };

  return (
    <Card className="w-full overflow-hidden bg-card/80 border border-border/50 shadow-lg backdrop-blur-sm hover:border-primary/20 transition-all duration-300 relative">
      {/* Enhanced background with animated effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorStyles.gradient} pointer-events-none`}
      ></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${colorStyles.particleColor} float-animation`}
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
              animationDuration: particle.animationDuration,
              animationDelay: particle.animationDelay,
            }}
          ></div>
        ))}
      </div>

      <div className="relative">
        <div className="flex w-full px-6 pt-6 pb-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`bg-muted/50 w-10 h-10 rounded-xl flex items-center justify-center shadow-md border border-primary/30 backdrop-blur-sm`}
            >
              <Icon className={`h-5 w-5 text-primary`} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm mt-0.5">
                {description}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Collapse/Expand All Toggle */}
            {sortedQuests.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">View:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleAll}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  {areAllCollapsed ? (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Expand All
                    </>
                  ) : (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Collapse All
                    </>
                  )}
                </Button>
              </div>
            )}

            {type === "today" && (
              <Button
                variant="outline"
                size="sm"
                className={`bg-black/30 ${colorStyles.buttonBorder} hover:bg-black/50 text-white gap-1.5 text-sm ${colorStyles.hoverBorder} transition-all duration-300`}
                onClick={handleAddQuest}
              >
                <Plus className="h-4 w-4" />
                <span>Add Quest</span>
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedQuests.length > 0 ? (
            sortedQuests.map((quest: QuestInstance) => (
              <QuestInstanceItem
                key={quest.instanceId}
                quest={quest}
                colorStyles={
                  quest.type == "daily"
                    ? useQuestTheme("orange")
                    : useQuestTheme("blue")
                }
                questTypeLabel={
                  quest.type == "daily" ? "DAILY QUEST" : "SIDE QUEST"
                }
                Icon={quest.type == "daily" ? Flame : Compass}
                queryKey={queryKey}
                globalCollapseState={globalCollapseState}
              />
            ))
          ) : (
            <div className="col-span-2 p-8 text-center bg-zinc-800/30 rounded-lg border border-zinc-700/50 shadow-lg shadow-black/10">
              <EmptyIcon
                className={`h-12 w-12 ${colorStyles.iconColor}/30 mx-auto mb-3`}
              />
              <h3 className="text-white/90 font-medieval text-lg mb-1">
                {emptyStateTitle}
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                {emptyStateDescription}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddQuest}
                className={`bg-gradient-to-r ${colorStyles.emptyBtnGradient} text-white`}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Quest
              </Button>
            </div>
          )}
        </div>
      </div>
      <QuestTypeChooserDialog
        open={isTypeChooserOpen}
        onOpenChange={setIsTypeChooserOpen}
        onChoose={handleQuestTypeSelect}
      />
      {isDialogOpen && (
        <CurrentAddDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={() => {
            setSelectedQuestType(null);
          }}
        />
      )}
    </Card>
  );
};

export default memo(QuestCard);
