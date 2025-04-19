import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { mainQuest, questInstance, questTemplate } from "../db/schema";
import { QuestTemplate, TaskPriority } from "@questly/types";
import { and, eq } from "drizzle-orm";

const router = express.Router();

const basePointsMap: Record<TaskPriority, number> = {
  optional: 1,
  low: 2,
  medium: 3,
  high: 5,
  critical: 8,
};

router.post("/main", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { title, dueDate, description, importance, quests } = req.body;
    const newMainQuest = {
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      description,
      importance,
      id: uuidv4(),
      userId,
    };

    const updatedQuests = quests.map((quest: QuestTemplate) => ({
      ...quest,
      parentQuestId: newMainQuest.id,
      userId,
      id: uuidv4(),
      basePoints:
        typeof quest.basePoints === "string"
          ? (basePointsMap[quest.basePoints as keyof typeof basePointsMap] ?? 0)
          : quest.basePoints,
    }));

    await db.insert(mainQuest).values(newMainQuest);
    await db.insert(questTemplate).values(updatedQuests);
    res.status(201).json({
      message: "Main Quest added successfully",
      questId: newMainQuest.id,
    });
  } catch (err) {
    console.error("Error creating Quest:", err);
    res.status(500).json({ message: "Failed to create quest" });
  }
});

router.get("/main", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const mainQuests = await db
      .select()
      .from(mainQuest)
      .where(eq(mainQuest.userId, userId));

    res.status(200).json({
      message: "Main quests retrived successfully",
      mainQuests,
    });
  } catch (err) {
    console.error("Error getting main quests:", err);
    res.status(500).json({ message: "failed getting mainQuests" });
  }
});

router.get("/questInstance", requireAuth, async (req, res) => {
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

router.post("/questTemplate", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const {
      title,
      description,
      type,
      parentQuestId,
      recurrenceRule,
      base_points,
    } = req.body;

    const newQuest = {
      title,
      description,
      type,
      parentQuestId,
      recurrenceRule,
      basePoints:
        typeof base_points === "string"
          ? (basePointsMap[base_points as keyof typeof basePointsMap] ?? 0)
          : base_points,
      userId,
      id: uuidv4(),
    };
    await db.insert(questTemplate).values(newQuest);

    res.status(200).json({ message: "quest added successfully" });
  } catch (err) {
    console.error("Error adding quest", err);
    res.status(500).json({ message: "failed adding Quest" });
  }
});

export default router;
