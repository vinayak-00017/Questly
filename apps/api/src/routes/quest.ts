import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { mainQuest, questTemplate } from "../db/schema";
import { TaskPriority } from "@questly/types";

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

    const updatedQuests = quests.map((quest) => ({
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
export default router;
