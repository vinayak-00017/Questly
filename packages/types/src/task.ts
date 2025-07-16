import { z } from "zod";
import { TaskPriority } from "./base";

// Task Template Schema
export const taskTemplateSchema = z.object({
  id: z.string(),
  questTemplateId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  basePoints: z
    .union([z.number().int().positive(), z.nativeEnum(TaskPriority)])
    .default(TaskPriority.Medium),
  plannedStartTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  plannedEndTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

// Task Instance Schema
export const taskInstanceSchema = z.object({
  id: z.string(),
  questInstanceId: z.string(),
  templateId: z.string().optional(),
  title: z.string(),
  completed: z.boolean().default(false),
  basePoints: z.union([
    z.number().int().positive(),
    z.nativeEnum(TaskPriority),
  ]),
  plannedStartTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  plannedEndTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
});

// Create Task Template Schema
export const createTaskTemplateSchema = taskTemplateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createTaskInstanceSchema = taskInstanceSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    questInstanceId: true,
  })
  .extend({
    basePoints: z.union([
      z.number().int().positive("Points must be a positive number"),
      z.nativeEnum(TaskPriority).default(TaskPriority.Medium),
    ]),
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be 100 characters or less"),
  });

// Types
export type TaskTemplate = z.infer<typeof taskTemplateSchema>;
export type TaskInstance = z.infer<typeof taskInstanceSchema>;
export type CreateTaskTemplate = z.infer<typeof createTaskTemplateSchema>;
export type CreateTaskInstance = z.infer<typeof createTaskInstanceSchema>;
