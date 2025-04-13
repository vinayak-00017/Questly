import React from "react";
import { Checkbox } from "../ui/checkbox";

const TaskElement = ({
  task,
  isChecked,
  setIsChecked,
  points,
}: {
  task: string;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  points: number;
}) => {
  return (
    <div
      className="border-2 rounded-2xl p-2 flex  items-center"
      onClick={(e) => {
        const checkboxElement = e.currentTarget.querySelector(
          '[data-slot="checkbox"]'
        );
        if (!checkboxElement?.contains(e.target as Node)) {
          setIsChecked(!isChecked);
        }
      }}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={(event) => {
          setIsChecked(!!event);
        }}
      />
      <div className="flex w-full justify-between">
        <div
          className={`px-2 ${isChecked ? "line-through text-muted-foreground" : ""}`}
        >
          {task}
        </div>
        <div className="flex">
          <div>Points:</div>
          <div>{points}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskElement;
