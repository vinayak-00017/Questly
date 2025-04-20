import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { questInstance, questTemplate } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { isValidRRule } from "../utils/rrule-utils";
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
// router.get("/sideQuestInstance", requireAuth, async (req, res) => {
//   try {
//     const userId = (req as AuthenticatedRequest).userId;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const sideQuests = await db
//       .select({
//         instanceId: questInstance.id,
//         templateId: questInstance.templateId,
//         title: questTemplate.title,
//         description: questTemplate.description,
//         type: questTemplate.type,
//         basePoints: questInstance.basePoints,
//         updatedAt: questInstance.updatedAt,
//         completed: questInstance.completed,
//         xpReward: questInstance.xpReward,
//         date: questInstance.date,
//       })
//       .from(questInstance)
//       .innerJoin(questTemplate, eq(questInstance.templateId, questTemplate.id))
//       .where(
//         and(
//           eq(questInstance.userId, userId),
//           eq(questInstance.date, today.toISOString().split("T")[0]),
//           eq(questTemplate.type, "daily")
//         )
//       );

//     res
//       .status(200)
//       .json({ message: "Daily quests retrived successfully", dailyQuests });
//   } catch (err) {
//     console.error("Error getting daily quests", err);
//     res.status(500).json({ message: "failed getting dailyQuests" });
//   }
// });

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

    // Validate recurrence rule if provided
    if (recurrenceRule && !isValidRRule(recurrenceRule)) {
      return res.status(400).json({
        message: "Invalid recurrence rule format",
        details:
          "The recurrence rule must be a valid iCalendar RRULE format (RFC 5545)",
      });
    }

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
