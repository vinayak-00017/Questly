import db from "../db";
import { questInstance, user } from "../db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import { toDbDate } from "@questly/utils";

/**
 * Calculate and update user's streak based on completed quest instances
 * A streak day is counted if the user has completed at least 1 quest instance on that day
 */
export async function calculateUserStreak(userId: string, userTimezone: string = "UTC"): Promise<{
  streak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
}> {
  try {
    // Get current date in user's timezone
    const currentUTC = new Date();
    const userLocalTime = new Date(
      currentUTC.toLocaleString("en-US", {
        timeZone: userTimezone,
      })
    );
    const todayString = toDbDate(userLocalTime);

    // Get all dates where user has completed at least 1 quest instance
    // Order by date descending to calculate streak from most recent
    const activeDates = await db
      .select({
        date: questInstance.date,
        completedCount: sql<number>`count(*)`.as('completed_count'),
      })
      .from(questInstance)
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.completed, true)
        )
      )
      .groupBy(questInstance.date)
      .having(sql`count(*) > 0`)
      .orderBy(desc(questInstance.date));

    if (activeDates.length === 0) {
      return {
        streak: 0,
        lastActiveDate: null,
        isActiveToday: false,
      };
    }

    const activeDateStrings = activeDates.map(d => d.date);
    const isActiveToday = activeDateStrings.includes(todayString);
    const lastActiveDate = activeDateStrings[0];

    // Calculate streak by counting consecutive days from the most recent active date
    let streak = 0;
    let currentDate = new Date(lastActiveDate);

    // If user is not active today, start from yesterday
    if (!isActiveToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count consecutive days backwards
    while (true) {
      const dateString = toDbDate(currentDate);
      
      if (activeDateStrings.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // If user was active today, include today in the streak
    if (isActiveToday) {
      // Streak already includes today from the loop above
    } else {
      // If user wasn't active today, check if streak should be reset
      const yesterday = new Date(userLocalTime);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = toDbDate(yesterday);
      
      // If user wasn't active yesterday either, reset streak
      if (!activeDateStrings.includes(yesterdayString)) {
        streak = 0;
      }
    }

    return {
      streak,
      lastActiveDate,
      isActiveToday,
    };
  } catch (error) {
    console.error(`Error calculating streak for user ${userId}:`, error);
    return {
      streak: 0,
      lastActiveDate: null,
      isActiveToday: false,
    };
  }
}

/**
 * Update user's streak in the database
 */
export async function updateUserStreak(userId: string, userTimezone: string = "UTC"): Promise<{
  success: boolean;
  streak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
}> {
  try {
    const streakData = await calculateUserStreak(userId, userTimezone);
    
    await db
      .update(user)
      .set({
        streak: streakData.streak,
        lastActiveDate: streakData.lastActiveDate,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    console.log(`Updated streak for user ${userId}: ${streakData.streak} days`);

    return {
      success: true,
      ...streakData,
    };
  } catch (error) {
    console.error(`Error updating streak for user ${userId}:`, error);
    return {
      success: false,
      streak: 0,
      lastActiveDate: null,
      isActiveToday: false,
    };
  }
}

/**
 * Calculate streaks for all users (used by scheduler)
 */
export async function updateAllUserStreaks(): Promise<{
  processedUsers: number;
  errors: number;
}> {
  try {
    console.log("Updating streaks for all users...");

    // Get all users
    const allUsers = await db
      .select({
        id: user.id,
        timezone: user.timezone,
      })
      .from(user);

    let processedUsers = 0;
    let errors = 0;

    for (const userRecord of allUsers) {
      try {
        await updateUserStreak(userRecord.id, userRecord.timezone);
        processedUsers++;
      } catch (error) {
        console.error(`Error updating streak for user ${userRecord.id}:`, error);
        errors++;
      }
    }

    console.log(`Streak update complete: ${processedUsers} users processed, ${errors} errors`);

    return {
      processedUsers,
      errors,
    };
  } catch (error) {
    console.error("Error updating all user streaks:", error);
    return {
      processedUsers: 0,
      errors: 1,
    };
  }
}