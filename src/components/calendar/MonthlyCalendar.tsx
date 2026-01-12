import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMonthMatrix, formatMonthYear, getLocalizedWeekDays, getUltraShortWeekDays, isToday } from '@/utils/localizedDates';
import { gamification } from '@/lib/gamification';
import { Language, t } from '@/lib/translations';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthlyCalendarProps {
  language: Language;
}

export const MonthlyCalendar = ({ language }: MonthlyCalendarProps) => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Use ultra-short (single letter) for mobile, short (3 letters) for larger screens
  const weekDays = isMobile 
    ? getUltraShortWeekDays(language)
    : getLocalizedWeekDays(language, true);
  const monthMatrix = getMonthMatrix(year, month);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const hasActivity = (date: Date): boolean => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const entries = gamification.getEntriesInRange(dayStart, dayEnd);
    return entries.length > 0;
  };

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {formatMonthYear(currentDate, language)}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="h-8 w-8"
            aria-label={t('previousMonth', language)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
            aria-label={t('nextMonth', language)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground py-2 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthMatrix.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            if (!day) {
              return (
                <div
                  key={`empty-${weekIndex}-${dayIndex}`}
                  className="aspect-square"
                />
              );
            }

            const isCurrentDay = isToday(day);
            const hasActivityOnDay = hasActivity(day);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                  transition-smooth cursor-pointer
                  ${isCurrentDay ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                  ${hasActivityOnDay 
                    ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
                title={hasActivityOnDay ? t('recentActivity', language) : t('noActivity', language)}
              >
                {day.getDate()}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};