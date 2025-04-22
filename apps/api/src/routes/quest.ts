import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { questInstance, questTemplate } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { isValidRRule, doesRRuleMatchDate } from "../utils/rrule-utils";
import { basePointsMap } from "../utils/points-map";

const router = express.Router();

router.get("/dailyQuestInstance", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyQuests = await db
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
      .innerJoin(questTemplate, eq(questInstance.templateId, questTemplate.id))
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, today.toISOString().split("T")[0]),
          eq(questTemplate.type, "daily")
        )
      );

    res
      .status(200)
      .json({ message: "Daily quests retrived successfully", dailyQuests });
  } catch (err) {
    console.error("Error getting daily quests", err);
    res.status(500).json({ message: "failed getting dailyQuests" });
  }
});

router.get("/sideQuestInstance", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sideQuests = await db
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
      .innerJoin(questTemplate, eq(questInstance.templateId, questTemplate.id))
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, today.toISOString().split("T")[0]),
          eq(questTemplate.type, "side")
        )
      );

    res
      .status(200)
      .json({ message: "Side quests retrived successfully", sideQuests });
  } catch (err) {
    console.error("Error getting side quests", err);
    res.status(500).json({ message: "failed getting sideQuests" });
  }
});

router.post("/questTemplate", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const {
      title,
      description,
      type,
      parentQuestId,
      recurrenceRule,
      basePoints,
    } = req.body;

    console.log(parentQuestId);
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
      id: uuidv4(),
    };

    // Insert the quest template
    await db.transaction(async (trx) => {
      await trx.insert(questTemplate).values(newQuest);

      // Create an instance for today if the quest applies to today
      // or if no recurrence rule (one-time quest)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // If no recurrence rule or rule matches today, create an instance
      if (doesRRuleMatchDate(recurrenceRule, today)) {
        const questInstanceId = uuidv4();
        await trx.insert(questInstance).values({
          id: questInstanceId,
          templateId: newQuest.id,
          userId,
          date: today.toISOString().split("T")[0],
          completed: false,
          title,
          description,
          basePoints: basePointsValue,
          xpReward: null,
          createdAt: new Date(),
        });

        // You could also create task instances here if the template has tasks
      }
    });

    res.status(200).json({ message: "Quest added successfully with instance" });
  } catch (err) {
    console.error("Error adding quest", err);
    res.status(500).json({ message: "failed adding Quest" });
  }
});

export default router;
