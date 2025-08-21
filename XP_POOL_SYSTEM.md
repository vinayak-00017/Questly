# XP Pool Depletion System

## Problem Solved

Previously, users could exceed their daily XP cap by completing quests early and then adding more quests later in the day. This led to inconsistent XP rewards and potential exploitation.

## Solution: Daily XP Pool Depletion

Instead of retroactively adjusting XP, we now use a "pool depletion" system:

### How It Works

1. **Daily XP Cap**: Each user level has a daily XP cap (calculated by `getXpCapForLevel(level)`)
2. **XP Pool Tracking**: We track how much XP has been consumed from the daily pool
3. **Remaining XP**: New quests can only award XP from the remaining pool
4. **First-Come-First-Served**: Earlier completed quests get their full calculated XP; later quests get less if the pool is depleted

### Key Features

- ✅ **Never reduces earned XP** - Once awarded, XP is never taken away
- ✅ **Simple and fast** - No complex recalculations needed
- ✅ **Clear daily limits** - Users can see their remaining XP pool
- ✅ **Prevents exploitation** - Can't exceed daily cap by adding quests later

### Example Scenario

- User Level 5 has 500 XP daily cap
- Completes 2 quests (3 points each) → gets 250 XP each = 500 XP total
- Adds 2 more quests (3 points each) later → gets 0 XP each (pool is depleted)
- Total XP for the day: 500 XP (exactly the daily cap)

### API Changes

1. **Quest Completion**: Uses `getValidatedXpReward()` to ensure XP doesn't exceed pool
2. **Quest Display**: Uses `calculateXpWithPoolLimit()` to show realistic potential XP
3. **Pool Status**: New endpoint `getDailyXpPoolStatus()` shows remaining XP

### Benefits

- **Performance**: Much faster than recalculating all quests
- **Predictability**: Users know exactly how much XP they can still earn
- **Fairness**: Early birds get better rewards, encouraging consistent daily engagement
- **No Confusion**: XP never decreases, only shows realistic potential rewards
