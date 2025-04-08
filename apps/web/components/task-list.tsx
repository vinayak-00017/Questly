"use client";
import React, { useState } from "react";
import { AnimatedList, AnimatedListItem } from "./magicui/animated-list";
import TaskElement from "./task-element";
import { Button } from "./ui/button";

const addTaskApi = async (taskData: { title: string }) => {
  const response = await fetch("/addTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(taskData),
  });

  if (!response.ok) throw new Error(`Failed to add task`);
  return response.json();
};

const fetchTasksApi = async () => {
  const response = await fetch("", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};

const TaskList = () => {
  const [taskStates, setTaskStates] = useState([]);

  const updateTaskState = (index: number, checked: boolean) => {
    setTaskStates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: checked } : item))
    );
  };

  return (
    <>
      <Button>Add Task</Button>
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
