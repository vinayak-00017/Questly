import cron from "node-cron";
import axios from "axios";
import db from "../src/db";
import { questInstance, user } from "../src/db/schema";
import { getSchedulerToken } from "../lib/auth";
import { eq } from "drizzle-orm";

// Function to generate daily quests for all users
async function generateDailyQuestsForAllUsers() {
  try {
    console.log("Starting daily quest generation job...");

    // Get scheduler token for internal API calls
    const schedulerToken = await getSchedulerToken();

    // Get all active users
    const users = await db.select().from(user);
    console.log(`Found ${users.length} users to process`);

    // Generate quest instances for each user
    const results = await Promise.allSettled(
      users.map(async (user) => {
        try {
          // Make internal API call to generate quests for this user
          await axios.post(
            `${process.env.API_URL}/instance/generate-daily-instances`,
            {},
            {
              headers: {
                Authorization: `Bearer ${schedulerToken}`,
                "X-User-Id": user.id,
              },
            }
          );
          return user.id;
        } catch (error) {
          console.error(
            `Failed to generate quests for user ${user.id}:`,
            error
          );
          throw error;
        }
      })
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failCount = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Daily quests generation complete: ${successCount} succeeded, ${failCount} failed`
    );
  } catch (error) {
    console.error("Error in daily quest generation job:", error);
  }
}

// Check if quest generation should run immediately
async function shouldRunImmediately() {
  try {
    // Get the current date in local timezone
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find any quest instance created today (to check if job already ran today)
    const todayInstances = await db
      .select()
      .from(questInstance)
      .where(eq(questInstance.date, today.toISOString().split("T")[0]))
      .limit(1);

    // If no instances for today exist, run the job
    return todayInstances.length === 0;
  } catch (error) {
    console.error("Error checking if quest generation should run:", error);
    return false; // On error, default to not running
  }
}

// Schedule the job to run at midnight every day
export async function initializeScheduler() {
  console.log("Initializing quest scheduler...");

  // Schedule to run at midnight every day
  cron.schedule("0 0 * * *", generateDailyQuestsForAllUsers);

  // Check if we should run immediately (on server start)
  const runNow = await shouldRunImmediately();
  if (runNow) {
    console.log(
      "Server restart detected and no quests for today - running generation job now"
    );
    // Add a small delay to ensure server is fully initialized
    setTimeout(generateDailyQuestsForAllUsers, 5000);
  } else {
    console.log("Quests already generated for today or shouldn't run now");
  }

  console.log("Quest scheduler initialized successfully");
}
