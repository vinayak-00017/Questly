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
 * @param condensed Whether to return a condensed version (for small UI elements)
 * @returns Human-readable description
 */
export function getHumanReadableRRule(
  rule?: string,
  condensed = false
): string {
  if (!rule) return condensed ? "Once" : "Once (no recurrence)";

  // Simple parsing for common patterns
  if (rule === "FREQ=DAILY") {
    return "Every day";
  }

  if (rule === "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR") {
    return condensed ? "Every weekday" : "Every weekday (Monday to Friday)";
  }

  if (rule === "FREQ=WEEKLY;BYDAY=SA,SU") {
    return condensed ? "Weekends" : "Weekends (Saturday and Sunday)";
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

    const shortDayNames: Record<string, string> = {
      MO: "Mon",
      TU: "Tue",
      WE: "Wed",
      TH: "Thu",
      FR: "Fri",
      SA: "Sat",
      SU: "Sun",
    };

    if (condensed) {
      if (days.length === 1) {
        return `Every ${shortDayNames[days[0]] || days[0]}`;
      } else if (days.length === 2) {
        // For 2 days, show both days in abbreviated form
        return `${shortDayNames[days[0]] || days[0]} & ${shortDayNames[days[1]] || days[1]}`;
      }
      return `Weekly (${days.length} days)`;
    }

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
      return condensed
        ? `Monthly (day ${day})`
        : `Monthly on day ${day}${getDaySuffix(day)}`;
    }

    return condensed
      ? `Monthly (${days.length} days)`
      : `Monthly on days ${days.join(", ")}`;
  }

  // For any other formats, try to make them somewhat readable
  if (condensed) {
    if (rule.startsWith("FREQ=")) {
      const freq = rule.split(";")[0].replace("FREQ=", "");
      return freq.charAt(0) + freq.slice(1).toLowerCase();
    }
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
