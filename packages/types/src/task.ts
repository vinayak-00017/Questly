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
  xpReward: z.number().int().nullable().optional(),
  basePoints: z.number().default(1),
  createdAt: z.string().datetime().optional(), // ISO format dates
  updatedAt: z.string().datetime().optional(),
});

// Type inference
export type Task = z.infer<typeof taskSchema>;

export const UserTaskSchema = taskSchema.omit({
  xpReward: true,
});

export type UserTask = z.infer<typeof UserTaskSchema>;

// Schema for creating a new task (omits id, createdAt, updatedAt)
export const addTaskSchema = taskSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  })
  .extend({
    completed: z.boolean().default(false).optional(),
    title: z.string().min(1, "Title is required"),
    isTimeTracked: z.boolean().default(false).optional(),
    plannedDuration: z.number().int().positive().optional(),
  });

export type AddTask = z.infer<typeof addTaskSchema>;

// Schema for updating an existing task (all fields optional except id)
export const updateTaskSchema = taskSchema.partial().pick({
  title: true,
  description: true,
  date: true,
  completed: true,
  isTimeTracked: true,
  plannedDuration: true,
  actualDuration: true,
  basePoints: true,
  xpReward: true,
});

export type UpdateTask = z.infer<typeof updateTaskSchema>;

// Schema for task with required ID (for operations requiring an ID)
export const taskWithIdSchema = updateTaskSchema.extend({
  id: z.string(),
});

export type TaskWithId = z.infer<typeof taskWithIdSchema>;
