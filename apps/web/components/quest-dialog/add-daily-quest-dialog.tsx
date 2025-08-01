"use client";

import { CalendarDays, Flame } from "lucide-react";
import { BaseQuestDialog } from "../base-quest-dialog";
import { createDailyRRule } from "@/lib/rrule-utils";
import { RecurrencePicker } from "../date-freq/recurrence-picker";

interface AddDailyQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddDailyQuestDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddDailyQuestDialogProps) {
  return (
    <BaseQuestDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
      type="daily"
      title="Add Daily Quest"
      description="Begin a new daily challenge for your journey"
      icon={Flame}
      themeColor="orange"
      queryKey={["dailyQuests"]}
      InfoIcon={Flame}
      infoTitle="Daily quests"
      infoText="refresh each day and help you build consistent habits to achieve your main quests."
      createRecurrenceRule={(data) => data?.recurrenceRule}
      renderDateField={({ onChange, value, className }) => {
        // Since RecurrencePicker requires separate handlers for date and recurrence rule,
        // we use a composite state object for value
        const currentRecurrence = value?.recurrenceRule || createDailyRRule();
        const currentDate = value?.date || undefined;

        if (!value) {
          // Set initial default value on component mount
          setTimeout(() => {
            onChange({
              date: undefined,
              recurrenceRule: createDailyRRule(),
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
}