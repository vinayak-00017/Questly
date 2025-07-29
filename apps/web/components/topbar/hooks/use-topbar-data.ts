import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import { useAnonymousUser } from "../../anonymous-login-provider";
import { 
  getPlayerRank, 
  getPlayerRankIcon, 
  getPlayerRankColor 
} from "@questly/utils";
import { getAuraIntensity, getStreakDisplay } from "../utils";
import { UserStats } from "../types";

export function useTopbarData() {
  const [animationKey, setAnimationKey] = useState(0);
  const { isAnonymous } = useAnonymousUser();
  const { data: session, isPending } = useSession();

  // Force re-render of animations every few seconds to get new random values
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const { data } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => ({ userStats: data.userStats }),
    enabled: !!session,
  });

  const userStats: UserStats = data?.userStats || {
    levelStats: {
      level: 1,
      currentLevelXp: 0,
      xpForThisLevel: 100,
      progressPercent: 0,
    },
    todaysXp: 0,
    streak: 0,
    isActiveToday: false,
    characterClass: "Adventurer",
    timezone: "UTC",
  };

  const rank = getPlayerRank(userStats.levelStats.level);
  const rankIcon = getPlayerRankIcon(userStats.levelStats.level);
  const rankColor = getPlayerRankColor(userStats.levelStats.level);
  const auraIntensity = getAuraIntensity(userStats.levelStats.level);
  const streakDisplay = getStreakDisplay(userStats);

  return {
    session,
    isPending,
    isAnonymous,
    userStats,
    rank,
    rankIcon,
    rankColor,
    auraIntensity,
    streakDisplay,
    animationKey,
  };
}