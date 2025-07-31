import React from "react";
import { CalendarDays, Trophy } from "lucide-react";
import { QuestInstance } from "@questly/types";
import { cn } from "@/lib/utils";

interface QuestMetadataProps {
  quest: QuestInstance;
  isCompleted: boolean;
  colorStyles: any;
  variant?: "full" | "compact";
}

const QuestMetadata = ({
  quest,
  isCompleted,
  colorStyles,
  variant = "full",
}: QuestMetadataProps) => {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "text-sm font-medium flex items-center gap-1.5",
          isCompleted ? "text-green-400" : colorStyles.xpColor
        )}
      >
        <Trophy className="h-4 w-4" />
        <span>+{quest.xpReward} XP</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 pt-1">
      <div
        className={cn(
          "text-xs font-medium flex items-center gap-1",
          isCompleted ? "text-green-400" : colorStyles.xpColor
        )}
      >
        <Trophy className="h-3 w-3" />
        <span>+{quest.xpReward} XP</span>
      </div>

      {quest.date && (
        <div
          className={cn(
            "text-xs flex items-center gap-1",
            isCompleted ? "text-green-200/50" : "text-zinc-400"
          )}
        >
          <CalendarDays className="h-3 w-3" />
          <span>{new Date(quest.date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default QuestMetadata;
