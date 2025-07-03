# Timezone-Aware Scheduling

## Overview

The quest scheduling system has been updated to support multiple timezones, ensuring that users receive their daily quests at midnight in their local timezone, regardless of where the server is located.

## How It Works

### Quest Generation Scheduler

**File:** `services/quest-scheduler.ts`

- **Frequency:** Runs every hour (`0 * * * *`)
- **Logic:** 
  - Checks all users to find those who are currently at midnight (00:00) in their local timezone
  - Generates daily quests only for users whose local time is midnight
  - Skips users who already have quests for their current local date

### XP Calculation Scheduler

**File:** `services/xp-scheduler.ts`

- **Frequency:** Runs every hour (`0 * * * *`)
- **Logic:**
  - Checks all users to find those who are currently at 1 AM in their local timezone
  - Processes XP for the previous day (when it's 1 AM, the previous day has just ended)
  - Skips users who already have XP calculated for their previous day

## Key Features

1. **Timezone Awareness:** Each user's timezone is stored in the database (`user.timezone` field)
2. **Hourly Checks:** Instead of running once per day, the system checks every hour for users at specific times
3. **Duplicate Prevention:** Multiple safeguards prevent duplicate quest generation or XP calculation
4. **Error Handling:** Invalid timezones are caught and logged, defaulting to UTC
5. **Efficient Processing:** Only processes users who are at the relevant time in their timezone

## Database Schema

Users must have their timezone set in the `user.timezone` field. The system supports all standard IANA timezone names (e.g., "America/New_York", "Europe/London", "Asia/Tokyo").

## Benefits

1. **Global User Support:** Users worldwide get quests at their local midnight
2. **No Third-Party Dependencies:** Uses built-in Node.js timezone handling
3. **Scalable:** Processes only relevant users each hour instead of all users at once
4. **Reliable:** Multiple checks prevent duplicate processing
5. **Server Location Independent:** Works regardless of server timezone

## Migration Notes

- The old single daily cron job has been replaced with hourly timezone-aware processing
- Existing functionality remains backward compatible
- Users without a timezone set default to UTC
- The system handles server restarts gracefully by checking for missing quest generations

## Example Flow

For a user in New York (America/New_York):
1. At midnight EST/EDT, the quest scheduler generates their daily quests
2. At 1 AM EST/EDT, the XP scheduler calculates XP for the previous day
3. This happens regardless of the server's local time or timezone

## Error Handling

- Invalid timezones log an error and skip processing for that user
- Database errors are caught and logged without crashing the scheduler
- Failed quest generations are logged individually without affecting other users
