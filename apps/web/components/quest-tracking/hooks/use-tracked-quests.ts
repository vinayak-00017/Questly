import { useState, useEffect } from "react";
import { TrackedQuest } from "../types";

export const useTrackedQuests = () => {
  const [trackedQuests, setTrackedQuests] = useState<TrackedQuest[]>(() => {
    // Load from localStorage only once on initial render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trackedQuests");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore parse error
        }
      }
    }
    return [];
  });

  // Persist trackedQuests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("trackedQuests", JSON.stringify(trackedQuests));
  }, [trackedQuests]);

  const addQuestToTracker = (quest: Omit<TrackedQuest, "id">) => {
    const newTrackedQuest: TrackedQuest = {
      ...quest,
      id: `tracked-${Date.now()}`,
    };
    setTrackedQuests((prev) => [...prev, newTrackedQuest]);
  };

  const removeQuestFromTracker = (questId: string) => {
    setTrackedQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  return {
    trackedQuests,
    addQuestToTracker,
    removeQuestFromTracker,
  };
};