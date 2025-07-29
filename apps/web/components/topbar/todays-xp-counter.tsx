import React from "react";
import { Zap } from "lucide-react";
import { UserStats } from "./types";

interface TodaysXpCounterProps {
  userStats: UserStats;
}

export function TodaysXpCounter({ userStats }: TodaysXpCounterProps) {
  return (
    <div className="flex items-center gap-1.5 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border border-yellow-600/20 shadow-inner shadow-yellow-500/5 hover:scale-105 transition-all duration-300">
      <div className="h-6 w-6 flex items-center justify-center bg-yellow-500/20 rounded-full">
        <Zap className="h-3.5 w-3.5 text-yellow-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-400 text-xs leading-tight">
          Today
        </span>
        <span className="text-yellow-200 text-sm font-medium">
          +{userStats.todaysXp} XP
        </span>
      </div>
    </div>
  );
}