import cron from "node-cron";

import { toDbDate } from "@questly/utils";
import db from "../src/db";
import { user } from "../src/db/schema";
import { processUserDailyXp } from "../src/utils/xp";

// Schedule the job to run at midnight (00:00)
export function initXpScheduler() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Running daily XP calculation job");

      try {
        // Get yesterday's date in YYYY-MM-DD format
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = toDbDate(yesterday);

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
    },
    {
      timezone: "UTC",
    }
  );

  console.log("XP scheduler initialized");
}
