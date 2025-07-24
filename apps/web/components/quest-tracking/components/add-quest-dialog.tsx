import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Flame, Compass } from "lucide-react";

interface AddQuestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: string;
  onTemplateChange: (value: string) => void;
  availableTemplates: any[];
  onAddQuest: () => void;
  disabled?: boolean;
  compact?: boolean;
  onDialogTriggerClick?: (e: React.MouseEvent) => void;
}

export const AddQuestDialog: React.FC<AddQuestDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedTemplate,
  onTemplateChange,
  availableTemplates,
  onAddQuest,
  disabled = false,
  compact = false,
  onDialogTriggerClick,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={`bg-amber-600 hover:bg-amber-700 text-white ${
            compact ? "h-7 px-2" : ""
          }`}
          disabled={disabled}
          onClick={onDialogTriggerClick}
        >
          <Plus className={`${compact ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
          {compact ? "Track" : "Track Quest"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add Quest to Tracker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedTemplate} onValueChange={onTemplateChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select a quest template..." />
            </SelectTrigger>
            <SelectContent>
              {availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    {template.type === "daily" ? (
                      <Flame className="h-3 w-3 text-amber-400" />
                    ) : (
                      <Compass className="h-3 w-3 text-sky-400" />
                    )}
                    {template.title}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={onAddQuest}
              disabled={!selectedTemplate}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Add to Tracker
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};