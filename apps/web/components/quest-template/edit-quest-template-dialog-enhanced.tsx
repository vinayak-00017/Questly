import React from "react";
import { QuestTemplate, QuestPriority } from "@questly/types";
import { CalendarDays, Settings } from "lucide-react";
import { BaseQuestDialog, BaseQuestDialogProps } from "../base-quest-dialog";
import { questTemplateApi } from "@/services/quest-template-api";
import { RecurrencePicker } from "../date-freq/recurrence-picker";
import { createDailyRRule } from "@/lib/rrule-utils";
import { useTopbarData } from "../topbar/hooks/use-topbar-data";
import { getTodayMidnight } from "@questly/utils";

interface EditQuestTemplateDialogProps {
  questTemplate: QuestTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditQuestTemplateDialog: React.FC<
  EditQuestTemplateDialogProps
> = ({ questTemplate, open, onOpenChange }) => {
  if (!questTemplate) return null;

  const { userStats } = useTopbarData();
  const userTimezone = userStats.timezone;

  // Enhanced BaseQuestDialog props for editing mode
  const baseDialogProps: BaseQuestDialogProps & {
    editMode?: boolean;
    existingTemplate?: QuestTemplate;
    updateApi?: (id: string, data: any) => Promise<any>;
  } = {
    open,
    onOpenChange,
    type: questTemplate.type,
    title: `Edit ${questTemplate.type === "daily" ? "Daily" : "Side"} Quest Template`,
    description: `Modify your ${questTemplate.type === "daily" ? "daily challenge" : "side quest adventure"}`,
    icon:
      questTemplate.type === "daily"
        ? require("lucide-react").Flame
        : require("lucide-react").Compass,
    themeColor: questTemplate.type === "daily" ? "orange" : "blue",
    queryKey: ["questTemplates"],
    InfoIcon: Settings,
    infoTitle: `${questTemplate.type === "daily" ? "Daily" : "Side"} quest templates`,
    infoText: `define the structure for ${questTemplate.type === "daily" ? "recurring daily habits" : "flexible side adventures"}.`,
    editMode: true,
    existingTemplate: questTemplate,
    updateApi: questTemplateApi.updateQuestTemplate,
    createRecurrenceRule: (data) => data?.recurrenceRule,
    renderDateField: ({ onChange, value, className }) => {
      const currentRecurrence =
        value?.recurrenceRule ||
        (questTemplate.type === "daily" ? createDailyRRule() : undefined);
      const currentDate = value?.date || undefined;

      if (!value) {
        setTimeout(() => {
          onChange({
            date:
              questTemplate.type === "side"
                ? questTemplate.dueDate
                  ? new Date(questTemplate.dueDate)
                  : getTodayMidnight(userTimezone)
                : undefined,
            recurrenceRule: questTemplate.recurrenceRule || currentRecurrence,
          });
        }, 0);
      }

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
            onDateSelect={(newDate) =>
              onChange({
                date: newDate,
                recurrenceRule: currentRecurrence,
              })
            }
            recurrenceRule={currentRecurrence}
            onRecurrenceSelect={(newRecurrence) =>
              onChange({
                date: currentDate,
                recurrenceRule: newRecurrence,
              })
            }
            className={className}
          />
        </>
      );
    },
  };

  // We need to create an enhanced BaseQuestDialog that supports editing
  // For now, let's return the existing dialog as a fallback
  return (
    <div>
      {/* Placeholder - we would need to enhance BaseQuestDialog to support edit mode */}
      <p>Edit mode would be implemented here using enhanced BaseQuestDialog</p>
    </div>
  );
};
