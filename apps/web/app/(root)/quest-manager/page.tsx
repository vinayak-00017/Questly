"use client";

import React, { useState, useCallback, useMemo } from "react";
import { QuestTemplate } from "@questly/types";
import EditQuestTemplateDialog from "@/components/quest-template/edit-quest-template-dialog";
import { AddDailyQuestDialog } from "@/components/quest-dialog/add-daily-quest-dialog";
import { AddSideQuestDialog } from "@/components/quest-dialog/add-side-quest-dialog";
import { QuestTypeChooserDialog } from "@/components/quest-card/quest-type-chooser-dialog";
import { useQuestTemplates } from "@/hooks/useQuestTemplates";
import {
  useFilteredTemplates,
  FilterState,
} from "@/hooks/useFilteredTemplates";
import { calculateQuestTemplateStats } from "@/utils/questTemplateStats";
import { QuestManagerHeader } from "@/components/quest-manager/quest-manager-header";
import { QuestStatsCards } from "@/components/quest-manager/quest-stats-cards";
import { QuestTemplateFilters } from "@/components/quest-manager/quest-template-filters";
import { QuestTemplateGrid } from "@/components/quest-manager/quest-template-grid";

const QuestManager = () => {
  // State management
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTypeChooserOpen, setIsTypeChooserOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestType, setSelectedQuestType] = useState<
    "daily" | "side" | null
  >(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    filterType: "all",
    filterQuestType: "all",
    filterImportance: "all",
  });

  // Data fetching and mutations
  const {
    templatesData,
    isLoadingTemplates,
    deleteMutation,
    toggleStatusMutation,
  } = useQuestTemplates();

  // Derived data
  const filteredTemplates = useFilteredTemplates(templatesData, filters);
  const stats = calculateQuestTemplateStats(templatesData);

  // Find selected template by ID - memoized to prevent infinite loops
  const selectedTemplate = useMemo(() => {
    return selectedTemplateId
      ? templatesData?.find((t) => t.id === selectedTemplateId) || null
      : null;
  }, [selectedTemplateId, templatesData]);

  // Event handlers (memoized to prevent unnecessary re-renders)
  const handleEdit = useCallback((template: QuestTemplate) => {
    setSelectedTemplateId(template.id);
    setIsEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleToggleStatus = useCallback(
    (id: string, isActive: boolean) => {
      toggleStatusMutation.mutate({ id, isActive });
    },
    [toggleStatusMutation]
  );

  const handleAddQuest = useCallback(() => {
    setIsTypeChooserOpen(true);
  }, []);

  const handleQuestTypeSelect = useCallback((questType: "daily" | "side") => {
    setIsTypeChooserOpen(false);
    setSelectedQuestType(questType);
    setIsDialogOpen(true);
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  // Choose the appropriate dialog based on quest type
  const CurrentAddDialog =
    selectedQuestType === "daily" ? AddDailyQuestDialog : AddSideQuestDialog;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-stone-950 relative">
        {/* Background patterns - dimmed */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),rgba(255,255,255,0))] opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:20px_20px] opacity-30" />

        <div className="relative z-10 flex h-full w-full flex-col px-4 py-8 md:px-8 md:py-10 max-w-7xl mx-auto">
          <QuestManagerHeader
            title="Quest Management"
            subtitle="Manage your quest templates and view active quests"
          />

          <QuestStatsCards stats={stats} />

          <div className="flex-1 space-y-8">
            <QuestTemplateFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onAddQuest={handleAddQuest}
            />

            <QuestTemplateGrid
              templates={filteredTemplates}
              isLoading={isLoadingTemplates}
              filters={filters}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </div>

        <EditQuestTemplateDialog
          questTemplate={selectedTemplate}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      </div>

      <QuestTypeChooserDialog
        open={isTypeChooserOpen}
        onOpenChange={setIsTypeChooserOpen}
        onChoose={handleQuestTypeSelect}
      />

      {isDialogOpen && selectedQuestType && (
        <CurrentAddDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={() => {
            setSelectedQuestType(null);
          }}
        />
      )}
    </>
  );
};

export default QuestManager;