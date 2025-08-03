import React from "react";
import { CalendarDays } from "lucide-react";
import { QuestInstance } from "@questly/types";
import { cn } from "@/lib/utils";
import QuestXpTag from "./quest-xp-tag";

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
      <QuestXpTag
        xpReward={quest.xpReward}
        isCompleted={isCompleted}
        variant="compact"
        className={cn(
          "text-sm font-medium",
          isCompleted ? "text-green-400" : colorStyles.xpColor
        )}
      />
    );
  }

  return (
    <div className="flex items-center gap-4 pt-1">
      <QuestXpTag
        xpReward={quest.xpReward}
        isCompleted={isCompleted}
        variant="full"
        className={cn(
          "text-xs font-medium",
          isCompleted ? "text-green-400" : colorStyles.xpColor
        )}
      />

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
