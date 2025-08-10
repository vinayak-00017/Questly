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
      bg: "bg-gradient-to-r from-[#3d3d5c]/80 to-[#3d3d5c]/60",
      text: "text-[#c3c3cc]",
      border: "border-[#3d3d5c]",
      shadow: "shadow-[#3d3d5c]/30",
      dot: "bg-[#9e9ead]", // subtle gray dot
    },
    minor: {
      bg: "bg-gradient-to-r from-[#00aaff]/80 to-[#0099e6]/80",
      text: "text-[#ffffff]",
      border: "border-[#00aaff]",
      shadow: "shadow-[#00aaff]/30",
      dot: "bg-[#00aaff]", // blue dot
    },
    standard: {
      bg: "bg-gradient-to-r from-[#2ecc71]/80 to-[#27ae60]/80",
      text: "text-[#ffffff]",
      border: "border-[#2ecc71]",
      shadow: "shadow-[#2ecc71]/30",
      dot: "bg-[#2ecc71]", // green dot
    },
    important: {
      bg: "bg-gradient-to-r from-[#f1c40f]/80 to-[#f39c12]/80",
      text: "text-[#ffffff]",
      border: "border-[#f1c40f]",
      shadow: "shadow-[#f1c40f]/30",
      dot: "bg-[#f1c40f]", // yellow dot
    },
    critical: {
      bg: "bg-gradient-to-r from-[#e74c3c]/80 to-[#c0392b]/80",
      text: "text-[#ffffff]",
      border: "border-[#e74c3c]",
      shadow: "shadow-[#e74c3c]/30",
      dot: "bg-[#e74c3c]", // red dot
    },
  } as const;

  const style =
    priorityStyles[priority as keyof typeof priorityStyles] ||
    priorityStyles.standard;

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "px-1.5 py-0.5 rounded-xl text-xs font-medium uppercase tracking-wide flex items-center gap-1 bg-[#2a2a3d]/50",
          style.text,
          isCompleted && "opacity-70"
        )}
      >
        <span
          className={cn("w-1.5 h-1.5 rounded-full priority-dot", style.dot)}
        />
        {priority}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-2xl text-xs font-medium uppercase tracking-wider border flex items-center gap-1",
        "shadow-inner transition-all duration-300 hover:scale-105 transform",
        style.bg,
        style.text,
        style.border,
        style.shadow,
        isCompleted ? "opacity-70" : "animate-pulse"
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full priority-dot", style.dot)}
      />
      {priority}
    </span>
  );
};

export default QuestPriorityTag;
