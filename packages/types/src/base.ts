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
  Creation = "creation", // Building/making things
  Exploration = "exploration", // Trying new things
  Knowledge = "knowledge", // Learning/mental challenges
  Social = "social", // People-oriented goals
}

export enum MainQuestImportance {
  Legendary = "legendary",
  Heroic = "heroic",
  Rare = "rare",
  Common = "common",
}

export enum QuestType {
  Daily = "daily",
  Side = "side",
}

export enum QuestPriority {
  Optional = "optional",
  Minor = "minor",
  Standard = "standard",
  Important = "important",
  Critical = "critical",
}
export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}

export interface AddTask {
  title: string;
  basePoints: TaskPriority;
}
