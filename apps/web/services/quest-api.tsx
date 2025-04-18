import { BASE_URL } from "@/config";

export const questApi = {
  fetchDailyQuest: async () => {
    const response = await fetch(`${BASE_URL}/quest/dailyInstance`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch daily quests");
    return response.json();
  },
};
