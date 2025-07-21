import { QuestPriority } from "@questly/types";
import { Crown, Star, Shield, Target, AlertTriangle } from "lucide-react";

// Helper function to get quest priority from basePoints
export const getQuestPriority = (basePoints: number | string): QuestPriority => {
  if (typeof basePoints === 'string') {
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

// Helper function to get importance badge styling
export const getImportanceStyle = (priority: QuestPriority) => {
  switch (priority) {
    case QuestPriority.Critical:
      return {
        bg: "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border-red-500/30",
        icon: Crown,
        label: "Critical"
      };
    case QuestPriority.Important:
      return {
        bg: "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30",
        icon: Star,
        label: "Important"
      };
    case QuestPriority.Standard:
      return {
        bg: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
        icon: Shield,
        label: "Standard"
      };
    case QuestPriority.Minor:
      return {
        bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30",
        icon: Target,
        label: "Minor"
      };
    case QuestPriority.Optional:
      return {
        bg: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30",
        icon: AlertTriangle,
        label: "Optional"
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30",
        icon: Target,
        label: "Standard"
      };
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "daily":
      return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30";
    case "side":
      return "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30";
    default:
      return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getCardGradient = (type: string, isActive: boolean) => {
  const baseOpacity = isActive ? "80" : "40";
  switch (type) {
    case "daily":
      return `bg-gradient-to-br from-slate-800/${baseOpacity} via-amber-900/10 to-slate-900/${baseOpacity}`;
    case "side":
      return `bg-gradient-to-br from-slate-800/${baseOpacity} via-sky-900/10 to-slate-900/${baseOpacity}`;
    default:
      return `bg-gradient-to-br from-slate-800/${baseOpacity} to-slate-900/${baseOpacity}`;
  }
};

export const getBorderColor = (type: string, isActive: boolean) => {
  if (!isActive) return "border-slate-800/50";
  switch (type) {
    case "daily":
      return "border-amber-500/20 hover:border-amber-500/40";
    case "side":
      return "border-sky-500/20 hover:border-sky-500/40";
    default:
      return "border-slate-700/50 hover:border-slate-600/50";
  }
};

export const formatRecurrenceRule = (rule: string | null) => {
  if (!rule) return "One-time";
  if (rule.includes("DAILY")) return "Daily";
  if (rule.includes("WEEKLY")) return "Weekly";
  if (rule.includes("MONTHLY")) return "Monthly";
  return "Custom";
};

export const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) return "No due date";
  return new Date(dueDate).toLocaleDateString();
};