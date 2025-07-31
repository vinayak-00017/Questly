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
import { and, eq, inArray } from "drizzle-orm";
import { gte, lte } from "drizzle-orm";
import {
  calculateLevelFromXp,
  calculateXpRewards,
  getTodayMidnight,
  toLocalDbDate,
} from "@questly/utils";
import { getUserTimezone } from "../utils/dates";
import { achievementEventService } from "../services/achievement-events.service";

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
      const totalXp = currentUser?.totalXp || 0;
      const levelInfo = calculateLevelFromXp(totalXp);

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

      const questsWithXp = calculateXpRewards(
        allQuestsData,
        levelInfo.level,
        false
      );

      const dailyQuests = questsWithXp.filter(
        (quest) => quest.type === "daily"
      );
      const sideQuests = questsWithXp.filter((quest) => quest.type === "side");

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
      const { done, id } = req.body;
      const updatedFields = { completed: done, updatedAt: new Date() };

      // Get quest info before updating
      const questInfo = await db
        .select({
          type: questTemplate.type,
        })
        .from(questInstance)
        .innerJoin(
          questTemplate,
          eq(questInstance.templateId, questTemplate.id)
        )
        .where(and(eq(questInstance.userId, userId), eq(questInstance.id, id)))
        .limit(1);

      await db
        .update(questInstance)
        .set(updatedFields)
        .where(and(eq(questInstance.userId, userId), eq(questInstance.id, id)));

      let newAchievements: any[] = [];

      // Trigger achievement events if quest was completed
      if (done && questInfo.length > 0) {
        const quest = questInfo[0];
        // Use the 'type' field directly for questType
        const questType = quest.type === "daily" ? "daily" : "side";
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
      const updatedFields: any = {
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
      const activityData: { [templateId: string]: { [date: string]: any } } =
        {};

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
          instanceId: instance.instanceId,
        };
      });

      res.status(200).json(activityData);
    } catch (err) {
      console.error("Error fetching quest activity:", err);
      res.status(500).json({ message: "Failed to fetch quest activity" });
    }
  }
}
