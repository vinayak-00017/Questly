"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { QuestTemplate, QuestPriority } from "@questly/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questTemplateApi } from "@/services/quest-template-api";
import { toast } from "sonner";

interface EditModeContextType {
  isEditMode: boolean;
  questTemplate: QuestTemplate | null;
  initialFormData: any;
  customSubmitHandler: (formData: any) => void;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  return context;
};

interface EditModeWrapperProps {
  questTemplate: QuestTemplate;
  children: ReactNode;
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

export const EditModeWrapper: React.FC<EditModeWrapperProps> = ({
  questTemplate,
  children,
}) => {
  const queryClient = useQueryClient();

  // Update mutation for quest templates
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      questTemplateApi.updateQuestTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update quest template");
    },
  });

  // Prepare initial form data based on the existing template
  const initialFormData = {
    title: questTemplate.title || "",
    description: questTemplate.description || "",
    priority:
      typeof questTemplate.basePoints === "number"
        ? getPriorityFromPoints(questTemplate.basePoints)
        : (questTemplate.basePoints as QuestPriority),
    dateValue: questTemplate.recurrenceRule
      ? {
          recurrenceRule: questTemplate.recurrenceRule,
          date: questTemplate.dueDate
            ? new Date(questTemplate.dueDate)
            : undefined,
        }
      : undefined,
    parentQuestId: undefined, // Templates don't have parent quests
  };

  // Custom submit handler for edit mode
  const customSubmitHandler = (formData: any) => {
    const updateData = {
      title: formData.title,
      description: formData.description,
      basePoints: formData.priority,
      recurrenceRule: formData.dateValue?.recurrenceRule || null,
      dueDate:
        formData.dateValue?.date instanceof Date
          ? formData.dateValue.date.toISOString()
          : null,
      isActive: questTemplate.isActive,
      type: questTemplate.type,
    };

    updateMutation.mutate({ id: questTemplate.id, data: updateData });
  };

  const contextValue: EditModeContextType = {
    isEditMode: true,
    questTemplate,
    initialFormData,
    customSubmitHandler,
  };

  return (
    <EditModeContext.Provider value={contextValue}>
      {children}
    </EditModeContext.Provider>
  );
};
