"use client";

import { useState, useEffect, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuestPriority, QuestTemplate, QuestType } from "@questly/types";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";
import { questTemplateApi } from "@/services/quest-template-api";
import { questApi } from "@/services/quest-api";
import { mainQuestApi } from "@/services/main-quest-api";

import { QuestDialogHeader } from "../quest-dialog/header";
import { QuestDialogDecorations } from "../quest-dialog/decorations";
import { QuestFormFields } from "../quest-dialog/form-fields";
import { QuestDialogFooter } from "../quest-dialog/footer";
import { UnsavedChangesAlert } from "../quest-dialog/unsaved-changes-alert";
import { QuestFormData, getQuestColorStyles } from "../quest-dialog/types";

// Helper function to convert basePoints back to priority
export const getPriorityFromPoints = (points: number): QuestPriority => {
  if (points === 1) return QuestPriority.Optional;
  if (points === 2) return QuestPriority.Minor;
  if (points === 3) return QuestPriority.Standard;
  if (points === 5) return QuestPriority.Important;
  if (points >= 8) return QuestPriority.Critical;
  return QuestPriority.Standard;
};

export interface BaseQuestTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode: "create" | "edit";
  existingTemplate?: QuestTemplate;
  type: "daily" | "side";
  title: string;
  description: string;
  icon: LucideIcon;
  themeColor: "blue" | "orange";
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

export function BaseQuestTemplateDialog({
  open,
  onOpenChange,
  onSuccess,
  mode,
  existingTemplate,
  type,
  title,
  description,
  icon,
  themeColor,
  renderDateField,
  createRecurrenceRule,
  infoTitle,
  infoText,
  InfoIcon,
}: BaseQuestTemplateDialogProps) {
  // Initialize form state with existing template data if in edit mode
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

  // Initialize form data when template changes or dialog opens
  useEffect(() => {
    if (mode === "edit" && existingTemplate && open) {
      setFormData({
        title: existingTemplate.title || "",
        description: existingTemplate.description || "",
        priority:
          typeof existingTemplate.basePoints === "number"
            ? getPriorityFromPoints(existingTemplate.basePoints)
            : (existingTemplate.basePoints as QuestPriority),
        dateValue: existingTemplate.recurrenceRule
          ? {
              recurrenceRule: existingTemplate.recurrenceRule,
              date: existingTemplate.dueDate
                ? new Date(existingTemplate.dueDate)
                : undefined,
            }
          : undefined,
        parentQuestId: undefined, // Templates don't have parent quests
      });
    } else if (mode === "create" && open) {
      // Reset form for create mode
      setFormData({
        title: "",
        description: "",
        priority: QuestPriority.Standard,
        dateValue: undefined,
        parentQuestId: undefined,
      });
    }
  }, [mode, existingTemplate, open]);

  // Handle form field updates
  const updateFormField = (field: keyof QuestFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if form has changes
  const hasChanges =
    mode === "create"
      ? !!formData.title ||
        !!formData.description ||
        formData.priority !== QuestPriority.Standard ||
        !!formData.dateValue ||
        !!formData.parentQuestId
      : // For edit mode, check if values differ from original
        existingTemplate &&
        (formData.title !== (existingTemplate.title || "") ||
          formData.description !== (existingTemplate.description || "") ||
          formData.priority !==
            (typeof existingTemplate.basePoints === "number"
              ? getPriorityFromPoints(existingTemplate.basePoints)
              : existingTemplate.basePoints) ||
          JSON.stringify(formData.dateValue) !==
            JSON.stringify({
              recurrenceRule: existingTemplate.recurrenceRule,
              date: existingTemplate.dueDate
                ? new Date(existingTemplate.dueDate)
                : undefined,
            }));

  // Handle close with confirmation if needed
  const handleCloseWithConfirmation = (newOpenState: boolean) => {
    if (!newOpenState && hasChanges) {
      setShowConfirmDialog(true);
      return false;
    }
    return true;
  };

  // Handle actual close after confirmation
  const confirmClose = () => {
    setShowConfirmDialog(false);
    setTimeout(() => {
      resetForm();
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
      const timeout = setTimeout(() => {
        resetForm();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Create mutation for new templates
  const createMutation = useMutation({
    mutationFn: questApi.addQuest,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success(
        `${type === "daily" ? "Daily" : "Side"} quest template created!`
      );
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create quest template");
    },
  });

  // Update mutation for existing templates
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      questTemplateApi.updateQuestTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template updated successfully!");
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update quest template");
    },
  });

  // Fetch main quests for the parent quest dropdown (only needed for create mode)
  const { data: mainQuestsIds = [] } = useQuery({
    queryKey: ["mainQuestsId"],
    queryFn: mainQuestApi.fetchMainQuestsId,
    select: (data) => data.mainQuestsIds || [],
    enabled: mode === "create", // Only fetch for create mode
  });

  // Handle form submission
  const handleSubmit = () => {
    try {
      const recurrenceRule = createRecurrenceRule?.(formData.dateValue);
      const templateData = {
        title: formData.title,
        description: formData.description,
        basePoints: formData.priority,
        type: type === "daily" ? QuestType.Daily : QuestType.Side,
        recurrenceRule: recurrenceRule || null,
        dueDate:
          formData.dateValue?.date instanceof Date
            ? formData.dateValue.date.toISOString()
            : null,
      };

      if (mode === "create") {
        createMutation.mutate(templateData);
      } else if (mode === "edit" && existingTemplate) {
        const updateData = {
          ...templateData,
          isActive: existingTemplate.isActive ?? true,
        };
        updateMutation.mutate({ id: existingTemplate.id, data: updateData });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const isSubmitting =
    mode === "create" ? createMutation.isPending : updateMutation.isPending;

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
          <QuestDialogDecorations themeColor={themeColor} />

          <QuestDialogHeader
            icon={icon}
            themeColor={themeColor}
            title={title}
            description={description}
          />

          <QuestFormFields
            formData={formData}
            onUpdateForm={updateFormField}
            themeColor={themeColor}
            renderDateField={renderDateField}
            mainQuestsIds={mode === "create" ? mainQuestsIds : []} // Only show parent quest selection for create mode
            InfoIcon={InfoIcon}
            infoTitle={infoTitle}
            infoText={infoText}
          />

          <QuestDialogFooter
            themeColor={themeColor}
            isDisabled={!formData.title.trim()}
            isPending={isSubmitting}
            icon={icon}
            onAction={handleSubmit}
            actionText={mode === "edit" ? "Save Changes" : "Create Quest"}
            loadingText={mode === "edit" ? "Saving..." : "Creating..."}
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
}
