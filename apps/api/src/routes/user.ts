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
import { performanceService } from "../../services/performance-service";

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

    const userStats = { 
      levelStats, 
      todaysXp, 
      timezone: currUser.timezone,
      timezoneSetExplicitly: currUser.timezoneSetExplicitly 
    };

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
        timezoneSetExplicitly: true,
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

router.get("/weeklyPerformance", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const result = await performanceService.getWeeklyPerformance(userId);

    // Transform response to match legacy format
    res.status(200).json({
      message: result.message,
      weeklyData: result.performanceData,
      summary: {
        averagePercentage: result.summary.averagePercentage,
        bestDay: {
          day: result.summary.bestPeriod.period,
          percentage: result.summary.bestPeriod.percentage,
        },
        totalPointsThisWeek: result.summary.totalPoints,
        activeDays: result.summary.activePeriods,
      },
    });
  } catch (err) {
    console.error("Error fetching weekly performance:", err);
    res.status(500).json({ message: "Failed to fetch weekly performance" });
  }
});

router.get("/performance", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const periodQuery = (req.query.period as string) || "weekly";

    // Validate and cast the period to the correct type
    const validPeriods = [
      "weekly",
      "monthly",
      "quarterly",
      "yearly",
      "overall",
    ] as const;
    type ValidPeriod = (typeof validPeriods)[number];

    const period: ValidPeriod = validPeriods.includes(
      periodQuery as ValidPeriod
    )
      ? (periodQuery as ValidPeriod)
      : "weekly";

    const result = await performanceService.getPerformance(userId, period);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching performance:", err);
    res.status(500).json({ message: "Failed to fetch performance data" });
  }
});

router.get("/questDetails", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const date = req.query.date as string;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    // Fetch quest instances for the specific date
    const quests = await db
      .select({
        id: questInstance.id,
        basePoints: questInstance.basePoints,
        completed: questInstance.completed,
        date: questInstance.date,
        templateId: questInstance.templateId,
        title: questInstance.title,
        description: questInstance.description,
      })
      .from(questInstance)
      .where(
        and(eq(questInstance.userId, userId), eq(questInstance.date, date))
      );

    // Transform quest data
    const questDetails = quests.map((quest) => ({
      id: quest.id,
      title: quest.title || `Quest ${quest.id}`,
      completed: quest.completed,
      points: quest.basePoints,
      category: "General", // You could determine this based on templateId later
      templateId: quest.templateId,
      description: quest.description,
    }));

    const totalQuests = quests.length;
    const completedQuests = quests.filter((q) => q.completed).length;
    const totalPoints = quests.reduce((sum, q) => sum + q.basePoints, 0);
    const completedPoints = quests
      .filter((q) => q.completed)
      .reduce((sum, q) => sum + q.basePoints, 0);

    res.status(200).json({
      message: "Quest details retrieved successfully",
      date,
      totalQuests,
      completedQuests,
      totalPoints,
      completedPoints,
      completionPercentage:
        totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0,
      quests: questDetails,
    });
  } catch (err) {
    console.error("Error fetching quest details:", err);
    res.status(500).json({ message: "Failed to fetch quest details" });
  }
});

export default router;
