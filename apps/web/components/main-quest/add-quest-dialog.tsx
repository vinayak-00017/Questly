"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { DatePicker } from "./date-picker";
import { useMutation } from "@tanstack/react-query";
import {
  MainQuestImportance,
  TaskPriority,
  CreateQuestTemplate,
  QuestType,
} from "@questly/types";
import { CreateMainQuest, createMainQuestSchema } from "@questly/types";
import { toast } from "sonner";
import { BASE_URL } from "@/config";

interface AddQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddQuestDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddQuestDialogProps) {
  const { Medium, High, Critical, Low, Optional } = TaskPriority;
  const {
    Epic,
    Medium: MainMedium,
    High: MainHigh,
    Low: MainLow,
  } = MainQuestImportance;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<MainQuestImportance>(MainMedium);
  const [dueDate, setDueDate] = useState<Date>();
  const [dailyQuests, setDailyQuests] = useState<CreateQuestTemplate[]>([]);
  const [dailyQuestPriority, setDailyQuestPriority] =
    useState<TaskPriority>(Medium);
  const [dailyQuestTitle, setDailyQuestTitle] = useState("");

  const handleAddDailyTask = () => {
    if (dailyQuestTitle.trim()) {
      setDailyQuests([
        ...dailyQuests,
        {
          title: dailyQuestTitle.trim(),
          type: QuestType.Daily,
          basePoints: dailyQuestPriority,
          recurrenceRule: "daily",
        },
      ]);
      setDailyQuestTitle("");
      setDailyQuestPriority(Medium);
    }
  };

  const handleRemoveTask = (index: number) => {
    setDailyQuests(dailyQuests.filter((_, i) => i !== index));
  };

  const addMainQuestMutation = useMutation({
    mutationFn: async (input: CreateMainQuest) => {
      const response = await fetch(`${BASE_URL}/quest/main`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create quest");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Main quest created successfully!");
      onSuccess?.();
      onOpenChange(false);
      // Reset form
      setTitle("");
      setDescription("");
      setImportance(MainMedium);
      setDueDate(undefined);
      setDailyQuests([]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create quest");
    },
  });

  const handleCreateMainQuest = () => {
    try {
      const input = {
        title,
        description,
        importance,
        dueDate: dueDate ? dueDate.toISOString() : null,
        quests: dailyQuests,
      };

      console.log(input);
      try {
        const validatedInput = createMainQuestSchema.parse(input);
        console.log("hi2");
        addMainQuestMutation.mutate(validatedInput);
      } catch (validationError) {
        console.error("Validation error:", validationError); // Log the validation error
        throw validationError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-none px-6">
          <DialogTitle className="text-xl font-bold">
            Add New Main Quest
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 px-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">
              Quest Title
            </label>
            <Input
              placeholder="Enter quest title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Enter quest description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                Importance
              </label>
              <Select
                value={importance}
                onValueChange={(value) =>
                  setImportance(value as MainQuestImportance)
                }
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value={MainLow}>Low</SelectItem>
                  <SelectItem value={MainMedium}>Medium</SelectItem>
                  <SelectItem value={MainHigh}>High</SelectItem>
                  <SelectItem value={Epic}>Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                Due Date (Optional)
              </label>
              <DatePicker date={dueDate} onSelect={setDueDate} />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="flex gap-2 items-end">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-zinc-200">
                  Associated Daily Quests
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
                  className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="task-priority"
                  className="text-sm font-medium text-zinc-200"
                >
                  Priority
                </label>
                <Select
                  value={dailyQuestPriority}
                  onValueChange={(value) =>
                    setDailyQuestPriority(value as TaskPriority)
                  }
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value={Optional}>Optional</SelectItem>
                    <SelectItem value={Low}>Low</SelectItem>
                    <SelectItem value={Medium}>Medium</SelectItem>
                    <SelectItem value={High}>High</SelectItem>
                    <SelectItem value={Critical}>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddDailyTask}
                className="bg-purple-500 hover:bg-purple-600 self-end"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {dailyQuests.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-zinc-800/30 border border-zinc-700"
                >
                  <div className="flex gap-4 items-center w-full">
                    <span className="text-sm text-zinc-200">{task.title}</span>
                    <span className="text-sm text-zinc-200 bg-accent rounded-full p-1">
                      {task.basePoints}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTask(index)}
                    className="h-8 w-8 p-0 hover:bg-zinc-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800 flex-none px-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleCreateMainQuest}
            className="bg-purple-500 hover:bg-purple-600"
            disabled={!title.trim() || addMainQuestMutation.isPending}
          >
            {addMainQuestMutation.isPending ? "Creating..." : "Create Quest"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
