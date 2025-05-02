import express from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import db from "../db";
import { taskInstance } from "../db/schema";
import { v4 as uuidv4 } from "uuid";

// **** IMPORTANT: Use mergeParams: true ****
// This allows this router to access URL parameters defined in parent routers (like :questId)
const router = express.Router({ mergeParams: true });

/**
 * POST /quest/:questId/tasks
 * Creates a new task instance for a specific quest instance.
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    // Access questId from the parent router's parameters
    const { questId } = req.params;
    // taskData comes from the request body (e.g., { title, priority })
    const taskData = req.body;

    if (!questId) {
      // Should technically not happen if routing is correct, but good practice
      return res
        .status(400)
        .json({ message: "Quest ID parameter is missing." });
    }

    // --- Optional: Add validation for taskData here ---
    if (!taskData.title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const newTask = {
      id: uuidv4(),
      questInstanceId: questId, // Link task to the quest instance
      userId: userId,
      title: taskData.title,
      basePoints: taskData.base_points,
      // Add other fields from taskData as needed (e.g., priority)
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new task instance into the database
    await db.insert(taskInstance).values(newTask);

    // Respond with the created task
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Failed to add task" });
  }
});

export default router;
