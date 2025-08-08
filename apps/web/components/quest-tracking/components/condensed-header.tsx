import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, TrendingUp } from "lucide-react";
import { AddQuestDialog } from "./add-quest-dialog";

interface CondensedHeaderProps {
  onToggleExpanded: () => void;
  isAddDialogOpen: boolean;
  onAddDialogOpenChange: (open: boolean) => void;
  selectedTemplate: string;
  onTemplateChange: (value: string) => void;
  availableTemplates: any[];
  onAddQuest: () => void;
}

export const CondensedHeader: React.FC<CondensedHeaderProps> = ({
  onToggleExpanded,
  isAddDialogOpen,
  onAddDialogOpenChange,
  selectedTemplate,
  onTemplateChange,
  availableTemplates,
  onAddQuest,
}) => {
  return (
    <div
      className="pb-2 cursor-pointer hover:bg-slate-700/20 transition-colors rounded-t-lg"
      onClick={onToggleExpanded}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Quest Activity Tracker
            </h3>
            <p className="text-xs text-slate-400">No quests tracked</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddQuestDialog
            isOpen={isAddDialogOpen}
            onOpenChange={onAddDialogOpenChange}
            selectedTemplate={selectedTemplate}
            onTemplateChange={onTemplateChange}
            availableTemplates={availableTemplates}
            onAddQuest={onAddQuest}
            disabled={availableTemplates.length === 0}
            compact={true}
            onDialogTriggerClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-7 w-7 p-0"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
