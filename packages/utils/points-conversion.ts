export const taskTagToNumber = (tag: string): number => {
  switch (tag?.toLowerCase()) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    case "urgent":
      return 5;
    default:
      return 2;
  }
};

export const numberToTaskTag = (points: number): string => {
  if (points <= 1) return "low";
  if (points <= 2) return "medium";
  if (points <= 3) return "high";
  return "urgent";
};

export const numberToQuestTag = (points: number): string => {
  if (points <= 1) return "optional";
  if (points <= 2) return "minor";
  if (points <= 3) return "standard";
  if (points <= 5) return "important";
  return "critical";
};

export const questTagToNumber = (tag: string): number => {
  switch (tag?.toLowerCase()) {
    case "optional":
      return 1;
    case "minor":
      return 2;
    case "standard":
      return 3;
    case "important":
      return 5;
    case "critical":
      return 8;
    default:
      return 3;
  }
};
