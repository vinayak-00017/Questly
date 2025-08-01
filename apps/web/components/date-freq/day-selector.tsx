import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { CalendarDaysIcon, BriefcaseIcon, HomeIcon } from "lucide-react";

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
}: DaySelectorProps) => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayAbbr = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CalendarDaysIcon className="w-4 h-4 text-blue-400" />
          <label className="text-sm font-semibold text-zinc-200">Repeat on days</label>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "h-8 text-xs px-3 transition-all duration-200",
              "bg-zinc-700/50 hover:bg-blue-600/20 border-zinc-600/50",
              "hover:border-blue-500/50 hover:text-blue-300"
            )}
            onClick={setWeekdaysOnly}
          >
            <BriefcaseIcon className="w-3 h-3 mr-1.5" />
            Weekdays
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "h-8 text-xs px-3 transition-all duration-200",
              "bg-zinc-700/50 hover:bg-green-600/20 border-zinc-600/50",
              "hover:border-green-500/50 hover:text-green-300"
            )}
            onClick={setWeekendsOnly}
          >
            <HomeIcon className="w-3 h-3 mr-1.5" />
            Weekends
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {dayAbbr.map((day, index) => {
          const isSelected = selectedDays.includes(index);
          const isWeekend = index === 0 || index === 6;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <Button
                type="button"
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-12 w-12 p-0 rounded-xl transition-all duration-200 relative overflow-hidden",
                  "border-2 font-semibold text-sm",
                  isSelected
                    ? "bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                    : "bg-zinc-700/50 hover:bg-zinc-600/50 border-zinc-600/50 hover:border-zinc-500/50 text-zinc-300 hover:text-white",
                  isWeekend && !isSelected && "border-orange-600/30 hover:border-orange-500/50"
                )}
                onClick={() => toggleDay(index)}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent" />
                )}
                <span className="relative z-10">{day}</span>
              </Button>
              <span className={cn(
                "text-xs transition-colors duration-200 text-center",
                isSelected ? "text-purple-300 font-medium" : "text-zinc-500",
                isWeekend && !isSelected && "text-orange-400/70"
              )}>
                {dayNames[index].slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>

      {selectedDays.length > 0 && (
        <div className="text-xs text-zinc-400 bg-zinc-800/50 rounded-lg p-3 border border-zinc-600/30">
          <span className="font-medium text-zinc-300">Selected days:</span>{" "}
          {selectedDays.map(day => dayNames[day]).join(", ")}
        </div>
      )}
    </div>
  );
};

export default DaySelector;