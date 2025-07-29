export interface UserStats {
  levelStats: {
    level: number;
    currentLevelXp: number;
    xpForThisLevel: number;
    progressPercent: number;
  };
  todaysXp: number;
  streak: number;
  isActiveToday: boolean;
  characterClass: string;
  timezone: string;
}

export interface StreakDisplay {
  icon: string;
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}