import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { questInstance, questTemplate, user } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { isValidRRule, doesRRuleMatchDate } from "../utils/rrule-utils";
import { basePointsMap } from "../utils/points-map";
import taskInstanceRouter from "./task-instance";
import taskTemplateRouter from "./task-template";
import {
  calculateLevelFromXp,
  calculateXpRewards,
  getTodayMidnight,
  isSameDay,
  toDbDate,
  toDbTimestamp,
} from "@questly/utils";

const router = express.Router();

router.get("/dailyQuestInstance", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
      .innerJoin(questTemplate, eq(questInstance.templateId, questTemplate.id))
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, today.toISOString().split("T")[0]),
          eq(questTemplate.type, "daily")
        )
      );

    // const questInstanceIds = dailyQuestsData.map((q) => q.instanceId);
    // const dailyQuestsMap = new Map();
    // dailyQuestsData.forEach((q) => {
    //   dailyQuestsMap.set(q.instanceId, { ...q, tasks: [] });
    // });

    // if (questInstanceIds.length > 0) {
    //   const tasks = await db
    //     .select()
    //     .from(taskInstance)
    //     .where(and(inArray(taskInstance.questInstanceId, questInstanceIds)));
    //   tasks.forEach((task) => {
    //     const quest = dailyQuestsMap.get(task.questInstanceId);
    //     if (quest) {
    //       quest.tasks.push(task);
    //     }
    //   });
    // }
    // const dailyQuests = Array.from(dailyQuestsMap.values());

    res.status(200).json({
      message: "Daily quests retrived successfully",
      dailyQuests: dailyQuestsData,
    });
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
      .innerJoin(questTemplate, eq(questInstance.templateId, questTemplate.id))
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, today.toISOString().split("T")[0]),
          eq(questTemplate.type, "side")
        )
      );

    const lvlOneXp = 100;
    const totalPoints = sideQuestsData.reduce(
      (sum, quest) => sum + quest.basePoints,
      0
    );

    const questsWithXpReward = sideQuestsData.map((quest) => {
      const xpReward = Math.round((quest.basePoints / totalPoints) * lvlOneXp);
      return {
        ...quest,
        xpReward,
      };
    });

    // const questInstanceIds = sideQuestsData.map((q) => q.instanceId);
    // const sideQuestsMap = new Map();
    // sideQuestsData.forEach((q) => {
    //   sideQuestsMap.set(q.instanceId, { ...q, tasks: [] });
    // });

    // if (questInstanceIds.length > 0) {
    //   const tasks = await db
    //     .select()
    //     .from(taskInstance)
    //     .where(and(inArray(taskInstance.questInstanceId, questInstanceIds)));
    //   tasks.forEach((task) => {
    //     const quest = sideQuestsMap.get(task.questInstanceId);
    //     if (quest) {
    //       quest.tasks.push(task);
    //     }
    //   });
    // }
    // const sideQuests = Array.from(sideQuestsMap.values());

    res.status(200).json({
      message: "Side quests retrived successfully",
      sideQuests: questsWithXpReward,
    });
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

      // Create an instance for today if the quest applies to today
      // or if no recurrence rule (one-time quest)
      const today = getTodayMidnight();

      // If no recurrence rule or rule matches today, create an instance
      if (
        doesRRuleMatchDate(recurrenceRule, today) ||
        (!recurrenceRule && dueDateObj && isSameDay(dueDateObj, today))
      ) {
        const questInstanceId = uuidv4();
        await trx.insert(questInstance).values({
          id: questInstanceId,
          templateId: newQuest.id,
          userId,
          date: toDbDate(today),
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

router.get("/todaysQuests", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentUser = await db
      .select({ totalXp: user.xp })
      .from(user)
      .where(eq(user.id, userId))
      .then((rows) => rows[0]);

    const totalXp = currentUser?.totalXp || 0;
    const levelInfo = calculateLevelFromXp(totalXp);

    const allQuestsData = await db
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
      .innerJoin(questTemplate, eq(questInstance.templateId, questTemplate.id))
      .where(
        and(
          eq(questInstance.userId, userId),
          eq(questInstance.date, today.toISOString().split("T")[0])
        )
      );

    const questsWithXp = calculateXpRewards(
      allQuestsData,
      levelInfo.level,
      false
    );

    const dailyQuests = questsWithXp.filter((quest) => quest.type === "daily");
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
});

router.patch("/completeQuest", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { done, id } = req.body;
    const updatedFields = { completed: done, updatedAt: new Date() };
    await db
      .update(questInstance)
      .set(updatedFields)
      .where(and(eq(questInstance.userId, userId), eq(questInstance.id, id)));
    res.status(200).json({ message: "Quest Instance updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update questInstance" });
  }
});

router.use(
  "/quest-instance/:questInstanceId/task-instance",
  taskInstanceRouter
);
router.use(
  "/quest-template/:questTemplateId/task-template",
  taskTemplateRouter
);

export default router;
