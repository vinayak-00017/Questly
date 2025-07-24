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
      {/* Week view: Add extra content in remaining space */}
      {selectedView === "week" && (
        <div className="flex-1 pl-8">
          <div className="bg-slate-800/30 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-800/50 border border-slate-700 rounded-sm"></div>
                <span className="text-slate-400">No Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-600/50 border border-slate-500 rounded-sm"></div>
                <span className="text-slate-400">Attempted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400 rounded-sm"></div>
                <span className="text-slate-400">Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-sky-500 to-blue-600 border border-sky-400 rounded-sm"></div>
                <span className="text-slate-400">Side</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};