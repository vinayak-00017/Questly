import { achievementService } from "./achievement.service";
import type { Achievement } from "@questly/utils";

export type AchievementEvent =
  | "quest_completed"
  | "main_quest_completed"
  | "side_quest_completed"
  | "task_completed"
  | "xp_earned"
  | "streak_updated"
  | "quest_added"
  | "main_quest_added";

export interface AchievementEventData {
  userId: string;
  event: AchievementEvent;
  value?: number;
  metadata?: Record<string, any>;
}

export interface AchievementUnlockedResult {
  newAchievements: Achievement[];
  totalUnlocked: number;
}

class AchievementEventService {
  private eventQueue: AchievementEventData[] = [];
  private processing = false;

  /**
   * Emit an achievement event
   */
  async emit(
    eventData: AchievementEventData
  ): Promise<AchievementUnlockedResult> {
    // Add to queue for batch processing if needed
    this.eventQueue.push(eventData);

    // Process immediately for now, but could be batched for performance
    return await this.processEvent(eventData);
  }

  /**
   * Process a single achievement event
   */
  private async processEvent(
    eventData: AchievementEventData
  ): Promise<AchievementUnlockedResult> {
    try {
      const newAchievements =
        await achievementService.checkAndUnlockAchievements(eventData.userId);

      if (newAchievements.length > 0) {
        console.log(
          `🏆 User ${eventData.userId} unlocked ${newAchievements.length} new achievements:`,
          newAchievements.map((a) => a.name).join(", ")
        );
      }

      return {
        newAchievements,
        totalUnlocked: newAchievements.length,
      };
    } catch (error) {
      console.error("Error processing achievement event:", error);
      return {
        newAchievements: [],
        totalUnlocked: 0,
      };
    }
  }

  /**
   * Emit quest completion event
   */
  async onQuestCompleted(
    userId: string,
    questType: "main" | "side" = "side"
  ): Promise<AchievementUnlockedResult> {
    const events: AchievementEventData[] = [
      { userId, event: "quest_completed" },
    ];

    if (questType === "main") {
      events.push({ userId, event: "main_quest_completed" });
    } else {
      events.push({ userId, event: "side_quest_completed" });
    }

    // Process all related events
    let totalNewAchievements: Achievement[] = [];
    for (const event of events) {
      const result = await this.emit(event);
      totalNewAchievements = [
        ...totalNewAchievements,
        ...result.newAchievements,
      ];
    }

    return {
      newAchievements: totalNewAchievements,
      totalUnlocked: totalNewAchievements.length,
    };
  }

  /**
   * Emit task completion event
   */
  async onTaskCompleted(userId: string): Promise<AchievementUnlockedResult> {
    return await this.emit({ userId, event: "task_completed" });
  }

  /**
   * Emit XP earned event
   */
  async onXpEarned(
    userId: string,
    xpAmount: number
  ): Promise<AchievementUnlockedResult> {
    return await this.emit({
      userId,
      event: "xp_earned",
      value: xpAmount,
      metadata: { xpAmount },
    });
  }

  /**
   * Emit streak updated event
   */
  async onStreakUpdated(
    userId: string,
    newStreak: number
  ): Promise<AchievementUnlockedResult> {
    return await this.emit({
      userId,
      event: "streak_updated",
      value: newStreak,
      metadata: { streak: newStreak },
    });
  }

  /**
   * Emit quest added event
   */
  async onQuestAdded(
    userId: string,
    questType: "main" | "side" = "side"
  ): Promise<AchievementUnlockedResult> {
    const events: AchievementEventData[] = [{ userId, event: "quest_added" }];

    if (questType === "main") {
      events.push({ userId, event: "main_quest_added" });
    }

    // Process all related events
    let totalNewAchievements: Achievement[] = [];
    for (const event of events) {
      const result = await this.emit(event);
      totalNewAchievements = [
        ...totalNewAchievements,
        ...result.newAchievements,
      ];
    }

    return {
      newAchievements: totalNewAchievements,
      totalUnlocked: totalNewAchievements.length,
    };
  }

  /**
   * Process queued events in batch (for future optimization)
   */
  async processQueue(): Promise<void> {
    if (this.processing || this.eventQueue.length === 0) {
      return;
    }

    this.processing = true;
    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Group events by user for batch processing
      const eventsByUser = events.reduce(
        (acc, event) => {
          if (!acc[event.userId]) {
            acc[event.userId] = [];
          }
          acc[event.userId].push(event);
          return acc;
        },
        {} as Record<string, AchievementEventData[]>
      );

      // Process all events for each user
      for (const [userId, userEvents] of Object.entries(eventsByUser)) {
        for (const event of userEvents) {
          await this.processEvent(event);
        }
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * Get event queue status (for debugging)
   */
  getQueueStatus() {
    return {
      queueLength: this.eventQueue.length,
      processing: this.processing,
    };
  }
}

export const achievementEventService = new AchievementEventService();
