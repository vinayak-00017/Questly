import { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import db from "../db";
import { trackedQuest, questTemplate } from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth";

export class TrackedQuestController {
  /**
   * Get user's tracked quests
   */
  static async getTrackedQuests(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;

      const userTrackedQuests = await db
        .select({
          id: trackedQuest.id,
          templateId: trackedQuest.templateId,
          title: trackedQuest.title,
          type: trackedQuest.type,
          priority: trackedQuest.priority,
          createdAt: trackedQuest.createdAt,
          // Include template info for additional context
          templateTitle: questTemplate.title,
          templateDescription: questTemplate.description,
          templateBasePoints: questTemplate.basePoints,
          templateIsActive: questTemplate.isActive,
        })
        .from(trackedQuest)
        .innerJoin(questTemplate, eq(trackedQuest.templateId, questTemplate.id))
        .where(eq(trackedQuest.userId, userId))
        .orderBy(trackedQuest.createdAt);

      res.status(200).json({
        message: "Tracked quests retrieved successfully",
        trackedQuests: userTrackedQuests,
      });
    } catch (err) {
      console.error("Error fetching tracked quests:", err);
      res.status(500).json({ message: "Failed to fetch tracked quests" });
    }
  }

  /**
   * Add a quest to tracking
   */
  static async addTrackedQuest(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { templateId, title, type, priority } = req.body;

      if (!templateId || !title || !type) {
        return res.status(400).json({
          message: "Template ID, title, and type are required",
        });
      }

      // Check if quest template exists and belongs to user or is active
      const template = await db
        .select()
        .from(questTemplate)
        .where(
          and(
            eq(questTemplate.id, templateId),
            eq(questTemplate.isActive, true)
          )
        )
        .limit(1);

      if (template.length === 0) {
        return res.status(404).json({
          message: "Quest template not found or not active",
        });
      }

      // Check if already tracking this quest
      const existingTracked = await db
        .select()
        .from(trackedQuest)
        .where(
          and(
            eq(trackedQuest.userId, userId),
            eq(trackedQuest.templateId, templateId)
          )
        )
        .limit(1);

      if (existingTracked.length > 0) {
        return res.status(409).json({
          message: "Quest is already being tracked",
        });
      }

      const newTrackedQuest = {
        id: nanoid(),
        userId,
        templateId,
        title,
        type,
        priority: priority || "standard",
      };

      await db.insert(trackedQuest).values(newTrackedQuest);

      res.status(201).json({
        message: "Quest added to tracking successfully",
        trackedQuest: newTrackedQuest,
      });
    } catch (err) {
      console.error("Error adding tracked quest:", err);
      res.status(500).json({ message: "Failed to add quest to tracking" });
    }
  }

  /**
   * Remove a quest from tracking
   */
  static async removeTrackedQuest(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "Tracked quest ID is required" });
      }

      await db
        .delete(trackedQuest)
        .where(and(eq(trackedQuest.id, id), eq(trackedQuest.userId, userId)));

      res.status(200).json({
        message: "Quest removed from tracking successfully",
      });
    } catch (err) {
      console.error("Error removing tracked quest:", err);
      res.status(500).json({ message: "Failed to remove quest from tracking" });
    }
  }

  /**
   * Update tracked quest priority or title
   */
  static async updateTrackedQuest(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { id } = req.params;
      const { priority, title } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "Tracked quest ID is required" });
      }

      const updateData: Partial<typeof trackedQuest.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (priority !== undefined) updateData.priority = priority;
      if (title !== undefined) updateData.title = title;

      await db
        .update(trackedQuest)
        .set(updateData)
        .where(and(eq(trackedQuest.id, id), eq(trackedQuest.userId, userId)));

      res.status(200).json({
        message: "Tracked quest updated successfully",
      });
    } catch (err) {
      console.error("Error updating tracked quest:", err);
      res.status(500).json({ message: "Failed to update tracked quest" });
    }
  }
}
