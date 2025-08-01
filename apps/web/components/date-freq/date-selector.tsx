import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, HashIcon } from "lucide-react";

interface DateSelectorProps {
  selectedDates: number[];
  toggleDate: (date: number) => void;
}

const DateSelector = ({ selectedDates, toggleDate }: DateSelectorProps) => {
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="w-4 h-4 text-orange-400" />
        <label className="text-sm font-semibold text-zinc-200">Repeat on dates</label>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
          const isSelected = selectedDates.includes(date);
          const isSpecialDate = date === 1 || date === 15 || date === 31;
          
          return (
            <Button
              key={date}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-10 w-10 p-0 rounded-xl text-xs font-medium transition-all duration-200 relative overflow-hidden",
                "border-2",
                isSelected
                  ? "bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                  : "bg-zinc-700/50 hover:bg-zinc-600/50 border-zinc-600/50 hover:border-zinc-500/50 text-zinc-300 hover:text-white",
                isSpecialDate && !isSelected && "border-orange-600/30 hover:border-orange-500/50"
              )}
              onClick={() => toggleDate(date)}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent" />
              )}
              <span className="relative z-10">{date}</span>
            </Button>
          );
        })}
      </div>

      {/* Quick selection buttons */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-zinc-300">Quick select:</div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "h-8 text-xs px-3 transition-all duration-200",
              "bg-zinc-700/50 hover:bg-orange-600/20 border-zinc-600/50",
              "hover:border-orange-500/50 hover:text-orange-300"
            )}
            onClick={() => toggleDate(1)}
          >
            <HashIcon className="w-3 h-3 mr-1.5" />
            1st of month
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "h-8 text-xs px-3 transition-all duration-200",
              "bg-zinc-700/50 hover:bg-orange-600/20 border-zinc-600/50",
              "hover:border-orange-500/50 hover:text-orange-300"
            )}
            onClick={() => toggleDate(15)}
          >
            <HashIcon className="w-3 h-3 mr-1.5" />
            15th of month
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "h-8 text-xs px-3 transition-all duration-200",
              "bg-zinc-700/50 hover:bg-orange-600/20 border-zinc-600/50",
              "hover:border-orange-500/50 hover:text-orange-300"
            )}
            onClick={() => toggleDate(31)}
          >
            <HashIcon className="w-3 h-3 mr-1.5" />
            Last day of month
          </Button>
        </div>
      </div>

      {selectedDates.length > 0 && (
        <div className="text-xs text-zinc-400 bg-zinc-800/50 rounded-lg p-3 border border-zinc-600/30">
          <span className="font-medium text-zinc-300">Selected dates:</span>{" "}
          {selectedDates
            .sort((a, b) => a - b)
            .map(date => `${date}${getOrdinalSuffix(date)}`)
            .join(", ")}
        </div>
      )}
    </div>
  );
};

export default DateSelector;