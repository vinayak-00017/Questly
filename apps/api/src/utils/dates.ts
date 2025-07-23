import { eq } from "drizzle-orm";
import db from "../db";
import { user } from "../db/schema";

export async function getUserTimezone(userId: string): Promise<string> {
  try {
    const userTimezoneResult = await db
      .select({ timezone: user.timezone })
      .from(user)
      .where(eq(user.id, userId));

    if (userTimezoneResult.length === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return userTimezoneResult[0].timezone;
  } catch (error) {
    console.error(`Error fetching timezone for user ${userId}:`, error);
    return "UTC"; // Fallback to UTC on error
  }
}
