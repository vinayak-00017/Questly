import React from "react";
import { UserStats, StreakDisplay } from "./types";

interface StreakCounterProps {
  userStats: UserStats;
  streakDisplay: StreakDisplay;
}

export function StreakCounter({ userStats, streakDisplay }: StreakCounterProps) {
  return (
    <div
      className={`flex items-center gap-2.5 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border ${streakDisplay.borderColor} shadow-inner shadow-orange-500/5 hover:scale-105 transition-all duration-300 relative`}
    >
      <div
        className={`h-6 w-6 flex items-center justify-center ${streakDisplay.bgColor} rounded-full`}
      >
        <span className="text-xs">{streakDisplay.icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-400 text-xs leading-tight">
          {userStats.streak > 0 ? "Streak" : "No Streak"}
        </span>
        <span
          className={`text-sm font-medium ${streakDisplay.color}`}
        >
          {streakDisplay.text}
        </span>
      </div>
      
      {/* Active today indicator */}
      {userStats.isActiveToday && userStats.streak > 0 && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">✓</span>
        </div>
      )}
      
      {/* Milestone indicator for 7+ day streaks */}
      {userStats.streak >= 7 && !userStats.isActiveToday && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">★</span>
        </div>
      )}
    </div>
  );
}