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

export enum MainQuestDifficulty {
  Novice = "novice",
  Adventurer = "adventurer",
  Veteran = "veteran",
  Master = "master",
  Legendary = "legendary",
}

export enum MainQuestDuration {
  Sprint = "sprint", // Very short-term (days)
  Journey = "journey", // Medium-term (weeks)
  Odyssey = "odyssey", // Long-term (months)
  Epic = "epic", // Very long-term (year+)
}

export enum MainQuestCategory {
  Challenge = "challenge", // Overcoming obstacles
  Combat = "combat", // Physical challenges
  Knowledge = "knowledge", // Learning/mental challenges
  Creation = "creation", // Building/making things
  Exploration = "exploration", // Trying new things
  Social = "social", // People-oriented goals
}

export enum QuestType {
  Daily = "daily",
  Side = "side",
}

export enum MainQuestImportance {
  Epic = "epic",
  High = "high",
  Medium = "medium",
  Low = "low",
}

export enum QuestPriority {
  Optional = "optional",
  Minor = "minor",
  Standard = "standard",
  Important = "important",
  Critical = "critical",
}
export enum TaskPriority {
  Optional = "optional",
  Minor = "minor",
  Standard = "standard",
  Important = "important",
  Critical = "critical",
}

export interface AddTask {
  title: string;
  basePoints: TaskPriority;
}
