import { z } from "zod";

export const baseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export enum MainQuestImportance {
  Epic = "epic",
  High = "high",
  Medium = "medium",
  Low = "low",
}

export enum QuestType {
  Daily = "daily",
  Side = "side",
}

export enum TaskPriority {
  Optional = "optional",
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export interface AddTask {
  title: string;
  basePoints: TaskPriority;
}
