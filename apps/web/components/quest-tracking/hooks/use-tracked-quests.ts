import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  trackedQuestApi,
  type TrackedQuest,
  type CreateTrackedQuest,
} from "@/services/tracked-quest-api";
import { TrackedQuest as LegacyTrackedQuest } from "../types";

// Convert API TrackedQuest to legacy format for backward compatibility
const convertToLegacyFormat = (apiQuest: TrackedQuest): LegacyTrackedQuest => ({
  id: apiQuest.id,
  title: apiQuest.title,
  type: apiQuest.type,
  templateId: apiQuest.templateId,
  priority: apiQuest.priority || "standard",
});

export const useTrackedQuests = () => {
  const queryClient = useQueryClient();

  // Fetch tracked quests from database
  const { data: apiTrackedQuests = [], isLoading } = useQuery({
    queryKey: ["trackedQuests"],
    queryFn: async () => {
      const response = await trackedQuestApi.fetchTrackedQuests();
      return response.trackedQuests;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Convert to legacy format for backward compatibility
  const trackedQuests: LegacyTrackedQuest[] = apiTrackedQuests.map(
    convertToLegacyFormat
  );

  // Add quest mutation
  const addQuestMutation = useMutation({
    mutationFn: async (quest: Omit<LegacyTrackedQuest, "id">) => {
      const createQuest: CreateTrackedQuest = {
        templateId: quest.templateId,
        title: quest.title,
        type: quest.type,
        priority: quest.priority,
      };
      return trackedQuestApi.addTrackedQuest(createQuest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackedQuests"] });
    },
    onError: (error) => {
      console.error("Failed to add quest to tracking:", error);
    },
  });

  // Remove quest mutation
  const removeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      await trackedQuestApi.removeTrackedQuest(questId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackedQuests"] });
    },
    onError: (error) => {
      console.error("Failed to remove quest from tracking:", error);
    },
  });

  // Migrate localStorage data to database (one-time migration)
  useEffect(() => {
    const migrateLocalStorageData = async () => {
      if (typeof window === "undefined" || trackedQuests.length > 0) return;

      const saved = localStorage.getItem("trackedQuests");
      if (saved) {
        try {
          const localQuests: LegacyTrackedQuest[] = JSON.parse(saved);
          if (localQuests.length > 0) {
            console.log(
              "Migrating tracked quests from localStorage to database..."
            );

            // Add each quest to the database
            for (const quest of localQuests) {
              try {
                await addQuestMutation.mutateAsync(quest);
              } catch (error) {
                console.error("Failed to migrate quest:", quest.title, error);
              }
            }

            // Clear localStorage after successful migration
            localStorage.removeItem("trackedQuests");
            console.log("Migration completed, localStorage cleared");
          }
        } catch (error) {
          console.error("Failed to migrate localStorage data:", error);
        }
      }
    };

    migrateLocalStorageData();
  }, [trackedQuests.length, addQuestMutation]);

  const addQuestToTracker = (quest: Omit<LegacyTrackedQuest, "id">) => {
    addQuestMutation.mutate(quest);
  };

  const removeQuestFromTracker = (questId: string) => {
    removeQuestMutation.mutate(questId);
  };

  return {
    trackedQuests,
    addQuestToTracker,
    removeQuestFromTracker,
    isLoading,
    isAdding: addQuestMutation.isPending,
    isRemoving: removeQuestMutation.isPending,
  };
};
