import { useQuery } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { TrackedQuest, QuestActivityData } from "../types";

export const useQuestActivity = (
  trackedQuests: TrackedQuest[],
  dateRange: Date[]
) => {
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

  return {
    activityData,
    getQuestActivity,
  };
};