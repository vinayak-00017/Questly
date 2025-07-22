"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Calendar,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Flame,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { questTemplateApi } from "@/services/quest-template-api";
import { questApi } from "@/services/quest-api";
import { useSession } from "@/lib/auth-client";

type TrackedQuest = {
  id: string;
  title: string;
  type: "daily" | "side";
  templateId: string;
  priority?: string; // Add priority field
};

type QuestActivityData = {
  date: string;
  completed: boolean;
  xpEarned: number;
  instanceId?: string;
};

const QuestTracker: React.FC = () => {
  const [trackedQuests, setTrackedQuests] = useState<TrackedQuest[]>(() => {
    // Load from localStorage only once on initial render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trackedQuests");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore parse error
        }
      }
    }
    return [];
  });
  const [selectedView, setSelectedView] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Fetch available quest templates
  const { data: templatesData } = useQuery({
    queryKey: ["questTemplates"],
    queryFn: questTemplateApi.fetchQuestTemplates,
    select: (data) => data.questTemplates || [],
  });

  // Get available templates that aren't already tracked
  const availableTemplates = useMemo(() => {
    const trackedTemplateIds = trackedQuests.map((q) => q.templateId);
    return (templatesData || [])
      .filter(
        (template) =>
          template.isActive && !trackedTemplateIds.includes(template.id)
      )
      .sort((a, b) => {
        // Sort by priority: Critical > Important > Standard > Minor > Optional
        const priorityOrder = {
          critical: 0,
          important: 1,
          standard: 2,
          minor: 3,
          optional: 4,
        };
        const aPriority =
          priorityOrder[a.basePoints as keyof typeof priorityOrder] ?? 2;
        const bPriority =
          priorityOrder[b.basePoints as keyof typeof priorityOrder] ?? 2;
        return aPriority - bPriority;
      });
  }, [templatesData, trackedQuests]);

  // Generate date range based on view
  const dateRange = useMemo(() => {
    const dates: Date[] = [];

    if (selectedView === "week") {
      // Get week starting from Sunday
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - day);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } else {
      // Get current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
      }
    }

    return dates;
  }, [currentDate, selectedView]);

  // Fetch quest activity data for tracked quests
  const { data: activityData } = useQuery({
    queryKey: [
      "questActivity",
      trackedQuests.map((q) => q.templateId),
      dateRange[0]?.toISOString().split("T")[0],
      dateRange[dateRange.length - 1]?.toISOString().split("T")[0],
    ],
    queryFn: () => {
      if (trackedQuests.length === 0 || dateRange.length === 0) return {};

      const templateIds = trackedQuests.map((q) => q.templateId);
      const startDate = dateRange[0].toISOString().split("T")[0];
      const endDate = dateRange[dateRange.length - 1]
        .toISOString()
        .split("T")[0];

      return questApi.fetchQuestActivity(templateIds, startDate, endDate);
    },
    enabled: trackedQuests.length > 0 && dateRange.length > 0,
    select: (data) => data || {},
  });

  // Get quest activity for a specific quest and date
  const getQuestActivity = (
    questId: string,
    date: Date
  ): QuestActivityData | null => {
    if (!activityData) return null;

    const quest = trackedQuests.find((q) => q.id === questId);
    if (!quest) return null;

    const dateStr = date.toISOString().split("T")[0];
    const questActivity = activityData[quest.templateId];

    if (questActivity && questActivity[dateStr]) {
      return questActivity[dateStr];
    }

    return null;
  };

  const addQuestToTracker = () => {
    if (!selectedTemplate) return;

    const template = templatesData?.find((t) => t.id === selectedTemplate);
    if (!template) return;

    const newTrackedQuest: TrackedQuest = {
      id: `tracked-${Date.now()}`,
      title: template.title,
      type: template.type,
      templateId: template.id,
      priority:
        typeof template.basePoints === "string"
          ? template.basePoints
          : "standard", // Add priority
    };

    setTrackedQuests((prev) => [...prev, newTrackedQuest]);
    setSelectedTemplate("");
    setIsAddDialogOpen(false);
  };

  const removeQuestFromTracker = (questId: string) => {
    setTrackedQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (selectedView === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatDateHeader = () => {
    if (selectedView === "week") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - day);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  };

  // Sort tracked quests by priority
  const sortedTrackedQuests = useMemo(() => {
    return [...trackedQuests].sort((a, b) => {
      const priorityOrder = {
        critical: 0,
        important: 1,
        standard: 2,
        minor: 3,
        optional: 4,
      };
      const aPriority =
        priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
      const bPriority =
        priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
      return aPriority - bPriority;
    });
  }, [trackedQuests]);

  // Helper function to get priority badge style
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "important":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "standard":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "minor":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "optional":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  // Helper function to get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "🔥";
      case "important":
        return "⚡";
      case "standard":
        return "⭐";
      case "minor":
        return "📌";
      case "optional":
        return "💡";
      default:
        return "⭐";
    }
  };

  // Persist trackedQuests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("trackedQuests", JSON.stringify(trackedQuests));
  }, [trackedQuests]);

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-800/80 border-amber-500/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white font-medieval">
                Quest Activity Tracker
              </h3>
              <p className="text-sm text-slate-400">
                Track your quest completion patterns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate("prev")}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h4 className="text-white font-medium min-w-[200px] text-center">
              {formatDateHeader()}
            </h4>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate("next")}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-3 ">
            <Select
              value={selectedView}
              onValueChange={(value: "week" | "month") =>
                setSelectedView(value)
              }
            >
              <SelectTrigger className="w-24 bg-slate-800/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={availableTemplates.length === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Track Quest
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Add Quest to Tracker
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select a quest template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            {template.type === "daily" ? (
                              <Flame className="h-3 w-3 text-amber-400" />
                            ) : (
                              <Compass className="h-3 w-3 text-sky-400" />
                            )}
                            {template.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={addQuestToTracker}
                      disabled={!selectedTemplate}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Add to Tracker
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tracked Quests */}
        {trackedQuests.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">No Quests Tracked</h4>
            <p className="text-slate-400 text-sm">
              Add quests to start tracking your completion patterns
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Date Headers */}
            <div className="flex">
              <div className="w-48 flex-shrink-0"></div>{" "}
              {/* Space for quest names */}
              <div
                className={cn(
                  "flex gap-1",
                  selectedView === "week" ? "max-w-md" : "flex-1"
                )}
              >
                {dateRange.map((date) => {
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "flex flex-col items-center",
                        selectedView === "week"
                          ? "w-12" // Fixed width for week view
                          : "flex-1 min-w-0 max-w-8" // Flexible for month view
                      )}
                    >
                      {selectedView === "week" && (
                        <div
                          className={cn(
                            "text-xs font-medium mb-1",
                            isToday ? "text-amber-400" : "text-slate-400"
                          )}
                        >
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                      )}
                      <div
                        className={cn(
                          "text-xs",
                          isToday ? "text-amber-400" : "text-slate-500"
                        )}
                      >
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Week view: Add extra content in remaining space */}
              {selectedView === "week" && (
                <div className="flex-1 pl-8">
                  <div className="bg-slate-800/30 rounded-lg p-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-800/50 border border-slate-700 rounded-sm"></div>
                        <span className="text-slate-400">No Activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-600/50 border border-slate-500 rounded-sm"></div>
                        <span className="text-slate-400">Attempted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400 rounded-sm"></div>
                        <span className="text-slate-400">Daily</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-sky-500 to-blue-600 border border-sky-400 rounded-sm"></div>
                        <span className="text-slate-400">Side</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quest Rows */}
            {sortedTrackedQuests.map((quest, questIndex) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: questIndex * 0.1 }}
                className="flex items-center"
              >
                {/* Quest Info */}
                <div className="w-48 flex-shrink-0 flex items-center justify-between pr-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs flex-shrink-0",
                        quest.type === "daily"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-sky-500/20 text-sky-400 border-sky-500/30"
                      )}
                    >
                      {quest.type === "daily" ? (
                        <Flame className="h-3 w-3" />
                      ) : (
                        <Compass className="h-3 w-3" />
                      )}
                    </Badge>

                    <span
                      className="text-white text-sm font-medium truncate"
                      title={quest.title}
                    >
                      {quest.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestFromTracker(quest.id)}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-900/20 h-6 w-6 p-0 flex-shrink-0"
                  >
                    ×
                  </Button>
                </div>

                {/* Activity Grid */}
                <div
                  className={cn(
                    "flex gap-1",
                    selectedView === "week" ? "max-w-md" : "flex-1"
                  )}
                >
                  {dateRange.map((date, dateIndex) => {
                    const activity = getQuestActivity(quest.id, date);
                    const isToday =
                      date.toDateString() === new Date().toDateString();

                    return (
                      <motion.div
                        key={date.toISOString()}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: questIndex * 0.05 + dateIndex * 0.01,
                        }}
                        className={cn(
                          "relative group cursor-pointer transition-all duration-200 rounded-sm",
                          selectedView === "week"
                            ? "w-12 h-8" // Fixed larger size for week view
                            : "flex-1 min-w-0 max-w-8 h-5" // Flexible for month view
                        )}
                        title={`${date.toLocaleDateString()} - ${
                          activity
                            ? activity.completed
                              ? `Completed (+${activity.xpEarned} XP)`
                              : "Attempted"
                            : "No activity"
                        }`}
                      >
                        <div
                          className={cn(
                            "w-full h-full rounded-sm transition-all duration-200 hover:scale-105 border",
                            activity
                              ? activity.completed
                                ? quest.type === "daily"
                                  ? "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 shadow-amber-500/20 shadow-sm"
                                  : "bg-gradient-to-br from-sky-500 to-blue-600 border-sky-400 shadow-sky-500/20 shadow-sm"
                                : "bg-slate-600/50 border-slate-500"
                              : "bg-slate-800/50 border-slate-700",
                            isToday && "ring-2 ring-white/40"
                          )}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Week view: Add quest stats in remaining space */}
                {selectedView === "week" && (
                  <div className="flex-1 pl-8">
                    <div className="text-xs text-slate-400">
                      {(() => {
                        const weekActivities = dateRange.map((date) =>
                          getQuestActivity(quest.id, date)
                        );
                        const completed = weekActivities.filter(
                          (a) => a?.completed
                        ).length;
                        const attempted = weekActivities.filter(
                          (a) => a && !a.completed
                        ).length;
                        const totalXp = weekActivities.reduce(
                          (sum, a) => sum + (a?.xpEarned || 0),
                          0
                        );

                        return (
                          <div className="flex items-center gap-4">
                            <span className="text-slate-300 font-medium">
                              {completed}/{dateRange.length}
                            </span>
                            <span>{totalXp > 0 && `${totalXp} XP`}</span>
                            {completed === dateRange.length && (
                              <span className="text-amber-400 font-medium">
                                Perfect Week! 🔥
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestTracker;
