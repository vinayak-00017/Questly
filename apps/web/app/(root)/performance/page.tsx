"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import { getLocalDateMidnight } from "@questly/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PerformanceBarChart,
  PerformanceSummaryCards,
  PerformanceTable,
  PerformanceHeader,
  PeriodType,
  PeriodOption,
  PerformanceApiResponse,
} from "@/components/performance";

const PerformancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");

  // Get user timezone for proper date handling
  const { data: userStatsData } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => data.userStats,
  });
  const userTimezone = userStatsData?.timezone || "UTC";

  const {
    data: performanceData,
    isLoading,
    error,
  } = useQuery<PerformanceApiResponse>({
    queryKey: ["tablePerformance", selectedPeriod],
    queryFn: () => userApi.getTablePerformance(selectedPeriod),
    enabled: true,
  });

  // Sort performance data in descending order (most recent first) with timezone awareness
  const sortedPerformanceData = performanceData?.performanceData
    ? [...performanceData.performanceData].sort((a, b) => {
        // Use timezone-aware date parsing for proper sorting
        const dateA = getLocalDateMidnight(
          new Date(a.date + "T00:00:00"),
          userTimezone
        );
        const dateB = getLocalDateMidnight(
          new Date(b.date + "T00:00:00"),
          userTimezone
        );
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  const periodOptions: PeriodOption[] = [
    { value: "daily", label: "Daily View", description: "Last 12 days" },
    { value: "weekly", label: "Weekly View", description: "Last 12 weeks" },
    { value: "monthly", label: "Monthly View", description: "Last 12 months" },
    { value: "yearly", label: "Yearly View", description: "Last 12 years" },
  ];

  return (
    <div className="space-y-4 mx-8 mt-4">
      <PerformanceHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        periodOptions={periodOptions}
      />

      {/* Performance Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="h-40 bg-zinc-800 rounded-lg animate-pulse" />
          ) : sortedPerformanceData.length > 0 ? (
            <PerformanceBarChart
              data={[...sortedPerformanceData].reverse()}
              selectedPeriod={selectedPeriod}
            />
          ) : (
            <div className="h-40 flex items-center justify-center text-zinc-400 text-sm">
              No data available for chart
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-24 bg-zinc-800" />
                  <Skeleton className="h-4 w-16 bg-zinc-800" />
                  <Skeleton className="h-4 w-20 bg-zinc-800" />
                  <Skeleton className="h-4 w-24 bg-zinc-800" />
                  <Skeleton className="h-4 w-16 bg-zinc-800" />
                </div>
              ))}
            </div>
          ) : performanceData?.performanceData &&
            performanceData.performanceData.length > 0 ? (
            <>
              {/* Summary Stats */}
              <PerformanceSummaryCards summary={performanceData.summary} />

              {/* Performance Table */}
              <PerformanceTable
                data={sortedPerformanceData}
                selectedPeriod={selectedPeriod}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No performance data available</p>
              <p className="text-zinc-500 text-sm mt-1">
                Start completing quests to see your performance analytics
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformancePage;
