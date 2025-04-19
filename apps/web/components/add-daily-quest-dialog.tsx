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
import { useMutation } from "@tanstack/react-query";
import {
  MainQuestImportance,
  TaskPriority,
  CreateQuestTemplate,
  QuestType,
} from "@questly/types";
import { createMainQuestSchema } from "@questly/types";
import { toast } from "sonner";
import { mainQuestApi } from "@/services/main-quest-api";
import { DatePicker } from "./main-quest/date-picker";

interface AddQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddDailyQuestDialog({
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

  const addMainQuestMutation = useMutation({
    mutationFn: mainQuestApi.addMainQuest,
    onSuccess: () => {
      toast.success("Main quest created successfully!");
      onSuccess?.();
      onOpenChange(false);
      // Reset form
      setTitle("");
      setDescription("");
      setImportance(MainMedium);
      setDueDate(undefined);
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
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      };

      try {
        const validatedInput = createMainQuestSchema.parse(input);
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
      <DialogContent className="sm:max-w-[500px] w-full bg-zinc-900 border-zinc-800 max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-none px-6">
          <DialogTitle className="text-xl font-bold">
            Add New Daily Quest
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

          <div className="flex justify-between px-2 ">
            <div>
              <label className="text-sm font-medium text-zinc-200">Link</label>
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
