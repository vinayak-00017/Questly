import { TaskPriority } from "@questly/types";

export const basePointsMap: Record<TaskPriority, number> = {
  optional: 1,
  low: 2,
  medium: 3,
  high: 5,
  critical: 8,
};
