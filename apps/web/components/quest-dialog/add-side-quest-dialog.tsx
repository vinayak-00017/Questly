"use client";

import { Compass, Map, CalendarDays } from "lucide-react";
import { BaseQuestDialog } from "../base-quest-dialog";
import { RecurrencePicker } from "../date-freq/recurrence-picker";

interface AddSideQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddSideQuestDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddSideQuestDialogProps) {
  return (
    <BaseQuestDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
      type="side"
      title="Add Side Quest"
      description="Discover new adventures to enhance your journey"
      icon={Compass}
      themeColor="blue"
      queryKey={["sideQuests"]}
      InfoIcon={Map}
      infoTitle="Side quests"
      infoText="offer alternative paths of exploration and can earn you valuable experience along your journey."
      createRecurrenceRule={(data) => data?.recurrenceRule}
      renderDateField={({ onChange, value, className }) => {
        // Since RecurrencePicker requires separate handlers for date and recurrence rule,
        // we use a composite state object for value
        const currentRecurrence = value?.recurrenceRule || undefined;
        const currentDate =
          value?.date ||
          (!currentRecurrence || currentRecurrence === "once"
            ? new Date()
            : null);

        if (!value) {
          // Set initial default value on component mount
          setTimeout(() => {
            onChange({
              date:
                !currentRecurrence || currentRecurrence === "once"
                  ? (() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return today;
                    })()
                  : null,
              recurrenceRule: currentRecurrence,
            });
          }, 0);
        }

        return (
          <>
            <label className="text-sm font-medium text-blue-400 flex items-center gap-2">
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
