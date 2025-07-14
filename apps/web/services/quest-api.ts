import { apiClient } from "@/lib/api-client";

export interface QuestActivityResponse {
  [templateId: string]: {
    [date: string]: {
      date: string;
      completed: boolean;
      xpEarned: number;
      instanceId: string;
    };
  };
}

export const questApi = {
  // Fetch quest activity for multiple template IDs within a date range
  fetchQuestActivity: async (
    templateIds: string[],
    startDate: string,
    endDate: string
  ): Promise<QuestActivityResponse> => {
    try {
      const response = await apiClient.get("/quest/activity", {
        params: {
          templateIds: templateIds.join(","),
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching quest activity:", error);
      return {};
    }
  },

  // Fetch quest instances for a specific template and date range
  fetchQuestInstances: async (
    templateId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await apiClient.get(`/quest/instances/${templateId}`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching quest instances:", error);
      return [];
    }
  },
};
