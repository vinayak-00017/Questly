"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { userApi } from "@/services/user-api";
import { questApi } from "@/services/quest-api";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  Award,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
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
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function PerformanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
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

  // Fetch all-time performance to populate available dates across history
  const { data: allPerformance } = useQuery({
    queryKey: ["performance-available-dates"],
    queryFn: () => userApi.getPerformance("overall"),
  });

  // Fetch detailed quest data for the specific date
  const { data: questDetails, isLoading: questsLoading } = useQuery({
    queryKey: ["quest-details", date],
    queryFn: () => userApi.getQuestDetails(date),
  });

  // Quest completion mutation - moved to top to follow Rules of Hooks
  const completeQuestMutation = useMutation({
    mutationFn: ({
      questId,
      completed,
    }: {
      questId: string;
      completed: boolean;
    }) => questApi.completeQuest(questId, completed),
    onMutate: async ({ questId, completed }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["quest-details", date] });

      // Snapshot the previous value
      const previousQuestDetails = queryClient.getQueryData([
        "quest-details",
        date,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["quest-details", date], (old: any) => {
        if (!old?.quests) return old;

        const updatedQuests = old.quests.map((quest: any) =>
          quest.id === questId ? { ...quest, completed } : quest
        );

        const newCompletedQuests = updatedQuests.filter(
          (q: any) => q.completed
        ).length;
        const newCompletedPoints = updatedQuests
          .filter((q: any) => q.completed)
          .reduce((sum: number, q: any) => sum + q.points, 0);
        const newCompletionPercentage =
          old.totalPoints > 0
            ? Math.round((newCompletedPoints / old.totalPoints) * 100)
            : 0;

        return {
          ...old,
          quests: updatedQuests,
          completedQuests: newCompletedQuests,
          completedPoints: newCompletedPoints,
          completionPercentage: newCompletionPercentage,
        };
      });

      // Return a context object with the snapshotted value
      return { previousQuestDetails };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousQuestDetails) {
        queryClient.setQueryData(
          ["quest-details", date],
          context.previousQuestDetails
        );
      }
      toast.error("Failed to update quest status");
    },
    onSuccess: (data, variables) => {
      if (variables.completed) {
        toast.success("Quest completed!");
      } else {
        toast.success("Quest marked as incomplete");
      }

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ["quest-details", date] });
      queryClient.invalidateQueries({ queryKey: ["performance"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });

  const specificDayData = performanceData?.performanceData?.find(
    (item: any) => item.date === date
  );

  // Build available dates list (sorted ascending) from performance data (prefer overall)
  const dateItems = (
    ((allPerformance?.performanceData || performanceData?.performanceData) || []) as Array<{ date?: string }>
  )
    .map((d) => d.date)
    .filter((d): d is string => typeof d === "string" && d.length > 0);
  const availableDates: string[] = Array.from(new Set<string>(dateItems)).sort();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(date));

  // Update calendar month when date changes
  useEffect(() => {
    setCalendarMonth(new Date(date));
  }, [date]);

  // Utilities
  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Prev/Next strictly from availableDates
  const currentIndex = availableDates.indexOf(date);
  const prevDate = currentIndex > 0 ? availableDates[currentIndex - 1] : null;
  const nextDate =
    currentIndex >= 0 && currentIndex < availableDates.length - 1
      ? availableDates[currentIndex + 1]
      : null;

  const goToDate = (target: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    router.push(`/performance/${target}?${sp.toString()}`);
  };

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

  // Compute filtered quests by type (daily/side) to drive UI and stats
  const filteredQuests = (questDetails?.quests || []).filter(
    (q: any) => q?.type === "daily" || q?.type === "side"
  );

  // Build category stats from filtered quests (type-based)
  const categoryStats = filteredQuests.reduce((acc: any, quest: any) => {
    if (!acc[quest.type]) {
      acc[quest.type] = { total: 0, completed: 0, points: 0 };
    }
    acc[quest.type].total++;
    if (quest.completed) {
      acc[quest.type].completed++;
      acc[quest.type].points += quest.points;
    }
    return acc;
  }, {});

  // Sort quests: completed first (by points descending), then incompleted (by points descending)
  let sortedQuests: any[] = [];
  if (filteredQuests.length) {
    const completed = filteredQuests
      .filter((q: any) => q.completed)
      .sort((a: any, b: any) => b.points - a.points);
    const incompleted = filteredQuests
      .filter((q: any) => !q.completed)
      .sort((a: any, b: any) => b.points - a.points);
    sortedQuests = [...completed, ...incompleted];
  }

  // Only show Daily and Side quests in UI
  const displayedQuests = sortedQuests;

  // Recompute overview metrics from filtered quests only
  const totalPoints = filteredQuests.reduce(
    (sum: number, q: any) => sum + (q.points || 0),
    0
  );
  const completedPoints = filteredQuests
    .filter((q: any) => q.completed)
    .reduce((sum: number, q: any) => sum + (q.points || 0), 0);
  const totalQuests = filteredQuests.length;
  const questsCompleted = filteredQuests.filter((q: any) => q.completed).length;
  const completionPercentage =
    totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

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
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            disabled={!prevDate}
            onClick={() => prevDate && goToDate(prevDate)}
            title={prevDate ? `Go to ${prevDate}` : "No previous date"}
            className="text-zinc-300 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Calendar Date Picker */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-black/30 border-zinc-700 text-white hover:bg-black/50 gap-2"
                title="Pick a date"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="font-mono">{date}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
              <Calendar
                mode="single"
                selected={new Date(date)}
                onSelect={(d) => {
                  if (!d) return;
                  const yyyy = d.getFullYear();
                  const mm = String(d.getMonth() + 1).padStart(2, "0");
                  const dd = String(d.getDate()).padStart(2, "0");
                  const formatted = `${yyyy}-${mm}-${dd}`;
                  if (availableDates.includes(formatted)) {
                    setCalendarOpen(false);
                    goToDate(formatted);
                  }
                }}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                disabled={(d) => {
                  const yyyy = d.getFullYear();
                  const mm = String(d.getMonth() + 1).padStart(2, "0");
                  const dd = String(d.getDate()).padStart(2, "0");
                  const formatted = `${yyyy}-${mm}-${dd}`;
                  return !availableDates.includes(formatted);
                }}
              />
              <div className="px-3 pb-3 pt-2 text-xs text-zinc-400">
                Only dates with data are selectable.
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            disabled={!nextDate}
            onClick={() => nextDate && goToDate(nextDate)}
            title={nextDate ? `Go to ${nextDate}` : "No next date"}
            className="text-zinc-300 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">
            {completionPercentage}%
          </div>
          <p className="text-sm text-zinc-400">Completion Rate</p>
        </div>
      </div>

      {/* Secondary Title Row */}
      <div className="flex items-center gap-2 -mt-2">
        <CalendarIcon className="h-4 w-4 text-zinc-400" />
        <h1 className="text-2xl font-semibold text-white">
          Performance Details
        </h1>
        <span className="text-zinc-500">•</span>
        <span className="text-zinc-400">{label}</span>
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
            {Object.entries(categoryStats)
              .filter(([questType]) => questType === "daily" || questType === "side")
              .map(([questType, stats]: [string, any]) => (
                <div
                  key={questType}
                  className="p-4 rounded-lg border border-zinc-700 bg-black/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{questType}</h3>
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
              ))}
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
            {displayedQuests?.map((quest: any) => (
              <div
                key={quest.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  quest.completed
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-zinc-700 bg-black/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      completeQuestMutation.mutate({
                        questId: quest.id,
                        completed: !quest.completed,
                      })
                    }
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all hover:scale-110 ${
                      quest.completed
                        ? "border-green-500 bg-green-500"
                        : "border-zinc-600 hover:border-green-400"
                    } ${
                      completeQuestMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={completeQuestMutation.isPending}
                    title={
                      completeQuestMutation.isPending
                        ? "Updating..."
                        : quest.completed
                          ? "Mark as incomplete"
                          : "Mark as completed"
                    }
                  >
                    {quest.completed && !completeQuestMutation.isPending && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                    {completeQuestMutation.isPending && (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    )}
                  </button>
                  <div>
                    <h4
                      className={`font-medium ${
                        quest.completed ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {quest.title}
                    </h4>
                    <p className="text-sm text-zinc-500">{quest.type}</p>
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
