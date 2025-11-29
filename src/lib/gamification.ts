import { UserProgress, Badge, HabitEntry } from '@/types';
import { storage } from './storage';

const XP_PER_RELAXATION = 10;
const XP_PER_LEVEL = 100;

export const gamification = {
  // Calculate level from XP
  calculateLevel: (xp: number): number => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  },

  // Calculate XP needed for next level
  getXPForNextLevel: (currentXP: number): number => {
    const currentLevel = gamification.calculateLevel(currentXP);
    return currentLevel * XP_PER_LEVEL;
  },

  // Get XP progress percentage for current level
  getLevelProgress: (currentXP: number): number => {
    const levelXP = currentXP % XP_PER_LEVEL;
    return (levelXP / XP_PER_LEVEL) * 100;
  },

  // Award XP for completing a relaxation
  awardXP: (type: 'reminder' | 'manual' = 'reminder'): number => {
    const xpEarned = XP_PER_RELAXATION;
    const progress = storage.getUserProgress();
    const newXP = progress.totalXP + xpEarned;
    const newLevel = gamification.calculateLevel(newXP);
    const leveledUp = newLevel > progress.level;

    const updatedProgress: UserProgress = {
      ...progress,
      totalXP: newXP,
      level: newLevel,
      totalRelaxations: progress.totalRelaxations + 1,
      lastActivity: new Date(),
    };

    storage.setUserProgress(updatedProgress);

    // Check and unlock badges
    gamification.checkBadges(updatedProgress);

    return xpEarned;
  },

  // Update streak
  updateStreak: (): void => {
    const progress = storage.getUserProgress();
    const lastActivity = new Date(progress.lastActivity);
    const now = new Date();
    const daysSinceLastActivity = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = progress.currentStreak;

    if (daysSinceLastActivity === 0) {
      // Same day, streak continues
      return;
    } else if (daysSinceLastActivity === 1) {
      // Next day, increment streak
      newStreak = progress.currentStreak + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    const updatedProgress: UserProgress = {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      lastActivity: now,
    };

    storage.setUserProgress(updatedProgress);
    gamification.checkBadges(updatedProgress);
  },

  // Check and unlock badges
  checkBadges: (progress: UserProgress): Badge[] => {
    const badges = storage.getBadges();
    const newlyUnlocked: Badge[] = [];

    badges.forEach((badge) => {
      if (!badge.unlocked) {
        let shouldUnlock = false;

        switch (badge.type) {
          case 'total':
            shouldUnlock = progress.totalRelaxations >= badge.requirement;
            break;
          case 'streak':
            shouldUnlock = progress.currentStreak >= badge.requirement;
            break;
          case 'level':
            shouldUnlock = progress.level >= badge.requirement;
            break;
        }

        if (shouldUnlock) {
          badge.unlocked = true;
          badge.unlockedAt = new Date();
          newlyUnlocked.push(badge);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      storage.setBadges(badges);
    }

    return newlyUnlocked;
  },

  // Get today's entries
  getTodayEntries: (): HabitEntry[] => {
    const entries = storage.getHabitEntries();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  },

  // Get entries for a specific date range
  getEntriesInRange: (startDate: Date, endDate: Date): HabitEntry[] => {
    const entries = storage.getHabitEntries();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  },

  // Calculate weekly progress
  getWeeklyProgress: (): { [key: string]: number } => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData: { [key: string]: number } = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const dayEntries = gamification.getEntriesInRange(day, dayEnd);
      weekData[days[i]] = dayEntries.length;
    }

    return weekData;
  },
};
