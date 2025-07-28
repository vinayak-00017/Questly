"use client";

import React, { useState, useMemo, useEffect, memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ViewType } from "./types";
import { useTrackedQuests } from "./hooks/use-tracked-quests";
import { useQuestTemplates } from "./hooks/use-quest-templates";
import { useQuestActivity } from "./hooks/use-quest-activity";
import {
  formatDateHeader,
  generateDateRange,
  sortTrackedQuests,
  navigateDate,
} from "./utils";
import { QuestTrackerHeader } from "./components/quest-tracker-header";
import { CondensedHeader } from "./components/condensed-header";
import { DateHeaders } from "./components/date-headers";
import { QuestRow } from "./components/quest-row";
import { EmptyState } from "./components/empty-state";

const QuestTracker: React.FC = () => {
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    // Auto-expand if there are tracked quests, otherwise start condensed
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trackedQuests");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.length > 0;
        } catch (e) {
          return false;
        }
      }
    }
    return false;
  });

  const { trackedQuests, addQuestToTracker, removeQuestFromTracker } =
    useTrackedQuests();
  const { availableTemplates } = useQuestTemplates(trackedQuests);

  // Generate date range based on view
  const dateRange = useMemo(
    () => generateDateRange(currentDate, selectedView),
    [currentDate, selectedView]
  );

  const { getQuestActivity } = useQuestActivity(trackedQuests, dateRange);

  // Sort tracked quests by priority
  const sortedTrackedQuests = useMemo(
    () => sortTrackedQuests(trackedQuests),
    [trackedQuests]
  );

  // Auto-expand when quests are added, auto-collapse when no quests
  useEffect(() => {
    if (trackedQuests.length > 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [trackedQuests.length]);

  const handleAddQuestToTracker = () => {
    if (!selectedTemplate) return;

    const template = availableTemplates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    addQuestToTracker({
      title: template.title,
      type: template.type,
      templateId: template.id,
      priority:
        typeof template.basePoints === "string"
          ? template.basePoints
          : "standard",
    });

    setSelectedTemplate("");
    setIsAddDialogOpen(false);
  };

  const handleNavigateDate = (direction: "prev" | "next") => {
    setCurrentDate(navigateDate(currentDate, direction, selectedView));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Condensed view when no quests are tracked and component is collapsed
  if (trackedQuests.length === 0 && !isExpanded) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-800/80 border-amber-500/20 backdrop-blur-sm">
        <CardHeader>
          <CondensedHeader
            onToggleExpanded={toggleExpanded}
            isAddDialogOpen={isAddDialogOpen}
            onAddDialogOpenChange={setIsAddDialogOpen}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            availableTemplates={availableTemplates}
            onAddQuest={handleAddQuestToTracker}
          />
        </CardHeader>
      </Card>
    );
  }

  // Full expanded view
  return (
    <Card className="bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-800/80 border-amber-500/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <QuestTrackerHeader
          trackedQuestsCount={trackedQuests.length}
          selectedView={selectedView}
          onViewChange={setSelectedView}
          dateHeader={formatDateHeader(currentDate, selectedView)}
          onNavigateDate={handleNavigateDate}
          isAddDialogOpen={isAddDialogOpen}
          onAddDialogOpenChange={setIsAddDialogOpen}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          availableTemplates={availableTemplates}
          onAddQuest={handleAddQuestToTracker}
          onToggleExpanded={trackedQuests.length === 0 ? toggleExpanded : undefined}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        {trackedQuests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            <DateHeaders dateRange={dateRange} selectedView={selectedView} />

            {/* Quest Rows */}
            {sortedTrackedQuests.map((quest, questIndex) => (
              <QuestRow
                key={quest.id}
                quest={quest}
                questIndex={questIndex}
                dateRange={dateRange}
                selectedView={selectedView}
                getQuestActivity={getQuestActivity}
                onRemoveQuest={removeQuestFromTracker}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(QuestTracker);