"use client";
import React from "react";

import TaskElement from "./task-element";
import { useTasks } from "@/hooks/useTasks";
import TaskInput from "./task-input";
import { AnimatedList, AnimatedListItem } from "../magicui/animated-list";
import { Task } from "../../../../packages/common-types/task";

const TaskList = () => {
  const {
    tasks,
    isLoading,
    title,
    setTitle,
    addTask,
    updateCompletedState,
    isPending,
  } = useTasks();

  if (isLoading) {
    return <div className="text-center p-4">Loading tasks...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <TaskInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onSubmit={addTask}
        isPending={isPending}
      />

      {tasks.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No tasks yet. Add your first task above!
        </div>
      ) : (
        <AnimatedList delay={300} className="w-full max-w-md space-y-2">
          {[...tasks]
            .sort((a, b) => {
              // First factor: completed status (incomplete tasks first)
              if (a.completed !== b.completed) {
                return a.completed ? -1 : 1; // False (incomplete) comes first
              }

              // Second factor: most recently updated first
              const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
              const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
              return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
            })
            .map((taskItem: Task, index: number) => (
              <AnimatedListItem key={taskItem.id || `task-${index}`}>
                <TaskElement
                  task={taskItem.title}
                  isChecked={!!taskItem.completed}
                  setIsChecked={(e) => updateCompletedState(taskItem.id, e)}
                />
              </AnimatedListItem>
            ))}
        </AnimatedList>
      )}
    </div>
  );
};

export default TaskList;
