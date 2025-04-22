import { z } from "zod";
import {
  baseSchema,
  MainQuestCategory,
  MainQuestDifficulty,
  MainQuestDuration,
  MainQuestImportance,
} from "./base";
import { createQuestTemplateSchema } from "./quest";
import { duration } from "drizzle-orm/gel-core";

export const mainQuestSchema = baseSchema.extend({
  importance: z.nativeEnum(MainQuestImportance),
  difficulty: z.nativeEnum(MainQuestDifficulty),
  category: z.nativeEnum(MainQuestCategory),
  duration: z.nativeEnum(MainQuestDuration),
  dueDate: z.string(),
  xpReward: z.number().int().positive().nullable(),
});

export const createMainQuestSchema = mainQuestSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    xpReward: true,
  })
  .extend({
    quests: z.array(createQuestTemplateSchema),
  });

export const mainQuestIdSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type MainQuest = z.infer<typeof mainQuestSchema>;
export type CreateMainQuest = z.infer<typeof createMainQuestSchema>;
export type MainQuestId = z.infer<typeof mainQuestIdSchema>;
