import { z } from "zod";

export const questSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["main", "daily", "side"]),
  parentQuestId: z.string().nullable(),
  recurrenceRule: z.string().nullable(),
  dueDate: z.date().nullable(),
  completed: z.boolean().default(false),
  basePoints: z.number().int().positive().default(1),
  xpReward: z.number().int().positive().default(50),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createQuestSchema = questSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const createMainQuestSchema = createQuestSchema
  .extend({
    type: z.literal("main"),
    importance: z.enum(["low", "medium", "high"]),
    dailyTasks: z
      .array(
        z.object({
          title: z.string().min(1, "Task title is required"),
          description: z.string().optional(),
        })
      )
      .optional()
      .default([]),
  })
  .omit({
    parentQuestId: true,
    recurrenceRule: true,
  });

export type Quest = z.infer<typeof questSchema>;
export type CreateMainQuestInput = z.infer<typeof createMainQuestSchema>;
