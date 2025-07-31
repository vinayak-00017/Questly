import React from "react";
import { numberToQuestTag } from "@questly/utils";
import { cn } from "@/lib/utils";

interface QuestPriorityTagProps {
  basePoints: number;
  isCompleted: boolean;
  variant?: "full" | "compact";
}

const QuestPriorityTag = ({
  basePoints,
  isCompleted,
  variant = "full",
}: QuestPriorityTagProps) => {
  const priority = numberToQuestTag(Number(basePoints));

  const priorityStyles = {
    optional: {
      bg: "bg-gradient-to-r from-slate-800/80 to-slate-700/80",
      text: "text-slate-200",
      border: "border-slate-600",
      shadow: "shadow-slate-700/30",
      dot: "bg-slate-400",
    },
    minor: {
      bg: "bg-gradient-to-r from-blue-800/80 to-blue-700/80",
      text: "text-blue-200",
      border: "border-blue-600",
      shadow: "shadow-blue-700/30",
      dot: "bg-blue-400",
    },
    standard: {
      bg: "bg-gradient-to-r from-emerald-800/80 to-emerald-700/80",
      text: "text-emerald-200",
      border: "border-emerald-600",
      shadow: "shadow-emerald-700/30",
      dot: "bg-emerald-400",
    },
    important: {
      bg: "bg-gradient-to-r from-amber-800/80 to-amber-700/80",
      text: "text-amber-200",
      border: "border-amber-600",
      shadow: "shadow-amber-700/30",
      dot: "bg-amber-400",
    },
    critical: {
      bg: "bg-gradient-to-r from-rose-800/80 to-rose-700/80",
      text: "text-rose-200",
      border: "border-rose-600",
      shadow: "shadow-rose-700/30",
      dot: "bg-rose-400",
    },
  };

  const style =
    priorityStyles[priority as keyof typeof priorityStyles] ||
    priorityStyles.standard;

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "px-1.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wide flex items-center gap-1 bg-zinc-800/50",
          style.text,
          isCompleted && "opacity-70"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
        {priority}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider border flex items-center gap-1",
        "shadow-inner transition-all duration-300 hover:scale-105 transform",
        style.bg,
        style.text,
        style.border,
        style.shadow,
        isCompleted ? "opacity-70" : "animate-pulse"
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {priority}
    </span>
  );
};

export default QuestPriorityTag;
