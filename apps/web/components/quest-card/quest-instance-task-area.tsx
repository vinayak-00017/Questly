import { Plus, Check } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CreateTaskInstance,
  QuestInstance,
  TaskInstance,
  TaskPriority,
} from "@questly/types";
import { taskApi } from "@/services/task-api";
import { toast } from "sonner";

const QuestInstanceTaskArea = ({
  colorStyles,
  expandedQuestId,
  quest,
}: {
  colorStyles: any;
  expandedQuestId: string;
  quest: QuestInstance;
}) => {
  const { Low, Medium, High, Urgent } = TaskPriority;
  const [taskPriority, setTaskPriority] = useState<TaskPriority>(Medium);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const queryClient = useQueryClient();

  // Mutations
  const addTaskMutation = useMutation({
    mutationFn: (variables: {
      questInstanceId: string;
      taskData: CreateTaskInstance;
    }) => taskApi.addTaskInstance(variables),
    onSuccess: () => {
      setNewTaskTitle("");
      queryClient.invalidateQueries({
        queryKey: ["taskInstances", expandedQuestId],
      });
      toast.success("Task added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add task");
    },
  });

  // Handle task submission
  const handleAddTaskInstance = (questId: string) => {
    if (!newTaskTitle.trim()) return;

    addTaskMutation.mutate({
      questInstanceId: questId,
      taskData: {
        title: newTaskTitle,
        basePoints: taskPriority,
        completed: false,
      },
    });
  };

  const handlePriorityChange = (value: string) => {
    setTaskPriority(value as TaskPriority);
  };

  return (
    <div
      className={`p-4 border border-t-0 border-zinc-800/50 rounded-b-lg ${colorStyles.expandedBg} transition-all`}
    >
      {/* Task input area */}
      <div className="flex items-end gap-2 mb-3">
        <div className="flex-1">
          <Input
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTaskInstance(quest.instanceId);
            }}
            className={`bg-black/30 ${colorStyles.inputBorder} text-white`}
          />
        </div>
        <Select value={taskPriority} onValueChange={handlePriorityChange}>
          <SelectTrigger
            className={`w-24 bg-black/30 border-zinc-700 text-white`}
          >
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value={Low}>Low</SelectItem>
            <SelectItem value={Medium}>Medium</SelectItem>
            <SelectItem value={High}>High</SelectItem>
            <SelectItem value={Urgent}>Urgent</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={() => handleAddTaskInstance(quest.instanceId)}
          className={`${colorStyles.addButtonBg} text-white`}
          disabled={!newTaskTitle.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuestInstanceTaskArea;
