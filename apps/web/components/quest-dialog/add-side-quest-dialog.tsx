"use client";

import { Compass, Map, CalendarDays } from "lucide-react";
import { BaseQuestDialog } from "../base-quest-dialog";
import { RecurrencePicker } from "../date-freq/recurrence-picker";
import { useTopbarData } from "../topbar/hooks/use-topbar-data";
import { getTodayMidnight } from "@questly/utils";

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
  const { userStats } = useTopbarData();
  const userTimezone = userStats.timezone;
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
        const currentDate = value?.date || undefined;
        const { userStats } = useTopbarData();
        const userTimezone = userStats.timezone;

        if (!value) {
          // Set initial default value on component mount - once with today's date
          setTimeout(() => {
            onChange({
              date: getTodayMidnight(userTimezone),
              recurrenceRule: undefined,
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
