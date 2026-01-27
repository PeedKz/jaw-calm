export interface UserProfile {
  id: string;
  bruxismType: 'daytime' | 'nighttime' | 'both';
  dailyGoal: number;
  stressLevel: number;
  bruxismIntensity: number;
  createdAt: Date;
  language: 'en' | 'pt';
}

export interface Reminder {
  id: string;
  enabled: boolean;
  frequency: number; // minutes between reminders
  sound: boolean;
  vibration: boolean;
  silentMode: boolean;
  customMessages: string[];
  activeHoursStart: string; // HH:mm format, e.g., "07:00"
  activeHoursEnd: string;   // HH:mm format, e.g., "21:00"
}

export interface HabitEntry {
  id: string;
  timestamp: Date;
  type: 'reminder' | 'manual';
  xpEarned: number;
}

export interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalRelaxations: number;
  lastActivity: Date;
}

export interface Badge {
  id: string;
  name: string;
  nameEn: string;
  namePt: string;
  description: string;
  descriptionEn: string;
  descriptionPt: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: number;
  type: 'streak' | 'total' | 'level' | 'special';
}

export interface Exercise {
  id: string;
  titleEn: string;
  titlePt: string;
  descriptionEn: string;
  descriptionPt: string;
  duration: number; // seconds
  steps: string[];
  stepsEn: string[];
  stepsPt: string[];
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WeeklyChallenge {
  id: string;
  titleEn: string;
  titlePt: string;
  target: number;
  progress: number;
  reward: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
}
