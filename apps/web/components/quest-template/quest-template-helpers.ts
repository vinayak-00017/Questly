import { QuestPriority } from "@questly/types";
import { Crown, Star, Shield, Target, AlertTriangle, Axe } from "lucide-react";

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

// Helper function to get importance badge styling
export const getImportanceStyle = (priority: QuestPriority) => {
  switch (priority) {
    case QuestPriority.Critical:
      return {
        bg: "bg-gradient-to-r from-[#e74c3c]/20 to-[#c0392b]/20 text-[#e74c3c] border-[#e74c3c]/30",
        icon: Crown,
        label: "Critical",
      };
    case QuestPriority.Important:
      return {
        bg: "bg-gradient-to-r from-[#f1c40f]/20 to-[#f39c12]/20 text-[#f1c40f] border-[#f1c40f]/30",
        icon: Star,
        label: "Important",
      };
    case QuestPriority.Standard:
      return {
        bg: "bg-gradient-to-r from-[#00aaff]/20 to-[#0099e6]/20 text-[#00aaff] border-[#00aaff]/30",
        icon: Shield,
        label: "Standard",
      };
    case QuestPriority.Minor:
      return {
        bg: "bg-gradient-to-r from-[#2ecc71]/20 to-[#27ae60]/20 text-[#2ecc71] border-[#2ecc71]/30",
        icon: Axe,
        label: "Minor",
      };
    case QuestPriority.Optional:
      return {
        bg: "bg-gradient-to-r from-[#3d3d5c]/20 to-[#3d3d5c]/20 text-[#c3c3cc] border-[#3d3d5c]/30",
        icon: AlertTriangle,
        label: "Optional",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-[#00aaff]/20 to-[#0099e6]/20 text-[#00aaff] border-[#00aaff]/30",
        icon: Shield,
        label: "Standard",
      };
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "daily":
      return "bg-gradient-to-r from-[#f1c40f]/20 to-[#f39c12]/20 text-[#f1c40f] border-[#f1c40f]/30";
    case "side":
      return "bg-gradient-to-r from-[#00aaff]/20 to-[#0099e6]/20 text-[#00aaff] border-[#00aaff]/30";
    default:
      return "bg-gradient-to-r from-[#3d3d5c]/20 to-[#3d3d5c]/20 text-[#c3c3cc] border-[#3d3d5c]/30";
  }
};

export const getCardGradient = (type: string, isActive: boolean) => {
  const baseOpacity = isActive ? "80" : "40";
  switch (type) {
    case "daily":
      return `bg-gradient-to-br from-[#2a2a3d]/${baseOpacity} via-[#f1c40f]/10 to-[#2a2a3d]/${baseOpacity}`;
    case "side":
      return `bg-gradient-to-br from-[#2a2a3d]/${baseOpacity} via-[#00aaff]/10 to-[#2a2a3d]/${baseOpacity}`;
    default:
      return `bg-gradient-to-br from-[#2a2a3d]/${baseOpacity} to-[#2a2a3d]/${baseOpacity}`;
  }
};

export const getBorderColor = (type: string, isActive: boolean) => {
  if (!isActive) return "border-[#3d3d5c]/50";
  switch (type) {
    case "daily":
      return "border-[#f1c40f]/20 hover:border-[#f1c40f]/40";
    case "side":
      return "border-[#00aaff]/20 hover:border-[#00aaff]/40";
    default:
      return "border-[#3d3d5c]/50 hover:border-[#3d3d5c]/70";
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
