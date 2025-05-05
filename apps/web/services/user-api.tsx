import { BASE_URL } from "@/config";

export const userApi = {
  getUserStats: async () => {
    const response = await fetch(`${BASE_URL}/user/userStats`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user Stats");
    return response.json();
  },

  updateTimezone: async ({ timezone }: { timezone: string }) => {
    const response = await fetch(`${BASE_URL}/user/updateTimezone`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ timezone }),
    });
    if (!response.ok) throw new Error(`Failed to update timezone`);
    return response.json();
  },
};
