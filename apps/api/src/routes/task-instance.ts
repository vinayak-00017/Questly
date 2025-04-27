import express from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import db from "../db";
import { taskInstance } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { createTaskInstanceSchema } from "@questly/types";
import { basePointsTaskMap } from "../utils/points-map";

const router = express.Router({ mergeParams: true });

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { questId } = req.params;

    if (!questId) {
      return res
        .status(400)
        .json({ message: "Quest ID parameter is missing." });
    }

    const validationResult = createTaskInstanceSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid task data",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }
    const validatedTaskData = validationResult.data;

    const basePointsValue =
      typeof validatedTaskData.basePoints === "string"
        ? (basePointsTaskMap[validatedTaskData.basePoints] ?? 0)
        : validatedTaskData.basePoints;

    const newTask = {
      id: uuidv4(),
      questInstanceId: questId,
      userId: userId,
      title: validatedTaskData.title,
      completed: validatedTaskData.completed,
      createdAt: new Date(),
      updatedAt: new Date(),
      basePoints: basePointsValue,
    };

    await db.insert(taskInstance).values(newTask);

    res
      .status(201)
      .json({ message: "Task instance added successfully", task: newTask });
  } catch (err) {
    console.error("Error adding task instance:", err);
    res.status(500).json({ message: "Failed to add task instance" });
  }
});

export default router;
