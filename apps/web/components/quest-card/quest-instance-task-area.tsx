import { Plus, Check } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
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
  TaskPriority,
} from "@questly/types";
import { taskApi } from "@/services/task-api";
import { toast } from "sonner";

const QuestInstanceTaskArea = ({
  colorStyles,
  expandedQuestId,
  quest,
  onTaskAdded,
}: {
  colorStyles: any;
  expandedQuestId: string;
  quest: QuestInstance;
  onTaskAdded?: () => void;
}) => {
  const { Low, Medium, High, Urgent } = TaskPriority;
  const [taskPriority, setTaskPriority] = useState<TaskPriority>(Medium);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const queryClient = useQueryClient();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when area is mounted
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      if (onTaskAdded) onTaskAdded();
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

  // Determine if the quest is completed to apply correct styling
  const isCompleted = quest.completed;

  // Collapse area when clicking outside
  const areaRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!onTaskAdded) return;
    const handleClick = (e: MouseEvent) => {
      // Use composedPath for robust detection of overlays and dropdowns
      const path = e.composedPath();
      const isInOverlay = path.some((el) => {
        if (!(el instanceof HTMLElement)) return false;
        // Check for select dropdowns, dialogs, portals, and listbox roles
        if (
          el.classList.contains("select-content") ||
          el.classList.contains("dialog-content") ||
          el.getAttribute("role") === "dialog" ||
          el.classList.contains("radix-portal") ||
          el.getAttribute("role") === "listbox" ||
          el.hasAttribute("data-radix-portal")
        ) {
          return true;
        }
        // Check parent for data-radix-portal (for deeply nested dropdowns)
        let parent = el.parentElement;
        while (parent) {
          if (parent.hasAttribute("data-radix-portal")) return true;
          parent = parent.parentElement;
        }
        return false;
      });
      if (areaRef.current && !path.includes(areaRef.current) && !isInOverlay) {
        onTaskAdded();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onTaskAdded]);
  return (
    <div
      ref={areaRef}
      className="px-4 relative task-area-container"
      tabIndex={-1}
    >
      <div
        className={cn(
          "p-4 relative",
          "task-area",
          // Styling based on quest completion state
          isCompleted
            ? "bg-green-900/5 border-green-500/40"
            : "bg-black/20 border-zinc-700/60",
          // Use expandedBg from colorStyles if provided
          colorStyles.expandedBg
        )}
      >
        {/* Corner decorative elements for bottom corners only */}
        <div
          className={`absolute bottom-0 left-[12px] w-3 h-3 border-b border-l ${
            isCompleted
              ? "border-green-500/50"
              : colorStyles.cornerBorder || "border-zinc-700/50"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 right-[12px] w-3 h-3 border-b border-r ${
            isCompleted
              ? "border-green-500/50"
              : colorStyles.cornerBorder || "border-zinc-700/50"
          }`}
        ></div>

        {/* Task input area */}
        <div className="flex items-end gap-2 relative z-10">
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Add a task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTaskInstance(quest.instanceId);
              }}
              className={cn(
                "bg-black/30 text-white",
                isCompleted
                  ? "border-green-500/50 focus-visible:ring-green-500/10"
                  : colorStyles.inputBorder ||
                      "border-zinc-700/60 focus-visible:ring-blue-500/10"
              )}
            />
          </div>
          <Select value={taskPriority} onValueChange={handlePriorityChange}>
            <SelectTrigger
              className={cn(
                "w-24 bg-black/30 text-white",
                isCompleted ? "border-green-500/50" : "border-zinc-700/60"
              )}
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
            className={cn(
              "text-white transition-all",
              isCompleted
                ? "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500"
                : colorStyles.addButtonBg || "bg-blue-600 hover:bg-blue-500"
            )}
            disabled={!newTaskTitle.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CSS for connecting to the parent card */}
      <style jsx>{`
        .task-area-container {
          margin-top: -2px;
          padding-top: 0;
          margin-bottom: 8px;
          position: relative;
        }
        .task-area {
          border-bottom: 1px gray;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          margin-left: 4px;
          margin-right: 4px;
          border-top: none;
        }
      `}</style>
    </div>
  );
};

export default QuestInstanceTaskArea;
