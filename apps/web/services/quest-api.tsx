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
};
