import { BASE_URL } from "@/config";

export const userApi = {
  getUserStats: async () => {
    const response = await fetch(`${BASE_URL}/user/userStats`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user Stats");
    return response.json();
  },
};
