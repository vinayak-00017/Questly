"use client";

import { useState, useEffect, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuestPriority } from "@questly/types";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";
import { createQuestTemplateSchema } from "@questly/types";
import { mainQuestApi } from "@/services/main-quest-api";

import { QuestDialogHeader } from "./quest-dialog/header";
import { QuestDialogDecorations } from "./quest-dialog/decorations";
import { QuestFormFields } from "./quest-dialog/form-fields";
import { QuestDialogFooter } from "./quest-dialog/footer";
import { UnsavedChangesAlert } from "./quest-dialog/unsaved-changes-alert";
import { QuestFormData, getQuestColorStyles } from "./quest-dialog/types";
import { questApi } from "@/services/quest-api";

export interface BaseQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  type: "daily" | "side";
  title: string;
  description: string;
  icon: LucideIcon;
  themeColor: "blue" | "orange";
  queryKey: string[];
  renderDateField: (props: {
    className?: string;
    onChange: (value: any) => void;
    value: any;
  }) => ReactNode;
  createRecurrenceRule?: (data?: any) => string | undefined;
  infoTitle?: string;
  infoText?: string;
  InfoIcon?: LucideIcon;
}

export function BaseQuestDialog({
  open,
  onOpenChange,
  onSuccess,
  type,
  title,
  description,
  icon,
  themeColor,
  queryKey,
  renderDateField,
  createRecurrenceRule,
  infoTitle,
  infoText,
  InfoIcon,
}: BaseQuestDialogProps) {
  // Initialize form state
  const [formData, setFormData] = useState<QuestFormData>({
    title: "",
    description: "",
    priority: QuestPriority.Standard,
    dateValue: undefined,
    parentQuestId: undefined,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const queryClient = useQueryClient();
  const colorStyles = getQuestColorStyles(themeColor);

  // Handle form field updates
  const updateFormField = (field: keyof QuestFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if form has changes
  const hasChanges =
    !!formData.title ||
    !!formData.description ||
    formData.priority !== QuestPriority.Standard ||
    !!formData.dateValue ||
    !!formData.parentQuestId;

  // Handle close with confirmation if needed
  const handleCloseWithConfirmation = (newOpenState: boolean) => {
    if (!newOpenState && hasChanges) {
      // User is trying to close and has unsaved changes
      setShowConfirmDialog(true);
      // Prevent default close behavior
      return false;
    }
    // Allow dialog to close
    return true;
  };

  // Handle actual close after confirmation
  const confirmClose = () => {
    // First hide the confirmation dialog
    setShowConfirmDialog(false);

    // Use a small setTimeout to ensure state updates are processed in separate render cycles
    setTimeout(() => {
      // Reset form state immediately
      resetForm();

      // Then close the main dialog after state is reset
      onOpenChange(false);
    }, 10);
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: QuestPriority.Standard,
      dateValue: undefined,
      parentQuestId: undefined,
    });
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // We use a timeout to ensure the reset happens after the dialog closing animation
      const timeout = setTimeout(() => {
        resetForm();
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Add quest mutation
  const addQuestMutation = useMutation({
    mutationFn: questApi.addQuest,
    onSuccess: () => {
      // Invalidate the specific quest type cache
      queryClient.invalidateQueries({ queryKey });
      // Also invalidate the combined todaysQuests cache so Today's Quests card updates
      queryClient.invalidateQueries({ queryKey: ["todaysQuests"] });
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success(`${type === "daily" ? "Daily" : "Side"} quest added!`);
      onSuccess?.();
      onOpenChange(false);
      // Form reset is handled by the useEffect above
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create quest");
    },
  });

  // Fetch main quests for the parent quest dropdown
  const { data: mainQuestsIds = [] } = useQuery({
    queryKey: ["mainQuestsId"],
    queryFn: mainQuestApi.fetchMainQuestsId,
    select: (data) => data.mainQuestsIds || [],
  });

  // Handle quest creation
  const handleCreateQuest = () => {
    try {
      const recurrenceRule = createRecurrenceRule?.(formData.dateValue);
      const input = {
        title: formData.title,
        description: formData.description,
        basePoints: formData.priority,
        dueDate:
          formData.dateValue?.date instanceof Date
            ? formData.dateValue.date.toISOString()
            : undefined,
        parentQuestId: formData.parentQuestId,
        type,
        recurrenceRule,
      };

      try {
        const validatedInput = createQuestTemplateSchema.parse(input);
        addQuestMutation.mutate(validatedInput);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        throw validationError;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpenState) => {
          if (handleCloseWithConfirmation(newOpenState)) {
            onOpenChange(newOpenState);
          }
        }}
      >
        <DialogContent
          className={`sm:max-w-[500px] w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black ${colorStyles.headerBorder} max-h-[85vh] overflow-hidden shadow-xl flex flex-col mt-6 sm:mt-0`}
        >
          {/* Visual decorations */}
          <QuestDialogDecorations themeColor={themeColor} />

          {/* Dialog header */}
          <QuestDialogHeader
            icon={icon}
            themeColor={themeColor}
            title={title}
            description={description}
          />

          {/* Form fields */}
          <QuestFormFields
            formData={formData}
            onUpdateForm={updateFormField}
            themeColor={themeColor}
            renderDateField={renderDateField}
            mainQuestsIds={mainQuestsIds}
            InfoIcon={InfoIcon}
            infoTitle={infoTitle}
            infoText={infoText}
          />

          {/* Footer with actions */}
          <QuestDialogFooter
            themeColor={themeColor}
            isDisabled={!formData.title.trim()}
            isPending={addQuestMutation.isPending}
            icon={icon}
            onAction={handleCreateQuest}
          />
        </DialogContent>
      </Dialog>

      {/* Unsaved changes alert */}
      <UnsavedChangesAlert
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmClose}
      />
    </>
  );
}
