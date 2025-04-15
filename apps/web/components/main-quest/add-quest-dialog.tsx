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
  createMainQuestSchema,
  type CreateMainQuestInput,
} from "../../../../packages/types/src/quest";
import { toast } from "sonner";

interface AddQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface DailyTask {
  title: string;
  description?: string;
}

export function AddQuestDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddQuestDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [dueDate, setDueDate] = useState<Date>();
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddDailyTask = () => {
    if (newTaskTitle.trim()) {
      setDailyTasks([...dailyTasks, { title: newTaskTitle.trim() }]);
      setNewTaskTitle("");
    }
  };

  const handleRemoveTask = (index: number) => {
    setDailyTasks(dailyTasks.filter((_, i) => i !== index));
  };

  const addMainQuestMutation = useMutation({
    mutationFn: async (input: CreateMainQuestInput) => {
      const response = await fetch("/api/quests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      setImportance("medium");
      setDueDate(undefined);
      setDailyTasks([]);
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
        type: "main" as const,
        importance,
        dueDate,
        dailyTasks,
        completed: false,
        basePoints: 1,
        xpReward: 50,
      };

      const validatedInput = createMainQuestSchema.parse(input);
      addMainQuestMutation.mutate(validatedInput);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Main Quest
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              <Select value={importance} onValueChange={setImportance}>
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
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

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-200">
              Associated Daily Quests
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter daily quest title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddDailyTask();
                  }
                }}
                className="bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-white"
              />
              <Button
                onClick={handleAddDailyTask}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {dailyTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-zinc-800/30 border border-zinc-700"
                >
                  <span className="text-sm text-zinc-200">{task.title}</span>
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

        <div className="flex justify-end gap-3 mt-6">
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
