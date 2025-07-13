import cron from "node-cron";

import { toDbDate } from "@questly/utils";
import db from "../src/db";
import { user, questInstance } from "../src/db/schema";
import { processUserDailyXp } from "../src/utils/xp";
import { eq, and, isNull, ne, not } from "drizzle-orm";

// Function to run the XP calculation job
async function runXpCalculationJob() {
  console.log("Running daily XP calculation job");

  try {
    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = toDbDate(yesterday);

    // Check if there's at least one quest instance from yesterday with non-zero and non-null xpReward
    const instancesWithXp = await db
      .select({ id: questInstance.id })
      .from(questInstance)
      .where(
        and(
          eq(questInstance.date, yesterdayString),
          ne(questInstance.xpReward, 0),
          not(isNull(questInstance.xpReward))
        )
      )
      .limit(1);

    // Skip the job if we found any instances with XP already calculated
    if (instancesWithXp.length > 0) {
      console.log(
        "Found quest instances with XP already calculated for yesterday. Skipping job."
      );
      return;
    }

    // Get all active users
    const users = await db.select({ id: user.id }).from(user);

    // Process XP for each user
    for (const user of users) {
      try {
        const result = await processUserDailyXp(user.id, yesterdayString);
        console.log(`XP processed for user ${user.id}:`, result);
      } catch (error) {
        console.error(`Error processing XP for user ${user.id}:`, error);
      }
    }

    console.log("Daily XP calculation job completed");
  } catch (error) {
    console.error("Error in daily XP calculation job:", error);
  }
}

// Schedule the job to run at midnight (00:00)
export function initXpScheduler() {
  // Schedule the job to run daily
  cron.schedule("0 0 * * *", runXpCalculationJob, {
    timezone: "UTC",
  });

  // Run the job immediately upon initialization
  runXpCalculationJob()
    .then(() => console.log("Initial XP calculation job completed"))
    .catch((error) =>
      console.error("Error in initial XP calculation job:", error)
    );

  console.log("XP scheduler initialized");
}
