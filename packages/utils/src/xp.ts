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

// To assing a player's rank based on their level

export function getPlayerRank(level: number): string {
  // Find the highest rank where minLevel <= level
  const rank = allRanks
    .slice()
    .reverse()
    .find((r) => level >= r.minLevel);
  return rank ? rank.name : allRanks[0].name;
}

export function getPlayerRankIcon(level: number): string {
  const rank = allRanks
    .slice()
    .reverse()
    .find((r) => level >= r.minLevel);
  return rank ? rank.icon : "";
}

export function getPlayerRankColor(level: number): string {
  const rank = allRanks
    .slice()
    .reverse()
    .find((r) => level >= r.minLevel);
  return rank ? rank.color : "#000000";
}

export function getPlayerRankDescription(level: number): string {
  const rank = allRanks
    .slice()
    .reverse()
    .find((r) => level >= r.minLevel);
  return rank ? rank.description : "";
}

export const allRanks = [
  {
    name: "Beginner",
    minLevel: 1,
    maxLevel: 1,
    icon: "🎒",
    color: "#7CFC00",
    description: "Just starting your journey, eager to learn and grow.",
  },
  {
    name: "Novice",
    minLevel: 2,
    maxLevel: 3,
    icon: "🗡️",
    color: "#32CD32",
    description:
      "Gaining confidence and understanding the basics of adventure.",
  },
  {
    name: "Apprentice",
    minLevel: 4,
    maxLevel: 5,
    icon: "📜",
    color: "#1E90FF",
    description: "Learning from experience, honing your skills with guidance.",
  },
  {
    name: "Adventurer",
    minLevel: 6,
    maxLevel: 8,
    icon: "🛡️",
    color: "#00BFFF",
    description: "Boldly exploring new quests and embracing challenges.",
  },
  {
    name: "Pathfinder",
    minLevel: 9,
    maxLevel: 11,
    icon: "🧭",
    color: "#20B2AA",
    description: "Discovering new routes and leading the way for others.",
  },
  {
    name: "Journeyman",
    minLevel: 12,
    maxLevel: 14,
    icon: "🪓",
    color: "#BFA14A",
    description: "Skilled and reliable, with a wealth of experience.",
  },
  {
    name: "Craftsman",
    minLevel: 15,
    maxLevel: 19,
    icon: "🔨",
    color: "#FFA500",
    description: "Mastering your craft and perfecting your abilities.",
  },
  {
    name: "Challenger",
    minLevel: 20,
    maxLevel: 24,
    icon: "⚔️",
    color: "#FF8C00",
    description: "Fearlessly taking on formidable tasks and rivals.",
  },
  {
    name: "Expert",
    minLevel: 25,
    maxLevel: 29,
    icon: "🏹",
    color: "#8A2BE2",
    description: "Highly knowledgeable and accomplished in your field.",
  },
  {
    name: "Master",
    minLevel: 30,
    maxLevel: 34,
    icon: "🧙‍♂️",
    color: "#4B0082",
    description: "Commanding respect with exceptional skill and wisdom.",
  },
  {
    name: "Champion",
    minLevel: 35,
    maxLevel: 39,
    icon: "🥇",
    color: "#C0C0C0",
    description: "Rising above the rest, celebrated for your victories.",
  },
  {
    name: "Conqueror",
    minLevel: 40,
    maxLevel: 49,
    icon: "👑",
    color: "#B22222",
    description: "Overcoming the toughest obstacles and adversaries.",
  },
  {
    name: "Mythic",
    minLevel: 50,
    maxLevel: 59,
    icon: "🐲",
    color: "#9400D3",
    description: "Achieving legendary feats, your name echoes in tales.",
  },
  {
    name: "Immortal",
    minLevel: 60,
    maxLevel: 69,
    icon: "💀",
    color: "#FFD700",
    description: "Your legacy endures, inspiring generations to come.",
  },
  {
    name: "Legendary",
    minLevel: 70,
    maxLevel: 999,
    icon: "🏰",
    color: "#FF4500",
    description: "The pinnacle of greatness, your story becomes legend.",
  },
];
