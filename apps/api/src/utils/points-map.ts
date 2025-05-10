import {
  MainQuestDuration,
  MainQuestImportance,
  QuestPriority,
  TaskPriority,
} from "@questly/types";

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

export const getDurationTag = (days: number): MainQuestDuration => {
  if (days <= 14) return MainQuestDuration.Sprint;
  if (days <= 60) return MainQuestDuration.Journey;
  if (days <= 150) return MainQuestDuration.Odyssey;
  return MainQuestDuration.Epic;
};
// export const mainBasePointsMap: Record<MainQuestImportance, number> = {}
