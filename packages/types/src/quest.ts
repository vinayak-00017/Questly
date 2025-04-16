import { z } from "zod";
import { baseSchema, QuestType, TaskPriority } from "./base";
import { createTaskTemplateSchema } from "./task";

// Quest Template Schema
export const questTemplateSchema = baseSchema.extend({
  type: z.nativeEnum(QuestType),
  parentQuestId: z.string().nullable(),
  recurrenceRule: z.string().nullable(),
  isActive: z.boolean().default(true),
  basePoints: z.number().int().positive().default(1),
  xpReward: z.number().int().positive().default(50),
});

// Quest Instance Schema
export const questInstanceSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  userId: z.string(),
  date: z.date(),
  completed: z.boolean().default(false),
  basePoints: z.number().int().positive(),
  xpReward: z.number().int().positive(),
  streakCount: z.number().int().default(0),
  updatedAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
});

// Creation schema
export const createQuestTemplateSchema = questTemplateSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    xpReward: true,
    parentQuestId: true,
    completed: true,
    isActive: true,
  })
  .extend({
    basePoints: z.union([
      z.number().int().positive(),
      z.nativeEnum(TaskPriority),
    ]),
  });

// Types
export type QuestTemplate = z.infer<typeof questTemplateSchema>;
export type QuestInstance = z.infer<typeof questInstanceSchema>;
export type CreateQuestTemplate = z.infer<typeof createQuestTemplateSchema>;
