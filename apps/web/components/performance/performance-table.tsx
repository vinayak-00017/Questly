"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PerformanceData {
  day: string;
  date: string;
  percentage: number;
  completedPoints: number;
  totalPossiblePoints: number;
  questsCount: number;
  completedQuestsCount: number;
}

interface PerformanceTableProps {
  data: PerformanceData[];
  selectedPeriod: string;
}

export const PerformanceTable = ({
  data,
  selectedPeriod,
}: PerformanceTableProps) => {
  const router = useRouter();

  const getCompletionRateColor = (percentage: number) => {
    if (percentage >= 75)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (percentage >= 50)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (percentage >= 25)
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getStreakIcon = (percentage: number) => {
    if (percentage === 100) return "🔥";
    if (percentage >= 75) return "⭐";
    if (percentage >= 50) return "📈";
    return "📊";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPeriodLabel = (
    item: PerformanceData,
    index: number,
    period: string,
    sortedData: PerformanceData[]
  ) => {
    switch (period) {
      case "daily":
        const date = new Date(item.date + "T00:00:00");
        return date.toLocaleDateString("en-US", { weekday: "short" });
      case "weekly":
        const weekNumber = sortedData.length - index;
        return `Week ${weekNumber}`;
      case "monthly":
        const monthDate = new Date(item.date + "T00:00:00");
        return monthDate.toLocaleDateString("en-US", { month: "short" });
      case "yearly":
        const yearDate = new Date(item.date + "T00:00:00");
        return yearDate.getFullYear().toString();
      default:
        const defaultDate = new Date(item.date + "T00:00:00");
        return defaultDate.toLocaleDateString("en-US", { weekday: "short" });
    }
  };

  const handleRowClick = useCallback(
    (item: PerformanceData) => {
      const date = item.date;
      const label = item.day;
      router.push(
        `/performance/${date}?period=${selectedPeriod}&label=${encodeURIComponent(label)}`
      );
    },
    [router, selectedPeriod]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
          <TableHead className="text-zinc-300">Period</TableHead>
          <TableHead className="text-zinc-300">Date</TableHead>
          <TableHead className="text-zinc-300">Completion Rate</TableHead>
          <TableHead className="text-zinc-300">Quests</TableHead>
          <TableHead className="text-zinc-300">Points</TableHead>
          <TableHead className="text-zinc-300">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: PerformanceData, index: number) => (
          <TableRow
            key={`${item.date}-${index}`}
            className="border-zinc-700 hover:bg-zinc-800/50 transition-colors cursor-pointer"
            onClick={() => handleRowClick(item)}
          >
            <TableCell className="font-medium text-white py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {getStreakIcon(item.percentage)}
                </span>
                {getPeriodLabel(item, index, selectedPeriod, data)}
              </div>
            </TableCell>
            <TableCell className="text-zinc-400 py-2 text-sm">
              {formatDate(item.date)}
            </TableCell>
            <TableCell className="py-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`font-mono text-xs ${getCompletionRateColor(item.percentage)}`}
                >
                  {item.percentage}%
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-zinc-300 py-2">
              <div className="text-xs">
                <span className="font-medium">{item.completedQuestsCount}</span>
                <span className="text-zinc-400">/{item.questsCount}</span>
              </div>
            </TableCell>
            <TableCell className="text-zinc-300 py-2">
              <div className="text-xs">
                <span className="font-medium text-green-400">
                  {item.completedPoints}
                </span>
                <span className="text-zinc-400">
                  /{item.totalPossiblePoints}
                </span>
              </div>
            </TableCell>
            <TableCell className="py-2">
              {item.percentage === 100 ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Perfect
                </Badge>
              ) : item.percentage >= 75 ? (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  Excellent
                </Badge>
              ) : item.percentage >= 50 ? (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  Good
                </Badge>
              ) : item.percentage >= 25 ? (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                  Improving
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                  Needs Focus
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
