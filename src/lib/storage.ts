import { UserProfile, Reminder, HabitEntry, UserProgress, Badge, WeeklyChallenge } from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'bruxism_user_profile',
  REMINDERS: 'bruxism_reminders',
  HABIT_ENTRIES: 'bruxism_habit_entries',
  USER_PROGRESS: 'bruxism_user_progress',
  BADGES: 'bruxism_badges',
  WEEKLY_CHALLENGE: 'bruxism_weekly_challenge',
  ONBOARDING_COMPLETED: 'bruxism_onboarding_completed',
  FACTS_STREAK: 'bruxism_facts_streak',
};

export const storage = {
  // User Profile
  getUserProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  setUserProfile: (profile: UserProfile): void => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Reminders
  getReminders: (): Reminder => {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : getDefaultReminders();
  },

  setReminders: (reminders: Reminder): void => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  // Habit Entries
  getHabitEntries: (): HabitEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HABIT_ENTRIES);
    return data ? JSON.parse(data) : [];
  },

  addHabitEntry: (entry: HabitEntry): void => {
    const entries = storage.getHabitEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEYS.HABIT_ENTRIES, JSON.stringify(entries));
  },

  // User Progress
  getUserProgress: (): UserProgress => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : getDefaultProgress();
  },

  setUserProgress: (progress: UserProgress): void => {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  },

  // Badges
  getBadges: (): Badge[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BADGES);
    return data ? JSON.parse(data) : getDefaultBadges();
  },

  setBadges: (badges: Badge[]): void => {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  },

  // Weekly Challenge
  getWeeklyChallenge: (): WeeklyChallenge | null => {
    const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_CHALLENGE);
    return data ? JSON.parse(data) : null;
  },

  setWeeklyChallenge: (challenge: WeeklyChallenge): void => {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_CHALLENGE, JSON.stringify(challenge));
  },

  // Onboarding
  isOnboardingCompleted: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
  },

  setOnboardingCompleted: (): void => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

function getDefaultReminders(): Reminder {
  return {
    id: 'default',
    enabled: true,
    frequency: 120, // calculated automatically
    dailyNotificationCount: 6, // default 6 notifications per day
    sound: true,
    vibration: true,
    silentMode: false,
    customMessages: [],
    activeHoursStart: '09:00',
    activeHoursEnd: '21:00',
  };
}

function getDefaultProgress(): UserProgress {
  return {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalRelaxations: 0,
    lastActivity: new Date(),
  };
}

function getDefaultBadges(): Badge[] {
  return [
    {
      id: 'first_step',
      name: 'First Step',
      nameEn: 'First Step',
      namePt: 'Primeiro Passo',
      description: 'Complete your first relaxation',
      descriptionEn: 'Complete your first relaxation',
      descriptionPt: 'Complete seu primeiro relaxamento',
      icon: '🌱',
      unlocked: false,
      requirement: 1,
      type: 'total',
    },
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      nameEn: 'Week Warrior',
      namePt: 'Guerreiro da Semana',
      description: 'Maintain a 7-day streak',
      descriptionEn: 'Maintain a 7-day streak',
      descriptionPt: 'Mantenha uma sequência de 7 dias',
      icon: '🔥',
      unlocked: false,
      requirement: 7,
      type: 'streak',
    },
    {
      id: 'zen_master',
      name: 'Zen Master',
      nameEn: 'Zen Master',
      namePt: 'Mestre Zen',
      description: 'Reach Level 10',
      descriptionEn: 'Reach Level 10',
      descriptionPt: 'Alcance o Nível 10',
      icon: '🧘',
      unlocked: false,
      requirement: 10,
      type: 'level',
    },
    {
      id: 'century_club',
      name: 'Century Club',
      nameEn: 'Century Club',
      namePt: 'Clube dos 100',
      description: 'Complete 100 relaxations',
      descriptionEn: 'Complete 100 relaxations',
      descriptionPt: 'Complete 100 relaxamentos',
      icon: '💯',
      unlocked: false,
      requirement: 100,
      type: 'total',
    },
    {
      id: 'month_champion',
      name: 'Month Champion',
      nameEn: 'Month Champion',
      namePt: 'Campeão do Mês',
      description: 'Maintain a 30-day streak',
      descriptionEn: 'Maintain a 30-day streak',
      descriptionPt: 'Mantenha uma sequência de 30 dias',
      icon: '👑',
      unlocked: false,
      requirement: 30,
      type: 'streak',
    },
    {
      id: 'jaw_master',
      name: 'Jaw Master',
      nameEn: 'Jaw Master',
      namePt: 'Mestre da Mandíbula',
      description: 'Complete 500 relaxations',
      descriptionEn: 'Complete 500 relaxations',
      descriptionPt: 'Complete 500 relaxamentos',
      icon: '⭐',
      unlocked: false,
      requirement: 500,
      type: 'total',
    },
    {
      id: 'active_awareness',
      name: 'Active Awareness',
      nameEn: 'Active Awareness',
      namePt: 'Consciência Ativa',
      description: 'Read daily facts for 7 days in a row',
      descriptionEn: 'Read daily facts for 7 days in a row',
      descriptionPt: 'Leia curiosidades por 7 dias seguidos',
      icon: '💡',
      unlocked: false,
      requirement: 7,
      type: 'special',
    },
  ];
}
