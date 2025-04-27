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
import { CreateTaskInstance, TaskInstance, TaskPriority } from "@questly/types";
import { taskApi } from "@/services/task-api";
import { toast } from "sonner";

const QuestInstanceTaskArea = ({ colorStyles, expandedQuestId, quest }) => {
  const { Low, Medium, High, Urgent } = TaskPriority;
  const [taskPriority, setTaskPriority] = useState(Medium);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const queryClient = useQueryClient();
  // Tasks for the expanded quest
  const { data: taskData = { tasks: [] }, isLoading: isLoadingTasks } =
    useQuery({
      queryKey: ["tasks", expandedQuestId],
      queryFn: () => fetchTasksFn(expandedQuestId || ""),
      enabled: !!expandedQuestId,
    });

  const tasks: TaskInstance[] = taskData.tasks || [];

  // Mutations
  const addTaskMutation = useMutation({
    mutationFn: (variables: {
      questInstanceId: string;
      taskData: CreateTaskInstance;
    }) => taskApi.addTaskInstance(variables),
    onSuccess: () => {
      setNewTaskTitle("");
      queryClient.invalidateQueries({ queryKey: ["tasks", expandedQuestId] });
      toast.success("Task added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add task");
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => completeTaskFn(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", expandedQuestId] });
      toast.success("Task completed");
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
              if (e.key === "Enter") handleAddTask(quest.instanceId);
            }}
            className={`bg-black/30 ${colorStyles.inputBorder} text-white`}
          />
        </div>
        <Select value={taskPriority} onValueChange={setTaskPriority}>
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

      {/* Task list */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
        {isLoadingTasks ? (
          <div className="text-center py-2 text-zinc-400 text-sm">
            Loading tasks...
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2 rounded-md ${colorStyles.taskItemBg} border ${colorStyles.taskItemBorder} ${task.completed ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => completeTaskMutation.mutate(task.id)}
                  className={`h-5 w-5 rounded-full flex items-center justify-center ${task.completed ? "bg-green-600/30 text-green-400" : "bg-black/30 text-zinc-500"} transition-colors ring-1 ring-white/10`}
                >
                  {task.completed && <Check className="h-3 w-3" />}
                </button>
                <span
                  className={`text-sm ${task.completed ? "line-through text-zinc-500" : "text-white"}`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/30 text-zinc-400">
                  {task.basePoints}
                </span>
                {!task.completed && (
                  <button
                    onClick={() => completeTaskMutation.mutate(task.id)}
                    className="text-zinc-400 hover:text-green-400 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-zinc-400 text-sm">
            No tasks yet
          </div>
        )}
      </div>

      {/* Complete all button */}
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          onClick={() => completeQuestMutation.mutate(quest.instanceId)}
          className={`${colorStyles.completeButtonBg} text-white gap-1.5`}
        >
          <Check className="h-4 w-4" />
          Complete Quest
        </Button>
      </div>
    </div>
  );
};

export default QuestInstanceTaskArea;
