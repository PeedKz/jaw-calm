import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';

export default function Progress() {
  const { language, userProgress } = useApp();

  const stats = [
    {
      icon: TrendingUp,
      label: t('totalRelaxations', language),
      value: userProgress.totalRelaxations,
      color: 'text-primary',
    },
    {
      icon: Calendar,
      label: t('longestStreak', language),
      value: `${userProgress.longestStreak} ${t('days', language)}`,
      color: 'text-orange-500',
    },
    {
      icon: Award,
      label: t('currentLevel', language),
      value: userProgress.level,
      color: 'text-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-6 pt-8 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          {t('progress', language)}
        </motion.h1>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-soft"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-soft"
        >
          <h2 className="text-lg font-semibold mb-4">{t('thisWeek', language)}</h2>
          <WeeklyCalendar language={language} />
        </motion.div>

        {/* Monthly Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-soft"
        >
          <MonthlyCalendar language={language} />
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
