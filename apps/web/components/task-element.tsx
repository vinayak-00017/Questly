import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";

const TaskElement = ({
  task,
  isChecked,
  setIsChecked,
}: {
  task: string;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
}) => {
  const handleTaskClick = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div
      className="border-2 rounded-2xl p-2 flex  items-center"
      onClick={handleTaskClick}
    >
      <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
      <div className="px-2">{task}</div>
    </div>
  );
};

export default TaskElement;
