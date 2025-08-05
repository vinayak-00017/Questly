import React from "react";
import { Calendar, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestTemplate } from "@questly/types";
import {
  formatRecurrenceRule,
  formatDueDate,
  getQuestPriority,
  getImportanceStyle,
  isQuestTemplateExpired,
} from "./quest-template-helpers";

interface QuestTemplateDetailsProps {
  questTemplate: QuestTemplate;
}

export const QuestTemplateDetails: React.FC<QuestTemplateDetailsProps> = ({
  questTemplate,
}) => {
  const priority = getQuestPriority(questTemplate.basePoints);
  const importanceStyle = getImportanceStyle(priority);
  const ImportanceIcon = importanceStyle.icon;
  const isExpired = isQuestTemplateExpired(questTemplate);

  return (
    <div className="space-y-4">
      {/* Quest Details */}
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
          <div
            className={cn(
              "p-1.5 rounded",
              questTemplate.type === "daily"
                ? "bg-amber-500/20"
                : questTemplate.type === "side"
                  ? "bg-sky-500/20"
                  : "bg-slate-500/20"
            )}
          >
            <ImportanceIcon
              className={cn(
                "h-4 w-4",
                questTemplate.type === "daily"
                  ? "text-amber-400"
                  : questTemplate.type === "side"
                    ? "text-sky-400"
                    : "text-slate-400"
              )}
            />
          </div>
          <div className="flex-1">
            <span className="text-slate-300 font-medium">
              Priority: {importanceStyle.label}
            </span>
            <div className="text-xs text-slate-400 mt-1">
              {questTemplate.basePoints} points
            </div>
          </div>
        </div>
      </div>

      {questTemplate.dueDate && (
        <div
          className={cn(
            "flex items-center gap-2 text-sm p-3 rounded-lg border",
            isExpired
              ? "bg-red-500/20 border-red-500/30"
              : "bg-slate-800/50 border-slate-700/30"
          )}
        >
          <div
            className={cn(
              "p-1.5 rounded",
              isExpired ? "bg-red-500/30" : "bg-slate-500/20"
            )}
          >
            <Clock
              className={cn(
                "h-4 w-4",
                isExpired ? "text-red-400" : "text-slate-400"
              )}
            />
          </div>
          <div className="flex-1">
            <span
              className={cn(
                "font-medium",
                isExpired ? "text-red-300" : "text-slate-300"
              )}
            >
              Due: {formatDueDate(questTemplate.dueDate)}
              {isExpired && " (Expired)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
