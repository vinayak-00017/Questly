import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { AuthenticatedRequest } from "../middleware/auth";
import { questInstance, questTemplate, user } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { isValidRRule, doesRRuleMatchDate } from "../utils/rrule-utils";
import { basePointsMap } from "../utils/points-map";
import {
  getTodayMidnight,
  isSameDay,
  toDbTimestamp,
  toLocalDbDate,
} from "@questly/utils";

export class QuestTemplateController {
  /**
   * Get all quest templates for a user
   */
  static async getQuestTemplates(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;

      const questTemplates = await db
        .select({
          id: questTemplate.id,
          title: questTemplate.title,
          description: questTemplate.description,
          type: questTemplate.type,
          parentQuestId: questTemplate.parentQuestId,
          recurrenceRule: questTemplate.recurrenceRule,
          dueDate: questTemplate.dueDate,
          isActive: questTemplate.isActive,
          basePoints: questTemplate.basePoints,
          xpReward: questTemplate.xpReward,
          createdAt: questTemplate.createdAt,
          updatedAt: questTemplate.updatedAt,
        })
        .from(questTemplate)
        .where(eq(questTemplate.userId, userId));

      res.status(200).json({
        message: "Quest templates retrieved successfully",
        questTemplates,
      });
    } catch (err) {
      console.error("Error getting quest templates:", err);
      res.status(500).json({ message: "Failed to get quest templates" });
    }
  }

  /**
   * Update a quest template
   */
  static async updateQuestTemplate(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { id: templateId } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, userId: _, createdAt, ...allowedUpdates } = updateData;

      // Convert dueDate to proper Date object if it exists
      const updatedFields = {
        ...allowedUpdates,
        updatedAt: new Date(),
      };

      // Handle dueDate conversion if it exists in the update data
      if (updatedFields.dueDate !== undefined) {
        updatedFields.dueDate = updatedFields.dueDate
          ? toDbTimestamp(updatedFields.dueDate)
          : null;
      }

      await db
        .update(questTemplate)
        .set(updatedFields)
        .where(
          and(
            eq(questTemplate.id, templateId),
            eq(questTemplate.userId, userId)
          )
        );

      res.status(200).json({ message: "Quest template updated successfully" });
    } catch (err) {
      console.error("Error updating quest template:", err);
      res.status(500).json({ message: "Failed to update quest template" });
    }
  }

  /**
   * Delete a quest template
   */
  static async deleteQuestTemplate(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { id: templateId } = req.params;

      await db
        .delete(questTemplate)
        .where(
          and(
            eq(questTemplate.id, templateId),
            eq(questTemplate.userId, userId)
          )
        );

      res.status(200).json({ message: "Quest template deleted successfully" });
    } catch (err) {
      console.error("Error deleting quest template:", err);
      res.status(500).json({ message: "Failed to delete quest template" });
    }
  }

  /**
   * Create a new quest template
   */
  static async createQuestTemplate(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const {
        title,
        description,
        type,
        parentQuestId,
        recurrenceRule,
        basePoints,
        dueDate,
      } = req.body;

      const dueDateObj = dueDate ? toDbTimestamp(dueDate) : null;

      // Validate recurrence rule if provided
      if (recurrenceRule && !isValidRRule(recurrenceRule)) {
        return res.status(400).json({
          message: "Invalid recurrence rule format",
          details:
            "The recurrence rule must be a valid iCalendar RRULE format (RFC 5545)",
        });
      }

      const basePointsValue =
        typeof basePoints === "string"
          ? (basePointsMap[basePoints as keyof typeof basePointsMap] ?? 0)
          : basePoints;

      const newQuest = {
        title,
        description,
        type,
        parentQuestId,
        recurrenceRule,
        basePoints: basePointsValue,
        userId,
        dueDate: dueDateObj,
        id: uuidv4(),
      };

      // Insert the quest template
      await db.transaction(async (trx) => {
        await trx.insert(questTemplate).values(newQuest);

        const userTimezoneResult = await db
          .select({ timezone: user.timezone })
          .from(user)
          .where(eq(user.id, userId));
        const userTimezone = userTimezoneResult[0]?.timezone;

        // Create an instance for today if the quest applies to today
        // or if no recurrence rule (one-time quest)
        const today = getTodayMidnight(userTimezone);

        // Do not create instance if due date is before today
        if (dueDateObj && dueDateObj < today) {
          return;
        }

        // If no recurrence rule or rule matches today, create an instance
        if (
          doesRRuleMatchDate(recurrenceRule, today) ||
          (!recurrenceRule && dueDateObj && isSameDay(dueDateObj, today))
        ) {
          console.log("Creating instance for today");
          const questInstanceId = uuidv4();
          await trx.insert(questInstance).values({
            id: questInstanceId,
            templateId: newQuest.id,
            userId,
            type,
            parentQuestId: parentQuestId || null,
            date: toLocalDbDate(today, userTimezone),
            completed: false,
            title,
            description,
            basePoints: basePointsValue,
            xpReward: null,
            createdAt: new Date(),
          });
        }
      });

      res
        .status(200)
        .json({ message: "Quest added successfully with instance" });
    } catch (err) {
      console.error("Error adding quest", err);
      res.status(500).json({ message: "failed adding Quest" });
    }
  }
}
