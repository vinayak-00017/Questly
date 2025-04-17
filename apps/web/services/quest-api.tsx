import { BASE_URL } from "@/config";

export const questApi = {
  fetchDailyQuest: async () => {
    const response = await fetch(`${BASE_URL}/quest/daily`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetct main quests");
    return response.json();
  },
};
