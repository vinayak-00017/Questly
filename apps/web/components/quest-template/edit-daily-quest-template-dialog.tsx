import React, { useEffect } from "react";
import { QuestTemplate, QuestPriority } from "@questly/types";
import { CalendarDays, Flame } from "lucide-react";
import {
  BaseQuestTemplateDialog,
  getPriorityFromPoints,
} from "./base-quest-template-dialog";
import { RecurrencePicker } from "../date-freq/recurrence-picker";
import { createDailyRRule } from "@/lib/rrule-utils";

interface EditDailyQuestTemplateDialogProps {
  questTemplate: QuestTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditDailyQuestTemplateDialog: React.FC<
  EditDailyQuestTemplateDialogProps
> = ({ questTemplate, open, onOpenChange, onSuccess }) => {
  if (!questTemplate || questTemplate.type !== "daily") return null;

  return (
    <BaseQuestTemplateDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
      mode="edit"
      existingTemplate={questTemplate}
      type="daily"
      title="Edit Daily Quest Template"
      description="Modify your daily challenge template"
      icon={Flame}
      themeColor="orange"
      InfoIcon={Flame}
      infoTitle="Editing Daily Quest Template"
      infoText="Changes will apply to future daily quest instances. Current active quests remain unchanged."
      createRecurrenceRule={(data) => data?.recurrenceRule}
      renderDateField={({ onChange, value, className }) => {
        const currentRecurrence = value?.recurrenceRule || createDailyRRule();
        const currentDate = value?.date || undefined;

        if (!value) {
          setTimeout(() => {
            onChange({
              date: undefined,
              recurrenceRule:
                questTemplate.recurrenceRule || createDailyRRule(),
            });
          }, 0);
        }

        return (
          <>
            <label className="text-sm font-medium text-orange-400 flex items-center gap-2">
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
      }}
    />
  );
};
