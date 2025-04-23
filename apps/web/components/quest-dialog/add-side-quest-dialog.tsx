"use client";

import { Compass, Map, CalendarDays } from "lucide-react";
import { BaseQuestDialog } from "../base-quest-dialog";
import { RecurrencePicker } from "../main-quest/recurrence-picker";

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
      actionButtonLabel="Embark on Quest"
      InfoIcon={Map}
      infoTitle="Side quests"
      infoText="offer alternative paths of exploration and can earn you valuable experience along your journey."
      createRecurrenceRule={(data) => data?.recurrenceRule}
      renderDateField={({ onChange, value, className }) => {
        // Since RecurrencePicker requires separate handlers for date and recurrence rule,
        // we use a composite state object for value
        const currentDate = value?.date || undefined;
        const currentRecurrence = value?.recurrenceRule || undefined;

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
