import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";

interface DaySelectorProps {
  selectedDays: number[];
  toggleDay: (day: number) => void;
  setWeekdaysOnly: () => void;
  setWeekendsOnly: () => void;
}

const DaySelector = ({
  selectedDays,
  toggleDay,
  setWeekdaysOnly,
  setWeekendsOnly,
}: DaySelectorProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium">Repeat on days:</label>
      <div className="space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-xs bg-zinc-700 hover:bg-zinc-600 border-zinc-600"
          onClick={setWeekdaysOnly}
        >
          Weekdays
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-xs bg-zinc-700 hover:bg-zinc-600 border-zinc-600"
          onClick={setWeekendsOnly}
        >
          Weekends
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-7 gap-2">
      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
        <Button
          key={index}
          type="button"
          size="sm"
          variant={selectedDays.includes(index) ? "default" : "outline"}
          className={cn(
            "h-9 w-9 p-0 rounded-full",
            selectedDays.includes(index)
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-zinc-700 hover:bg-zinc-600 border-zinc-600"
          )}
          onClick={() => toggleDay(index)}
        >
          {day}
        </Button>
      ))}
    </div>
  </div>
);

export default DaySelector;
