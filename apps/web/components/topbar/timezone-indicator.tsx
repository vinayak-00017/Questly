import React from "react";
import { Clock } from "lucide-react";
import { formatTimezone } from "./utils";
import { UserStats } from "./types";

interface TimezoneIndicatorProps {
  userStats: UserStats;
}

export function TimezoneIndicator({ userStats }: TimezoneIndicatorProps) {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border border-zinc-600/20 shadow-inner shadow-zinc-500/5 hover:scale-105 transition-all duration-300">
      <div className="h-5 w-5 flex items-center justify-center bg-zinc-500/20 rounded-full">
        <Clock className="h-3 w-3 text-zinc-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-400 text-xs leading-tight">
          Timezone
        </span>
        <span className="text-zinc-300 text-sm font-medium">
          {formatTimezone(userStats.timezone)}
        </span>
      </div>
    </div>
  );
}