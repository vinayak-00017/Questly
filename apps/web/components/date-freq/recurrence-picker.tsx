"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ClockIcon, RepeatIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createDailyRRule,
  createWeeklyRRule,
  getHumanReadableRRule,
} from "@/lib/rrule-utils";

// Types
export type FrequencyType = "once" | "daily" | "weekly" | "monthly";

interface RecurrencePickerProps {
  date?: Date;
  onDateSelect: (date: Date | undefined) => void;
  recurrenceRule?: string;
  onRecurrenceSelect: (rule: string | undefined) => void;
  className?: string;
}

export function RecurrencePicker({
  date,
  onDateSelect,
  recurrenceRule,
  onRecurrenceSelect,
  className,
}: RecurrencePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localDate, setLocalDate] = useState<Date | undefined>(date);
  const [localFrequency, setLocalFrequency] = useState<string>(
    recurrenceRule ? getFrequencyFromRule(recurrenceRule) : "once"
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    recurrenceRule ? getSelectedDaysFromRule(recurrenceRule) : []
  );

  // Helper function to extract frequency type from recurrence rule
  function getFrequencyFromRule(rule: string): string {
    if (!rule) return "once";
    if (rule === "FREQ=DAILY") return "daily";
    if (rule.startsWith("FREQ=WEEKLY")) return "weekly";
    return "once";
  }

  // Helper function to extract selected days from weekly recurrence rule
  function getSelectedDaysFromRule(rule: string): number[] {
    if (!rule || !rule.startsWith("FREQ=WEEKLY")) return [];

    const match = rule.match(/BYDAY=([A-Z,]+)/);
    if (!match) return [];

    const dayMap: Record<string, number> = {
      SU: 0,
      MO: 1,
      TU: 2,
      WE: 3,
      TH: 4,
      FR: 5,
      SA: 6,
    };

    return match[1]
      .split(",")
      .map((day) => dayMap[day])
      .filter((day) => day !== undefined);
  }

  // Handle frequency change and generate appropriate rule
  const handleFrequencyChange = (frequency: string) => {
    setLocalFrequency(frequency);

    let newRule: string | undefined;
    switch (frequency) {
      case "once":
        newRule = undefined;
        break;
      case "daily":
        newRule = createDailyRRule();
        break;
      case "weekly":
        // Use current selected days, or default to Monday if none selected
        const daysToUse = selectedDays.length > 0 ? selectedDays : [1];
        newRule = createWeeklyRRule(daysToUse);
        break;
      default:
        newRule = undefined;
    }

    onRecurrenceSelect(newRule);
  };

  // Handle day selection for weekly recurrence
  const handleDayToggle = (dayIndex: number) => {
    const newSelectedDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((d) => d !== dayIndex)
      : [...selectedDays, dayIndex].sort();

    setSelectedDays(newSelectedDays);

    // If we're in weekly mode, update the rule immediately
    if (localFrequency === "weekly" && newSelectedDays.length > 0) {
      const newRule = createWeeklyRRule(newSelectedDays);
      onRecurrenceSelect(newRule);
    }
  };

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setLocalDate(newDate);
    onDateSelect(newDate);
  };

  // Handle dialog close
  const handleClose = () => {
    setIsOpen(false);
  };

  // Get preview text for current settings
  const getPreviewText = () => {
    switch (localFrequency) {
      case "daily":
        return "This will repeat daily";
      case "weekly":
        if (selectedDays.length === 0)
          return "Select days for weekly recurrence";
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const selectedDayNames = selectedDays.map((d) => dayNames[d]);
        return `This will repeat every ${selectedDayNames.join(", ")}`;
      default:
        return `This will be a ${localFrequency} task`;
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[320px] justify-start text-left font-normal group relative overflow-hidden",
                  "bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border-zinc-600/80 text-white",
                  "hover:from-zinc-800/90 hover:to-zinc-700/90 hover:border-purple-500/50",
                  "transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/10",
                  "backdrop-blur-sm border-2",
                  recurrenceRule &&
                    "border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-zinc-900/90",
                  className
                )}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center w-full overflow-hidden relative z-10">
                  <div className="flex items-center mr-3">
                    {recurrenceRule ? (
                      <div className="relative">
                        <RepeatIcon className="h-4 w-4 text-purple-400 animate-pulse" />
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-75" />
                      </div>
                    ) : (
                      <ClockIcon className="h-4 w-4 text-zinc-400 group-hover:text-purple-400 transition-colors duration-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          recurrenceRule ? "text-white" : "text-zinc-300"
                        )}
                      >
                        {recurrenceRule
                          ? getHumanReadableRRule(recurrenceRule, true)
                          : "One-time task"}
                      </span>
                      {(date || localDate) && (
                        <span className="text-xs text-zinc-400 truncate">
                          {recurrenceRule ? "Until" : "Due"}{" "}
                          {format(date || localDate!, "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="ml-2 flex-shrink-0">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        recurrenceRule
                          ? "bg-purple-500 shadow-lg shadow-purple-500/50"
                          : "bg-zinc-500 group-hover:bg-purple-400"
                      )}
                    />
                  </div>
                </div>
              </Button>
            </TooltipTrigger>
          </DialogTrigger>

          <TooltipContent
            side="left"
            className="bg-zinc-900/95 border-zinc-600 text-white shadow-xl rounded-lg backdrop-blur-sm"
          >
            {recurrenceRule
              ? getHumanReadableRRule(recurrenceRule, true) +
                (date || localDate
                  ? ` till ${format(date || localDate!, "MMM d, yyyy")}`
                  : "")
              : "One-time task"}
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[500px] p-0 bg-gradient-to-b from-zinc-900/98 to-zinc-800/98 border-zinc-600/50 text-white shadow-2xl backdrop-blur-md border-2 max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5" />

            {/* Custom Header - Fixed */}
            <DialogHeader className="relative z-10 bg-gradient-to-r from-zinc-800/90 via-zinc-700/90 to-zinc-800/90 p-5 border-b border-zinc-600/30 flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center space-x-3 text-lg font-semibold text-zinc-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span>Schedule Settings</span>
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-zinc-700/50 rounded-lg"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto relative z-10">
              <div className="p-6 space-y-6">
                {/* Frequency Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <RepeatIcon className="h-4 w-4" />
                    Frequency
                  </label>
                  <Select
                    value={localFrequency}
                    onValueChange={handleFrequencyChange}
                  >
                    <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-600">
                      <SelectItem value="once">One-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">
                        Weekly (Custom Days)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Day Selection for Weekly */}
                {localFrequency === "weekly" && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-300">
                      Select Days
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day, index) => (
                          <Button
                            key={day}
                            variant={
                              selectedDays.includes(index)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={cn(
                              "h-10 text-xs font-medium transition-all duration-200",
                              selectedDays.includes(index)
                                ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
                                : "bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 border-zinc-600/50"
                            )}
                            onClick={() => handleDayToggle(index)}
                          >
                            {day}
                          </Button>
                        )
                      )}
                    </div>
                    {selectedDays.length === 0 && (
                      <p className="text-xs text-amber-400">
                        Please select at least one day
                      </p>
                    )}
                  </div>
                )}

                {/* Date Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {localFrequency === "once" ? "Due Date" : "End Date"}
                  </label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={localDate}
                      onSelect={handleDateChange}
                      initialFocus
                      className="rounded-xl bg-zinc-800/50 border border-zinc-600/30 backdrop-blur-sm"
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </div>
                </div>

                {/* Preview */}
                {(recurrenceRule || localFrequency !== "once") && (
                  <div className="space-y-2 p-4 bg-zinc-800/30 rounded-lg border border-zinc-600/30">
                    <h4 className="text-sm font-medium text-zinc-300">
                      Preview:
                    </h4>
                    <p className="text-sm text-zinc-400">
                      {recurrenceRule
                        ? getHumanReadableRRule(recurrenceRule, true)
                        : getPreviewText()}
                      {(date || localDate) &&
                        ` starting ${format(date || localDate!, "MMM d, yyyy")}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="relative z-10 p-4 bg-gradient-to-r from-zinc-800/90 to-zinc-700/90 border-t border-zinc-600/30 flex-shrink-0">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="bg-zinc-700/50 border-zinc-600/50 text-zinc-300 hover:bg-zinc-600/50"
                >
                  Cancel
                </Button>
                <Button
                  className={cn(
                    "bg-gradient-to-r from-purple-600 to-purple-700",
                    "hover:from-purple-700 hover:to-purple-800",
                    "shadow-lg hover:shadow-xl transition-all duration-300",
                    "border border-purple-500/30 hover:border-purple-400/50"
                  )}
                  onClick={handleClose}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
