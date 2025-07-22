import { taskApi } from "@/services/task-api";
import { TaskInstance } from "@questly/types";
import { numberToTaskTag } from "@questly/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListChecks, Check, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Progress } from "../ui/progress";

const QuestTasks = ({
  questInstanceId,
  colorStyles,
}: {
  questInstanceId: string;
  colorStyles: any;
}) => {
  const queryClient = useQueryClient();
  const { data: taskData = { taskInstances: [] }, isLoading: isLoadingTasks } =
    useQuery({
      queryKey: ["taskInstances", questInstanceId],
      queryFn: () => taskApi.fetchTasks({ questInstanceId }),
      enabled: !!questInstanceId,
    });

  const completeTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      completed,
      questInstanceId,
    }: {
      taskId: string;
      completed: boolean;
      questInstanceId: string;
    }) => taskApi.updateTaskStatus({ taskId, completed, questInstanceId }),
    onMutate: async ({ taskId, completed }) => {
      await queryClient.cancelQueries({
        queryKey: ["taskInstances", questInstanceId],
      });
      const previousTasks = queryClient.getQueryData([
        "taskInstances",
        questInstanceId,
      ]);

      queryClient.setQueryData(
        ["taskInstances", questInstanceId],
        (old: any) => {
          if (!old || !old.taskInstances) return old;

          return {
            ...old,
            taskInstances: old.taskInstances.map((task: TaskInstance) =>
              task.id === taskId ? { ...task, completed } : task
            ),
          };
        }
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["taskInstances", questInstanceId],
          context.previousTasks
        );
      }
      toast.error("Failed to update task");
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["taskInstances", questInstanceId],
      // });
      // queryClient.invalidateQueries({ queryKey: ["questInstance"] });
      toast.success("Task updated");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      questInstanceId,
    }: {
      taskId: string;
      questInstanceId: string;
    }) => taskApi.deleteTaskInstance({ taskId, questInstanceId }),
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({
        queryKey: ["taskInstances", questInstanceId],
      });
      const previousTasks = queryClient.getQueryData([
        "taskInstances",
        questInstanceId,
      ]);

      queryClient.setQueryData(
        ["taskInstances", questInstanceId],
        (old: any) => {
          if (!old || !old.taskInstances) return old;

          return {
            ...old,
            taskInstances: old.taskInstances.filter((task: TaskInstance) =>
              task.id !== taskId
            ),
          };
        }
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["taskInstances", questInstanceId],
          context.previousTasks
        );
      }
      toast.error("Failed to delete task");
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
    },
  });

  const tasks: TaskInstance[] = taskData.taskInstances || [];

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return Number(b.basePoints) - Number(a.basePoints);
  });

  const taskCount = tasks?.length || 0;
  const totalTaskPoints = tasks?.reduce(
    (total, task) => total + (Number(task.basePoints) || 0),
    0
  );
  const completedTaskPoints =
    tasks
      ?.filter((task) => task.completed)
      .reduce((total, task) => total + (Number(task.basePoints) || 0), 0) || 0;
  const completedTaskCount =
    tasks?.filter((task) => task.completed)?.length || 0;
  const hasProgress = taskCount > 0;
  const progress = hasProgress
    ? Math.round((completedTaskPoints / totalTaskPoints) * 100)
    : 0;

  if (isLoadingTasks)
    return <div className="text-xs text-zinc-500">Loading tasks...</div>;
  if (taskCount === 0)
    return <div className="text-xs text-zinc-500">No tasks yet</div>;
  return (
    <>
      {taskCount > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ListChecks className="h-3 w-3" />
              <span>
                {taskCount} {taskCount === 1 ? "task" : "tasks"} (
                {completedTaskCount} completed)
              </span>
            </div>

            {/* Progress percentage */}
            <span
              className={
                progress === 100 ? colorStyles.xpColor : "text-zinc-400"
              }
            >
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <Progress value={progress} />

          {/* Task list preview */}
          <ul className="space-y-1 list-none pl-1 mt-1">
            {sortedTasks.map((task: TaskInstance) => (
              <li
                key={task.id}
                className="group/task flex items-center gap-1.5 text-xs text-zinc-300 py-0.5 px-0.5 hover:bg-black/30 rounded cursor-pointer transition-colors"
                onClick={() => {
                  const newStatus = !task.completed;
                  completeTaskMutation.mutate({
                    taskId: task.id,
                    completed: newStatus,
                    questInstanceId,
                  });
                }}
              >
                {/* Task priority tag with fixed width */}
                <div
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm min-w-[52px] text-center ${
                    numberToTaskTag(Number(task.basePoints)) === "low"
                      ? "bg-slate-700/50 text-slate-300"
                      : numberToTaskTag(Number(task.basePoints)) === "medium"
                        ? "bg-emerald-700/50 text-emerald-300"
                        : numberToTaskTag(Number(task.basePoints)) === "high"
                          ? "bg-amber-700/50 text-amber-300"
                          : "bg-rose-700/50 text-rose-300" // urgent
                  } flex-shrink-0`}
                >
                  {numberToTaskTag(Number(task.basePoints))
                    ? numberToTaskTag(Number(task.basePoints))
                        .charAt(0)
                        .toUpperCase() +
                      numberToTaskTag(Number(task.basePoints)).slice(1)
                    : "Medium"}
                </div>

                {/* Custom checkbox with improved appearance */}
                <div
                  className={`h-4 w-4 flex-shrink-0 rounded-full ${
                    task.completed
                      ? `${colorStyles.expandedBg} ring-1 ring-opacity-50 ${colorStyles.cornerBorder}`
                      : "bg-black/20 border border-zinc-700"
                  } flex items-center justify-center transition-colors`}
                >
                  {task.completed && <Check className="h-3 w-3 text-white" />}
                </div>
                <span
                  className={`${task.completed ? "line-through text-zinc-500" : ""} text-xs flex-1 truncate max-w-[140px]`}
                >
                  {task.title}
                </span>

                {/* Delete button - appears on hover */}
                <button
                  className="opacity-0 group-hover/task:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-sm flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent task completion toggle
                    deleteTaskMutation.mutate({
                      taskId: task.id,
                      questInstanceId,
                    });
                  }}
                  title="Delete task"
                >
                  <X className="h-3 w-3 text-red-400 hover:text-red-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default QuestTasks;
