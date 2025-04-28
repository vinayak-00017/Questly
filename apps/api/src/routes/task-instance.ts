import express from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import db from "../db";
import { taskInstance } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { and, eq } from "drizzle-orm";
import { createTaskInstanceSchema } from "@questly/types";
import { basePointsTaskMap } from "../utils/points-map";

const router = express.Router({ mergeParams: true });

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { questInstanceId } = req.params;

    if (!questInstanceId) {
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
      questInstanceId,
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

router.get("/", requireAuth, async (req, res) => {
  try {
    const { questInstanceId } = req.params;
    let taskInstances = await db
      .select()
      .from(taskInstance)
      .where(eq(taskInstance.questInstanceId, questInstanceId));

    const pointsToPriority = Object.entries(basePointsTaskMap).reduce(
      (acc, [priority, points]) => {
        acc[points] = priority;
        return acc;
      },
      {} as Record<number, string>
    );
    taskInstances = taskInstances.map((task) => ({
      ...task,
      basePoints: task.basePoints,
      priorityLabel: pointsToPriority[task.basePoints] || "medium",
    }));

    res
      .status(200)
      .json({ message: "Task Instance retrieved successfully", taskInstances });
  } catch (err) {
    console.error("Error fetching task instance:", err);
    res.status(500).json({ message: "Failed to fetch task instance" });
  }
});

router.patch("/status", requireAuth, async (req, res) => {
  try {
    const { taskId, completed } = req.body;
    const { questInstanceId } = req.params;

    const updatedFields = { completed, updatedAt: new Date() };
    await db
      .update(taskInstance)
      .set(updatedFields)
      .where(
        and(
          eq(taskInstance.questInstanceId, questInstanceId),
          eq(taskInstance.id, taskId)
        )
      );
    res
      .status(200)
      .json({ message: "Task Instance Status updated successfully" });
  } catch (err) {
    console.error("Error updating task instance status:", err);
    res.status(500).json({ message: "Failed to update task instance status" });
  }
});

export default router;
