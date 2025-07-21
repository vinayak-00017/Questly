import db from "../src/db";
import { user } from "../src/db/schema";

// Shared function to get users who are at midnight in their timezone
export async function getUsersAtMidnight() {
  try {
    const currentUTC = new Date();
    const users = await db
      .select({
        id: user.id,
        timezone: user.timezone,
      })
      .from(user);

    // Filter users whose local time is midnight (00:00)
    const usersAtMidnight = users.filter((userRecord) => {
      try {
        // Get the current time in user's timezone
        const userLocalTime = new Date(
          currentUTC.toLocaleString("en-US", {
            timeZone: userRecord.timezone || "UTC",
          })
        );

        // Check if it's midnight in their timezone (between 00:00 and 00:59)
        return userLocalTime.getHours() === 0;
      } catch {
        console.error(
          `Invalid timezone for user ${userRecord.id}: ${userRecord.timezone}`
        );
        return false;
      }
    });

    return usersAtMidnight;
  } catch (error) {
    console.error("Error getting users at midnight:", error);
    return [];
  }
}