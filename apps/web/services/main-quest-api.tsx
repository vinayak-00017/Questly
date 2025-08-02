import { BASE_URL } from "@/config";
import { CreateMainQuest } from "@questly/types";

export const mainQuestApi = {
  addMainQuest: async (input: CreateMainQuest) => {
    try {
      const response = await fetch(`${BASE_URL}/main-quest/`, {
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
      const response = await fetch(`${BASE_URL}/main-quest/`, {
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

  fetchActiveMainQuests: async () => {
    try {
      const response = await fetch(`${BASE_URL}/main-quest/active`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(error.message || "Failed to fetch active main quests");
      }

      return response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },

  fetchMainQuestsId: async () => {
    try {
      const response = await fetch(`${BASE_URL}/main-quest/ids`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(error.message || "Failed to fetch main quests IDs");
      }

      return response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },

  getDetails: async () => {
    try {
      const response = await fetch(`${BASE_URL}/main-quest/details`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(error.message || "Failed to fetch main quest details");
      }
      return response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },

  completeMainQuest: async (questId: string, completed: boolean) => {
    try {
      const response = await fetch(`${BASE_URL}/main-quest/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ questId, completed }),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(error.message || "Failed to update main quest");
      }

      return response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },
};
