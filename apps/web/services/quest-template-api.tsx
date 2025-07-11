import { BASE_URL } from "@/config";
import { QuestTemplate } from "@questly/types";

export const questTemplateApi = {
  fetchQuestTemplates: async (): Promise<{
    questTemplates: QuestTemplate[];
  }> => {
    const response = await fetch(`${BASE_URL}/quest/questTemplates`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch quest templates");
    return response.json();
  },

  updateQuestTemplate: async (
    id: string,
    updateData: Partial<QuestTemplate>
  ) => {
    const response = await fetch(`${BASE_URL}/quest/questTemplate/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to update quest template");
    }

    return response.json();
  },

  deleteQuestTemplate: async (id: string) => {
    const response = await fetch(`${BASE_URL}/quest/questTemplate/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(error.message || "Failed to delete quest template");
    }

    return response.json();
  },

  toggleQuestTemplateStatus: async (id: string, isActive: boolean) => {
    const response = await fetch(`${BASE_URL}/quest/questTemplate/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Server error: ${response.status}` }));
      throw new Error(
        error.message || "Failed to toggle quest template status"
      );
    }

    return response.json();
  },
};
