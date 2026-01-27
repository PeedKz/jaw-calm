/**
 * Calculates the optimal reminder interval based on daily goal
 * Assumes ~14 active hours per day (7am to 9pm)
 */

const ACTIVE_HOURS_PER_DAY = 14;
const MINUTES_PER_HOUR = 60;

// Available interval options in minutes
export const INTERVAL_OPTIONS = [15, 30, 45, 60, 90, 120] as const;
export type IntervalOption = typeof INTERVAL_OPTIONS[number];

/**
 * Calculate the ideal interval in minutes based on daily goal
 * @param dailyGoal - Number of reminders per day (3-12)
 * @returns Interval in minutes
 */
export function calculateIntervalFromGoal(dailyGoal: number): number {
  const totalActiveMinutes = ACTIVE_HOURS_PER_DAY * MINUTES_PER_HOUR; // 840 minutes
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
 * Calculate expected daily reminders based on interval
 * @param intervalMinutes - Interval between reminders in minutes
 * @returns Expected number of reminders per day
 */
export function calculateDailyRemindersFromInterval(intervalMinutes: number): number {
  const totalActiveMinutes = ACTIVE_HOURS_PER_DAY * MINUTES_PER_HOUR;
  return Math.round(totalActiveMinutes / intervalMinutes);
}

/**
 * Get a human-readable description of the reminder schedule
 */
export function getReminderScheduleDescription(
  intervalMinutes: number,
  language: 'en' | 'pt'
): string {
  const dailyReminders = calculateDailyRemindersFromInterval(intervalMinutes);
  
  if (language === 'pt') {
    return `~${dailyReminders} lembretes por dia`;
  }
  return `~${dailyReminders} reminders per day`;
}
