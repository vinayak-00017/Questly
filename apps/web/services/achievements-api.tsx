import { BASE_URL } from "@/config";

interface AchievementProgress {
  achievementId: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    importance: "common" | "rare" | "epic" | "legendary";
    criteria: {
      type: string;
      value: number;
    };
    hidden?: boolean;
  };
}

interface AchievementStats {
  total: number;
  unlocked: number;
  percentage: number;
  byImportance: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  byCategory: Record<string, { total: number; unlocked: number }>;
}

export const achievementsApi = {
  // Fetch all achievements with progress
  getAchievements: async (): Promise<{ data: AchievementProgress[] }> => {
    const response = await fetch(`${BASE_URL}/achievements`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch achievements");
    }

    return response.json();
  },

  // Fetch achievement statistics
  getAchievementStats: async (): Promise<{ data: AchievementStats }> => {
    const response = await fetch(`${BASE_URL}/achievements/stats`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch achievement stats");
    }

    return response.json();
  },

  // Fetch recent achievements with optional limit
  getRecentAchievements: async (limit: number = 4): Promise<{ data: AchievementProgress[] }> => {
    const response = await fetch(`${BASE_URL}/achievements/recent?limit=${limit}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent achievements");
    }

    return response.json();
  },

  // Unlock an achievement (if needed for manual unlocking)
  unlockAchievement: async (achievementId: string): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}/achievements/${achievementId}/unlock`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to unlock achievement");
    }
  },
};
