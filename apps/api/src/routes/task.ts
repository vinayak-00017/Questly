// import express from "express";
// import db from "../db";
// import { task } from "../db/schema";
// import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
// import { and, eq } from "drizzle-orm";

// const router = express.Router();

// router.post("/", requireAuth, async (req, res) => {
//   try {
//     const { title, basePoints, isTimeTracked, plannedDuration } = req.body;
//     const userId = (req as AuthenticatedRequest).userId;
//     const newTask = {
//       id: Date.now().toString(),
//       title: title,
//       basePoints,
//       userId,
//       isTimeTracked,
//       plannedDuration,
//     };

//     await db.insert(task).values(newTask);

//     res.status(201).json({
//       message: "Task added successfully",
//       taskId: newTask.id,
//     });
//   } catch (err) {
//     console.error("Error adding Task:", err);
//     res.status(500).json({ message: "Failed to add task" });
//   }
// });

// router.get("/", requireAuth, async (req, res) => {
//   try {
//     const userId = (req as AuthenticatedRequest).userId;
//     const response = await db
//       .select()
//       .from(task)
//       .where(eq(task.userId, userId));

//     res.status(200).json({
//       message: "Tasks retrived successfully",
//       tasks: response,
//     });
//   } catch (err) {
//     console.error("Error getting Tasks:", err);
//     res.status(500).json({ message: "Failed getting Tasks" });
//   }
// });

// router.patch("/:id", requireAuth, async (req, res) => {
//   try {
//     const updatedFields = { ...req.body, updatedAt: new Date() };
//     const taskId = req.params.id;
//     const userId = (req as AuthenticatedRequest).userId;
//     await db
//       .update(task)
//       .set(updatedFields)
//       .where(and(eq(task.userId, userId), eq(task.id, taskId)));

//     res.status(200).json({ message: "Task updated successfully" });
//   } catch (err) {
//     console.error("Error updating task:", err);
//     res.status(500).json({ message: "Failed to update task" });
//   }
// });

// export default router;
