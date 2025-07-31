import express from "express";
import { questInstance, questTemplate, user } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { requireSchedulerAuth } from "../middleware/scheduler-auth";
import { doesRRuleMatchDate } from "../utils/rrule-utils";
import { getTodayMidnight, toLocalDbDate } from "@questly/utils";

const router = express.Router();

router.post(
  "/generate-daily-instances",
  requireSchedulerAuth,
  async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const userTimezoneResult = await db
        .select({ timezone: user.timezone })
        .from(user)
        .where(eq(user.id, userId));
      const userTimezone = userTimezoneResult[0]?.timezone;

      const today = getTodayMidnight(userTimezone);

      // Get all active templates for this user
      const allActiveTemplates = await db
        .select()
        .from(questTemplate)
        .where(
          and(
            eq(questTemplate.userId, userId),
            eq(questTemplate.isActive, true)
          )
        );

      // Filter out templates whose dueDate (in user's timezone) is before today
      const activeTemplates = allActiveTemplates.filter((template) => {
        if (!template.dueDate) return true;
        return template.dueDate > today;
      });

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

      // Use local date string instead of UTC to avoid off-by-one errors
      const localDateString = toLocalDbDate(today, userTimezone);

      // Check if instances already exist for today
      const existingInstances = await db
        .select()
        .from(questInstance)
        .where(
          and(
            eq(questInstance.userId, userId),
            eq(questInstance.date, localDateString)
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
        type: template.type,
        parenQuestId: template.parentQuestId || null,
        userId,
        date: localDateString,
        completed: false,
        basePoints: template.basePoints,
        xpReward: template.xpReward,
        createdAt: new Date(),
        updatedAt: new Date(),
        plannedStartTime: template.plannedStartTime,
        plannedEndTime: template.plannedEndTime,
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
