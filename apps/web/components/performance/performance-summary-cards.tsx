"use client";

import React from "react";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

interface PerformanceSummary {
  averagePercentage: number;
  bestPeriod: {
    percentage: number;
    period: string;
  };
  totalPoints: number;
  activePeriods: number;
}

interface PerformanceSummaryCardsProps {
  summary: PerformanceSummary;
}

export const PerformanceSummaryCards = ({
  summary,
}: PerformanceSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
      <div className="bg-zinc-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Target className="h-3 w-3 text-blue-400" />
          <span className="text-xs text-zinc-400">Average Rate</span>
        </div>
        <p className="text-xl font-bold text-white mt-1">
          {summary?.averagePercentage || 0}%
        </p>
      </div>
      <div className="bg-zinc-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Award className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-zinc-400">Best Period</span>
        </div>
        <p className="text-lg font-semibold text-white mt-1">
          {summary?.bestPeriod?.percentage || 0}%
        </p>
        <p className="text-xs text-zinc-500">
          {summary?.bestPeriod?.period || "N/A"}
        </p>
      </div>
      <div className="bg-zinc-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3 w-3 text-green-400" />
          <span className="text-xs text-zinc-400">Total Points</span>
        </div>
        <p className="text-xl font-bold text-white mt-1">
          {summary?.totalPoints || 0}
        </p>
      </div>
      <div className="bg-zinc-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-purple-400" />
          <span className="text-xs text-zinc-400">Active Periods</span>
        </div>
        <p className="text-xl font-bold text-white mt-1">
          {summary?.activePeriods || 0}
        </p>
      </div>
    </div>
  );
};
