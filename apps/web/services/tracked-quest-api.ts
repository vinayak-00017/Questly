import { BASE_URL } from "@/config";

export interface TrackedQuest {
  id: string;
  templateId: string;
  title: string;
  type: "daily" | "side";
  priority?: string;
  createdAt: Date;
  // Template info
  templateTitle: string;
  templateDescription?: string;
  templateBasePoints: number;
  templateIsActive: boolean;
}

export interface CreateTrackedQuest {
  templateId: string;
  title: string;
  type: "daily" | "side";
  priority?: string;
}

export const trackedQuestApi = {
  // Get user's tracked quests
  fetchTrackedQuests: async (): Promise<{ trackedQuests: TrackedQuest[] }> => {
    const response = await fetch(`${BASE_URL}/tracked-quest`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch tracked quests");
    return response.json();
  },

  // Add a quest to tracking
  addTrackedQuest: async (
    quest: CreateTrackedQuest
  ): Promise<{ trackedQuest: TrackedQuest }> => {
    const response = await fetch(`${BASE_URL}/tracked-quest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(quest),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to add quest to tracking");
    }

    return response.json();
  },

  // Remove a quest from tracking
  removeTrackedQuest: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/tracked-quest/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to remove quest from tracking");
    }
  },

  // Update tracked quest
  updateTrackedQuest: async (
    id: string,
    updates: { priority?: string; title?: string }
  ): Promise<void> => {
    const response = await fetch(`${BASE_URL}/tracked-quest/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to update tracked quest");
    }
  },
};
