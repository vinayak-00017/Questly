"use client";

import { Flame } from "lucide-react";
import { BaseQuestDialog } from "../base-quest-dialog";
import { createDailyRRule } from "@/lib/rrule-utils";
import { DatePicker } from "../date-freq/date-picker";

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
      createRecurrenceRule={() => createDailyRRule()}
      renderDateField={({ onChange, value, className }) => {
        // Get the current date from the value or use default
        const currentDate = value?.date || null;

        // Set initial default value if needed
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
              <Flame className="h-3.5 w-3.5" />
              Due Date (Optional)
            </label>
            <DatePicker
              date={currentDate}
              onSelect={(newDate) =>
                onChange({
                  date: newDate,
                  recurrenceRule: createDailyRRule(),
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
