"use client";

import React, { useState } from "react";
import { Card, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestInstance } from "@questly/types";
import { LucideIcon, Plus } from "lucide-react";

import QuestInstanceItem from "./quest-instance-item";
import { useQuestTheme } from "@/hooks/useQuestTheme";

export interface QuestCardProps {
  title: string;
  description: string;
  type: "daily" | "side";
  Icon: LucideIcon;
  EmptyIcon: LucideIcon;
  themeColor: "blue" | "orange";
  fetchFn: () => Promise<any>;
  queryKey: string[];
  dataSelector: (data: any) => QuestInstance[];
  AddQuestDialog: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
  }>;
  questTypeLabel: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  addButtonLabel?: string;
  createButtonLabel?: string;
  defaultXpReward?: number;
  // Add new props for task functionality
  fetchTasksFn?: (questInstanceId: string) => Promise<any>;
  addTaskFn?: (questInstanceId: string, taskData: any) => Promise<any>;
  completeTaskFn?: (taskId: string) => Promise<any>;
  completeQuestFn?: (questInstanceId: string) => Promise<any>;
}

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  type,
  Icon,
  EmptyIcon,
  themeColor,
  fetchFn,
  queryKey,
  dataSelector,
  AddQuestDialog,
  questTypeLabel,
  emptyStateTitle,
  emptyStateDescription,
  addButtonLabel = "Add Quest",
  createButtonLabel = "Create Quest",
  defaultXpReward,
  // Task-related props with defaults
  fetchTasksFn = async () => ({ tasks: [] }),
  addTaskFn = async () => ({}),
  completeTaskFn = async () => ({}),
  completeQuestFn = async () => ({}),
}) => {
  const router = useRouter();
  const colorStyles = useQuestTheme(themeColor);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Quest data
  const { data: quests = [], isLoading } = useQuery({
    queryKey,
    queryFn: fetchFn,
    select: dataSelector,
  });

  // Color-specific styles based on theme
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-lg relative">
      {/* Enhanced background with animated effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorStyles.gradient} pointer-events-none`}
      ></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${colorStyles.particleColor} float-animation`}
            style={{
              width: `${Math.random() * 10 + 3}px`,
              height: `${Math.random() * 10 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative">
        <div className="flex w-full px-6 pt-6 pb-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${colorStyles.iconBg} pulse-glow`}
            >
              <Icon className={`h-5 w-5 ${colorStyles.iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-medieval text-white/90">
                {title}
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs mt-0.5">
                {description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={`bg-black/30 ${colorStyles.buttonBorder} hover:bg-black/50 text-white gap-1.5 text-sm ${colorStyles.hoverBorder} transition-all duration-300`}
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>{addButtonLabel}</span>
          </Button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {quests.length > 0 ? (
            quests.map((quest: QuestInstance) => (
              <QuestInstanceItem
                key={quest.instanceId}
                quest={quest}
                colorStyles={colorStyles}
                questTypeLabel={questTypeLabel}
                Icon={Icon}
                queryKey={queryKey}
              />
            ))
          ) : (
            <div className="col-span-2 p-8 text-center bg-black/20 rounded-lg border border-zinc-800/40">
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
                onClick={() => setIsDialogOpen(true)}
                className={`bg-gradient-to-r ${colorStyles.emptyBtnGradient} text-white`}
              >
                <Plus className="h-4 w-4 mr-1" />
                {createButtonLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
      <AddQuestDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </Card>
  );
};

export default QuestCard;
