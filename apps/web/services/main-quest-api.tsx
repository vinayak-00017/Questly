import { BASE_URL } from "@/config";
import { CreateMainQuest } from "@questly/types";

export const mainQuestApi = {
  addMainQuest: async (input: CreateMainQuest) => {
    try {
      const response = await fetch(`${BASE_URL}/quest/main`, {
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
        throw new Error(error.message || "Failed to create quest");
      }

      return response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },

  fetchMainQuests: async () => {
    try {
      const response = await fetch(`${BASE_URL}/quest/main`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(error.message || "Failed to fetch main quests");
      }

      return response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },
};
