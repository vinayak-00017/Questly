"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import {
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PerformanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = params.date as string;
  const period = searchParams.get("period") || "daily";
  const label = searchParams.get("label") || date;

  // For now, we'll fetch the period data and find the specific date
  // Later you might want to create a specific endpoint for detailed day/period data
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ["performance-detail", date, period],
    queryFn: () =>
      userApi.getPerformance(period === "daily" ? "weekly" : period),
  });

  // Fetch detailed quest data for the specific date
  const { data: questDetails, isLoading: questsLoading } = useQuery({
    queryKey: ["quest-details", date],
    queryFn: () => userApi.getQuestDetails(date),
  });

  const specificDayData = performanceData?.performanceData?.find(
    (item: any) => item.date === date
  );

  if (isLoading || questsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-amber-400 hover:bg-amber-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center text-zinc-400">
          Loading detailed performance data...
        </div>
      </div>
    );
  }

  const completionPercentage =
    questDetails?.completionPercentage || specificDayData?.percentage || 0;
  const completedPoints =
    questDetails?.completedPoints || specificDayData?.completedPoints || 0;
  const totalPoints =
    questDetails?.totalPoints || specificDayData?.totalPossiblePoints || 0;
  const questsCompleted =
    questDetails?.completedQuests || specificDayData?.completedQuestsCount || 0;
  const totalQuests =
    questDetails?.totalQuests || specificDayData?.questsCount || 0;

  const categoryStats =
    questDetails?.quests?.reduce((acc: any, quest: any) => {
      if (!acc[quest.category]) {
        acc[quest.category] = { total: 0, completed: 0, points: 0 };
      }
      acc[quest.category].total++;
      if (quest.completed) {
        acc[quest.category].completed++;
        acc[quest.category].points += quest.points;
      }
      return acc;
    }, {}) || {};

  // Sort quests: completed first (by points descending), then incompleted (by points descending)
  let sortedQuests: any[] = [];
  if (questDetails?.quests) {
    const completed = questDetails.quests
      .filter((q: any) => q.completed)
      .sort((a: any, b: any) => b.points - a.points);
    const incompleted = questDetails.quests
      .filter((q: any) => !q.completed)
      .sort((a: any, b: any) => b.points - a.points);
    sortedQuests = [...completed, ...incompleted];
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-amber-400 hover:bg-amber-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-amber-400 font-medieval">
              Performance Details
            </h1>
            <p className="text-zinc-400 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {label} • {date}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">
            {completionPercentage}%
          </div>
          <p className="text-sm text-zinc-400">Completion Rate</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {questsCompleted}/{totalQuests}
            </div>
            <p className="text-xs text-zinc-400">Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {completedPoints}/{totalPoints}
            </div>
            <p className="text-xs text-zinc-400">Earned</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalQuests > 0
                ? Math.round((completedPoints / totalPoints) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-zinc-400">Point Efficiency</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Object.keys(categoryStats).length}
            </div>
            <p className="text-xs text-zinc-400">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="bg-black/20 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-400">Category Performance</CardTitle>
          <CardDescription className="text-zinc-400">
            Breakdown by quest category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryStats).map(
              ([category, stats]: [string, any]) => (
                <div
                  key={category}
                  className="p-4 rounded-lg border border-zinc-700 bg-black/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{category}</h3>
                    <Badge
                      variant="outline"
                      className="text-amber-400 border-amber-400/30"
                    >
                      {stats.completed}/{stats.total}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-zinc-400">
                      Completion:{" "}
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </div>
                    <div className="text-sm text-zinc-400">
                      Points: {stats.points}
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(stats.completed / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Quest List */}
      <Card className="bg-black/20 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-400">Quest Details</CardTitle>
          <CardDescription className="text-zinc-400">
            All quests for this period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedQuests?.map((quest: any) => (
              <div
                key={quest.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  quest.completed
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-zinc-700 bg-black/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      quest.completed
                        ? "border-green-500 bg-green-500"
                        : "border-zinc-600"
                    }`}
                  >
                    {quest.completed && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        quest.completed ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {quest.title}
                    </h4>
                    <p className="text-sm text-zinc-500">{quest.category}</p>
                    {quest.description && (
                      <p className="text-xs text-zinc-600 mt-1">
                        {quest.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-medium ${
                      quest.completed ? "text-green-400" : "text-zinc-500"
                    }`}
                  >
                    {quest.points} pts
                  </div>
                  <div
                    className={`text-xs ${
                      quest.completed ? "text-green-300" : "text-zinc-600"
                    }`}
                  >
                    {quest.completed ? "Completed" : "Pending"}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center text-zinc-400 py-8">
                No quest data available for this date.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
