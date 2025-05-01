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

interface FrequencyTabProps {
  frequency: FrequencyType;
  setFrequency: (freq: FrequencyType) => void;
  selectedDays: number[];
  setSelectedDays: React.Dispatch<React.SetStateAction<number[]>>;
  selectedDatesOfMonth: number[];
  setSelectedDatesOfMonth: React.Dispatch<React.SetStateAction<number[]>>;
  recurrenceRule?: string;
}

const FrequencyTab = ({
  frequency,
  setFrequency,
  selectedDays,
  setSelectedDays,
  selectedDatesOfMonth,
  setSelectedDatesOfMonth,
  recurrenceRule,
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

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Recurrence Pattern</label>
        <Select
          value={frequency}
          onValueChange={(value) => setFrequency(value as FrequencyType)}
        >
          <SelectTrigger className="bg-zinc-700 border-zinc-600 focus:ring-purple-500">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="once" className="focus:bg-zinc-700">
              Once (No recurrence)
            </SelectItem>
            <SelectItem value="daily" className="focus:bg-zinc-700">
              Daily
            </SelectItem>
            <SelectItem value="weekly" className="focus:bg-zinc-700">
              Weekly
            </SelectItem>
            <SelectItem value="monthly" className="focus:bg-zinc-700">
              Monthly
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequency === "weekly" && (
        <DaySelector
          selectedDays={selectedDays}
          toggleDay={toggleDay}
          setWeekdaysOnly={setWeekdaysOnly}
          setWeekendsOnly={setWeekendsOnly}
        />
      )}

      {frequency === "monthly" && (
        <DateSelector
          selectedDates={selectedDatesOfMonth}
          toggleDate={toggleDate}
        />
      )}

      <div className="pt-2 text-sm text-zinc-400">
        {recurrenceRule ? (
          <div className="flex items-center overflow-hidden">
            <span className="mr-1 flex-shrink-0">Pattern:</span>
            <span className="font-medium text-white truncate">
              {getHumanReadableRRule(recurrenceRule)}
            </span>
          </div>
        ) : (
          <div>No recurrence pattern</div>
        )}
      </div>
    </div>
  );
};

export default FrequencyTab;
