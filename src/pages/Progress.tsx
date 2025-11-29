import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { gamification } from '@/lib/gamification';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function Progress() {
  const { language, userProgress } = useApp();
  const weeklyData = gamification.getWeeklyProgress();

  const chartData = Object.entries(weeklyData).map(([day, count]) => ({
    day,
    count,
  }));

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
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis hide />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.count > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Streak Calendar Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-soft"
        >
          <h2 className="text-lg font-semibold mb-4">
            {language === 'pt' ? 'Atividade Recente' : 'Recent Activity'}
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (27 - i));
              const dayEntries = gamification.getEntriesInRange(
                new Date(date.setHours(0, 0, 0, 0)),
                new Date(date.setHours(23, 59, 59, 999))
              );
              const hasActivity = dayEntries.length > 0;

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg transition-smooth ${
                    hasActivity
                      ? 'bg-gradient-to-br from-primary to-secondary'
                      : 'bg-muted'
                  }`}
                  title={date.toLocaleDateString()}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
