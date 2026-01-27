export {
  isNativePlatform,
  createNotificationChannel,
  requestNotificationPermission,
  checkNotificationPermission,
  scheduleReminderNotification,
  scheduleRecurringReminder,
  cancelReminderNotifications,
  cancelAllNotifications,
  getPendingNotifications,
  initializeNotificationListeners,
} from './localNotifications';

export {
  scheduleNotificationsForDay,
  cancelAllScheduledNotifications,
  getScheduledNotifications,
  calculateNotificationTimes,
  calculateIntervalFromCount,
  getScheduledTimesDisplay,
} from './notificationScheduler';
