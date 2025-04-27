import { QuestPriority, TaskPriority } from "@questly/types";

export const basePointsMap: Record<QuestPriority, number> = {
  optional: 1,
  minor: 2,
  standard: 3,
  important: 5,
  critical: 8,
};
export const basePointsTaskMap: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 5,
};
