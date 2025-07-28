import { BASE_URL } from "@/config";

export const userApi = {
  // New batched dashboard endpoint
  getDashboardData: async (period: string = "weekly") => {
    const response = await fetch(`${BASE_URL}/user/dashboard?period=${period}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard data");
    return response.json();
  },

  getUserStats: async () => {
    const response = await fetch(`${BASE_URL}/user/userStats`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user Stats");
    return response.json();
  },

  getWeeklyPerformance: async () => {
    const response = await fetch(`${BASE_URL}/user/weeklyPerformance`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch weekly performance");
    return response.json();
  },

  getPerformance: async (period: string = "weekly") => {
    const response = await fetch(
      `${BASE_URL}/user/performance?period=${period}`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch performance data");
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

  updateProfile: async ({ 
    name, 
    image, 
    imagePublicId, 
    timezone 
  }: { 
    name?: string; 
    image?: string; 
    imagePublicId?: string; 
    timezone?: string; 
  }) => {
    const response = await fetch(`${BASE_URL}/user/updateProfile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, image, imagePublicId, timezone }),
    });
    if (!response.ok) throw new Error(`Failed to update profile`);
    return response.json();
  },

  deleteImage: async (publicId: string) => {
    const response = await fetch(`/api/upload`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });
    if (!response.ok) throw new Error("Failed to delete image");
    return response.json();
  },

  getQuestDetails: async (date: string) => {
    const response = await fetch(`${BASE_URL}/user/questDetails?date=${date}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch quest details");
    return response.json();
  },
};