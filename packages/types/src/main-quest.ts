import { z } from "zod";
import {
  baseSchema,
  MainQuestCategory,
  MainQuestDifficulty,
  MainQuestDuration,
  MainQuestImportance,
} from "./base";
import { createQuestTemplateSchema } from "./quest";

export const mainQuestSchema = baseSchema.extend({
  importance: z.nativeEnum(MainQuestImportance),
  difficulty: z.nativeEnum(MainQuestDifficulty),
  category: z.nativeEnum(MainQuestCategory),
  dueDate: z.string(),
  xpReward: z.number().int().positive().nullable(),
  attachedQuests: z.array(createQuestTemplateSchema),
});

export const createMainQuestSchema = mainQuestSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    xpReward: true,
    attachedQuests: true,
  })
  .extend({
    quests: z.array(createQuestTemplateSchema).optional(),
  });

export const mainQuestIdSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type MainQuest = z.infer<typeof mainQuestSchema>;
export type CreateMainQuest = z.infer<typeof createMainQuestSchema>;
export type MainQuestId = z.infer<typeof mainQuestIdSchema>;
