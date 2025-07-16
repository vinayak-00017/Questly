import { z } from "zod";
import { baseSchema, QuestPriority, QuestType, TaskPriority } from "./base";
import { createTaskTemplateSchema, taskInstanceSchema } from "./task";

// Quest Template Schema
export const questTemplateSchema = baseSchema.extend({
  type: z.nativeEnum(QuestType),
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  parentQuestId: z.string().nullable().optional(),
  recurrenceRule: z.string().nullable(),
  dueDate: z.string().nullable(),
  isActive: z.boolean().default(true),
  basePoints: z.number().int().positive("Points must be a positive number").default(1),
  xpReward: z.number().int().positive("XP reward must be a positive number").default(50),
});

// Quest Instance Schema
export const questInstanceSchema = z.object({
  instanceId: z.string().uuid("Invalid instance ID format"),
  templateId: z.string().uuid("Invalid template ID format"),
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  completed: z.boolean().default(false),
  basePoints: z.number().int().positive("Points must be a positive number"),
  type: z.nativeEnum(QuestType),
  xpReward: z.number().int().positive("XP reward must be a positive number"),
  updatedAt: z.date().optional(),
});

// Creation schema
export const createQuestTemplateSchema = questTemplateSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    xpReward: true,
    completed: true,
    isActive: true,
  })
  .extend({
    basePoints: z.union([
      z.number().int().positive("Points must be a positive number"),
      z.nativeEnum(QuestPriority).default(QuestPriority.Standard),
    ]),
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    recurrenceRule: z.string().nullable().optional(),
    dueDate: z.string().optional(),
  });

// Types
export type QuestTemplate = z.infer<typeof questTemplateSchema>;
export type QuestInstance = z.infer<typeof questInstanceSchema>;
export type CreateQuestTemplate = z.infer<typeof createQuestTemplateSchema>;
