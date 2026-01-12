import { LocalNotifications, ScheduleOptions, Channel } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

const CHANNEL_ID = 'alerts';
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
      name: 'Desencostaê Alerts',
      description: 'Lembretes para relaxar a mandíbula',
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

// Request notification permissions (works on both web and native)
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (isNativePlatform()) {
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display !== 'granted') {
        toast.error('Permissão de notificação negada', {
          description: 'Ative as notificações nas configurações do dispositivo para receber lembretes.'
        });
        return false;
      }
      return true;
    } else {
      // Web: Use Notification API
      if (!('Notification' in window)) {
        console.log('Web platform: Notifications not supported');
        return false;
      }
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Permissão de notificação negada', {
          description: 'Ative as notificações no navegador para receber lembretes.'
        });
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

// Check if notifications are permitted
export const checkNotificationPermission = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  try {
    if (isNativePlatform()) {
      const permission = await LocalNotifications.checkPermissions();
      if (permission.display === 'granted') return 'granted';
      if (permission.display === 'denied') return 'denied';
      return 'prompt';
    } else {
      // Web: Check Notification API
      if (!('Notification' in window)) {
        return 'denied';
      }
      return Notification.permission as 'granted' | 'denied' | 'prompt';
    }
  } catch (error) {
    console.error('Failed to check notification permission:', error);
    return 'denied';
  }
};

// Store for web notification timeout
let webNotificationTimeout: NodeJS.Timeout | null = null;

// Schedule a reminder notification
export const scheduleReminderNotification = async (
  nextTriggerDate: Date,
  title: string = 'Desencostaê! 🦷',
  body: string = 'Hora de relaxar a mandíbula e soltar os dentes.'
): Promise<boolean> => {
  try {
    const hasPermission = await checkNotificationPermission();
    if (hasPermission === 'denied') {
      toast.error('Para ouvir o alerta, precisamos da permissão de notificação', {
        description: 'Ative as notificações nas configurações para receber lembretes.'
      });
      return false;
    }

    if (isNativePlatform()) {
      // First, ensure we have permission
      const granted = await requestNotificationPermission();
      if (!granted) return false;
      
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
            sound: 'default',
            actionTypeId: 'OPEN_APP',
          },
        ],
      };
      
      await LocalNotifications.schedule(scheduleOptions);
      console.log('Native notification scheduled for:', nextTriggerDate);
      return true;
    } else {
      // Web: Schedule using setTimeout
      await cancelReminderNotifications();
      
      const delay = nextTriggerDate.getTime() - Date.now();
      if (delay <= 0) {
        // Trigger immediately if time has passed
        showWebNotification(title, body);
        return true;
      }
      
      webNotificationTimeout = setTimeout(() => {
        showWebNotification(title, body);
      }, delay);
      
      console.log('Web notification scheduled for:', nextTriggerDate);
      return true;
    }
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return false;
  }
};

// Show web notification
const showWebNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'desencostaê-reminder',
      requireInteraction: true,
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

// Schedule recurring reminder notifications
export const scheduleRecurringReminder = async (
  intervalMinutes: number,
  title: string = 'Desencostaê! 🦷',
  body: string = 'Hora de relaxar a mandíbula e soltar os dentes.'
): Promise<boolean> => {
  try {
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
  try {
    if (isNativePlatform()) {
      // Cancel the specific reminder notification
      await LocalNotifications.cancel({
        notifications: [{ id: REMINDER_NOTIFICATION_ID }],
      });
      console.log('Native reminder notifications cancelled');
    } else {
      // Web: Clear timeout
      if (webNotificationTimeout) {
        clearTimeout(webNotificationTimeout);
        webNotificationTimeout = null;
      }
      console.log('Web notification cancelled');
    }
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
};

// Cancel all pending notifications
export const cancelAllNotifications = async (): Promise<void> => {
  if (!isNativePlatform()) {
    if (webNotificationTimeout) {
      clearTimeout(webNotificationTimeout);
      webNotificationTimeout = null;
    }
    return;
  }
  
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
