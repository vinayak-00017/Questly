import { TrackedQuest, ViewType, QuestActivityData } from "./types";

export const formatDateHeader = (currentDate: Date, selectedView: ViewType) => {
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

export const generateDateRange = (
  currentDate: Date,
  selectedView: ViewType
): Date[] => {
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
};

export const sortTrackedQuests = (
  trackedQuests: TrackedQuest[]
): TrackedQuest[] => {
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
};

export const getPriorityBadgeStyle = (priority: string) => {
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

export const getPriorityIcon = (priority: string) => {
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

export const navigateDate = (
  currentDate: Date,
  direction: "prev" | "next",
  selectedView: ViewType
): Date => {
  const newDate = new Date(currentDate);
  if (selectedView === "week") {
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
  } else {
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
  }
  return newDate;
};

/**
 * Calculate current streak for a quest based on recent activity
 * A streak is the number of consecutive days the quest was completed, ending on the most recent day
 *
 * This function is limited by the data available in the current view
 */
export const calculateQuestStreak = (
  questId: string,
  getQuestActivity: (questId: string, date: Date) => QuestActivityData | null
): number => {
  let streak = 0;
  const today = new Date();

  // Start from today and go backwards
  // Note: This is limited by the data available in the current view
  for (let i = 0; i < 365; i++) {
    // Check up to 1 year back
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const activity = getQuestActivity(questId, checkDate);

    // If we don't have data for this date, it might be outside the current view range
    // In that case, we should stop calculating to avoid incorrect results
    if (activity === null && i > 0) {
      // If we're beyond today and have no data, assume the streak ends here
      break;
    }

    if (activity?.completed) {
      streak++;
    } else if (activity !== null) {
      // We have data for this date but quest wasn't completed
      // Streak is broken, stop counting
      break;
    }
  }

  return streak;
};
