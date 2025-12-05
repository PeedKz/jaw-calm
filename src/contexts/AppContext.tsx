import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Reminder, UserProgress, Badge, HabitEntry } from '@/types';
import { storage } from '@/lib/storage';
import { gamification } from '@/lib/gamification';
import { Language } from '@/lib/translations';

const LAST_RELAXATION_TIME_KEY = 'bruxism_last_relaxation_time';
const DARK_MODE_KEY = 'bruxism_dark_mode';

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  reminders: Reminder;
  setReminders: (reminders: Reminder) => void;
  userProgress: UserProgress;
  badges: Badge[];
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  isOnboardingCompleted: boolean;
  completeOnboarding: () => void;
  logRelaxation: (type: 'reminder' | 'manual') => void;
  todayCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(storage.getUserProfile());
  const [reminders, setRemindersState] = useState<Reminder>(storage.getReminders());
  const [userProgress, setUserProgressState] = useState<UserProgress>(storage.getUserProgress());
  const [badges, setBadgesState] = useState<Badge[]>(storage.getBadges());
  const [language, setLanguageState] = useState<Language>(
    (userProfile?.language as Language) || 'pt'
  );
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(
    storage.isOnboardingCompleted()
  );
  const [todayCount, setTodayCount] = useState(gamification.getTodayEntries().length);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const setDarkMode = (enabled: boolean) => {
    localStorage.setItem(DARK_MODE_KEY, enabled.toString());
    setDarkModeState(enabled);
  };

  const setUserProfile = (profile: UserProfile) => {
    storage.setUserProfile(profile);
    setUserProfileState(profile);
    setLanguageState(profile.language);
  };

  const setReminders = (newReminders: Reminder) => {
    storage.setReminders(newReminders);
    setRemindersState(newReminders);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (userProfile) {
      const updated = { ...userProfile, language: lang };
      storage.setUserProfile(updated);
      setUserProfileState(updated);
    }
  };

  const completeOnboarding = () => {
    storage.setOnboardingCompleted();
    setIsOnboardingCompleted(true);
  };

  const logRelaxation = (type: 'reminder' | 'manual') => {
    const xpEarned = gamification.awardXP(type);
    
    const entry: HabitEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type,
      xpEarned,
    };
    
    storage.addHabitEntry(entry);
    gamification.updateStreak();
    
    // Update last relaxation time for reminder timer
    localStorage.setItem(LAST_RELAXATION_TIME_KEY, Date.now().toString());
    
    // Refresh state
    setUserProgressState(storage.getUserProgress());
    setBadgesState(storage.getBadges());
    setTodayCount(gamification.getTodayEntries().length);
  };

  // Update today count at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setTodayCount(0);
      // Set up recurring check
      setInterval(() => {
        setTodayCount(gamification.getTodayEntries().length);
      }, 60000); // Check every minute
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        reminders,
        setReminders,
        userProgress,
        badges,
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        isOnboardingCompleted,
        completeOnboarding,
        logRelaxation,
        todayCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
