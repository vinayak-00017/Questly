// Helper to safely convert query param to string for Drizzle ORM
function safeToString(val: unknown): string {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return String(val[0]);
  return String(val);
}
import { Request, Response } from "express";
import db from "../db";
import { AuthenticatedRequest } from "../middleware/auth";
import { questInstance, questTemplate, user } from "../db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { gte, lte } from "drizzle-orm";
import {
  calculateLevelFromXp,
  calculateXpRewards,
  getTodayMidnight,
  toLocalDbDate,
} from "@questly/utils";
import type { Achievement } from "@questly/utils";
import { getUserTimezone } from "../utils/dates";
import { updateUserStreak } from "../utils/streak";
import { achievementEventService } from "../services/achievement-events.service";
import {
  getValidatedXpReward,
  calculateXpWithPoolLimit,
  getXpBreakdown,
} from "../utils/xp-pool";

export class QuestInstanceController {
  /**
   * Get daily quest instances
   */
  static async getDailyQuestInstances(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const userTimezone = await getUserTimezone(userId);
      const today = getTodayMidnight(userTimezone);

      const dailyQuestsData = await db
        .select({
          instanceId: questInstance.id,
          templateId: questInstance.templateId,
          title: questTemplate.title,
          description: questTemplate.description,
          type: questTemplate.type,
          basePoints: questInstance.basePoints,
          updatedAt: questInstance.updatedAt,
          completed: questInstance.completed,
          xpReward: questInstance.xpReward,
          date: questInstance.date,
        })
        .from(questInstance)
        .innerJoin(
          questTemplate,
          eq(questInstance.templateId, questTemplate.id)
        )
        .where(
          and(
            eq(questInstance.userId, userId),
            eq(questInstance.date, toLocalDbDate(today, userTimezone)),
            eq(questTemplate.type, "daily")
          )
        );

      res.status(200).json({
        message: "Daily quests retrieved successfully",
        dailyQuests: dailyQuestsData,
      });
    } catch (err) {
      console.error("Error getting daily quests", err);
      res.status(500).json({ message: "failed getting dailyQuests" });
    }
  }

  /**
   * Get side quest instances
   */
  static async getSideQuestInstances(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const userTimezone = await getUserTimezone(userId);
      const today = getTodayMidnight(userTimezone);

      const sideQuestsData = await db
        .select({
          instanceId: questInstance.id,
          templateId: questInstance.templateId,
          title: questInstance.title,
          description: questInstance.description,
          type: questTemplate.type,
          basePoints: questInstance.basePoints,
          updatedAt: questInstance.updatedAt,
          completed: questInstance.completed,
          xpReward: questInstance.xpReward,
          date: questInstance.date,
        })
        .from(questInstance)
        .innerJoin(
          questTemplate,
          eq(questInstance.templateId, questTemplate.id)
        )
        .where(
          and(
            eq(questInstance.userId, userId),
            eq(questInstance.date, toLocalDbDate(today, userTimezone)),
            eq(questTemplate.type, "side")
          )
        );

      const lvlOneXp = 100;
      const totalPoints = sideQuestsData.reduce(
        (sum, quest) => sum + quest.basePoints,
        0
      );

      const questsWithXpReward = sideQuestsData.map((quest) => {
        const xpReward = Math.round(
          (quest.basePoints / totalPoints) * lvlOneXp
        );
        return {
          ...quest,
          xpReward,
        };
      });

      res.status(200).json({
        message: "Side quests retrieved successfully",
        sideQuests: questsWithXpReward,
      });
    } catch (err) {
      console.error("Error getting side quests", err);
      res.status(500).json({ message: "failed getting sideQuests" });
    }
  }

  /**
   * Get today's quests (both daily and side)
   */
  static async getTodaysQuests(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;

      const currentUser = await db
        .select({ totalXp: user.xp, timezone: user.timezone })
        .from(user)
        .where(eq(user.id, userId))
        .then((rows) => rows[0]);

      const userTimezone = currentUser?.timezone;
      const today = getTodayMidnight(userTimezone);

      const allQuestsData = await db
        .select({
          instanceId: questInstance.id,
          templateId: questInstance.templateId,
          title: questInstance.title,
          description: questInstance.description,
          type: questInstance.type,
          basePoints: questInstance.basePoints,
          updatedAt: questInstance.updatedAt,
          completed: questInstance.completed,
          xpReward: questInstance.xpReward,
          date: questInstance.date,
        })
        .from(questInstance)
        .where(
          and(
            eq(questInstance.userId, userId),
            eq(questInstance.date, toLocalDbDate(today, userTimezone))
          )
        );

      const questsWithXp = await calculateXpWithPoolLimit(
        userId,
        toLocalDbDate(today, userTimezone),
        allQuestsData.map((q) => ({
          id: q.instanceId,
          basePoints: q.basePoints,
          completed: q.completed,
          currentXpReward: q.xpReward,
        }))
      );

      // Map back to the original quest structure with XP rewards
      const questsWithRewards = allQuestsData.map((quest) => {
        const xpData = questsWithXp.find((xp) => xp.id === quest.instanceId);
        return {
          ...quest,
          xpReward: quest.completed
            ? quest.xpReward || 0 // For completed quests, show actual earned XP
            : xpData?.xpReward || 0, // For incomplete quests, show potential XP
        };
      });

      const dailyQuests = questsWithRewards.filter(
        (quest) => quest.type === "daily"
      );
      const sideQuests = questsWithRewards.filter(
        (quest) => quest.type === "side"
      );

      res.status(200).json({
        message: "Today's quests retrieved successfully",
        dailyQuests,
        sideQuests,
      });
    } catch (err) {
      console.error("Error getting today's quests", err);
      res.status(500).json({ message: "Failed getting today's quests" });
    }
  }

  /**
   * Complete or uncomplete a quest
   */
  static async completeQuest(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { done, id } = req.body as { done: boolean; id: string };
      const updatedFields: {
        completed: boolean;
        updatedAt: Date;
        xpReward?: number | null;
      } = {
        completed: done,
        updatedAt: new Date(),
      };

      // Parallelize quest info and user fetch
      const [questInfoRows, userRows] = await Promise.all([
        db
          .select({
            type: questTemplate.type,
            date: questInstance.date,
            completed: questInstance.completed,
            xpReward: questInstance.xpReward,
          })
          .from(questInstance)
          .innerJoin(
            questTemplate,
            eq(questInstance.templateId, questTemplate.id)
          )
          .where(
            and(eq(questInstance.userId, userId), eq(questInstance.id, id))
          )
          .limit(1),
        db
          .select({ totalXp: user.xp, timezone: user.timezone })
          .from(user)
          .where(eq(user.id, userId)),
      ]);

      const questInfo = questInfoRows;
      const u = userRows[0];
      const userTz = u?.timezone || (await getUserTimezone(userId));

      let xpDelta = 0;
      let xpToPersist: number | null | undefined = undefined;

      if (questInfo.length > 0) {
        const q = questInfo[0];
        const previouslyCompleted = q.completed;
        if (done !== previouslyCompleted) {
          if (done) {
            // Completing: calculate proportional XP and validate against daily pool
            const rawQuestsForDate = await db
              .select({
                id: questInstance.id,
                basePoints: questInstance.basePoints,
                completed: questInstance.completed,
              })
              .from(questInstance)
              .where(
                and(
                  eq(questInstance.userId, userId),
                  eq(questInstance.date, q.date)
                )
              );

            type QuestForXp = {
              id: string;
              basePoints: number;
              completed?: boolean;
            };
            const questsForXp: QuestForXp[] = rawQuestsForDate.map((qq) => ({
              id: String(qq.id),
              basePoints: qq.basePoints,
              completed: qq.completed,
            }));

            const toggledQuestsForXp: QuestForXp[] = questsForXp.map((qx) =>
              qx.id === String(id) ? { ...qx, completed: true } : qx
            );

            const playerLevel = calculateLevelFromXp(u?.totalXp || 0).level;
            const afterXpList = calculateXpRewards(
              toggledQuestsForXp,
              playerLevel,
              true
            );
            const afterQuest = afterXpList.find((qi) => qi.id === String(id));
            const calculatedXp = Math.round(afterQuest?.xpReward || 0);

            // Apply lateness multiplier
            const todayStr = toLocalDbDate(getTodayMidnight(userTz), userTz);
            const questDateStr = String(q.date);
            const msPerDay = 24 * 60 * 60 * 1000;
            const todayMs = new Date(`${todayStr}T00:00:00Z`).getTime();
            const questMs = new Date(`${questDateStr}T00:00:00Z`).getTime();
            const rawDays = Math.round((todayMs - questMs) / msPerDay);
            const daysLate = Math.max(0, rawDays);
            const multiplier =
              questDateStr === todayStr
                ? 1
                : daysLate <= 1
                  ? 1
                  : Math.max(0, 1 - 0.1 * (daysLate - 1));

            const adjustedXp = Math.max(
              0,
              Math.round(calculatedXp * multiplier)
            );

            // Validate against daily XP pool to prevent exceeding cap
            const validatedXp = await getValidatedXpReward(
              userId,
              questDateStr,
              adjustedXp
            );

            xpDelta = validatedXp;
            xpToPersist = validatedXp;
          } else {
            // Uncompleting: subtract stored reward if present
            const previouslyAwarded = Number(q.xpReward ?? 0);
            if (previouslyAwarded > 0) {
              xpDelta = -previouslyAwarded;
              xpToPersist = 0;
            } else {
              // Legacy fallback for quests without stored XP
              xpDelta = 0;
              xpToPersist = 0;
            }
          }
        }
      }

      if (typeof xpToPersist !== "undefined") {
        updatedFields.xpReward = xpToPersist;
      }

      // Wrap writes in a single transaction
      await db.transaction(async (tx) => {
        await tx
          .update(questInstance)
          .set(updatedFields)
          .where(
            and(eq(questInstance.userId, userId), eq(questInstance.id, id))
          );

        if (xpDelta !== 0) {
          await tx
            .update(user)
            .set({ xp: sql`${user.xp} + ${xpDelta}` })
            .where(eq(user.id, userId));
        }
      });

      // Update streak for today using the timezone we already fetched
      try {
        const questDateStr = questInfo.length
          ? String(questInfo[0].date)
          : null;
        if (questDateStr) {
          const todayStr = toLocalDbDate(getTodayMidnight(userTz), userTz);
          if (questDateStr === todayStr) {
            await updateUserStreak(userId, userTz);
          }
        }
      } catch (e) {
        console.error("Error updating streak instantly:", e);
      }

      let newAchievements: Achievement[] = [];
      if (done && questInfo.length > 0) {
        const questType: "main" | "side" = "side";
        try {
          const achievementResult =
            await achievementEventService.onQuestCompleted(userId, questType);
          newAchievements = achievementResult.newAchievements;
        } catch (error) {
          console.error(
            "Error checking achievements after quest completion:",
            error
          );
        }
      }

      res.status(200).json({
        message: "Quest Instance updated successfully",
        newAchievements,
        achievementCount: newAchievements.length,
      });
    } catch (err) {
      console.error("Error updating quest:", err);
      res.status(500).json({ message: "Failed to update questInstance" });
    }
  }

  /**
   * Update a quest instance
   */
  static async updateQuestInstance(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { instanceId } = req.params;
      const { title, description, basePoints } = req.body;

      // Validate required fields
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ message: "Title is required" });
      }

      if (
        basePoints !== undefined &&
        (!Number.isInteger(basePoints) || basePoints < 1)
      ) {
        return res
          .status(400)
          .json({ message: "Base points must be a positive integer" });
      }

      // Prepare update fields
      const updatedFields: {
        title: string;
        updatedAt: Date;
        description?: string | null;
        basePoints?: number;
      } = {
        title: title.trim(),
        updatedAt: new Date(),
      };

      if (description !== undefined) {
        updatedFields.description = description.trim() || null;
      }

      if (basePoints !== undefined) {
        updatedFields.basePoints = basePoints;
      }

      // Update the quest instance
      await db
        .update(questInstance)
        .set(updatedFields)
        .where(
          and(
            eq(questInstance.id, instanceId),
            eq(questInstance.userId, userId)
          )
        );

      res.status(200).json({ message: "Quest instance updated successfully" });
    } catch (err) {
      console.error("Error updating quest instance:", err);
      res.status(500).json({ message: "Failed to update quest instance" });
    }
  }

  /**
   * Delete a quest instance
   */
  static async deleteQuestInstance(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { instanceId } = req.params;

      // Delete the quest instance
      await db
        .delete(questInstance)
        .where(
          and(
            eq(questInstance.id, instanceId),
            eq(questInstance.userId, userId)
          )
        );

      res.status(200).json({ message: "Quest instance deleted successfully" });
    } catch (err) {
      console.error("Error deleting quest instance:", err);
      res.status(500).json({ message: "Failed to delete quest instance" });
    }
  }

  /**
   * Get daily XP pool status for a user
   */
  static async getDailyXpPoolStatus(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const userTimezone = await getUserTimezone(userId);
      const today = getTodayMidnight(userTimezone);
      const todayStr = toLocalDbDate(today, userTimezone);

      const breakdown = await getXpBreakdown(userId, todayStr);

      res.status(200).json({
        message: "Daily XP pool status retrieved successfully",
        date: todayStr,
        ...breakdown,
      });
    } catch (err) {
      console.error("Error getting daily XP pool status:", err);
      res.status(500).json({ message: "Failed to get daily XP pool status" });
    }
  }

  /**
   * Get quest activity for quest tracker
   */
  static async getQuestActivity(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { templateIds, startDate, endDate } = req.query;
      // Ensure startDate and endDate are strings for Drizzle ORM and not ParsedQs
      const startDateStr = safeToString(startDate);
      const endDateStr = safeToString(endDate);

      if (!templateIds || typeof templateIds !== "string") {
        return res.status(400).json({ message: "Template IDs are required" });
      }

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ message: "Start date and end date are required" });
      }

      // Parse the comma-separated templateIds
      const templateIdArray = templateIds.split(",").filter((id) => id.trim());

      if (templateIdArray.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one template ID is required" });
      }

      // Fetch quest instances for the given template IDs and date range
      const questInstances = await db
        .select({
          instanceId: questInstance.id,
          templateId: questInstance.templateId,
          date: questInstance.date,
          completed: questInstance.completed,
          xpReward: questInstance.xpReward,
        })
        .from(questInstance)
        .innerJoin(
          questTemplate,
          eq(questInstance.templateId, questTemplate.id)
        )
        .where(
          and(
            eq(questInstance.userId, userId),
            inArray(questInstance.templateId, templateIdArray),
            gte(questInstance.date, startDateStr),
            lte(questInstance.date, endDateStr)
          )
        );

      // Group the data by template ID and date
      const activityData: {
        [templateId: string]: {
          [date: string]: {
            date: string | Date;
            completed: boolean;
            xpEarned: number;
            instanceId: string;
          };
        };
      } = {};

      questInstances.forEach((instance) => {
        const templateIdKey = String(instance.templateId);
        const dateKey = String(instance.date);
        if (!activityData[templateIdKey]) {
          activityData[templateIdKey] = {};
        }
        activityData[templateIdKey][dateKey] = {
          date: instance.date,
          completed: instance.completed,
          xpEarned: instance.xpReward || 0,
          instanceId: String(instance.instanceId),
        };
      });

      res.status(200).json(activityData);
    } catch (err) {
      console.error("Error fetching quest activity:", err);
      res.status(500).json({ message: "Failed to fetch quest activity" });
    }
  }
}
