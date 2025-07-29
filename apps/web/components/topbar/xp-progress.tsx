import React from "react";
import { UserStats } from "./types";

interface XpProgressProps {
  userStats: UserStats;
}

export function XpProgress({ userStats }: XpProgressProps) {
  return (
    <div className="flex flex-col justify-center w-36">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-400">XP</span>
        <span className="text-amber-500/90">
          {userStats.levelStats.currentLevelXp}/
          {userStats.levelStats.xpForThisLevel}
        </span>
      </div>
      <div className="w-full bg-zinc-800/70 h-1.5 rounded-full overflow-hidden shadow-inner shadow-black/40">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 relative progress-bar"
          style={{
            width: `${userStats.levelStats.progressPercent}%`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 bottom-0 shimmer"></div>
        </div>
      </div>
    </div>
  );
}