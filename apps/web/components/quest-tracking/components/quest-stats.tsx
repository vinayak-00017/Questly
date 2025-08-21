import React, { memo } from "react";
import { ViewType, QuestActivityData } from "../types";
import { calculateQuestStreak } from "../utils";

interface QuestStatsProps {
  selectedView: ViewType;
  dateRange: Date[];
  questId: string;
  getQuestActivity: (questId: string, date: Date) => QuestActivityData | null;
}

export const QuestStats: React.FC<QuestStatsProps> = memo(
  ({ selectedView, dateRange, questId, getQuestActivity }) => {
    if (selectedView !== "week") return null;

    const weekActivities = dateRange.map((date) =>
      getQuestActivity(questId, date)
    );
    const completed = weekActivities.filter((a) => a?.completed).length;
    const totalXp = weekActivities.reduce(
      (sum, a) => sum + (a?.xpEarned || 0),
      0
    );
    const currentStreak = calculateQuestStreak(questId, getQuestActivity);

    return (
      <div className="flex-1 pl-8">
        <div className="text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-medium">
              {completed}/{dateRange.length}
            </span>
            <span>{totalXp > 0 && `${totalXp} XP`}</span>
            {completed === dateRange.length ? (
              <span className="text-amber-400 font-medium">
                Perfect Week! 🔥🔥
              </span>
            ) : completed >= dateRange.length - 2 ? (
              <span className="text-amber-400 font-medium">
                Almost Perfect Week! 🔥
              </span>
            ) : null}
            {currentStreak >= 2 && (
              <span className="text-orange-400 font-medium ml-auto">
                🔥 {currentStreak}x streak
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

QuestStats.displayName = "QuestStats";
