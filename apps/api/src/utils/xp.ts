import db from "../db";
import { calculateXpRewards, calculateLevelFromXp } from "@questly/utils";
import { questInstance, user } from "../db/schema";
import { and, eq, sql } from "drizzle-orm";

/**
 * Process completed quests for a user and award XP
 * Called at midnight to calculate all XP gained during the day
 */

export async function processUserDailyXp(userId: string, date: string) {
  return await db.transaction(async (trx) => {
    // Get the user's current XP and level
    const [userData] = await trx
      .select({ xp: user.xp })
      .from(user)
      .where(eq(user.id, userId));

    if (!userData) return { success: false, message: "User not found" };

    const currentXp = userData.xp;
    const currentLevel = calculateLevelFromXp(currentXp).level;

    //  Get all completed quests for the given date that haven't had XP awarded yet
    const totalQuests = await trx
      .select({
        id: questInstance.id,
        basePoints: questInstance.basePoints,
        completed: questInstance.completed,
        xpReward: questInstance.xpReward,
      })
      .from(questInstance)
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, date),
          sql`${questInstance.xpReward} IS NULL`
        )
      );

    if (totalQuests.length === 0) {
      return { success: true, message: "No new quests to process" };
    }

    // Calculate XP rewards based on quest points and user level
    const questsWithXp = calculateXpRewards(totalQuests, currentLevel);
    const totalXpEarned = questsWithXp.reduce(
      (sum, quest) => sum + quest.xpReward,
      0
    );

    // Update the quests with their XP rewards
    for (const quest of questsWithXp) {
      await trx
        .update(questInstance)
        .set({ xpReward: quest.xpReward })
        .where(eq(questInstance.id, quest.id));
    }

    // Add the XP to the user's total
    await trx
      .update(user)
      .set({
        xp: currentXp + totalXpEarned,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    return {
      success: true,
      xpEarned: totalXpEarned,
      newTotalXp: currentXp + totalXpEarned,
      previousLevel: currentLevel,
      newLevel: calculateLevelFromXp(currentXp + totalXpEarned).level,
    };
  });
}
