import { eq, and, sql, desc } from "drizzle-orm";
import db from "../db/index";
import {
  user,
  userAchievement,
  questInstance,
  mainQuest,
  taskInstance,
  xpTransaction,
} from "../db/schema";
import { ACHIEVEMENTS, type Achievement } from "@questly/utils";
import { nanoid } from "nanoid";

export interface UserProgress {
  questsCompleted: number;
  mainQuestsCompleted: number;
  sideQuestsCompleted: number;
  tasksCompleted: number;
  totalXp: number;
  currentStreak: number;
  questsAdded: number;
  mainQuestsAdded: number;
}

export interface AchievementProgress {
  achievementId: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  achievement: Achievement;
}

export class AchievementService {
  /**
   * Get user's current progress across all metrics
   */
  async getUserProgress(userId: string): Promise<UserProgress> {
    // Get basic user data
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!userData.length) {
      throw new Error("User not found");
    }

    const userRecord = userData[0];

    // Get quest completion counts
    const questStats = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`sum(case when ${questInstance.completed} then 1 else 0 end)`,
      })
      .from(questInstance)
      .where(eq(questInstance.userId, userId));

    // Get main quest completion count
    const mainQuestStats = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`sum(case when ${mainQuest.completed} then 1 else 0 end)`,
      })
      .from(mainQuest)
      .where(eq(mainQuest.userId, userId));

    // Get task completion count
    const taskStats = await db
      .select({
        completed: sql<number>`count(*)`,
      })
      .from(taskInstance)
      .where(
        and(
          eq(taskInstance.completed, true),
          sql`${taskInstance.questInstanceId} IN (
          SELECT id FROM ${questInstance} WHERE ${questInstance.userId} = ${userId}
        )`
        )
      );

    // Calculate side quests (total quests - main quests)
    const totalQuests = questStats[0]?.completed || 0;
    const mainQuests = mainQuestStats[0]?.completed || 0;
    const sideQuests = Math.max(0, totalQuests - mainQuests);

    return {
      questsCompleted: totalQuests,
      mainQuestsCompleted: mainQuests,
      sideQuestsCompleted: sideQuests,
      tasksCompleted: taskStats[0]?.completed || 0,
      totalXp: userRecord.xp || 0,
      currentStreak: userRecord.streak || 0,
      questsAdded: questStats[0]?.total || 0,
      mainQuestsAdded: mainQuestStats[0]?.total || 0,
    };
  }

  /**
   * Check which achievements a user has unlocked
   */
  async getUserAchievements(
    userId: string,
    progressOverride?: UserProgress
  ): Promise<AchievementProgress[]> {
    const progress = progressOverride || (await this.getUserProgress(userId));
    const unlockedAchievements = await db
      .select()
      .from(userAchievement)
      .where(eq(userAchievement.userId, userId));

    const unlockedMap = new Map(
      unlockedAchievements.map((ua) => [ua.achievementId, ua])
    );

    return ACHIEVEMENTS.map((achievement) => {
      const unlocked = unlockedMap.get(achievement.id);
      const currentProgress = this.calculateProgress(achievement, progress);

      return {
        achievementId: achievement.id,
        progress: currentProgress,
        isUnlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt || undefined,
        achievement,
      };
    });
  }

  /**
   * Calculate current progress for a specific achievement
   */
  private calculateProgress(
    achievement: Achievement,
    userProgress: UserProgress
  ): number {
    switch (achievement.criteria.type) {
      case "quest_completed":
        return userProgress.questsCompleted;
      case "main_quest_completed":
        return userProgress.mainQuestsCompleted;
      case "side_quest_completed":
        return userProgress.sideQuestsCompleted;
      case "task_completed":
        return userProgress.tasksCompleted;
      case "xp_earned":
        return userProgress.totalXp;
      case "streak":
        return userProgress.currentStreak;
      case "quest_added":
        return userProgress.questsAdded;
      case "main_quest_added":
        return userProgress.mainQuestsAdded;
      default:
        return 0;
    }
  }

  /**
   * Check and unlock new achievements for a user
   */
  async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    // Use a transaction to prevent race conditions and ensure atomicity
    return await db.transaction(async (trx) => {
      const progress = await this.getUserProgress(userId);
      const currentAchievements = await this.getUserAchievements(
        userId,
        progress
      );

      const newlyUnlocked: Achievement[] = [];

      for (const achievementProgress of currentAchievements) {
        const {
          achievement,
          isUnlocked,
          progress: currentProgress,
        } = achievementProgress;

        // Skip if already unlocked
        if (isUnlocked) continue;

        // Check if criteria is met
        if (currentProgress >= achievement.criteria.value) {
          // Use the transaction connection for unlock
          await this.unlockAchievementWithTrx(trx, userId, achievement);
          newlyUnlocked.push(achievement);
        }
      }

      return newlyUnlocked;
    });
  }

  // Helper for transactional unlock
  private async unlockAchievementWithTrx(
    trx: any,
    userId: string,
    achievement: Achievement
  ): Promise<void> {
    const now = new Date();
    const existing = await trx
      .select()
      .from(userAchievement)
      .where(
        and(
          eq(userAchievement.userId, userId),
          eq(userAchievement.achievementId, achievement.id)
        )
      );
    if (existing.length > 0) {
      return;
    }
    await trx.insert(userAchievement).values({
      id: nanoid(),
      userId,
      achievementId: achievement.id,
      unlockedAt: now,
      progress: achievement.criteria.value,
      importance: achievement.importance,
      lastProgressUpdate: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Unlock a specific achievement for a user
   */
  private async unlockAchievement(
    userId: string,
    achievement: Achievement
  ): Promise<void> {
    const now = new Date();

    // Check if already unlocked to prevent duplicates
    const existing = await db
      .select()
      .from(userAchievement)
      .where(
        and(
          eq(userAchievement.userId, userId),
          eq(userAchievement.achievementId, achievement.id)
        )
      );
    if (existing.length > 0) {
      // Already unlocked, skip insertion
      return;
    }

    await db.insert(userAchievement).values({
      id: nanoid(),
      userId,
      achievementId: achievement.id,
      unlockedAt: now,
      progress: achievement.criteria.value,
      importance: achievement.importance,
      lastProgressUpdate: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Get recently unlocked achievements for a user
   */
  async getRecentAchievements(
    userId: string,
    limit: number = 5
  ): Promise<AchievementProgress[]> {
    const recentUnlocked = await db
      .select()
      .from(userAchievement)
      .where(eq(userAchievement.userId, userId))
      .orderBy(desc(userAchievement.unlockedAt))
      .limit(limit);

    return recentUnlocked.map((ua) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === ua.achievementId);
      if (!achievement) {
        throw new Error(`Achievement not found: ${ua.achievementId}`);
      }

      return {
        achievementId: ua.achievementId,
        progress: ua.progress || achievement.criteria.value,
        isUnlocked: true,
        unlockedAt: ua.unlockedAt || undefined,
        achievement,
      };
    });
  }

  /**
   * Get achievements by category
   */
  async getAchievementsByCategory(
    userId: string,
    category: string
  ): Promise<AchievementProgress[]> {
    const allAchievements = await this.getUserAchievements(userId);
    return allAchievements.filter((ap) => ap.achievement.category === category);
  }

  /**
   * Get achievement statistics for a user
   */
  async getAchievementStats(userId: string) {
    const achievements = await this.getUserAchievements(userId);
    const unlocked = achievements.filter((a) => a.isUnlocked);

    const byImportance = {
      common: unlocked.filter((a) => a.achievement.importance === "common")
        .length,
      rare: unlocked.filter((a) => a.achievement.importance === "rare").length,
      epic: unlocked.filter((a) => a.achievement.importance === "epic").length,
      legendary: unlocked.filter(
        (a) => a.achievement.importance === "legendary"
      ).length,
    };

    const byCategory = achievements.reduce(
      (acc, a) => {
        const category = a.achievement.category;
        if (!acc[category]) {
          acc[category] = { total: 0, unlocked: 0 };
        }
        acc[category].total++;
        if (a.isUnlocked) {
          acc[category].unlocked++;
        }
        return acc;
      },
      {} as Record<string, { total: number; unlocked: number }>
    );

    return {
      total: achievements.length,
      unlocked: unlocked.length,
      percentage:
        achievements.length === 0
          ? 0
          : Math.round((unlocked.length / achievements.length) * 100),
      byImportance,
      byCategory,
    };
  }
}

export const achievementService = new AchievementService();
