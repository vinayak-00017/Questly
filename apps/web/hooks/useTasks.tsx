import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/services/task-api";
import { Task } from "../../../packages/common-types/task";
import { useState } from "react";

export function useTasks() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState(1);

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
      updates: Partial<Task>;
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
          tasks: old.tasks.map((t: Task) =>
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
      if (!title.trim()) {
        throw new Error("Task title cannot be empty");
      }
      return taskApi.addTask({ title, points });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
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
