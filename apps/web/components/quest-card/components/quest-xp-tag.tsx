import React from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestXpTagProps {
  xpReward: number;
  isCompleted: boolean;
  variant?: "full" | "compact";
  className?: string;
}

const QuestXpTag = ({
  xpReward,
  isCompleted,
  variant = "full",
  className,
}: QuestXpTagProps) => {
  const xpStyles = {
    bg: "bg-zinc-700/60",
    text: "text-zinc-200",
    border: "border-zinc-600/50",
    shadow: "shadow-zinc-700/30",
    compactBg: "bg-zinc-700/40",
  };

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "px-1.5 py-0.5 rounded-xl text-xs font-medium flex items-center gap-1",
          xpStyles.compactBg,
          xpStyles.text,
          isCompleted && "opacity-70",
          className
        )}
      >
        <Trophy className="w-3 h-3 text-zinc-400" />+{xpReward} XP
      </span>
    );
  }

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-2xl text-xs font-medium tracking-wider border flex items-center gap-1",
        "shadow-inner transition-all duration-300 hover:scale-105 transform",
        xpStyles.bg,
        xpStyles.text,
        xpStyles.border,
        xpStyles.shadow,
        isCompleted && "opacity-70",
        className
      )}
    >
      <Trophy className="w-3 h-3 text-zinc-400" />+{xpReward} XP
    </span>
  );
};

export default QuestXpTag;
