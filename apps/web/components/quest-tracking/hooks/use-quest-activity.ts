import { useQuery } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { TrackedQuest, QuestActivityData } from "../types";
import { toLocalDbDate, getLocalDateMidnight } from "@questly/utils";
import { useTopbarData } from "../../topbar/hooks/use-topbar-data";

export const useQuestActivity = (
  trackedQuests: TrackedQuest[],
  dateRange: Date[]
) => {
  const { userStats } = useTopbarData();
  const userTimezone = userStats.timezone;
  const { data: activityData } = useQuery({
    queryKey: [
      "questActivity",
      trackedQuests.map((q) => q.templateId),
      dateRange[0] ? toLocalDbDate(getLocalDateMidnight(dateRange[0], userTimezone), userTimezone) : null,
      dateRange[dateRange.length - 1] ? toLocalDbDate(getLocalDateMidnight(dateRange[dateRange.length - 1], userTimezone), userTimezone) : null,
    ],
    queryFn: () => {
      if (trackedQuests.length === 0 || dateRange.length === 0) return {};

      const templateIds = trackedQuests.map((q) => q.templateId);
      const startDate = toLocalDbDate(getLocalDateMidnight(dateRange[0], userTimezone), userTimezone);
      const endDate = toLocalDbDate(getLocalDateMidnight(dateRange[dateRange.length - 1], userTimezone), userTimezone);

      return questApi.fetchQuestActivity(templateIds, startDate, endDate);
    },
    enabled: trackedQuests.length > 0 && dateRange.length > 0,
    select: (data) => data || {},
  });

  const getQuestActivity = (
    questId: string,
    date: Date
  ): QuestActivityData | null => {
    if (!activityData) return null;

    const quest = trackedQuests.find((q) => q.id === questId);
    if (!quest) return null;

    const dateStr = toLocalDbDate(getLocalDateMidnight(date, userTimezone), userTimezone);
    const questActivity = activityData[quest.templateId];

    if (questActivity && questActivity[dateStr]) {
      return questActivity[dateStr];
    }

    return null;
  };

  return {
    activityData,
    getQuestActivity,
  };
};