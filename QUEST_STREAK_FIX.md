# Quest Streak Calculation Fix

## Problem Fixed

The quest streak calculation was only showing streaks within the current view (7 days or 30 days) instead of the true overall streak for the quest.

## Root Cause

The original `calculateQuestStreak` function was limited by the data available in the current view:

- Week view: Only had 7 days of data
- Month view: Only had 30 days of data
- Streak calculation was capped by this limited dataset

## Solution Implemented

### 1. New Dedicated Streak Hook

Created `useQuestStreaks` hook that:

- Fetches 90 days of quest activity data specifically for streak calculation
- Independent of the current view's date range
- Cached for 5 minutes to reduce API calls
- Provides accurate streak calculation regardless of current view

### 2. Updated Data Flow

**Before:**

```typescript
// Limited by current view data
const currentStreak = calculateQuestStreak(quest.id, getQuestActivity);
```

**After:**

```typescript
// Uses dedicated streak data with 90-day range
const { calculateQuestStreak } = useQuestStreaks(trackedQuests);
const currentStreak = calculateQuestStreak(quest.id);
```

### 3. Enhanced Quest Row Component

- Receives streak calculation function as prop
- No longer dependent on view-limited data
- Shows true overall quest streak

## Key Benefits

### ✅ **Accurate Streaks**

- Shows true consecutive completion count
- Not limited by current view (week/month)
- Up to 90 days of historical data

### ⚡ **Performance Optimized**

- Separate query for streak data
- 5-minute cache to reduce API calls
- Only fetches when needed

### 🎯 **Consistent Display**

- Streak remains same regardless of view
- Week view shows same streak as month view
- True quest performance indicator

### 📊 **Example Scenarios**

1. **User has 45-day streak**: Shows "45" in both week and month view
2. **User viewing week view**: Still sees full historical streak
3. **Quest template created 10 days ago**: Max possible streak is 10

## Technical Details

### Data Range

- **Streak calculation**: 90 days of historical data
- **View display**: 7 days (week) or 30 days (month)
- **Cache duration**: 5 minutes

### Fallback Behavior

- If no streak data: Shows 0
- If quest template not found: Shows 0
- If API error: Shows 0 (graceful degradation)

This fix ensures users see their true quest performance regardless of which view they're currently looking at!
