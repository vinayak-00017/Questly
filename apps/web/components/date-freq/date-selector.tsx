import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDates: number[];
  toggleDate: (date: number) => void;
}

const DateSelector = ({ selectedDates, toggleDate }: DateSelectorProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">Repeat on dates:</label>
    <div className="grid grid-cols-7 gap-1 max-w-[300px]">
      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
        <Button
          key={date}
          type="button"
          size="sm"
          variant={selectedDates.includes(date) ? "default" : "outline"}
          className={cn(
            "h-8 w-8 p-0 rounded-full text-xs",
            selectedDates.includes(date)
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-zinc-700 hover:bg-zinc-600 border-zinc-600"
          )}
          onClick={() => toggleDate(date)}
        >
          {date}
        </Button>
      ))}
    </div>
  </div>
);

export default DateSelector;
