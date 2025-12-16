import { LocalNotifications, ScheduleOptions, Channel } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

const CHANNEL_ID = 'jawcalm_reminders';
const REMINDER_NOTIFICATION_ID = 1001;

// Check if we're running on a native platform
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Create Android notification channel with high importance
export const createNotificationChannel = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  
  try {
    const channel: Channel = {
      id: CHANNEL_ID,
      name: 'Jaw Calm Reminders',
      description: 'Reminders to relax your jaw',
      importance: 5, // High importance
      visibility: 1, // Public
      vibration: true,
      sound: 'default',
    };
    
    await LocalNotifications.createChannel(channel);
  } catch (error) {
    console.error('Failed to create notification channel:', error);
  }
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNativePlatform()) return true; // Always return true for web
  
  try {
    const permission = await LocalNotifications.requestPermissions();
    
    if (permission.display !== 'granted') {
      toast.error('Permissão de notificação negada', {
        description: 'Ative as notificações nas configurações do dispositivo para receber lembretes.'
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

// Check if notifications are permitted
export const checkNotificationPermission = async (): Promise<boolean> => {
  if (!isNativePlatform()) return true;
  
  try {
    const permission = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Failed to check notification permission:', error);
    return false;
  }
};

// Schedule a reminder notification
export const scheduleReminderNotification = async (
  nextTriggerDate: Date,
  title: string = 'Jaw Calm',
  body: string = 'Hora de desencostar os dentes 😌'
): Promise<boolean> => {
  if (!isNativePlatform()) {
    console.log('Web platform: Notification scheduled for', nextTriggerDate);
    return true;
  }
  
  try {
    // First, ensure we have permission
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return false;
    
    // Create channel if it doesn't exist
    await createNotificationChannel();
    
    // Cancel any existing reminder notifications
    await cancelReminderNotifications();
    
    const scheduleOptions: ScheduleOptions = {
      notifications: [
        {
          id: REMINDER_NOTIFICATION_ID,
          title,
          body,
          schedule: {
            at: nextTriggerDate,
            allowWhileIdle: true,
          },
          channelId: CHANNEL_ID,
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#7C3AED',
          actionTypeId: 'OPEN_APP',
        },
      ],
    };
    
    await LocalNotifications.schedule(scheduleOptions);
    console.log('Notification scheduled for:', nextTriggerDate);
    return true;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return false;
  }
};

// Schedule recurring reminder notifications
export const scheduleRecurringReminder = async (
  intervalMinutes: number,
  title: string = 'Jaw Calm',
  body: string = 'Hora de desencostar os dentes 😌'
): Promise<boolean> => {
  if (!isNativePlatform()) {
    console.log('Web platform: Recurring notification would be scheduled every', intervalMinutes, 'minutes');
    return true;
  }
  
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return false;
    
    await createNotificationChannel();
    await cancelReminderNotifications();
    
    // Calculate next trigger time
    const nextTrigger = new Date();
    nextTrigger.setMinutes(nextTrigger.getMinutes() + intervalMinutes);
    
    return await scheduleReminderNotification(nextTrigger, title, body);
  } catch (error) {
    console.error('Failed to schedule recurring reminder:', error);
    return false;
  }
};

// Cancel all reminder notifications
export const cancelReminderNotifications = async (): Promise<void> => {
  if (!isNativePlatform()) {
    console.log('Web platform: Notifications cancelled');
    return;
  }
  
  try {
    // Cancel the specific reminder notification
    await LocalNotifications.cancel({
      notifications: [{ id: REMINDER_NOTIFICATION_ID }],
    });
    console.log('Reminder notifications cancelled');
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
};

// Cancel all pending notifications
export const cancelAllNotifications = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.notifications.map(n => ({ id: n.id })),
      });
    }
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
};

// Get pending notifications
export const getPendingNotifications = async () => {
  if (!isNativePlatform()) return [];
  
  try {
    const result = await LocalNotifications.getPending();
    return result.notifications;
  } catch (error) {
    console.error('Failed to get pending notifications:', error);
    return [];
  }
};

// Initialize notification listeners
export const initializeNotificationListeners = (): void => {
  if (!isNativePlatform()) return;
  
  // Listen for notification received while app is open
  LocalNotifications.addListener('localNotificationReceived', (notification) => {
    console.log('Notification received:', notification);
  });
  
  // Listen for notification action (when user taps the notification)
  LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
    console.log('Notification action performed:', action);
  });
};
