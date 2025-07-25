import React from "react";
import { cn } from "@/lib/utils";
import { ViewType } from "../types";

interface DateHeadersProps {
  dateRange: Date[];
  selectedView: ViewType;
}

export const DateHeaders: React.FC<DateHeadersProps> = ({
  dateRange,
  selectedView,
}) => {
  return (
    <div className="flex">
      <div className="w-48 flex-shrink-0"></div> {/* Space for quest names */}
      <div
        className={cn(
          "flex gap-1",
          selectedView === "week" ? "max-w-md" : "flex-1"
        )}
      >
        {dateRange.map((date) => {
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div
              key={date.toISOString()}
              className={cn(
                "flex flex-col items-center",
                selectedView === "week"
                  ? "w-12" // Fixed width for week view
                  : "flex-1 min-w-0 max-w-8" // Flexible for month view
              )}
            >
              {selectedView === "week" && (
                <div
                  className={cn(
                    "text-xs font-medium mb-1",
                    isToday ? "text-amber-400" : "text-slate-400"
                  )}
                >
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>
              )}
              <div
                className={cn(
                  "text-xs",
                  isToday ? "text-amber-400" : "text-slate-500"
                )}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
          </div>
  );
};