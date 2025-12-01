import { motion } from 'framer-motion';
import { getLocalizedWeekDays } from '@/utils/localizedDates';
import { gamification } from '@/lib/gamification';
import { Language } from '@/lib/translations';

interface WeeklyCalendarProps {
  language: Language;
}

export const WeeklyCalendar = ({ language }: WeeklyCalendarProps) => {
  const weekData = gamification.getWeeklyProgress();
  const weekDays = getLocalizedWeekDays(language, true);
  
  const chartData = weekDays.map((day, index) => {
    // Get the English day name for the key since weekData uses English keys
    const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const count = weekData[englishDays[index]] || 0;
    return {
      day,
      count,
    };
  });

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="grid grid-cols-7 gap-2">
      {chartData.map((data, index) => (
        <motion.div
          key={data.day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-xs text-muted-foreground font-medium">{data.day}</div>
          <div className="w-full aspect-square relative">
            <div className="absolute inset-0 rounded-lg bg-muted" />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(data.count / maxCount) * 100}%` }}
              transition={{ delay: index * 0.05 + 0.2, duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 rounded-lg bg-gradient-to-t from-primary to-secondary"
            />
          </div>
          <div className="text-xs font-semibold">{data.count}</div>
        </motion.div>
      ))}
    </div>
  );
};