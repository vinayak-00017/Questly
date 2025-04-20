import { z } from "zod";
import { baseSchema, MainQuestImportance } from "./base";
import { createQuestTemplateSchema } from "./quest";

export const mainQuestSchema = baseSchema.extend({
  importance: z.nativeEnum(MainQuestImportance),
  dueDate: z.string().nullable(),
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
