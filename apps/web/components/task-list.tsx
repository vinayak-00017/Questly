"use client";
import React, { useState } from "react";
import { AnimatedList, AnimatedListItem } from "./magicui/animated-list";
import TaskElement from "./task-element";
import { Button } from "./ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/config";
import { Input } from "./ui/input";
import { Task } from "better-auth/react";

const addTaskApi = async (taskData: { title: string }) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
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
  const response = await fetch(`${BASE_URL}/tasks`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};

const updateTaskApi = async (taskId: string, updates: Partial<Task>) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(`Failed to update task`);
  return response.json();
};

const TaskList = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  // //Query to fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasksApi,
    select: (data) => data.tasks || [],
  });

  //mutation to update task
  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<Task>;
    }) => updateTaskApi(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      console.error("Error updating task:", error.message);
      alert("Failed to update task status. Please try again.");
    },
  });
  //Mutation to add a new task
  const addTaskMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Task title cannot be empty");
      }
      return addTaskApi({ title });
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

  const handleAddTask = () => {
    if (!title.trim()) {
      alert("Task title cannot be empty");
      return;
    }
    addTaskMutation.mutate();
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  const updateCompletedState = (index: number, completed: boolean) => {
    const task = tasks[index];
    if (task && task.id) {
      updateTaskMutation.mutate({
        taskId: task.id,
        updates: { completed },
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        ></Input>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      <AnimatedList delay={300}>
        {tasks.map((taskItem, index: number) => (
          <AnimatedListItem key={`task-${index}`}>
            <TaskElement
              task={taskItem.title}
              isChecked={taskItem.completed}
              setIsChecked={(checked) => updateCompletedState(index, checked)}
            />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </div>
  );
};

export default TaskList;
