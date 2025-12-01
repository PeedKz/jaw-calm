import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

const CELEBRATION_SHOWN_KEY = 'bruxism_celebration_shown_date';

export const useDailyGoalCelebration = () => {
  const { userProfile, todayCount } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!userProfile) return;

    const today = new Date().toDateString();
    const lastShown = localStorage.getItem(CELEBRATION_SHOWN_KEY);

    // Check if we reached the daily goal and haven't shown celebration today
    if (todayCount >= userProfile.dailyGoal && lastShown !== today) {
      setShowCelebration(true);
      localStorage.setItem(CELEBRATION_SHOWN_KEY, today);
    }
  }, [todayCount, userProfile]);

  const dismissCelebration = () => {
    setShowCelebration(false);
  };

  return { showCelebration, dismissCelebration };
};