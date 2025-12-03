import { useEffect, useCallback, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { playNotificationSound, stopNotificationSound } from '@/utils/notificationAudio';
import { triggerVibration, stopVibration } from '@/utils/vibrate';

const STORAGE_KEY = 'bruxism_last_relaxation_time';
const CHECK_INTERVAL = 60000; // Check every minute

export const useRelaxationPopupTrigger = () => {
  const { reminders } = useApp();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getLastRelaxationTime = useCallback((): number | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  }, []);

  const setLastRelaxationTime = useCallback((time: number) => {
    localStorage.setItem(STORAGE_KEY, time.toString());
  }, []);

  const triggerNotification = useCallback(() => {
    if (reminders.silentMode) {
      // Silent mode: only show popup, no sound/vibration
      setIsPopupOpen(true);
      return;
    }

    // Play sound if enabled
    if (reminders.sound) {
      playNotificationSound();
    }

    // Trigger vibration if enabled
    if (reminders.vibration) {
      triggerVibration([200, 100, 200]);
    }

    // Show popup
    setIsPopupOpen(true);
  }, [reminders.silentMode, reminders.sound, reminders.vibration]);

  const checkReminder = useCallback(() => {
    if (!reminders.enabled || isPopupOpen) return;

    const lastTime = getLastRelaxationTime();
    if (!lastTime) return;

    const now = Date.now();
    const elapsed = now - lastTime;
    const intervalMs = reminders.frequency * 60 * 1000;

    if (elapsed >= intervalMs) {
      triggerNotification();
      // Reset timer to avoid repeated notifications
      setLastRelaxationTime(now);
    }
  }, [reminders.enabled, reminders.frequency, isPopupOpen, getLastRelaxationTime, setLastRelaxationTime, triggerNotification]);

  const handleDismiss = useCallback(() => {
    setIsPopupOpen(false);
    stopNotificationSound();
    stopVibration();
    setLastRelaxationTime(Date.now());
  }, [setLastRelaxationTime]);

  const handleStartExercise = useCallback(() => {
    setIsPopupOpen(false);
    stopNotificationSound();
    stopVibration();
    setLastRelaxationTime(Date.now());
  }, [setLastRelaxationTime]);

  const resetTimer = useCallback(() => {
    setLastRelaxationTime(Date.now());
  }, [setLastRelaxationTime]);

  // Check for reminders periodically
  useEffect(() => {
    if (!reminders.enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Initialize last relaxation time if not set
    if (!getLastRelaxationTime()) {
      setLastRelaxationTime(Date.now());
    }

    // Set up periodic check
    timerRef.current = setInterval(checkReminder, CHECK_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [reminders.enabled, checkReminder, getLastRelaxationTime, setLastRelaxationTime]);

  return {
    isPopupOpen,
    handleDismiss,
    handleStartExercise,
    resetTimer,
  };
};
