import { useEffect, useCallback, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { playNotificationSound, stopNotificationSound } from '@/utils/notificationAudio';
import { triggerVibration, stopVibration } from '@/utils/vibrate';

const STORAGE_KEY = 'bruxism_last_relaxation_time';
const URGENCY_KEY = 'bruxism_reminder_urgency';
const CHECK_INTERVAL = 60000; // Check every minute

export type UrgencyLevel = 0 | 1 | 2;

export const useRelaxationPopupTrigger = () => {
  const { reminders } = useApp();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(() => {
    const stored = localStorage.getItem(URGENCY_KEY);
    return stored ? (Math.min(parseInt(stored, 10), 2) as UrgencyLevel) : 0;
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getLastRelaxationTime = useCallback((): number | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  }, []);

  const setLastRelaxationTime = useCallback((time: number) => {
    localStorage.setItem(STORAGE_KEY, time.toString());
  }, []);

  const saveUrgencyLevel = useCallback((level: UrgencyLevel) => {
    localStorage.setItem(URGENCY_KEY, level.toString());
    setUrgencyLevel(level);
  }, []);

  const triggerNotification = useCallback(() => {
    if (reminders.silentMode) {
      // Silent mode: only show popup, no sound/vibration
      setIsPopupOpen(true);
      return;
    }

    // Sound intensity increases with urgency
    if (reminders.sound) {
      playNotificationSound();
    }

    // Vibration pattern intensifies with urgency level
    if (reminders.vibration) {
      const vibrationPatterns: Record<UrgencyLevel, number[]> = {
        0: [200],                    // Gentle single pulse
        1: [200, 100, 200],          // Two pulses
        2: [300, 100, 300, 100, 300] // Three stronger pulses
      };
      triggerVibration(vibrationPatterns[urgencyLevel]);
    }

    // Show popup
    setIsPopupOpen(true);
  }, [reminders.silentMode, reminders.sound, reminders.vibration, urgencyLevel]);

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

  // Called when user dismisses without exercising - escalate urgency
  const handleDismiss = useCallback(() => {
    setIsPopupOpen(false);
    stopNotificationSound();
    stopVibration();
    
    // Increment urgency level (max 2)
    const newLevel = Math.min(urgencyLevel + 1, 2) as UrgencyLevel;
    saveUrgencyLevel(newLevel);
    
    setLastRelaxationTime(Date.now());
  }, [urgencyLevel, saveUrgencyLevel, setLastRelaxationTime]);

  // Called when user completes an exercise - reset urgency to 0
  const handleStartExercise = useCallback(() => {
    setIsPopupOpen(false);
    stopNotificationSound();
    stopVibration();
    
    // Reset urgency level to 0 when user does exercise
    saveUrgencyLevel(0);
    
    setLastRelaxationTime(Date.now());
  }, [saveUrgencyLevel, setLastRelaxationTime]);

  const resetTimer = useCallback(() => {
    setLastRelaxationTime(Date.now());
  }, [setLastRelaxationTime]);

  // Reset urgency when user completes any exercise (can be called from exercise completion)
  const resetUrgency = useCallback(() => {
    saveUrgencyLevel(0);
  }, [saveUrgencyLevel]);

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
    urgencyLevel,
    handleDismiss,
    handleStartExercise,
    resetTimer,
    resetUrgency,
  };
};
