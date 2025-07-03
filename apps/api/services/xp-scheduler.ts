import * as cron from "node-cron";
import db from "../src/db";
import { user, questInstance } from "../src/db/schema";
import { processUserDailyXp } from "../src/utils/xp";
import { eq, and, isNull, ne, not } from "drizzle-orm";

// Function to get users who should have their XP calculated (users who just finished their day)
async function getUsersForXpCalculation() {
  try {
    const currentUTC = new Date();
    const users = await db.select({
      id: user.id,
      timezone: user.timezone,
    }).from(user);

    // Filter users whose local time is 1 AM (one hour after midnight, to process previous day)
    const usersAt1AM = users.filter(userRecord => {
      try {
        // Get the current time in user's timezone
        const userLocalTime = new Date(currentUTC.toLocaleString("en-US", {
          timeZone: userRecord.timezone || "UTC"
        }));
        
        // Check if it's 1 AM in their timezone (to process yesterday's XP)
        return userLocalTime.getHours() === 1;
      } catch {
        console.error(`Invalid timezone for user ${userRecord.id}: ${userRecord.timezone}`);
        return false;
      }
    });

    return usersAt1AM;
  } catch (error) {
    console.error("Error getting users for XP calculation:", error);
    return [];
  }
}

// Function to run XP calculation for specific users
async function processXpForUsers(users: Array<{id: string, timezone: string}>) {
  if (users.length === 0) return;

  console.log(`Processing XP for ${users.length} users at their local 1 AM...`);

  try {
    // Process XP for each user using their timezone
    for (const userRecord of users) {
      try {
        // Get yesterday's date in the user's timezone
        const userYesterday = new Date();
        userYesterday.setDate(userYesterday.getDate() - 1);
        const yesterdayInUserTz = userYesterday.toLocaleDateString("en-CA", {
          timeZone: userRecord.timezone || "UTC"
        }); // Gets YYYY-MM-DD format

        // Check if XP has already been calculated for this user's yesterday
        const instancesWithXp = await db
          .select({ id: questInstance.id })
          .from(questInstance)
          .where(
            and(
              eq(questInstance.userId, userRecord.id),
              eq(questInstance.date, yesterdayInUserTz),
              ne(questInstance.xpReward, 0),
              not(isNull(questInstance.xpReward))
            )
          )
          .limit(1);

        // Skip if XP already calculated
        if (instancesWithXp.length > 0) {
          console.log(`XP already calculated for user ${userRecord.id} for ${yesterdayInUserTz}`);
          continue;
        }

        const result = await processUserDailyXp(userRecord.id, yesterdayInUserTz);
        console.log(`XP processed for user ${userRecord.id} (${userRecord.timezone}):`, result);
      } catch (error) {
        console.error(`Error processing XP for user ${userRecord.id}:`, error);
      }
    }

    console.log("Timezone-aware XP calculation completed");
  } catch (error) {
    console.error("Error in timezone-aware XP calculation:", error);
  }
}

// Timezone-aware XP calculation job that runs every hour
async function processTimezoneAwareXp() {
  try {
    // Get users who are at 1 AM in their timezone (for processing yesterday's XP)
    const usersAt1AM = await getUsersForXpCalculation();
    
    if (usersAt1AM.length > 0) {
      console.log(`Found ${usersAt1AM.length} users at 1 AM in their timezone for XP processing`);
      await processXpForUsers(usersAt1AM);
    }
  } catch (error) {
    console.error("Error in timezone-aware XP processing:", error);
  }
}

// Schedule the job to run at midnight (00:00)
export function initXpScheduler() {
  // Schedule timezone-aware XP calculation to run every hour
  cron.schedule("0 * * * *", processTimezoneAwareXp);
  
  console.log("Timezone-aware XP scheduler set to run every hour");

  // Run the timezone-aware job immediately upon initialization
  processTimezoneAwareXp()
    .then(() => console.log("Initial timezone-aware XP calculation completed"))
    .catch((error) =>
      console.error("Error in initial timezone-aware XP calculation:", error)
    );

  console.log("XP scheduler initialized");
}
