import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CompassIcon,
  Flame,
  Target,
  Clock,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestTemplate, QuestPriority } from "@questly/types";
import {
  getTypeColor,
  getImportanceStyle,
  getQuestPriority,
  isQuestTemplateExpired,
  formatRecurrenceRule,
} from "./quest-template-helpers";

interface QuestTemplateBadgesProps {
  questTemplate: QuestTemplate;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "daily":
      return <Flame className="h-3 w-3" />;
    case "side":
      return <CompassIcon className="h-3 w-3" />;
    default:
      return <Target className="h-3 w-3" />;
  }
};

export const QuestTemplateBadges: React.FC<QuestTemplateBadgesProps> = ({
  questTemplate,
}) => {
  const priority = getQuestPriority(questTemplate.basePoints);
  const importanceStyle = getImportanceStyle(priority);
  const ImportanceIcon = importanceStyle.icon;
  const isExpired = isQuestTemplateExpired(questTemplate);

  return (
    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
      <Badge
        variant="outline"
        className={cn("text-xs font-medium", getTypeColor(questTemplate.type))}
      >
        <div className="flex items-center gap-1">
          {getTypeIcon(questTemplate.type)}
          {questTemplate.type}
        </div>
      </Badge>

      {/* Recurrence Badge */}
      <Badge
        variant="outline"
        className="text-xs bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-medium"
      >
        <div className="flex items-center gap-1">
          <RotateCcw className="h-3 w-3" />
          {formatRecurrenceRule(questTemplate.recurrenceRule)}
        </div>
      </Badge>

      {isExpired && (
        <Badge
          variant="outline"
          className="text-xs bg-red-500/30 text-red-300 border-red-500/50 expired-glow"
        >
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Expired
          </div>
        </Badge>
      )}

      <Badge
        variant="outline"
        className={cn(
          "text-xs",
          questTemplate.isActive
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            : "bg-red-500/20 text-red-400 border-red-500/30"
        )}
      >
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              questTemplate.isActive ? "bg-emerald-400" : "bg-red-400"
            )}
          />
          {questTemplate.isActive ? "Active" : "Inactive"}
        </div>
      </Badge>
      <Badge
        variant="outline"
        className={cn("text-xs font-medium", importanceStyle.bg)}
      >
        <div className="flex items-center gap-1">
          <ImportanceIcon className="h-3 w-3" />
          {importanceStyle.label}
        </div>
      </Badge>
    </div>
  );
};
