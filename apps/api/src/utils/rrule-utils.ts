import { RRule, RRuleSet, rrulestr } from "rrule";

/**
 * Validates if a string is a valid RRULE format
 * @param rule The RRULE string to validate
 * @returns True if valid, false otherwise
 */
export function isValidRRule(rule?: string): boolean {
  if (!rule) return true; // No rule is valid (once/no recurrence)

  try {
    // Try to parse the rule
    rrulestr(rule);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a recurrence rule applies to a specific date
 * @param rule The RRULE string
 * @param date The date to check (defaults to today)
 * @returns True if the rule applies to the date
 */
export function doesRRuleMatchDate(
  rule?: string,
  date: Date = new Date()
): boolean {
  if (!rule) return false; // No rule means no recurrence (once)

  try {
    const rrule = rrulestr(rule);

    // Set time to midnight for consistent date comparison
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Check if the rule applies to this date
    const occurrences = rrule.between(
      targetDate,
      new Date(targetDate.getTime() + 24 * 60 * 60 * 1000 - 1), // End of the day
      true
    );

    return occurrences.length > 0;
  } catch (error) {
    console.error("Error parsing RRULE:", error);
    return false;
  }
}

// Helper functions to create common RRULE patterns

/**
 * Creates a rule for one-time (non-recurring) events
 * @returns null to indicate no recurrence
 */
export function createOnceRRule(): null {
  return null;
}

/**
 * Creates a daily recurrence rule
 */
export function createDailyRRule(): string {
  return "FREQ=DAILY";
}

/**
 * Creates a weekly recurrence rule on specific days
 * @param daysOfWeek Array of weekdays (0=SU, 1=MO, 2=TU, 3=WE, 4=TH, 5=FR, 6=SA)
 * @returns RRULE string for weekly recurrence
 */
export function createWeeklyRRule(daysOfWeek: number[]): string {
  if (!daysOfWeek.length) {
    const today = new Date().getDay();
    daysOfWeek = [today];
  }

  const dayMap: Record<number, string> = {
    0: "SU",
    1: "MO",
    2: "TU",
    3: "WE",
    4: "TH",
    5: "FR",
    6: "SA",
  };

  const byDayStr = daysOfWeek.map((day) => dayMap[day]).join(",");
  return `FREQ=WEEKLY;BYDAY=${byDayStr}`;
}

/**
 * Creates a weekday recurrence rule (Monday to Friday)
 */
export function createWeekdayRRule(): string {
  return "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
}

/**
 * Creates a weekend recurrence rule (Saturday and Sunday)
 */
export function createWeekendRRule(): string {
  return "FREQ=WEEKLY;BYDAY=SA,SU";
}

/**
 * Creates a monthly recurrence rule on specific day(s) of month
 * @param daysOfMonth Array of days (1-31)
 * @returns RRULE string for monthly recurrence
 */
export function createMonthlyRRule(daysOfMonth: number[]): string {
  if (!daysOfMonth.length) {
    const today = new Date().getDate();
    daysOfMonth = [today];
  }

  return `FREQ=MONTHLY;BYMONTHDAY=${daysOfMonth.join(",")}`;
}

/**
 * Gets a human-readable description of an RRULE
 * @param rule The RRULE string
 * @returns Human-readable description
 */
export function getHumanReadableRRule(rule?: string): string {
  if (!rule) return "Once (no recurrence)";

  try {
    const rrule = rrulestr(rule);
    return rrule.toText();
  } catch (error) {
    return "Invalid recurrence pattern";
  }
}
