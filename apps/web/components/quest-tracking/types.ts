export type TrackedQuest = {
  id: string;
  title: string;
  type: "daily" | "side";
  templateId: string;
  priority?: string;
};

export type QuestActivityData = {
  date: string;
  completed: boolean;
  xpEarned: number;
  instanceId?: string;
};

export type ViewType = "week" | "month";