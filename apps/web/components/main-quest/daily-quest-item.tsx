// DailyQuestItem.tsx - New component for individual daily quest items
import { Button } from "@/components/ui/button";
import { QuestPriority, CreateQuestTemplate } from "@questly/types";
import { Scroll, X } from "lucide-react";

interface DailyQuestItemProps {
  task: CreateQuestTemplate;
  index: number;
  onRemove: (index: number) => void;
}

export function DailyQuestItem({ task, index, onRemove }: DailyQuestItemProps) {
  // Function to get priority badge styling
  const getPriorityBadgeStyle = (priority: number | QuestPriority) => {
    const { Optional, Minor, Standard, Important, Critical } = QuestPriority;
    switch (priority) {
      case Optional:
        return "bg-slate-600/50 text-slate-200";
      case Minor:
        return "bg-blue-600/50 text-blue-200";
      case Standard:
        return "bg-green-600/50 text-green-200";
      case Important:
        return "bg-amber-600/50 text-amber-200";
      case Critical:
        return "bg-red-600/50 text-red-200";
      default:
        return "bg-purple-600/50 text-purple-200";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-black/30 border border-zinc-700/50 hover:border-purple-500/30 transition-colors group">
      <div className="flex gap-3 items-center w-full">
        <div className="h-6 w-6 rounded-full bg-black/40 flex items-center justify-center ring-1 ring-purple-500/30">
          <Scroll className="h-3 w-3 text-purple-500" />
        </div>
        <span className="text-sm text-zinc-200">{task.title}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ml-auto ${getPriorityBadgeStyle(task.basePoints)}`}
        >
          {task.basePoints}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
