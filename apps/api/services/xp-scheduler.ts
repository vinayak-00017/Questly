import cron from "node-cron";
import db from "../src/db";
import { questInstance, user } from "../src/db/schema";
import { processUserDailyXp } from "../src/utils/xp";
import { updateUserStreak } from "../src/utils/streak";
import { getUsersAtMidnight } from "./timezone-utils";
import { toDbDate } from "@questly/utils";
import { eq, and, isNull, ne, not } from "drizzle-orm";

// Helper function to get yesterday's date in user's timezone using the same format as quest creation
function getUserYesterdayDate(userTimezone: string): string {
  const currentUTC = new Date();

  // Get current time in user's timezone
  const userLocalTime = new Date(
    currentUTC.toLocaleString("en-US", {
      timeZone: userTimezone || "UTC",
    })
  );

  // Get yesterday in user's timezone
  const yesterday = new Date(userLocalTime);
  yesterday.setDate(yesterday.getDate() - 1);

  // Use the same toDbDate function that quest creation uses
  return toDbDate(yesterday);
}

// Function to calculate XP and update streaks for users at their midnight
async function calculateXpForUsers(
  users: Array<{ id: string; timezone: string }>
) {
  if (users.length === 0) return;

  try {
    console.log(
      `🎯 Calculating XP and updating streaks for ${users.length} users at their local midnight...`
    );

    let processedUsers = 0;
    let totalXpAwarded = 0;
    let streaksUpdated = 0;

    for (const userRecord of users) {
      try {
        // Get yesterday's date in the user's timezone using the same format as quest creation
        const yesterdayString = getUserYesterdayDate(userRecord.timezone);

        console.log(
          `Processing user ${userRecord.id} for date: ${yesterdayString} (timezone: ${userRecord.timezone})`
        );

        // Check if XP has already been calculated
        const existingXpInstances = await db
          .select({ id: questInstance.id })
          .from(questInstance)
          .where(
            and(
              eq(questInstance.userId, userRecord.id),
              eq(questInstance.date, yesterdayString),
              ne(questInstance.xpReward, 0),
              not(isNull(questInstance.xpReward))
            )
          )
          .limit(1);

        if (existingXpInstances.length > 0) {
          console.log(
            `XP already calculated for user ${userRecord.id} for ${yesterdayString}`
          );
          // Still update streak even if XP was already calculated
          try {
            const streakResult = await updateUserStreak(
              userRecord.id,
              userRecord.timezone
            );
            if (streakResult.success) {
              streaksUpdated++;
              console.log(
                `🔥 Streak updated for user ${userRecord.id}: ${streakResult.streak} days`
              );
            }
          } catch (error) {
            console.error(
              `Error updating streak for user ${userRecord.id}:`,
              error
            );
          }
          continue;
        }

        // Check if there are quest instances that need XP calculation
        const instancesNeedingXp = await db
          .select({
            id: questInstance.id,
            title: questInstance.title,
            completed: questInstance.completed,
            basePoints: questInstance.basePoints,
          })
          .from(questInstance)
          .where(
            and(
              eq(questInstance.userId, userRecord.id),
              eq(questInstance.date, yesterdayString),
              isNull(questInstance.xpReward)
            )
          );

        if (instancesNeedingXp.length === 0) {
          console.log(
            `No quest instances found for user ${userRecord.id} on ${yesterdayString}`
          );
          // Still update streak
          try {
            const streakResult = await updateUserStreak(
              userRecord.id,
              userRecord.timezone
            );
            if (streakResult.success) {
              streaksUpdated++;
              console.log(
                `🔥 Streak updated for user ${userRecord.id}: ${streakResult.streak} days`
              );
            }
          } catch (error) {
            console.error(
              `Error updating streak for user ${userRecord.id}:`,
              error
            );
          }
          continue;
        }

        // Process XP for this user
        const result = await processUserDailyXp(userRecord.id, yesterdayString);

        if (result.success && result.xpEarned && result.xpEarned > 0) {
          processedUsers++;
          totalXpAwarded += result.xpEarned;
          console.log(
            `✅ XP processed for user ${userRecord.id}: ${result.xpEarned} XP (Level ${result.previousLevel} → ${result.newLevel})`
          );
        } else {
          console.log(
            `⚠️ No XP to award for user ${userRecord.id}: ${result.message || "No quests to process"}`
          );
        }

        // Update user's streak after XP calculation
        try {
          const streakResult = await updateUserStreak(
            userRecord.id,
            userRecord.timezone
          );
          if (streakResult.success) {
            streaksUpdated++;
            console.log(
              `🔥 Streak updated for user ${userRecord.id}: ${streakResult.streak} days (Active today: ${streakResult.isActiveToday})`
            );
          }
        } catch (error) {
          console.error(
            `Error updating streak for user ${userRecord.id}:`,
            error
          );
        }
      } catch (error) {
        console.error(`❌ Error processing user ${userRecord.id}:`, error);
      }
    }

    console.log(
      `🎯 Processing complete: ${processedUsers} users got XP (${totalXpAwarded} total XP), ${streaksUpdated} streaks updated`
    );
  } catch (error) {
    console.error("Error in XP and streak calculation:", error);
  }
}

// Function to calculate XP for all users who need it (used on server restart)
async function calculateXpForAllUsersWhoNeedIt() {
  try {
    console.log(
      "Checking all users for missing XP calculations on server restart..."
    );

    // Get all users
    const allUsers = await db
      .select({
        id: user.id,
        timezone: user.timezone,
      })
      .from(user);

    const usersNeedingXp = [];

    // Check each user to see if they need XP calculated for yesterday
    for (const userRecord of allUsers) {
      try {
        // Get yesterday's date in the user's timezone using consistent format
        const yesterdayString = getUserYesterdayDate(userRecord.timezone);

        // Check if XP has already been calculated for yesterday
        const existingXpInstances = await db
          .select({ id: questInstance.id })
          .from(questInstance)
          .where(
            and(
              eq(questInstance.userId, userRecord.id),
              eq(questInstance.date, yesterdayString),
              ne(questInstance.xpReward, 0),
              not(isNull(questInstance.xpReward))
            )
          )
          .limit(1);

        // Check if there are any quest instances for yesterday that need XP calculation
        const instancesNeedingXp = await db
          .select({ id: questInstance.id })
          .from(questInstance)
          .where(
            and(
              eq(questInstance.userId, userRecord.id),
              eq(questInstance.date, yesterdayString),
              isNull(questInstance.xpReward)
            )
          )
          .limit(1);

        if (existingXpInstances.length === 0 && instancesNeedingXp.length > 0) {
          usersNeedingXp.push(userRecord);
        }
      } catch (error) {
        console.error(
          `Error checking XP status for user ${userRecord.id}:`,
          error
        );
      }
    }

    if (usersNeedingXp.length > 0) {
      console.log(
        `Found ${usersNeedingXp.length} users who need XP calculated for yesterday`
      );
      await calculateXpForUsers(usersNeedingXp);
    } else {
      console.log("All users already have XP calculated for yesterday");

      // Still update streaks for all users on server restart
      console.log("Updating streaks for all users on server restart...");
      let streaksUpdated = 0;
      for (const userRecord of allUsers) {
        try {
          const streakResult = await updateUserStreak(
            userRecord.id,
            userRecord.timezone
          );
          if (streakResult.success) {
            streaksUpdated++;
          }
        } catch (error) {
          console.error(
            `Error updating streak for user ${userRecord.id}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error("Error calculating XP for all users who need it:", error);
  }
}

// Check if XP calculation should run immediately for any users
async function shouldRunXpCalculationImmediately() {
  try {
    // Get all users to check if they need XP calculated for yesterday
    const allUsers = await db
      .select({
        id: user.id,
        timezone: user.timezone,
      })
      .from(user);

    // For each user, check if they have uncalculated XP for yesterday
    for (const userRecord of allUsers) {
      try {
        const yesterdayString = getUserYesterdayDate(userRecord.timezone);

        // Check if there are quest instances that need XP calculation
        const instancesNeedingXp = await db
          .select({ id: questInstance.id })
          .from(questInstance)
          .where(
            and(
              eq(questInstance.userId, userRecord.id),
              eq(questInstance.date, yesterdayString),
              isNull(questInstance.xpReward)
            )
          )
          .limit(1);

        if (instancesNeedingXp.length > 0) {
          return true; // At least one user needs XP calculation
        }
      } catch (error) {
        console.error(
          `Error checking XP status for user ${userRecord.id}:`,
          error
        );
      }
    }

    return false; // All users already have XP calculated
  } catch (error) {
    console.error("Error checking if XP calculation should run:", error);
    return false; // On error, default to not running
  }
}

// Timezone-aware job that runs every hour
async function processTimezoneAwareXp() {
  try {
    // Get users who are at midnight in their timezone (shared logic)
    const usersAtMidnight = await getUsersAtMidnight();

    if (usersAtMidnight.length > 0) {
      console.log(
        `🌙 Found ${usersAtMidnight.length} users at midnight in their timezone for XP calculation and streak update`
      );
      await calculateXpForUsers(usersAtMidnight);
    } else {
      console.log("⏰ No users at midnight currently");
    }
  } catch (error) {
    console.error("Error in timezone-aware XP processing:", error);
  }
}

// Manual trigger for testing/debugging
export async function triggerXpCalculation() {
  console.log("Manually triggering XP calculation and streak update job");
  return await processTimezoneAwareXp();
}

// Initialize the timezone-aware XP scheduler
export function initXpScheduler() {
  console.log("Initializing timezone-aware XP scheduler with streak system...");

  // Schedule to run every hour to check for users at midnight
  cron.schedule("0 * * * *", processTimezoneAwareXp);

  console.log("Timezone-aware XP scheduler set to run every hour");

  // Check if we should run immediately (on server start)
  setTimeout(async () => {
    try {
      const runNow = await shouldRunXpCalculationImmediately();
      if (runNow) {
        console.log(
          "🔄 Server restart detected and some users need XP calculated - running XP calculation job for all users now"
        );
        await calculateXpForAllUsersWhoNeedIt();
      } else {
        console.log("✅ All users already have XP calculated for yesterday");

        // Still update streaks for all users on server restart
        console.log("🔥 Updating streaks for all users on server restart...");
        const allUsers = await db
          .select({
            id: user.id,
            timezone: user.timezone,
          })
          .from(user);

        let streaksUpdated = 0;
        for (const userRecord of allUsers) {
          try {
            const streakResult = await updateUserStreak(
              userRecord.id,
              userRecord.timezone
            );
            if (streakResult.success) {
              streaksUpdated++;
            }
          } catch (error) {
            console.error(
              `Error updating streak for user ${userRecord.id}:`,
              error
            );
          }
        }
      }
    } catch (error) {
      console.error("Error in XP scheduler initialization check:", error);
    }
  }, 5000); // 5 second delay to ensure server is fully initialized

  console.log("XP scheduler with streak system initialized successfully");
}
