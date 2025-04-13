import React from "react";
import { AnimatedCircularProgressBar } from "../magicui/animated-circular-progress-bar";
import { useTasks } from "@/hooks/useTasks";
import { UserTask } from "../../../../packages/types/src/task";

const TaskProgress = () => {
  const { tasks } = useTasks();

  const totalPoints = tasks.reduce(
    (sum: number, task: UserTask) =>
      sum +
      ((task.isTimeTracked && task.plannedDuration
        ? Math.round(task.basePoints * (task.plannedDuration / 60) * 100) / 100
        : task.basePoints) || 0),
    0
  );

  const completedPoints = tasks
    .filter((task: UserTask) => task.completed)
    .reduce(
      (sum: number, task: UserTask) =>
        sum +
        ((task.isTimeTracked && task.plannedDuration
          ? Math.round(task.basePoints * (task.plannedDuration / 60) * 100) /
            100
          : task.basePoints) || 0),
      0
    );

  return (
    <div className="flex flex-col items-center">
      <AnimatedCircularProgressBar
        max={totalPoints || 1}
        min={0}
        value={completedPoints}
        gaugePrimaryColor="red"
        gaugeSecondaryColor="gray"
      />
      <div className="mt-2 text-sm font-medium">
        {completedPoints} / {totalPoints} points
      </div>
    </div>
  );
};

export default TaskProgress;
