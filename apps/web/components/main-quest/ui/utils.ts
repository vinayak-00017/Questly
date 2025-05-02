import { MainQuest, MainQuestCategory } from "@questly/types";
import {
  LucideIcon,
  Swords,
  Scroll,
  Sparkles,
  Target,
  CalendarDays,
  Shield,
} from "lucide-react";

// Determine icon based on quest category
export const getCategoryIcon = (category: string): LucideIcon => {
  switch (category) {
    case "Combat":
      return Swords;
    case "Knowledge":
      return Scroll;
    case "Creation":
      return Sparkles;
    case "Exploration":
      return Target;
    case "Social":
      return CalendarDays;
    default:
      return Shield;
  }
};

// Get proper styling for importance levels
export const getImportanceStyle = (importance: string) => {
  switch (importance.toLowerCase()) {
    case "legendary":
      return "bg-red-600/30 text-red-300 border border-red-700/50";
    case "heroic":
      return "bg-amber-600/30 text-amber-300 border border-amber-700/50";
    case "rare":
      return "bg-blue-600/30 text-blue-300 border border-blue-700/50";
    case "common":
    default:
      return "bg-green-600/30 text-green-300 border border-green-700/50";
  }
};

// Mock function to get quest details (would be replaced with real data in production)
export const getQuestDetails = (quest: MainQuest) => {
  return {
    progress: Math.floor(Math.random() * 100),
    dailyQuestsCount: Math.floor(Math.random() * 5) + 1,
    category: Object.values(MainQuestCategory)[Math.floor(Math.random() * 6)],
  };
};
