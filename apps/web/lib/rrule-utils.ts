/**
 * Utility functions for working with iCalendar RRULE recurrence rules
 */

/**
 * Creates a daily recurrence rule
 * @returns RRULE string
 */
export function createDailyRRule(): string {
  return "FREQ=DAILY";
}

/**
 * Creates a weekly recurrence rule for specific days
 * @param daysOfWeek Array of days (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns RRULE string
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
 * @returns RRULE string
 */
export function createWeekdayRRule(): string {
  return "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
}

/**
 * Creates a weekend recurrence rule (Saturday and Sunday)
 * @returns RRULE string
 */
export function createWeekendRRule(): string {
  return "FREQ=WEEKLY;BYDAY=SA,SU";
}

/**
 * Creates a monthly recurrence rule for specific days of the month
 * @param daysOfMonth Array of month days (1-31)
 * @returns RRULE string
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

  // Simple parsing for common patterns
  if (rule === "FREQ=DAILY") {
    return "Every day";
  }

  if (rule === "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR") {
    return "Every weekday (Monday to Friday)";
  }

  if (rule === "FREQ=WEEKLY;BYDAY=SA,SU") {
    return "Weekends (Saturday and Sunday)";
  }

  if (rule.startsWith("FREQ=WEEKLY;BYDAY=")) {
    const days = rule.replace("FREQ=WEEKLY;BYDAY=", "").split(",");
    const dayNames: Record<string, string> = {
      MO: "Monday",
      TU: "Tuesday",
      WE: "Wednesday",
      TH: "Thursday",
      FR: "Friday",
      SA: "Saturday",
      SU: "Sunday",
    };

    const dayLabels = days.map((d) => dayNames[d] || d);

    if (dayLabels.length === 1) {
      return `Every ${dayLabels[0]}`;
    }

    return `Weekly on ${dayLabels.join(", ")}`;
  }

  if (rule.startsWith("FREQ=MONTHLY;BYMONTHDAY=")) {
    const days = rule.replace("FREQ=MONTHLY;BYMONTHDAY=", "").split(",");

    if (days.length === 1) {
      const day = parseInt(days[0]);
      return `Monthly on day ${day}${getDaySuffix(day)}`;
    }

    return `Monthly on days ${days.join(", ")}`;
  }

  return rule; // Return the raw rule if we can't parse it
}

/**
 * Gets the appropriate suffix for a day number (1st, 2nd, 3rd, etc.)
 */
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
