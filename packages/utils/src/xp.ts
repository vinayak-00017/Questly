/**
 * Calculate the XP cap for a specific level (daily maximum)
 *
 * @param level The player's current level
 * @returns The total XP cap for the given level
 */
export function getXpCapForLevel(level: number): number {
  const baseXp = 100;

  if (level < 1) return baseXp;

  return Math.round(baseXp * (1 + (level - 1) * 0.15) * level);
}

/**
 * Calculate how much total XP is needed to reach a specific level
 *
 * @param level The target level to reach
 * @returns The cumulative XP required to reach this level
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;

  let totalXp = 0;
  // For each previous level, add the XP needed to complete that level
  for (let i = 1; i < level; i++) {
    totalXp += Math.round(100 * (1 + 0.35 * (i - 1)) * i);
  }

  return totalXp;
}

/**
 * Calculate a player's level based on their total XP
 *
 * @param totalXp The player's total accumulated XP
 * @returns Object containing level information and progress details
 */
export function calculateLevelFromXp(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  progressPercent: number;
  totalXpForCurrentLevel: number;
  totalXpForNextLevel: number;
  xpForThisLevel: number;
} {
  if (totalXp <= 0) {
    return {
      level: 1,
      currentLevelXp: 0,
      xpToNextLevel: getXpRequiredForLevel(2),
      progressPercent: 0,
      totalXpForCurrentLevel: 0,
      totalXpForNextLevel: getXpRequiredForLevel(2),
      xpForThisLevel: getXpRequiredForLevel(2),
    };
  }

  // Find the highest level where cumulative XP requirement is <= totalXp
  let level = 1;
  while (getXpRequiredForLevel(level + 1) <= totalXp) {
    level++;
  }

  // Calculate XP within the current level
  const totalXpForCurrentLevel = getXpRequiredForLevel(level);
  const totalXpForNextLevel = getXpRequiredForLevel(level + 1);
  const xpForThisLevel = totalXpForNextLevel - totalXpForCurrentLevel;
  const currentLevelXp = totalXp - totalXpForCurrentLevel;
  const xpToNextLevel = totalXpForNextLevel - totalXp;
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentLevelXp / xpForThisLevel) * 100)
  );

  return {
    level,
    currentLevelXp,
    xpForThisLevel,
    xpToNextLevel,
    progressPercent,
    totalXpForCurrentLevel,
    totalXpForNextLevel,
  };
}

/**
 * Calculate XP rewards for quests based on their base points and the player's level
 *
 * @param quests Array of quests with basePoints property
 * @param playerLevel Current level of the player
 * @returns Array of quests with xpReward property added
 */
export function calculateXpRewards<
  T extends { basePoints: number; completed?: boolean },
>(
  quests: T[],
  playerLevel: number = 1,
  onlyCompleted: boolean
): (T & { xpReward: number })[] {
  const levelXpCap = getXpCapForLevel(playerLevel);

  const totalPoints = quests.reduce((sum, quest) => sum + quest.basePoints, 0);

  // Calculate and add XP rewards
  return quests.map((quest) => {
    const potentialXpReward =
      totalPoints > 0
        ? Math.round((quest.basePoints / totalPoints) * levelXpCap)
        : quest.basePoints > 0
          ? levelXpCap
          : 0;

    if (onlyCompleted) {
      const xpReward = quest.completed ? potentialXpReward : 0;
      return {
        ...quest,
        xpReward,
      };
    } else {
      const xpReward = potentialXpReward;
      return {
        ...quest,
        xpReward,
      };
    }
  });
}

/**
 * Check if a player will level up after adding XP
 *
 * @param currentTotalXp Current total XP of the player
 * @param xpToAdd Amount of XP to add
 * @returns Object containing information about the level up, if any
 */
export function checkLevelUp(
  currentTotalXp: number,
  xpToAdd: number
): {
  willLevelUp: boolean;
  currentLevel: number;
  newLevel: number;
  levelsGained: number;
} {
  const currentLevelInfo = calculateLevelFromXp(currentTotalXp);
  const newLevelInfo = calculateLevelFromXp(currentTotalXp + xpToAdd);

  return {
    willLevelUp: newLevelInfo.level > currentLevelInfo.level,
    currentLevel: currentLevelInfo.level,
    newLevel: newLevelInfo.level,
    levelsGained: newLevelInfo.level - currentLevelInfo.level,
  };
}
