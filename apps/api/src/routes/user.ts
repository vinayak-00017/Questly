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
import { calculateUserStreak } from "../utils/streak";
import { performanceService } from "../../services/performance-service";

const router = express.Router();

// New batched dashboard endpoint
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const period = (req.query.period as string) || "weekly";

    const [currUser] = await db.select().from(user).where(eq(user.id, userId));

    if (!currUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get today's date in the user's timezone using the same format as quest creation
    const currentUTC = new Date();
    const userLocalTime = new Date(
      currentUTC.toLocaleString("en-US", {
        timeZone: currUser.timezone || "UTC",
      })
    );

    // Use toDbDate to ensure consistent date format with quest creation
    const todayString = toDbDate(userLocalTime);

    console.log(
      `Dashboard: Getting data for user ${userId} on ${todayString} (timezone: ${currUser.timezone})`
    );

    // Validate period
    const validPeriods = [
      "weekly",
      "monthly",
      "quarterly",
      "yearly",
      "overall",
    ] as const;
    type ValidPeriod = (typeof validPeriods)[number];

    const validPeriod: ValidPeriod = validPeriods.includes(
      period as ValidPeriod
    )
      ? (period as ValidPeriod)
      : "weekly";

    // Run queries and heavy computations in parallel
    const todaysQuestsPromise = db
      .select({
        basePoints: questInstance.basePoints,
        completed: questInstance.completed,
        title: questInstance.title,
        xpReward: questInstance.xpReward,
        type: questInstance.type,
        description: questInstance.description,
        instanceId: questInstance.id,
        date: questInstance.date,
      })
      .from(questInstance)
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, todayString)
        )
      );

    const allQuestsPromise = db
      .select({
        instanceId: questInstance.id,
        title: questInstance.title,
        description: questInstance.description,
        basePoints: questInstance.basePoints,
        xpReward: questInstance.xpReward,
        completed: questInstance.completed,
        type: questInstance.type,
        date: questInstance.date,
        templateId: questInstance.templateId,
      })
      .from(questInstance)
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, todayString)
        )
      );

    const performancePromise = performanceService.getPerformance(
      userId,
      validPeriod
    );

    const streakPromise = calculateUserStreak(userId, currUser.timezone);

    const [todaysQuests, allQuests, performanceData, streakData] =
      await Promise.all([
        todaysQuestsPromise,
        allQuestsPromise,
        performancePromise,
        streakPromise,
      ]);

    console.log(`Dashboard: Found ${todaysQuests.length} quests for today`);

    // Calculate user stats
    const levelStats = calculateLevelFromXp(currUser.xp);

    // Calculate today's potential XP (what will be awarded at midnight)
    const todaysXp = calculateXpRewards(
      todaysQuests,
      levelStats.level,
      true
    ).reduce((sum, quest) => sum + quest.xpReward, 0);

    // Separate quests by type for today's quests
    const dailyQuests = allQuests.filter((q) => q.type === "daily");
    const sideQuests = allQuests.filter((q) => q.type === "side");

    const userStats = {
      levelStats,
      todaysXp,
      streak: streakData.streak,
      isActiveToday: streakData.isActiveToday,
      timezone: currUser.timezone,
      timezoneSetExplicitly: currUser.timezoneSetExplicitly,
    };

    console.log(
      `Dashboard: Calculated today's XP: ${todaysXp} for user ${userId}`
    );
    console.log(
      `Dashboard: Current streak: ${streakData.streak} days for user ${userId}`
    );

    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      userStats,
      todaysQuests: {
        dailyQuests,
        sideQuests,
      },
      performance: performanceData,
    });
  } catch (err) {
    console.log("Error fetching dashboard data:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

router.get("/userStats", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;

    const [currUser] = await db.select().from(user).where(eq(user.id, userId));

    if (!currUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get today's date in the user's timezone using the same format as quest creation
    const currentUTC = new Date();
    const userLocalTime = new Date(
      currentUTC.toLocaleString("en-US", {
        timeZone: currUser.timezone || "UTC",
      })
    );

    // Use toDbDate to ensure consistent date format with quest creation
    const todayString = toDbDate(userLocalTime);

    console.log(
      `UserStats: Getting quests for user ${userId} on ${todayString} (timezone: ${currUser.timezone})`
    );

    // Run quest fetch and streak calculation in parallel
    const questsPromise = db
      .select({
        basePoints: questInstance.basePoints,
        completed: questInstance.completed,
        title: questInstance.title,
        xpReward: questInstance.xpReward,
      })
      .from(questInstance)
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, todayString)
        )
      );

    const streakPromise = calculateUserStreak(userId, currUser.timezone);

    const [quests, streakData] = await Promise.all([
      questsPromise,
      streakPromise,
    ]);

    const levelStats = calculateLevelFromXp(currUser.xp);

    // Calculate today's potential XP (what will be awarded at midnight)
    const todaysXp = calculateXpRewards(quests, levelStats.level, true).reduce(
      (sum, quest) => sum + quest.xpReward,
      0
    );

    console.log(
      `UserStats: Calculated today's XP: ${todaysXp} for user ${userId}`
    );
    console.log(
      `UserStats: Current streak: ${streakData.streak} days for user ${userId}`
    );

    const userStats = {
      levelStats,
      todaysXp,
      streak: streakData.streak,
      isActiveToday: streakData.isActiveToday,
      timezone: currUser.timezone,
      timezoneSetExplicitly: currUser.timezoneSetExplicitly,
      hasCompletedOnboarding: currUser.hasCompletedOnboarding,
      onboardingStep: currUser.onboardingStep,
      hasCreatedFirstQuest: currUser.hasCreatedFirstQuest,
      createdAt: currUser.createdAt, // expose account creation date
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

    // Fetch quests for the date and user in parallel with the user for level calc
    const questsPromise = db
      .select({
        id: questInstance.id,
        type: questInstance.type,
        basePoints: questInstance.basePoints,
        completed: questInstance.completed,
        date: questInstance.date,
        templateId: questInstance.templateId,
        title: questInstance.title,
        description: questInstance.description,
        xpReward: questInstance.xpReward,
      })
      .from(questInstance)
      .where(
        and(eq(questInstance.userId, userId), eq(questInstance.date, date))
      );

    const userPromise = db.select().from(user).where(eq(user.id, userId));

    const [quests, userRows] = await Promise.all([questsPromise, userPromise]);

    const currUser = userRows[0];

    // Determine player's level (default to 1 if user not found)
    const playerLevel = currUser ? calculateLevelFromXp(currUser.xp).level : 1;

    // Compute potential xp rewards for this set of quests using player's level
    const computedRewards = calculateXpRewards(
      quests.map((q) => ({ basePoints: q.basePoints, completed: q.completed })),
      playerLevel,
      false
    );

    // Transform quest data and attach xpReward (rewarded for completed, potential for incomplete)
    const questDetails = quests.map((quest, idx) => {
      const potentialXp = computedRewards[idx]?.xpReward ?? 0;
      const rewardedXp = quest.xpReward ?? 0;
      return {
        id: quest.id,
        title: quest.title || `Quest ${quest.id}`,
        completed: quest.completed,
        points: quest.basePoints,
        type: quest.type,
        // Backward-compatible category label derived from type
        category: quest.type === "daily" ? "Daily" : "Side",
        templateId: quest.templateId,
        description: quest.description,
        xpReward: quest.completed ? rewardedXp : potentialXp,
        potentialXp, // expose separately for optimistic UI
      };
    });

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

router.patch("/updateProfile", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { name, image, timezone } = req.body;

    const updateData: {
      updatedAt: Date;
      name?: string;
      image?: string;
      timezone?: string;
      timezoneSetExplicitly?: boolean;
    } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name;
    }

    if (image !== undefined) {
      updateData.image = image;
    }

    if (timezone !== undefined) {
      updateData.timezone = timezone;
      updateData.timezoneSetExplicitly = true;
    }

    await db.update(user).set(updateData).where(eq(user.id, userId));

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res
      .status(500)
      .json({ message: "Failed to update profile", success: false });
  }
});

router.patch("/updateOnboarding", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { step, completed, hasCreatedFirstQuest } = req.body;

    const updateData: {
      updatedAt: Date;
      onboardingStep?: number;
      hasCompletedOnboarding?: boolean;
      hasCreatedFirstQuest?: boolean;
    } = {
      updatedAt: new Date(),
    };

    if (step !== undefined) {
      updateData.onboardingStep = step;
    }

    if (completed !== undefined) {
      updateData.hasCompletedOnboarding = completed;
    }

    if (hasCreatedFirstQuest !== undefined) {
      updateData.hasCreatedFirstQuest = hasCreatedFirstQuest;
    }

    await db.update(user).set(updateData).where(eq(user.id, userId));

    res.status(200).json({
      message: "Onboarding updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error updating onboarding:", err);
    res
      .status(500)
      .json({ message: "Failed to update onboarding", success: false });
  }
});

router.post("/updateStreak", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;

    const [currUser] = await db.select().from(user).where(eq(user.id, userId));
    if (!currUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { updateUserStreak } = await import("../utils/streak");
    const result = await updateUserStreak(userId, currUser.timezone);

    res.status(200).json({
      message: "Streak updated successfully",
      result,
    });
  } catch (err) {
    console.error("Error updating streak:", err);
    res.status(500).json({ message: "Failed to update streak" });
  }
});

export default router;
