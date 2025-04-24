import { QuestTemplate } from "@questly/types";
import { and, eq } from "drizzle-orm";
import db from "../db";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { mainQuest, questTemplate } from "../db/schema";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { basePointsMap } from "../utils/points-map";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const {
      title,
      dueDate,
      description,
      importance,
      quests,
      category,
      difficulty,
      duration,
    } = req.body;
    const newMainQuest = {
      title,
      dueDate: new Date(dueDate),
      description,
      importance,
      id: uuidv4(),
      userId,
      category,
      difficulty,
      duration,
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

router.get("/", requireAuth, async (req, res) => {
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
router.get("/ids", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const mainQuestsIds = await db
      .select({
        id: mainQuest.id,
        title: mainQuest.title,
      })
      .from(mainQuest)
      .where(and(eq(mainQuest.userId, userId), eq(mainQuest.completed, false)));

    res.status(200).json({
      message: "Main quests ids retrived successfully",
      mainQuestsIds,
    });
  } catch (err) {
    console.error("Error getting main quests ids:", err);
    res.status(500).json({ message: "failed getting mainQuests ids" });
  }
});

router.get("/:id/linked-quests", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const mainQuestId = req.params.id;

    // Fetch daily and side quests linked to this main quest
    const linkedQuests = await db
      .select({
        id: questTemplate.id,
        title: questTemplate.title,
        description: questTemplate.description,
        type: questTemplate.type,
        basePoints: questTemplate.basePoints,
        recurrenceRule: questTemplate.recurrenceRule,
        xpReward: questTemplate.xpReward,
      })
      .from(questTemplate)
      .where(
        and(
          eq(questTemplate.userId, userId),
          eq(questTemplate.parentQuestId, mainQuestId)
        )
      );

    // Separate daily and side quests
    const dailyQuests = linkedQuests.filter((quest) => quest.type === "daily");
    const sideQuests = linkedQuests.filter((quest) => quest.type === "side");

    res.status(200).json({
      message: "Linked quests retrieved successfully",
      dailyQuests,
      sideQuests,
    });
  } catch (err) {
    console.error("Error getting linked quests:", err);
    res.status(500).json({ message: "Failed to retrieve linked quests" });
  }
});

export default router;
