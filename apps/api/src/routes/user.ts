import express from "express";
import db from "../db";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";

import {
  calculateLevelFromXp,
  calculateXpRewards,
  toDbDate,
} from "@questly/utils";
import { questInstance, user } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { processUserDailyXp } from "../utils/xp";

const router = express.Router();

router.get("/userStats", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currUser] = await db.select().from(user).where(eq(user.id, userId));
    const quests = await db
      .select({
        basePoints: questInstance.basePoints,
        completed: questInstance.completed,
      })
      .from(questInstance)
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, today.toISOString().split("T")[0])
        )
      );

    if (!currUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const levelStats = calculateLevelFromXp(currUser.xp);
    const todaysXp = calculateXpRewards(quests, levelStats.level, true).reduce(
      (sum, quest) => sum + quest.xpReward,
      0
    );

    const userStats = { levelStats, todaysXp, timezone: currUser.timezone };

    res.status(200).json({
      message: "User Stats retrived successfully",
      userStats,
    });
  } catch (err) {
    console.log("Error fetching user Stats:", err);
    res.status(500).json({ message: "Failed to fetch user Stats" });
  }
});

router.post("/calculateDailyXp", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { date } = req.body;

    // Default to yesterday if no date provided
    const processDate =
      date ||
      (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return toDbDate(yesterday);
      })();

    const result = await processUserDailyXp(userId, processDate);

    res.status(200).json({
      message: "XP calculation completed",
      result,
    });
  } catch (err) {
    console.error("Error calculating XP:", err);
    res.status(500).json({ message: "Failed to calculate XP" });
  }
});

router.patch("/updateTimezone", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { timezone } = req.body;

    if (!timezone) {
      return res.status(400).json({
        message: "Timezone is required",
        success: false,
      });
    }

    await db
      .update(user)
      .set({
        timezone,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    res.status(200).json({
      message: "Timezone updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error updating timezone:", err);
    res
      .status(500)
      .json({ message: "Failed to update timezone", success: false });
  }
});

export default router;
