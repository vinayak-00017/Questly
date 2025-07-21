import React from "react";
import { Calendar, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestTemplate } from "@questly/types";
import { formatRecurrenceRule, formatDueDate, getQuestPriority, getImportanceStyle } from "./quest-template-helpers";

interface QuestTemplateDetailsProps {
  questTemplate: QuestTemplate;
}

export const QuestTemplateDetails: React.FC<QuestTemplateDetailsProps> = ({
  questTemplate,
}) => {
  const priority = getQuestPriority(questTemplate.basePoints);
  const importanceStyle = getImportanceStyle(priority);
  const ImportanceIcon = importanceStyle.icon;

  return (
    <div className="space-y-4">
      {/* Quest Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
          <div
            className={cn(
              "p-1 rounded",
              questTemplate.type === "daily"
                ? "bg-amber-500/20"
                : questTemplate.type === "side"
                  ? "bg-sky-500/20"
                  : "bg-slate-500/20"
            )}
          >
            <ImportanceIcon
              className={cn(
                "h-3 w-3",
                questTemplate.type === "daily"
                  ? "text-amber-400"
                  : questTemplate.type === "side"
                    ? "text-sky-400"
                    : "text-slate-400"
              )}
            />
          </div>
          <span className="text-slate-300 font-medium">
            {importanceStyle.label}
          </span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
          <div className="p-1 bg-slate-500/20 rounded">
            <Calendar className="h-3 w-3 text-slate-400" />
          </div>
          <span className="text-slate-300 font-medium">
            {formatRecurrenceRule(questTemplate.recurrenceRule)}
          </span>
        </div>
      </div>

      {questTemplate.dueDate && (
        <div className="flex items-center gap-2 text-sm p-2 bg-slate-800/50 rounded-lg">
          <div className="p-1 bg-slate-500/20 rounded">
            <Clock className="h-3 w-3 text-slate-400" />
          </div>
          <span className="text-slate-300 font-medium">
            Due: {formatDueDate(questTemplate.dueDate)}
          </span>
        </div>
      )}
    </div>
  );
};