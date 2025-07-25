import { BASE_URL } from "@/config";
import { CreateQuestTemplate } from "@questly/types";

export const questApi = {
  fetchDailyQuest: async () => {
    const response = await fetch(`${BASE_URL}/quest/dailyQuestInstance`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch daily quests");
    return response.json();
  },

  fetchSideQuests: async () => {
    const response = await fetch(`${BASE_URL}/quest/sideQuestInstance`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch side quests");
    return response.json();
  },

  fetchTodaysQuests: async () => {
    const response = await fetch(`${BASE_URL}/quest/todaysQuests`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch daily quests");
    return response.json();
  },

  addQuest: async (input: CreateQuestTemplate) => {
    const response = await fetch(`${BASE_URL}/quest/questTemplate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to add quest");
    }

    return response.json();
  },

  completeQuest: async (id: string, done: boolean) => {
    const input = { id, done };
    const response = await fetch(`${BASE_URL}/quest/completeQuest`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to add quest");
    }
    return response.json();
  },

  fetchQuestActivity: async (templateIds: string[], startDate: string, endDate: string) => {
    const response = await fetch(`${BASE_URL}/quest/activity?templateIds=${templateIds.join(',')}&startDate=${startDate}&endDate=${endDate}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch quest activity");
    return response.json();
  },

  updateQuestInstance: async (updateData: {
    instanceId: string;
    title: string;
    description?: string;
    basePoints: number;
  }) => {
    const response = await fetch(`${BASE_URL}/quest/questInstance/${updateData.instanceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: updateData.title,
        description: updateData.description,
        basePoints: updateData.basePoints,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to update quest instance");
    }

    return response.json();
  },
};
