import { useEffect, useCallback, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { t } from '@/lib/translations';

const STORAGE_KEY = 'bruxism_last_relaxation_time';
const CHECK_INTERVAL = 60000; // Check every minute

export const useRelaxationReminderTimer = () => {
  const { reminders, language } = useApp();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getLastRelaxationTime = useCallback((): number | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  }, []);

  const setLastRelaxationTime = useCallback((time: number) => {
    localStorage.setItem(STORAGE_KEY, time.toString());
  }, []);

  const showReminder = useCallback(() => {
    if (reminders.silentMode) return;

    const messages = [
      t('relaxJaw', language),
      t('unclench', language),
      t('checkPosture', language),
      t('takeBreak', language),
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Show toast notification
    toast(randomMessage, {
      duration: 5000,
      action: {
        label: t('startExercise', language),
        onClick: () => navigate('/exercises'),
      },
    });

    // Play sound if enabled
    if (reminders.sound && !reminders.silentMode) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi6H0fPTgjMGHm7A7+OZUQ0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg0PVqzn7a1aFw5CnePyu28gBjGM0/PTgjMGHm3A7+OZUg==');
      audio.play().catch(() => {
        // Silent fail if audio doesn't play
      });
    }

    // Vibrate if enabled and supported
    if (reminders.vibration && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [reminders, language, navigate]);

  const checkReminder = useCallback(() => {
    if (!reminders.enabled) return;

    const lastTime = getLastRelaxationTime();
    if (!lastTime) return;

    const now = Date.now();
    const elapsed = now - lastTime;
    const intervalMs = reminders.frequency * 60 * 1000;

    if (elapsed >= intervalMs) {
      showReminder();
      // Reset timer to avoid repeated notifications
      setLastRelaxationTime(now);
    }
  }, [reminders, getLastRelaxationTime, setLastRelaxationTime, showReminder]);

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

  return { resetTimer };
};