/**
 * Notification Scheduler Service
 * Handles scheduling multiple notifications throughout the day
 */

import { Reminder } from '@/types';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Notification ID range for daily reminders (1001-1099)
const NOTIFICATION_ID_BASE = 1001;
const MAX_NOTIFICATIONS_PER_DAY = 20;

// Rotating notification messages
const NOTIFICATION_MESSAGES = [
  { title: 'Desencosta! 👀', body: 'Ei, seus dentes estão encostados agora?' },
  { title: 'Desencosta! 😌', body: 'Hora de soltar a mandíbula' },
  { title: 'Desencosta! 😬➡️😌', body: 'Respira… e desencosta' },
  { title: 'Desencosta! 🦷', body: 'Relaxe a mandíbula e solte os dentes' },
  { title: 'Desencosta! 💆', body: 'Momento de aliviar a tensão mandibular' },
  { title: 'Desencosta! 🧘', body: 'Pause e relaxe sua mandíbula' },
];

// Storage key for scheduled notifications
const SCHEDULED_NOTIFICATIONS_KEY = 'desencosta_scheduled_notifications';

interface ScheduledNotification {
  id: number;
  scheduledTime: string; // ISO string
  title: string;
  body: string;
}

/**
 * Parse time string (HH:mm) to hours and minutes
 */
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Calculate notification times for today based on settings
 */
export function calculateNotificationTimes(
  startTime: string,
  endTime: string,
  count: number
): Date[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  const startDate = new Date(today);
  startDate.setHours(start.hours, start.minutes, 0, 0);
  
  const endDate = new Date(today);
  endDate.setHours(end.hours, end.minutes, 0, 0);
  
  // Handle case where end time is before start (crosses midnight)
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  const totalMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  const intervalMinutes = Math.floor(totalMinutes / count);
  
  const times: Date[] = [];
  
  for (let i = 0; i < count; i++) {
    const notificationTime = new Date(startDate.getTime() + (i * intervalMinutes * 60 * 1000));
    
    // Only add future notifications
    if (notificationTime > now) {
      times.push(notificationTime);
    }
  }
  
  return times;
}

/**
 * Get a random notification message
 */
function getNotificationMessage(index: number): { title: string; body: string } {
  return NOTIFICATION_MESSAGES[index % NOTIFICATION_MESSAGES.length];
}

/**
 * Cancel all scheduled reminder notifications
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      const notificationIds = Array.from(
        { length: MAX_NOTIFICATIONS_PER_DAY },
        (_, i) => ({ id: NOTIFICATION_ID_BASE + i })
      );
      await LocalNotifications.cancel({ notifications: notificationIds });
      console.log('[NotificationScheduler] Cancelled all scheduled notifications');
    }
    
    // Clear stored schedule
    localStorage.removeItem(SCHEDULED_NOTIFICATIONS_KEY);
  } catch (error) {
    console.error('[NotificationScheduler] Error cancelling notifications:', error);
  }
}

/**
 * Schedule all notifications for today based on reminder settings
 */
export async function scheduleNotificationsForDay(reminders: Reminder): Promise<boolean> {
  try {
    // Always cancel existing notifications first
    await cancelAllScheduledNotifications();
    
    if (!reminders.enabled) {
      console.log('[NotificationScheduler] Notifications disabled, skipping scheduling');
      return true;
    }
    
    const times = calculateNotificationTimes(
      reminders.activeHoursStart,
      reminders.activeHoursEnd,
      reminders.dailyNotificationCount
    );
    
    if (times.length === 0) {
      console.log('[NotificationScheduler] No future notification times for today');
      return true;
    }
    
    console.log(`[NotificationScheduler] Scheduling ${times.length} notifications for today`);
    
    if (Capacitor.isNativePlatform()) {
      const notifications = times.map((time, index) => {
        const message = getNotificationMessage(index);
        return {
          id: NOTIFICATION_ID_BASE + index,
          title: message.title,
          body: message.body,
          schedule: {
            at: time,
            allowWhileIdle: true,
          },
          channelId: 'alerts',
          smallIcon: 'ic_stat_icon',
          iconColor: '#7C3AED',
          sound: reminders.sound ? 'default' : undefined,
          actionTypeId: 'OPEN_APP',
        };
      });
      
      const scheduleOptions: ScheduleOptions = { notifications };
      await LocalNotifications.schedule(scheduleOptions);
      
      // Store scheduled notifications for reference
      const scheduledData: ScheduledNotification[] = times.map((time, index) => {
        const message = getNotificationMessage(index);
        return {
          id: NOTIFICATION_ID_BASE + index,
          scheduledTime: time.toISOString(),
          title: message.title,
          body: message.body,
        };
      });
      localStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(scheduledData));
      
      console.log('[NotificationScheduler] Native notifications scheduled:', times.map(t => t.toLocaleTimeString()));
      return true;
    } else {
      // Web fallback - schedule using setTimeout for the first notification
      // (Web doesn't support multiple scheduled notifications)
      const firstTime = times[0];
      const delay = firstTime.getTime() - Date.now();
      
      if (delay > 0) {
        // Store for web
        const scheduledData: ScheduledNotification[] = times.map((time, index) => {
          const message = getNotificationMessage(index);
          return {
            id: NOTIFICATION_ID_BASE + index,
            scheduledTime: time.toISOString(),
            title: message.title,
            body: message.body,
          };
        });
        localStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(scheduledData));
        
        console.log('[NotificationScheduler] Web notifications stored:', times.map(t => t.toLocaleTimeString()));
      }
      return true;
    }
  } catch (error) {
    console.error('[NotificationScheduler] Error scheduling notifications:', error);
    return false;
  }
}

/**
 * Get list of scheduled notifications for display
 */
export function getScheduledNotifications(): ScheduledNotification[] {
  try {
    const data = localStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Calculate the interval in minutes based on active hours and notification count
 */
export function calculateIntervalFromCount(
  startTime: string,
  endTime: string,
  count: number
): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  let startMinutes = start.hours * 60 + start.minutes;
  let endMinutes = end.hours * 60 + end.minutes;
  
  // Handle overnight period
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }
  
  const totalMinutes = endMinutes - startMinutes;
  return Math.floor(totalMinutes / count);
}

/**
 * Format scheduled times for display
 */
export function getScheduledTimesDisplay(reminders: Reminder): string[] {
  const times = calculateNotificationTimes(
    reminders.activeHoursStart,
    reminders.activeHoursEnd,
    reminders.dailyNotificationCount
  );
  
  // Also calculate times that have already passed today
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const start = parseTime(reminders.activeHoursStart);
  const end = parseTime(reminders.activeHoursEnd);
  
  const startDate = new Date(today);
  startDate.setHours(start.hours, start.minutes, 0, 0);
  
  const endDate = new Date(today);
  endDate.setHours(end.hours, end.minutes, 0, 0);
  
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  const totalMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  const intervalMinutes = Math.floor(totalMinutes / reminders.dailyNotificationCount);
  
  const allTimes: string[] = [];
  for (let i = 0; i < reminders.dailyNotificationCount; i++) {
    const notificationTime = new Date(startDate.getTime() + (i * intervalMinutes * 60 * 1000));
    allTimes.push(notificationTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  }
  
  return allTimes;
}
