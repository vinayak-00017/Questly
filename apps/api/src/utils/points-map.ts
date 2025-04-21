import { TaskPriority } from "@questly/types";

export const basePointsMap: Record<TaskPriority, number> = {
  optional: 1,
  minor: 2,
  standard: 3,
  important: 5,
  critical: 8,
};
