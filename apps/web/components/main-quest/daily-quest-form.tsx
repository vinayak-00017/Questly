// DailyQuestForm.tsx - Component for adding new daily quests
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestPriority, QuestType, CreateQuestTemplate } from "@questly/types";
import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { createDailyRRule } from "@/lib/rrule-utils";

interface DailyQuestFormProps {
  onAddQuest: (quest: CreateQuestTemplate) => void;
  dueDate?: Date;
}

export function DailyQuestForm({ onAddQuest, dueDate }: DailyQuestFormProps) {
  const [dailyQuestTitle, setDailyQuestTitle] = useState("");
  const [dailyQuestPriority, setDailyQuestPriority] = useState<QuestPriority>(
    QuestPriority.Standard
  );

  const handleAddDailyTask = () => {
    if (dailyQuestTitle.trim()) {
      const newQuest = {
        title: dailyQuestTitle.trim(),
        type: QuestType.Daily,
        basePoints: dailyQuestPriority,
        recurrenceRule: createDailyRRule(),
        dueDate: dueDate instanceof Date ? dueDate.toISOString() : undefined,
      };
      
      onAddQuest(newQuest);
      setDailyQuestTitle("");
      setDailyQuestPriority(QuestPriority.Standard);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" />
          Daily Quest Title
        </label>
        <Input
          placeholder="Enter daily quest title..."
          value={dailyQuestTitle}
          onChange={(e) => setDailyQuestTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddDailyTask();
            }
          }}
          className="bg-black/50 border-zinc-700 focus:border-purple-500 text-white hover:bg-black/70"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="task-priority"
          className="text-sm font-medium text-purple-400 flex items-center gap-2"
        >
          <Target className="h-3.5 w-3.5" />
          Priority
        </label>
        <Select
          value={dailyQuestPriority}
          onValueChange={(value) =>
            setDailyQuestPriority(value as QuestPriority)
          }
        >
          <SelectTrigger className="bg-black/50 border-zinc-700 text-white hover:bg-black/70 focus:border-purple-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem
              value={QuestPriority.Optional}
              className="focus:bg-purple-900/20 focus:text-purple-400"
            >
              Optional
            </SelectItem>
            <SelectItem
              value={QuestPriority.Minor}
              className="focus:bg-purple-900/20 focus:text-purple-400"
            >
              Minor
            </SelectItem>
            <SelectItem
              value={QuestPriority.Standard}
              className="focus:bg-purple-900/20 focus:text-purple-400"
            >
              Standard
            </SelectItem>
            <SelectItem
              value={QuestPriority.Important}
              className="focus:bg-purple-900/20 focus:text-purple-400"
            >
              Important
            </SelectItem>
            <SelectItem
              value={QuestPriority.Critical}
              className="focus:bg-purple-900/20 focus:text-purple-400"
            >
              Critical
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={handleAddDailyTask}
        className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 border-0 text-white self-end"
        disabled={!dailyQuestTitle.trim()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
