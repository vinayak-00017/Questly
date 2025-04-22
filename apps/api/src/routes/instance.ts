import express from "express";
import { questInstance, questTemplate } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { requireSchedulerAuth } from "../middleware/scheduler-auth";
import { doesRRuleMatchDate } from "../utils/rrule-utils";

const router = express.Router();

router.post(
  "/generate-daily-instances",
  requireSchedulerAuth,
  async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day

      // Get all active templates for this user
      const activeTemplates = await db
        .select()
        .from(questTemplate)
        .where(
          and(
            eq(questTemplate.userId, userId),
            eq(questTemplate.isActive, true)
          )
        );

      // Filter templates based on recurrence rules
      const templatesForToday = activeTemplates.filter((template) => {
        // If no recurrence rule (or empty string), it's a one-time quest
        // For one-time quests, check if an instance has ever been created
        if (!template.recurrenceRule) {
          // TODO: Implement proper handling for one-time quests if needed
          // For now, assume one-time quests should always appear (will be filtered out by existing instances check)
          return true;
        }

        // Check if today matches the recurrence rule
        return doesRRuleMatchDate(template.recurrenceRule, today);
      });

      // Check if instances already exist for today
      const existingInstances = await db
        .select()
        .from(questInstance)
        .where(
          and(
            eq(questInstance.userId, userId),
            eq(questInstance.date, today.toISOString().split("T")[0])
          )
        );

      // Create a map of existing template IDs for quick lookup
      const existingTemplateIds = new Set(
        existingInstances.map((instance) => instance.templateId)
      );

      // Filter templates to only those that don't have an existing instance
      const templatesToCreate = templatesForToday.filter(
        (template) => !existingTemplateIds.has(template.id)
      );

      // Create new instances
      const newInstances = templatesToCreate.map((template) => ({
        id: uuidv4(),
        templateId: template.id,
        title: template.title,
        description: template.description,
        userId,
        date: today.toISOString().split("T")[0],
        completed: false,
        basePoints: template.basePoints,
        xpReward: template.xpReward,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      try {
        if (newInstances.length > 0) {
          await db.insert(questInstance).values(newInstances);
          res.status(201).json({
            message: "Daily quest instances generated successfully",
            count: newInstances.length,
          });
        } else {
          res.status(200).json({
            message: "No new quest instances needed for today",
            count: 0,
          });
        }
      } catch (error) {
        console.error("Error inserting new instances:", error);
        return res
          .status(500)
          .json({ message: "Failed to insert new quest instances" });
      }
    } catch (err) {
      console.error("Error generating  quest instances:", err);
      res.status(500).json({ message: "Failed to generate quest instances" });
    }
  }
);

export default router;
