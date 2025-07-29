import { StreakDisplay, UserStats } from "./types";

// Calculate aura intensity with gradual progression
export const getAuraIntensity = (level: number): number => {
  const linearPart = level * 0.025;
  const exponentialPart = level > 30 ? Math.pow((level - 30) / 40, 2.0) * 0.5 : 0;
  const baseIntensity = Math.min(linearPart + exponentialPart, 1.0);
  const minIntensity = 0.008;
  return Math.max(minIntensity, baseIntensity);
};

// Helper function to convert opacity to hex with proper padding
export const getHexAlpha = (opacity: number): string => {
  return Math.floor(Math.max(0, Math.min(255, opacity))).toString(16).padStart(2, '0');
};

// Helper function to format timezone display
export const formatTimezone = (timezone: string): string => {
  if (!timezone) return "UTC";
  const parts = timezone.split("/");
  const city = parts[parts.length - 1];
  return city.replace(/_/g, " ");
};

// Helper function to get streak display
export const getStreakDisplay = (userStats: UserStats): StreakDisplay => {
  if (userStats.streak === 0) {
    return {
      icon: "🌱",
      text: "Start today!",
      color: "text-zinc-500",
      bgColor: "bg-zinc-500/20",
      borderColor: "border-zinc-600/20",
    };
  } else if (userStats.streak >= 30) {
    return {
      icon: "🏆",
      text: `${userStats.streak} days`,
      color: "text-purple-300",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-600/20",
    };
  } else if (userStats.streak >= 7) {
    return {
      icon: "🔥",
      text: `${userStats.streak} days`,
      color: "text-orange-300",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-600/20",
    };
  } else {
    return {
      icon: "🔥",
      text: `${userStats.streak} ${userStats.streak === 1 ? "day" : "days"}`,
      color: "text-blue-300",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-600/20",
    };
  }
};