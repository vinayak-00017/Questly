import { QuestTemplate } from "@questly/types";
import { and, eq, inArray, gt, gte } from "drizzle-orm";
import db from "../db";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { mainQuest, questTemplate, questInstance } from "../db/schema";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { basePointsMap } from "../utils/points-map";
import { createDailyRRule, doesRRuleMatchDate } from "../utils/rrule-utils";
import {
  getTodayMidnight,
  isSameDay,
  toLocalDbDate,
  type Achievement,
} from "@questly/utils";
import { getUserTimezone } from "../utils/dates";
import { achievementEventService } from "../services/achievement-events.service";

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
    } = req.body;

    const dueDateObj = new Date(dueDate);

    const newMainQuest = {
      title,
      dueDate: dueDateObj,
      description,
      importance,
      id: uuidv4(),
      userId,
      category,
      difficulty,
    };

    await db.insert(mainQuest).values(newMainQuest);

    if (quests && quests.length > 0) {
      const updatedQuests = quests.map((quest: QuestTemplate) => ({
        ...quest,
        parentQuestId: newMainQuest.id,
        userId,
        id: uuidv4(),
        recurrenceRule: createDailyRRule(),
        basePoints:
          typeof quest.basePoints === "string"
            ? (basePointsMap[quest.basePoints as keyof typeof basePointsMap] ??
              0)
            : quest.basePoints,
        ...(quest.dueDate && { dueDate: new Date(quest.dueDate) }),
      }));

      // Insert quest templates within a transaction
      await db.transaction(async (trx) => {
        await trx.insert(questTemplate).values(updatedQuests);

        // Create instances for today if the quest template should apply to today
        const userTimezone = await getUserTimezone(userId);
        const today = getTodayMidnight(userTimezone);
        const localDateString = toLocalDbDate(today, userTimezone);
        const instancesToCreate = [];

        for (const quest of updatedQuests) {
          // Check if this quest should have an instance created for today
          let shouldCreateInstance = false;

          if (quest.type === "daily" && quest.recurrenceRule) {
            // For daily quests, check if the recurrence rule matches today
            shouldCreateInstance = doesRRuleMatchDate(
              quest.recurrenceRule,
              today
            );
          } else if (quest.type === "side") {
            // For side quests, check if due date is today (or if no due date and no recurrence rule)
            if (quest.dueDate) {
              shouldCreateInstance = isSameDay(quest.dueDate, today);
            } else if (!quest.recurrenceRule) {
              // One-time side quest with no due date - create instance for today
              shouldCreateInstance = true;
            }
          }

          if (shouldCreateInstance) {
            instancesToCreate.push({
              id: uuidv4(),
              templateId: quest.id,
              userId,
              date: localDateString,
              completed: false,
              title: quest.title,
              description: quest.description,
              basePoints: quest.basePoints,
              xpReward: null,
              createdAt: new Date(),
            });
          }
        }

        // Insert instances if any should be created
        if (instancesToCreate.length > 0) {
          await trx.insert(questInstance).values(instancesToCreate);
        }
      });
    }

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
    // Fetch all main quests for the user
    const mainQuests = await db
      .select()
      .from(mainQuest)
      .where(eq(mainQuest.userId, userId));

    // Get all main quest IDs
    const mainQuestIds = mainQuests.map((mq) => mq.id);

    // Fetch all quest templates attached to these main quests
    let attachedQuests: any[] = [];
    if (mainQuestIds.length > 0) {
      attachedQuests = await db
        .select()
        .from(questTemplate)
        .where(inArray(questTemplate.parentQuestId, mainQuestIds));
    }

    // Group attached quests by parentQuestId
    const questsByParent: Record<string, any[]> = {};
    for (const quest of attachedQuests) {
      const parentId = quest.parentQuestId;
      if (!parentId) continue;
      if (!questsByParent[parentId]) {
        questsByParent[parentId] = [];
      }
      questsByParent[parentId].push(quest);
    }

    // Attach daily and side quests to each main quest
    const mainQuestsWithAttached = mainQuests.map((mq) => ({
      ...mq,
      attachedQuests: (questsByParent[mq.id] || []).filter(
        (q) => q.type === "daily" || q.type === "side"
      ),
    }));

    res.status(200).json({
      message: "Main quests retrived successfully",
      mainQuests: mainQuestsWithAttached,
    });
  } catch (err) {
    console.error("Error getting main quests:", err);
    res.status(500).json({ message: "failed getting mainQuests" });
  }
});

router.get("/active", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const userTimezone = await getUserTimezone(userId);
    const today = getTodayMidnight(userTimezone);
    // Fetch active main quests for the user
    const activeMainQuests = await db
      .select()
      .from(mainQuest)
      .where(
        and(
          eq(mainQuest.userId, userId),
          eq(mainQuest.completed, false),
          gte(mainQuest.dueDate, today)
        )
      );
    res.status(200).json({
      message: "Active main quests retrieved successfully",
      activeMainQuests,
    });
  } catch (err) {
    console.error("Error getting active main quests:", err);
    res.status(500).json({ message: "failed getting active mainQuests" });
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

// Complete or uncomplete a main quest
router.patch("/complete", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { questId, completed } = req.body;

    if (!questId || typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Quest ID and completed status are required",
      });
    }

    // Update the main quest completion status
    const updatedFields = {
      completed,
      updatedAt: new Date(),
    };

    await db
      .update(mainQuest)
      .set(updatedFields)
      .where(and(eq(mainQuest.id, questId), eq(mainQuest.userId, userId)));

    // If completed, trigger achievement check for main quest completion
    let newAchievements: Achievement[] = [];
    if (completed) {
      try {
        const achievementResult =
          await achievementEventService.onQuestCompleted(userId, "main");
        newAchievements = achievementResult.newAchievements;
      } catch (error) {
        console.error(
          "Error checking achievements after main quest completion:",
          error
        );
      }
    }

    res.status(200).json({
      message: `Main quest ${completed ? "completed" : "marked as incomplete"} successfully`,
      newAchievements,
      achievementCount: newAchievements.length,
    });
  } catch (err) {
    console.error("Error updating main quest:", err);
    res.status(500).json({ message: "Failed to update main quest" });
  }
});

export default router;
