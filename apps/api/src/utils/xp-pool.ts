import db from "../db";
import { questInstance, user } from "../db/schema";
import { and, eq, sum, isNotNull } from "drizzle-orm";
import { getXpCapForLevel, calculateLevelFromXp } from "@questly/utils";

/**
 * Get remaining XP pool for a user on a specific date
 * Returns how much XP is still available to be awarded that day
 */
export async function getRemainingDailyXpPool(
  userId: string,
  date: string
): Promise<{ remainingXp: number; totalCap: number; consumedXp: number }> {
  // Get user's current level to determine daily cap
  const [userData] = await db
    .select({ xp: user.xp })
    .from(user)
    .where(eq(user.id, userId));

  if (!userData) {
    return { remainingXp: 0, totalCap: 0, consumedXp: 0 };
  }

  const userLevel = calculateLevelFromXp(userData.xp).level;
  const dailyCap = getXpCapForLevel(userLevel);

  // Calculate how much XP has already been awarded today
  const [consumedResult] = await db
    .select({
      totalConsumed: sum(questInstance.xpReward),
    })
    .from(questInstance)
    .where(
      and(
        eq(questInstance.userId, userId),
        eq(questInstance.date, date),
        isNotNull(questInstance.xpReward)
      )
    );

  const consumedXp = Number(consumedResult?.totalConsumed) || 0;
  const remainingXp = Math.max(0, dailyCap - consumedXp);

  return {
    remainingXp,
    totalCap: dailyCap,
    consumedXp,
  };
}

/**
 * Calculate XP rewards for quests showing realistic potential for incomplete quests
 * For completed quests: returns their actual stored XP
 * For incomplete quests: shows what they would get if completed right now
 */
export async function calculateXpWithPoolLimit(
  userId: string,
  date: string,
  quests: Array<{
    id: string;
    basePoints: number;
    completed?: boolean;
    currentXpReward?: number | null;
  }>
): Promise<
  Array<{
    id: string;
    basePoints: number;
    completed?: boolean;
    xpReward: number;
  }>
> {
  const { remainingXp } = await getRemainingDailyXpPool(userId, date);

  // Calculate total points of incomplete quests for proportional distribution
  const incompleteQuests = quests.filter((q) => !q.completed);

  // For incomplete quests, calculate what they would get if completed
  const totalIncompletePoints = incompleteQuests.reduce(
    (sum, quest) => sum + quest.basePoints,
    0
  );

  return quests.map((quest) => {
    if (quest.completed) {
      // For completed quests, return their actual stored XP reward
      return {
        ...quest,
        xpReward: quest.currentXpReward || 0,
      };
    } else {
      // For incomplete quests, show potential XP based on remaining pool
      if (totalIncompletePoints === 0 || remainingXp <= 0) {
        return { ...quest, xpReward: 0 };
      }

      // Calculate proportional share of remaining XP
      const proportionalXp = Math.round(
        (quest.basePoints / totalIncompletePoints) * remainingXp
      );

      return {
        ...quest,
        xpReward: proportionalXp,
      };
    }
  });
}

/**
 * Check if a quest completion would exceed the daily XP pool
 * Returns the actual XP that can be awarded (may be less than calculated)
 */
export async function getValidatedXpReward(
  userId: string,
  date: string,
  calculatedXp: number
): Promise<number> {
  const { remainingXp } = await getRemainingDailyXpPool(userId, date);

  // Return the minimum of calculated XP and remaining pool
  return Math.min(calculatedXp, remainingXp);
}

/**
 * Get a detailed breakdown of XP status for debugging
 */
export async function getXpBreakdown(
  userId: string,
  date: string
): Promise<{
  userLevel: number;
  dailyCap: number;
  consumedXp: number;
  remainingXp: number;
  percentageUsed: number;
  completedQuests: number;
  incompleteQuests: number;
}> {
  // Get user level
  const [userData] = await db
    .select({ xp: user.xp })
    .from(user)
    .where(eq(user.id, userId));

  const userLevel = userData ? calculateLevelFromXp(userData.xp).level : 1;
  const dailyCap = getXpCapForLevel(userLevel);

  // Get XP pool status
  const { consumedXp, remainingXp } = await getRemainingDailyXpPool(
    userId,
    date
  );

  // Count completed vs incomplete quests
  const questCounts = await db
    .select({
      completed: questInstance.completed,
    })
    .from(questInstance)
    .where(and(eq(questInstance.userId, userId), eq(questInstance.date, date)));

  const completedQuests = questCounts.filter((q) => q.completed).length;
  const incompleteQuests = questCounts.filter((q) => !q.completed).length;

  return {
    userLevel,
    dailyCap,
    consumedXp,
    remainingXp,
    percentageUsed:
      dailyCap > 0 ? Math.round((consumedXp / dailyCap) * 100) : 0,
    completedQuests,
    incompleteQuests,
  };
}
