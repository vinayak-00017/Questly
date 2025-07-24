import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ViewType, QuestActivityData } from "../types";

interface QuestActivityGridProps {
  dateRange: Date[];
  selectedView: ViewType;
  questId: string;
  questType: "daily" | "side";
  getQuestActivity: (questId: string, date: Date) => QuestActivityData | null;
  questIndex: number;
}

export const QuestActivityGrid: React.FC<QuestActivityGridProps> = ({
  dateRange,
  selectedView,
  questId,
  questType,
  getQuestActivity,
  questIndex,
}) => {
  return (
    <div
      className={cn(
        "flex gap-1",
        selectedView === "week" ? "max-w-md" : "flex-1"
      )}
    >
      {dateRange.map((date, dateIndex) => {
        const activity = getQuestActivity(questId, date);
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: questIndex * 0.05 + dateIndex * 0.01,
            }}
            className={cn(
              "relative group cursor-pointer transition-all duration-200 rounded-sm",
              selectedView === "week"
                ? "w-12 h-8" // Fixed larger size for week view
                : "flex-1 min-w-0 max-w-8 h-5" // Flexible for month view
            )}
            title={`${date.toLocaleDateString()} - ${
              activity
                ? activity.completed
                  ? `Completed (+${activity.xpEarned} XP)`
                  : "Attempted"
                : "No activity"
            }`}
          >
            <div
              className={cn(
                "w-full h-full rounded-sm transition-all duration-200 hover:scale-105 border",
                activity
                  ? activity.completed
                    ? questType === "daily"
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 shadow-amber-500/20 shadow-sm"
                      : "bg-gradient-to-br from-sky-500 to-blue-600 border-sky-400 shadow-sky-500/20 shadow-sm"
                    : "bg-slate-600/50 border-slate-500"
                  : "bg-slate-800/50 border-slate-700",
                isToday && "ring-2 ring-white/40"
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
};