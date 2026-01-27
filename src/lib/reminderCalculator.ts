/**
 * Calculates the optimal reminder interval based on daily goal and active hours
 */

const DEFAULT_ACTIVE_HOURS = 14;
const MINUTES_PER_HOUR = 60;

// Available interval options in minutes
export const INTERVAL_OPTIONS = [15, 30, 45, 60, 90, 120] as const;
export type IntervalOption = typeof INTERVAL_OPTIONS[number];

/**
 * Calculate active hours from start and end time strings
 * @param startTime - Start time in HH:mm format (e.g., "07:00")
 * @param endTime - End time in HH:mm format (e.g., "21:00")
 * @returns Number of active hours
 */
export function calculateActiveHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Handle case where end is after midnight (less common but possible)
  const diffMinutes = endMinutes > startMinutes 
    ? endMinutes - startMinutes 
    : (24 * 60 - startMinutes) + endMinutes;
  
  return diffMinutes / 60;
}

/**
 * Calculate the ideal interval in minutes based on daily goal
 * @param dailyGoal - Number of reminders per day (3-12)
 * @param activeHours - Optional number of active hours (defaults to 14)
 * @returns Interval in minutes
 */
export function calculateIntervalFromGoal(dailyGoal: number, activeHours: number = DEFAULT_ACTIVE_HOURS): number {
  const totalActiveMinutes = activeHours * MINUTES_PER_HOUR;
  const idealInterval = Math.round(totalActiveMinutes / dailyGoal);
  
  // Find the closest available interval option
  let closestInterval: number = INTERVAL_OPTIONS[0];
  let minDifference = Math.abs(idealInterval - INTERVAL_OPTIONS[0]);
  
  for (const option of INTERVAL_OPTIONS) {
    const difference = Math.abs(idealInterval - option);
    if (difference < minDifference) {
      minDifference = difference;
      closestInterval = option;
    }
  }
  
  return closestInterval;
}

/**
 * Calculate expected daily reminders based on interval and active hours
 * @param intervalMinutes - Interval between reminders in minutes
 * @param activeHours - Optional number of active hours (defaults to 14)
 * @returns Expected number of reminders per day
 */
export function calculateDailyRemindersFromInterval(intervalMinutes: number, activeHours: number = DEFAULT_ACTIVE_HOURS): number {
  const totalActiveMinutes = activeHours * MINUTES_PER_HOUR;
  return Math.round(totalActiveMinutes / intervalMinutes);
}

/**
 * Get a human-readable description of the reminder schedule
 */
export function getReminderScheduleDescription(
  intervalMinutes: number,
  language: 'en' | 'pt',
  activeHours: number = DEFAULT_ACTIVE_HOURS
): string {
  const dailyReminders = calculateDailyRemindersFromInterval(intervalMinutes, activeHours);
  
  if (language === 'pt') {
    return `~${dailyReminders} lembretes por dia`;
  }
  return `~${dailyReminders} reminders per day`;
}
