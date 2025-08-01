import { getHumanReadableRRule } from "@/lib/rrule-utils";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FrequencyType } from "./recurrence-picker";
import DaySelector from "./day-selector";
import DateSelector from "./date-selector";
import { ClockIcon, CalendarDaysIcon, RepeatIcon, CalendarIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface FrequencyTabProps {
  frequency: FrequencyType;
  setFrequency: (freq: FrequencyType) => void;
  selectedDays: number[];
  setSelectedDays: React.Dispatch<React.SetStateAction<number[]>>;
  selectedDatesOfMonth: number[];
  setSelectedDatesOfMonth: React.Dispatch<React.SetStateAction<number[]>>;
  recurrenceRule?: string;
  date?: Date;
}

const FrequencyTab = ({
  frequency,
  setFrequency,
  selectedDays,
  setSelectedDays,
  selectedDatesOfMonth,
  setSelectedDatesOfMonth,
  recurrenceRule,
  date,
}: FrequencyTabProps) => {
  // Toggle a day selection for weekly recurrence
  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  // Toggle a date selection for monthly recurrence
  const toggleDate = (date: number) => {
    setSelectedDatesOfMonth((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date].sort((a, b) => a - b)
    );
  };

  // Set common recurrence patterns
  const setWeekdaysOnly = () => setSelectedDays([1, 2, 3, 4, 5]);
  const setWeekendsOnly = () => setSelectedDays([0, 6]);

  // Get preview text based on frequency
  const getPreviewText = () => {
    const dueDateText = date ? ` till ${format(date, "MMM d, yyyy")}` : "";
    
    if (frequency === "once") {
      return date ? `Task will run once on ${format(date, "MMM d, yyyy")}` : "Task will run only once";
    }
    
    if (recurrenceRule) {
      return getHumanReadableRRule(recurrenceRule) + dueDateText;
    }
    
    // Fallback preview based on frequency when no rule is set yet
    switch (frequency) {
      case "daily":
        return `Task will repeat every day${dueDateText}`;
      case "weekly":
        if (selectedDays.length === 0) {
          return "Select days for weekly recurrence";
        }
        return `Task will repeat on selected days${dueDateText}`;
      case "monthly":
        if (selectedDatesOfMonth.length === 0) {
          return "Select dates for monthly recurrence";
        }
        return `Task will repeat on selected dates${dueDateText}`;
      default:
        return "No recurrence pattern set";
    }
  };

  const hasValidPattern = () => {
    if (frequency === "once") return true;
    if (frequency === "daily") return true;
    if (frequency === "weekly") return selectedDays.length > 0;
    if (frequency === "monthly") return selectedDatesOfMonth.length > 0;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Frequency Selection */}
      <div className="px-6 pt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <RepeatIcon className="w-4 h-4 text-purple-400" />
          <label className="text-sm font-semibold text-zinc-200">Recurrence Pattern</label>
        </div>
        
        <Select
          value={frequency}
          onValueChange={(value) => setFrequency(value as FrequencyType)}
        >
          <SelectTrigger className={cn(
            "w-full h-11 bg-gradient-to-r from-zinc-700/80 to-zinc-600/80 border-zinc-500/50",
            "focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50",
            "transition-all duration-200 backdrop-blur-sm",
            "hover:from-zinc-600/80 hover:to-zinc-500/80 text-left"
          )}>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800/95 border-zinc-600/50 backdrop-blur-md rounded-xl">
            <SelectItem 
              value="once" 
              className="focus:bg-zinc-700/80 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 py-1">
                <ClockIcon className="w-4 h-4 text-zinc-400" />
                <span>Once (No recurrence)</span>
              </div>
            </SelectItem>
            <SelectItem 
              value="daily" 
              className="focus:bg-zinc-700/80 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 py-1">
                <RepeatIcon className="w-4 h-4 text-green-400" />
                <span>Daily</span>
              </div>
            </SelectItem>
            <SelectItem 
              value="weekly" 
              className="focus:bg-zinc-700/80 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 py-1">
                <CalendarDaysIcon className="w-4 h-4 text-blue-400" />
                <span>Weekly</span>
              </div>
            </SelectItem>
            <SelectItem 
              value="monthly" 
              className="focus:bg-zinc-700/80 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 py-1">
                <CalendarIcon className="w-4 h-4 text-orange-400" />
                <span>Monthly</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional Selectors */}
      {frequency === "weekly" && (
        <div className="px-6 animate-in slide-in-from-top-2 duration-300">
          <DaySelector
            selectedDays={selectedDays}
            toggleDay={toggleDay}
            setWeekdaysOnly={setWeekdaysOnly}
            setWeekendsOnly={setWeekendsOnly}
          />
        </div>
      )}

      {frequency === "monthly" && (
        <div className="px-6 animate-in slide-in-from-top-2 duration-300">
          <DateSelector
            selectedDates={selectedDatesOfMonth}
            toggleDate={toggleDate}
          />
        </div>
      )}

      {/* Pattern Preview */}
      <div className="px-6 pb-6">
        <div className={cn(
          "p-4 rounded-xl border transition-all duration-200",
          hasValidPattern() && frequency !== "once"
            ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30" 
            : frequency === "once"
            ? "bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30"
            : "bg-zinc-800/50 border-zinc-600/30"
        )}>
          <div className="flex items-start space-x-3">
            <div className={cn(
              "w-2 h-2 rounded-full mt-2 transition-colors duration-200",
              hasValidPattern() && frequency !== "once"
                ? "bg-purple-500 animate-pulse" 
                : frequency === "once"
                ? "bg-green-500"
                : "bg-zinc-500"
            )} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <InfoIcon className="w-3 h-3 text-zinc-400" />
                <div className="text-xs font-medium text-zinc-300">
                  Pattern Preview
                </div>
              </div>
              <div className={cn(
                "text-sm font-medium",
                hasValidPattern() 
                  ? frequency === "once" 
                    ? "text-green-300" 
                    : "text-white"
                  : "text-zinc-400"
              )}>
                {getPreviewText()}
              </div>
              
              {/* Additional info for incomplete patterns */}
              {!hasValidPattern() && frequency !== "once" && (
                <div className="text-xs text-amber-400 mt-1">
                  {frequency === "weekly" && "Please select at least one day"}
                  {frequency === "monthly" && "Please select at least one date"}
                </div>
              )}
              
              {/* Due date info when no due date is set */}
              {hasValidPattern() && !date && frequency !== "once" && (
                <div className="text-xs text-blue-400 mt-1">
                  💡 Set a due date to limit when this pattern ends
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyTab;