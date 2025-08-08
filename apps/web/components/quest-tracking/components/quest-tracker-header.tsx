import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronUp, TrendingUp } from "lucide-react";
import { ViewType } from "../types";
import { AddQuestDialog } from "./add-quest-dialog";

interface QuestTrackerHeaderProps {
  trackedQuestsCount: number;
  selectedView: ViewType;
  onViewChange: (value: ViewType) => void;
  dateHeader: string;
  onNavigateDate: (direction: "prev" | "next") => void;
  isAddDialogOpen: boolean;
  onAddDialogOpenChange: (open: boolean) => void;
  selectedTemplate: string;
  onTemplateChange: (value: string) => void;
  availableTemplates: any[];
  onAddQuest: () => void;
  onToggleExpanded?: () => void;
}

export const QuestTrackerHeader: React.FC<QuestTrackerHeaderProps> = ({
  trackedQuestsCount,
  selectedView,
  onViewChange,
  dateHeader,
  onNavigateDate,
  isAddDialogOpen,
  onAddDialogOpenChange,
  selectedTemplate,
  onTemplateChange,
  availableTemplates,
  onAddQuest,
  onToggleExpanded,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <TrendingUp className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Quest Activity Tracker
          </h3>
          <p className="text-sm text-slate-400">
            Track your quest completion patterns
          </p>
        </div>
      </div>

      {trackedQuestsCount > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateDate("prev")}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h4 className="text-white font-medium min-w-[200px] text-center">
            {dateHeader}
          </h4>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateDate("next")}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex gap-3">
        {trackedQuestsCount > 0 && (
          <Select value={selectedView} onValueChange={onViewChange}>
            <SelectTrigger className="w-24 bg-slate-800/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        )}

        <AddQuestDialog
          isOpen={isAddDialogOpen}
          onOpenChange={onAddDialogOpenChange}
          selectedTemplate={selectedTemplate}
          onTemplateChange={onTemplateChange}
          availableTemplates={availableTemplates}
          onAddQuest={onAddQuest}
          disabled={availableTemplates.length === 0}
        />

        {trackedQuestsCount === 0 && onToggleExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
