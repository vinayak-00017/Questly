import { BASE_URL } from "@/config";
import { CreateTaskInstance } from "@questly/types";

export const taskApi = {
  addTaskInstance: async ({
    questInstanceId,
    taskData,
  }: {
    questInstanceId: string;
    taskData: CreateTaskInstance;
  }) => {
    const response = await fetch(
      `${BASE_URL}/quest/quest-instance/${questInstanceId}/task-instance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(taskData),
      }
    );

    if (!response.ok) throw new Error(`Failed to add task`);
    return response.json();
  },

  fetchTasks: async () => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  // updateTask: async (taskId: string, updates: Partial<UserTask>) => {
  //   console.log(updates);
  //   const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //     body: JSON.stringify(updates),
  //   });
  //   if (!response.ok) throw new Error(`Failed to update task`);
  //   return response.json();
  // },
};
