/**
 * Utility functions for consistent date handling throughout the application
 */

// Convert any date input to a proper Date object
export function toDateObject(
  dateInput: string | Date | null | undefined
): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;
  return new Date(dateInput);
}

// Format for database timestamp columns
export function toDbTimestamp(
  date: Date | string | null | undefined
): Date | null {
  const dateObj = toDateObject(date);
  return dateObj;
}

// Format for database date columns (YYYY-MM-DD)
export function toDbDate(date: Date | string | null | undefined): string {
  if (!date) return new Date().toISOString().split("T")[0]; // Default to today if null

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
}
// Get today's date at midnight for comparison purposes
export function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Compare two dates ignoring time component
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0]
  );
}

// Enhanced list of common timezones with standard abbreviations - alphabetically ordered
export const TIMEZONES = [
  { value: "Africa/Cairo", label: "Cairo, Egypt", abbr: "EET" },
  { value: "Africa/Casablanca", label: "Casablanca, Morocco", abbr: "WET" },
  {
    value: "Africa/Johannesburg",
    label: "Johannesburg, South Africa",
    abbr: "SAST",
  },
  { value: "Africa/Lagos", label: "Lagos, Nigeria", abbr: "WAT" },
  { value: "Africa/Nairobi", label: "Nairobi, Kenya", abbr: "EAT" },
  { value: "America/Anchorage", label: "Alaska", abbr: "AKST/AKDT" },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "Buenos Aires",
    abbr: "ART",
  },
  {
    value: "Australia/Adelaide",
    label: "Adelaide (South Australia)",
    abbr: "ACST/ACDT",
  },
  { value: "Australia/Brisbane", label: "Brisbane, Queensland", abbr: "AEST" },
  {
    value: "Australia/Melbourne",
    label: "Melbourne, Victoria",
    abbr: "AEST/AEDT",
  },
  {
    value: "Australia/Perth",
    label: "Perth (Western Australia)",
    abbr: "AWST",
  },
  { value: "Australia/Sydney", label: "Sydney, NSW", abbr: "AEST/AEDT" },
  {
    value: "America/Chicago",
    label: "Central Time (US & Canada)",
    abbr: "CST/CDT",
  },
  { value: "Asia/Shanghai", label: "Beijing, Shanghai (China)", abbr: "CST" },
  { value: "Asia/Dubai", label: "Dubai, UAE", abbr: "GST" },
  {
    value: "America/New_York",
    label: "Eastern Time (US & Canada)",
    abbr: "EST/EDT",
  },
  { value: "Europe/Dublin", label: "Dublin (Ireland)", abbr: "GMT/IST" },
  { value: "Pacific/Fiji", label: "Fiji", abbr: "FJT" },
  { value: "Pacific/Honolulu", label: "Hawaii", abbr: "HST" },
  { value: "Asia/Bangkok", label: "Bangkok, Thailand", abbr: "ICT" },
  {
    value: "Asia/Kolkata",
    label: "Mumbai, New Delhi, Kolkata (India)",
    abbr: "IST",
  },
  { value: "Asia/Tokyo", label: "Tokyo, Osaka (Japan)", abbr: "JST" },
  { value: "Asia/Seoul", label: "Seoul, South Korea", abbr: "KST" },
  { value: "Europe/Lisbon", label: "Lisbon (Portugal)", abbr: "WET/WEST" },
  { value: "Europe/London", label: "London, Edinburgh (UK)", abbr: "GMT/BST" },
  { value: "America/Mexico_City", label: "Mexico City", abbr: "CST/CDT" },
  { value: "Europe/Moscow", label: "Moscow, Russia", abbr: "MSK" },
  {
    value: "America/Denver",
    label: "Mountain Time (US & Canada)",
    abbr: "MST/MDT",
  },
  { value: "America/Phoenix", label: "Arizona", abbr: "MST" },
  { value: "Asia/Kathmandu", label: "Kathmandu, Nepal", abbr: "NPT" },
  {
    value: "Pacific/Auckland",
    label: "Auckland, New Zealand",
    abbr: "NZST/NZDT",
  },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time (US & Canada)",
    abbr: "PST/PDT",
  },
  {
    value: "Europe/Paris",
    label: "Paris, Berlin, Rome (Central Europe)",
    abbr: "CET/CEST",
  },
  { value: "Europe/Madrid", label: "Madrid, Barcelona", abbr: "CET/CEST" },
  {
    value: "Europe/Amsterdam",
    label: "Amsterdam, Netherlands",
    abbr: "CET/CEST",
  },
  { value: "America/Sao_Paulo", label: "São Paulo, Brazil", abbr: "BRT" },
  { value: "Asia/Singapore", label: "Singapore", abbr: "SGT" },
  { value: "Europe/Stockholm", label: "Stockholm, Sweden", abbr: "CET/CEST" },
  { value: "Europe/Athens", label: "Athens, Greece", abbr: "EET/EEST" },
  { value: "America/Toronto", label: "Toronto, Ontario", abbr: "EST/EDT" },
  { value: "Asia/Istanbul", label: "Istanbul, Turkey", abbr: "TRT" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)", abbr: "UTC" },
  { value: "America/Vancouver", label: "Vancouver, BC", abbr: "PST/PDT" },
  { value: "Europe/Zurich", label: "Zurich, Switzerland", abbr: "CET/CEST" },
];
