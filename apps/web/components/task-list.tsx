import React, { useState } from "react";
import { AnimatedList, AnimatedListItem } from "./magicui/animated-list";
import TaskElement from "./task-element";

const TaskList = () => {
  const [taskStates, setTaskStates] = useState([
    { task: "meditate", done: false },
    { task: "audiobook", done: true },
    { task: "gym", done: true },
  ]);

  const updateTaskState = (index: number, checked: boolean) => {
    setTaskStates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: checked } : item))
    );
  };
  return (
    <>
      <AnimatedList delay={300}>
        {taskStates.map((taskItem, index) => (
          <AnimatedListItem key={`task-${index}`}>
            <TaskElement
              task={taskItem.task}
              isChecked={taskItem.done}
              setIsChecked={(checked) => updateTaskState(index, checked)}
            />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </>
  );
};

export default TaskList;
