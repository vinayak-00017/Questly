"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { QuestTemplate, QuestPriority } from "@questly/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questTemplateApi } from "@/services/quest-template-api";
import { toast } from "sonner";
import { CalendarDays, Flame, Compass, Settings } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RecurrencePicker } from "../date-freq/recurrence-picker";
import { createDailyRRule } from "@/lib/rrule-utils";
import { useTopbarData } from "../topbar/hooks/use-topbar-data";

// Import the same components used in BaseQuestDialog for consistency
import { QuestDialogHeader } from "../quest-dialog/header";
import { QuestDialogDecorations } from "../quest-dialog/decorations";
import { QuestFormFields } from "../quest-dialog/form-fields";
import { QuestDialogFooter } from "../quest-dialog/footer";
import { UnsavedChangesAlert } from "../quest-dialog/unsaved-changes-alert";
import { QuestFormData, getQuestColorStyles } from "../quest-dialog/types";

interface EditQuestTemplateDialogProps {
  questTemplate: QuestTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to convert basePoints back to priority
const getPriorityFromPoints = (points: number): QuestPriority => {
  if (points === 1) return QuestPriority.Optional;
  if (points === 2) return QuestPriority.Minor;
  if (points === 3) return QuestPriority.Standard;
  if (points === 5) return QuestPriority.Important;
  if (points >= 8) return QuestPriority.Critical;
  return QuestPriority.Standard;
};

const EditQuestTemplateDialog: React.FC<EditQuestTemplateDialogProps> = ({
  questTemplate,
  open,
  onOpenChange,
}) => {
  // ALL HOOKS MUST BE DECLARED AT THE TOP - NO CONDITIONAL LOGIC BEFORE HOOKS
  const { userStats } = useTopbarData();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<QuestFormData>({
    title: "",
    description: "",
    priority: QuestPriority.Standard,
    dateValue: undefined,
    parentQuestId: undefined,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (updateData: Partial<QuestTemplate>) => {
      if (!questTemplate) throw new Error("No quest template provided");
      return questTemplateApi.updateQuestTemplate(questTemplate.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template updated successfully!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update quest template");
    },
  });

  // Memoize the initial date value to prevent recreation
  const initialDateValue = useMemo(() => {
    if (!questTemplate?.recurrenceRule) return undefined;

    return {
      recurrenceRule: questTemplate.recurrenceRule,
      date: questTemplate.dueDate ? new Date(questTemplate.dueDate) : undefined,
    };
  }, [questTemplate?.recurrenceRule, questTemplate?.dueDate]);

  // Initialize form data when template changes or dialog opens
  useEffect(() => {
    if (questTemplate && open) {
      const initialFormData = {
        title: questTemplate.title || "",
        description: questTemplate.description || "",
        priority:
          typeof questTemplate.basePoints === "number"
            ? getPriorityFromPoints(questTemplate.basePoints)
            : (questTemplate.basePoints as QuestPriority),
        dateValue: initialDateValue,
        parentQuestId: undefined,
      };

      setFormData(initialFormData);
    }
  }, [questTemplate?.id, open, initialDateValue]);

  // Handle form field updates - memoized to prevent recreation
  const updateFormField = useCallback(
    (field: keyof QuestFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle close - simplified without hasChanges dependency
  const handleOpenChange = useCallback(
    (newOpenState: boolean) => {
      onOpenChange(newOpenState);
    },
    [onOpenChange]
  );

  // Handle actual close after confirmation - memoized to prevent recreation
  const confirmClose = useCallback(() => {
    setShowConfirmDialog(false);
    onOpenChange(false);
  }, [onOpenChange]);

  // Stable callback functions for RecurrencePicker
  const handleDateSelect = useCallback(
    (newDate: Date | undefined) => {
      setFormData((prev) => ({
        ...prev,
        dateValue: {
          date: newDate,
          recurrenceRule:
            prev.dateValue?.recurrenceRule ||
            (questTemplate?.type === "daily" ? createDailyRRule() : ""),
        },
      }));
    },
    [questTemplate?.type]
  );

  const handleRecurrenceSelect = useCallback(
    (newRecurrence: string | undefined) => {
      setFormData((prev) => ({
        ...prev,
        dateValue: {
          date: prev.dateValue?.date,
          recurrenceRule: newRecurrence || "",
        },
      }));
    },
    []
  );

  // Custom date field renderer for this template type - memoized to prevent recreation
  const renderDateField = useCallback(
    ({
      onChange,
      value,
      className,
    }: {
      className?: string;
      onChange: (value: any) => void;
      value: any;
    }) => {
      if (!questTemplate) return null;

      const currentRecurrence =
        value?.recurrenceRule ||
        (questTemplate.type === "daily" ? createDailyRRule() : undefined);
      const currentDate = value?.date || undefined;

      return (
        <>
          <label
            className={`text-sm font-medium flex items-center gap-2 ${
              questTemplate.type === "daily"
                ? "text-orange-400"
                : "text-blue-400"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Schedule
          </label>
          <RecurrencePicker
            date={currentDate}
            onDateSelect={handleDateSelect}
            recurrenceRule={currentRecurrence}
            onRecurrenceSelect={handleRecurrenceSelect}
            className={className}
          />
        </>
      );
    },
    [questTemplate?.type, handleDateSelect, handleRecurrenceSelect]
  );

  // Early return AFTER all hooks are declared
  if (!questTemplate) return null;

  const themeColor = questTemplate.type === "daily" ? "orange" : "blue";
  const icon = questTemplate.type === "daily" ? Flame : Compass;
  const colorStyles = getQuestColorStyles(themeColor);

  // Helper function to convert priority back to basePoints
  const getBasePointsFromPriority = (priority: QuestPriority): number => {
    switch (priority) {
      case QuestPriority.Optional:
        return 1;
      case QuestPriority.Minor:
        return 2;
      case QuestPriority.Standard:
        return 3;
      case QuestPriority.Important:
        return 5;
      case QuestPriority.Critical:
        return 8;
      default:
        return 3;
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const updateData = {
      title: formData.title,
      description: formData.description,
      basePoints: getBasePointsFromPriority(formData.priority),
      recurrenceRule: formData.dateValue?.recurrenceRule || null,
      dueDate:
        formData.dateValue?.date instanceof Date
          ? formData.dateValue.date.toISOString()
          : null,
      isActive: questTemplate.isActive,
    };

    updateMutation.mutate(updateData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={`sm:max-w-[500px] w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black ${colorStyles.headerBorder} max-h-[85vh] overflow-hidden shadow-xl flex flex-col mt-6 sm:mt-0`}
        >
          <QuestDialogDecorations themeColor={themeColor} opacity={0.3} />

          <QuestDialogHeader
            icon={icon}
            themeColor={themeColor}
            title={`Edit ${questTemplate.type === "daily" ? "Daily" : "Side"} Quest Template`}
            description={`Modify your ${questTemplate.type === "daily" ? "daily challenge" : "side quest adventure"} template`}
          />

          <QuestFormFields
            formData={formData}
            onUpdateForm={updateFormField}
            themeColor={themeColor}
            renderDateField={renderDateField}
            mainQuestsIds={[]} // Templates don't have parent quests
            InfoIcon={Settings}
            infoTitle={`${questTemplate.type === "daily" ? "Daily" : "Side"} quest templates`}
            infoText={`define the structure for ${questTemplate.type === "daily" ? "recurring daily habits" : "flexible side adventures"}.`}
          />

          <QuestDialogFooter
            themeColor={themeColor}
            isDisabled={!formData.title.trim()}
            isPending={updateMutation.isPending}
            icon={icon}
            onAction={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <UnsavedChangesAlert
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmClose}
      />
    </>
  );
};

export default EditQuestTemplateDialog;
