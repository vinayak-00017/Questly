"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AchievementNotification } from "@/components/achievements/achievement-notification";
import type { Achievement } from "@questly/utils";
import { BASE_URL } from "@/config";

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
  checkForNewAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(
  undefined
);

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      "useAchievements must be used within an AchievementProvider"
    );
  }
  return context;
};

interface AchievementProviderProps {
  children: React.ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({
  children,
}) => {
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  const showAchievement = useCallback((achievement: Achievement) => {
    setAchievementQueue((prev) => [...prev, achievement]);
  }, []);

  const processQueue = useCallback(() => {
    if (achievementQueue.length > 0 && !isVisible) {
      const nextAchievement = achievementQueue[0];
      setCurrentAchievement(nextAchievement);
      setIsVisible(true);
      setAchievementQueue((prev) => prev.slice(1));
    }
  }, [achievementQueue, isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setCurrentAchievement(null);

    // Process next achievement after a short delay
    setTimeout(() => {
      processQueue();
    }, 500);
  }, [processQueue]);

  const checkForNewAchievements = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/achievements/check`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const newAchievements = data.data?.newAchievements || [];

        // Show notifications for new achievements
        newAchievements.forEach((achievement: Achievement) => {
          showAchievement(achievement);
        });
      }
    } catch (error) {
      console.error("Error checking for new achievements:", error);
    }
  }, [showAchievement]);

  // Process queue when it changes
  useEffect(() => {
    processQueue();
  }, [processQueue]);

  const value: AchievementContextType = {
    showAchievement,
    checkForNewAchievements,
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
      {currentAchievement && (
        <AchievementNotification
          achievement={currentAchievement}
          isVisible={isVisible}
          onClose={handleClose}
        />
      )}
    </AchievementContext.Provider>
  );
};