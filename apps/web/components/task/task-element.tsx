import React from "react";
import { Checkbox } from "../ui/checkbox";
import { TaskPriority } from "@questly/types";

const TaskElement = ({
  title,
  isChecked,
  setIsChecked,
  basePoints,
}: {
  title: string;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  basePoints: number | TaskPriority;
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
          {title}
        </div>
        <div className="flex">
          <div>{basePoints}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskElement;
