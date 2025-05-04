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
