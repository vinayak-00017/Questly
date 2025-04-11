import { z } from "zod";

// Base task schema
export const taskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  recurringTaskId: z.number().nullable().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(), // For date fields, using string format that will be parsed
  completed: z.boolean().default(false),
  isTimeTracked: z.boolean().default(false),
  plannedDuration: z.number().int().nullable().optional(),
  actualDuration: z.number().int().nullable().optional(),
  xpPerMinute: z.number().int().nullable().optional(),
  xpReward: z.number().int().nullable().optional(),
  createdAt: z.string().datetime().optional(), // ISO format dates
  updatedAt: z.string().datetime().optional(),
});

// Type inference
export type Task = z.infer<typeof taskSchema>;

export const taskWithPointsSchema = taskSchema
  .omit({
    xpPerMinute: true,
    xpReward: true,
  })
  .extend({
    title: z.string().min(1, "Title is required"),
    points: z.number().int().min(1).max(5).optional(),
  });

export type TaskWithPoints = z.infer<typeof taskWithPointsSchema>;

// Schema for creating a new task (omits id, createdAt, updatedAt)
export const createTaskSchema = taskSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    title: z.string().min(1, "Title is required"),
  });

export type CreateTask = z.infer<typeof createTaskSchema>;

// Schema for updating an existing task (all fields optional except id)
export const updateTaskSchema = taskSchema.partial().pick({
  title: true,
  description: true,
  date: true,
  completed: true,
  isTimeTracked: true,
  plannedDuration: true,
  actualDuration: true,
  xpPerMinute: true,
  xpReward: true,
});

export type UpdateTask = z.infer<typeof updateTaskSchema>;

// Schema for task with required ID (for operations requiring an ID)
export const taskWithIdSchema = updateTaskSchema.extend({
  id: z.string(),
});

export type TaskWithId = z.infer<typeof taskWithIdSchema>;
