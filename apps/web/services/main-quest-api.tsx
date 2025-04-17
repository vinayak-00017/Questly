import { BASE_URL } from "@/config";
import { CreateMainQuest } from "@questly/types";

export const mainQuestApi = {
  addMainQuest: async (input: CreateMainQuest) => {
    const response = await fetch(`${BASE_URL}/quest/main`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create quest");
    }

    return response.json();
  },

  fetchMainQuests: async () => {
    const response = await fetch(`${BASE_URL}/quest/main`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetct main quests");
    return response.json();
  },
};
