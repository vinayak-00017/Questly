import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/services/task-api";
import {
  AddTask,
  addTaskSchema,
  UserTask,
} from "../../../packages/types/src/task";
import { useState } from "react";

export function useTasks() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState(1);
  const [isTimeTracked, setIsTimeTracked] = useState(false);
  const [plannedDuration, setPlannedDuration] = useState(30);

  // Query to fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.fetchTasks,
    select: (data) => data.tasks || [],
  });

  // Mutation to update task
  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<UserTask>;
    }) => taskApi.updateTask(taskId, updates),
    onMutate: async ({ taskId, updates }) => {
      // Cancel in-flight queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Save current state for potential rollback
      const previousTasks = queryClient.getQueryData(["tasks"]);

      // Update the cache optimistically
      queryClient.setQueryData(["tasks"], (old: any) => {
        return {
          ...old,
          tasks: old.tasks.map((t: UserTask) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        };
      });
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Mutation to add a new task
  const addTaskMutation = useMutation({
    mutationFn: () => {
      const taskInput: AddTask = {
        title,
        basePoints: points,
      };

      const result = addTaskSchema.safeParse(taskInput);
      if (!result.success) {
        const errorMessage =
          result.error.errors[0]?.message || "Invalid task data";
        throw new Error(errorMessage);
      }
      return taskApi.addTask(taskInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setPoints(1);
    },
    onError: (error: any) => {
      console.error("Error adding task:", error.message);
      alert("Failed to add task. Please try again.");
    },
  });

  const updateCompletedState = (taskId: string, completed: boolean) => {
    updateTaskMutation.mutate({
      taskId: taskId,
      updates: { completed },
    });
  };

  return {
    tasks,
    isLoading,
    title,
    setTitle,
    points,
    setPoints,
    isTimeTracked,
    setIsTimeTracked,
    plannedDuration,
    setPlannedDuration,
    addTask: () => {
      if (!title.trim()) {
        alert("Task title cannot be empty");
        return;
      }
      addTaskMutation.mutate();
    },
    updateCompletedState,
    isPending: addTaskMutation.isPending,
  };
}
