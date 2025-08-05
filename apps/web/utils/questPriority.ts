import { QuestPriority } from "@questly/types";

// Helper function to get quest priority from basePoints
export const getQuestPriority = (
  basePoints: number | string
): QuestPriority => {
  if (typeof basePoints === "string") {
    return basePoints as QuestPriority;
  }
  // Map number values to priority levels based on points-map.ts
  if (basePoints === 1) return QuestPriority.Optional;
  if (basePoints === 2) return QuestPriority.Minor;
  if (basePoints === 3) return QuestPriority.Standard;
  if (basePoints === 5) return QuestPriority.Important;
  if (basePoints >= 8) return QuestPriority.Critical;
  return QuestPriority.Standard; // default
};

// Helper function to get priority order for sorting
export const getPriorityOrder = (priority: QuestPriority): number => {
  switch (priority) {
    case QuestPriority.Critical:
      return 5;
    case QuestPriority.Important:
      return 4;
    case QuestPriority.Standard:
      return 3;
    case QuestPriority.Minor:
      return 2;
    case QuestPriority.Optional:
      return 1;
    default:
      return 3;
  }
};
