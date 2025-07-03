import * as cron from "node-cron";
import axios from "axios";
import db from "../src/db";
import { questInstance, user } from "../src/db/schema";
import { getSchedulerToken } from "../lib/auth";
import { eq, and } from "drizzle-orm";

// Function to get users who should have quests generated at this hour
async function getUsersForQuestGeneration() {
  try {
    const currentUTC = new Date();
    const users = await db.select({
      id: user.id,
      timezone: user.timezone,
    }).from(user);

    // Filter users whose local time is midnight (00:00)
    const usersAtMidnight = users.filter(userRecord => {
      try {
        // Get the current time in user's timezone
        const userLocalTime = new Date(currentUTC.toLocaleString("en-US", {
          timeZone: userRecord.timezone || "UTC"
        }));
        
        // Check if it's midnight in their timezone (between 00:00 and 00:59)
        return userLocalTime.getHours() === 0;
      } catch {
        console.error(`Invalid timezone for user ${userRecord.id}: ${userRecord.timezone}`);
        return false;
      }
    });

    return usersAtMidnight;
  } catch (error) {
    console.error("Error getting users for quest generation:", error);
    return [];
  }
}

// Function to generate daily quests for specific users
async function generateDailyQuestsForUsers(users: Array<{id: string, timezone: string}>) {
  if (users.length === 0) return;

  try {
    console.log(`Starting quest generation for ${users.length} users at their local midnight...`);

    // Get scheduler token for internal API calls
    const schedulerToken = await getSchedulerToken();

    // Generate quest instances for each user
    const results = await Promise.allSettled(
      users.map(async (userRecord) => {
        try {
          // Make internal API call to generate quests for this user
          await axios.post(
            `${process.env.API_URL}/instance/generate-daily-instances`,
            {},
            {
              headers: {
                Authorization: `Bearer ${schedulerToken}`,
                "X-User-Id": userRecord.id,
              },
            }
          );
          return userRecord.id;
        } catch (error) {
          console.error(
            `Failed to generate quests for user ${userRecord.id}:`,
            error
          );
          throw error;
        }
      })
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failCount = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Quest generation complete for timezone batch: ${successCount} succeeded, ${failCount} failed`
    );
  } catch (error) {
    console.error("Error in quest generation job:", error);
  }
}

// Timezone-aware job that runs every hour
async function processTimezoneAwareQuests() {
  try {
    // Get users who are at midnight in their timezone
    const usersAtMidnight = await getUsersForQuestGeneration();
    
    if (usersAtMidnight.length > 0) {
      console.log(`Found ${usersAtMidnight.length} users at midnight in their timezone`);
      await generateDailyQuestsForUsers(usersAtMidnight);
    }
  } catch (error) {
    console.error("Error in timezone-aware quest processing:", error);
  }
}

// Check if quest generation should run immediately for any timezone
async function shouldRunImmediately() {
  try {
    // Get all users at their current midnight
    const usersAtMidnight = await getUsersForQuestGeneration();
    
    // For each user at midnight, check if they already have quests for today
    for (const userRecord of usersAtMidnight) {
      const userDate = new Date().toLocaleDateString("en-CA", {
        timeZone: userRecord.timezone || "UTC"
      }); // Gets YYYY-MM-DD format in user's timezone
      
      const existingInstances = await db
        .select()
        .from(questInstance)
        .where(
          and(
            eq(questInstance.userId, userRecord.id),
            eq(questInstance.date, userDate)
          )
        )
        .limit(1);
        
      if (existingInstances.length === 0) {
        return true; // At least one user needs quest generation
      }
    }
    
    return false; // All users at midnight already have quests
  } catch (error) {
    console.error("Error checking if quest generation should run:", error);
    return false; // On error, default to not running
  }
}

// Initialize the timezone-aware scheduler
export async function initializeScheduler() {
  console.log("Initializing timezone-aware quest scheduler...");

  // Schedule to run every hour to check for users at midnight
  cron.schedule("0 * * * *", processTimezoneAwareQuests);
  
  console.log("Timezone-aware quest scheduler set to run every hour");

  // Check if we should run immediately (on server start)
  const runNow = await shouldRunImmediately();
  if (runNow) {
    console.log(
      "Server restart detected and some users need quests - running generation job now"
    );
    // Add a small delay to ensure server is fully initialized
    setTimeout(processTimezoneAwareQuests, 5000);
  } else {
    console.log("All users at midnight already have quests or no users at midnight");
  }

  console.log("Quest scheduler initialized successfully");
}
