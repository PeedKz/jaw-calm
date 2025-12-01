import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Language } from '@/lib/translations';

export const getLocale = (language: Language) => {
  return language === 'pt' ? ptBR : enUS;
};

export const getLocalizedWeekDays = (language: Language, short: boolean = true): string[] => {
  const locale = getLocale(language);
  const start = startOfWeek(new Date(), { locale });
  const days = eachDayOfInterval({
    start,
    end: endOfWeek(start, { locale }),
  });
  
  return days.map(day => format(day, short ? 'EEE' : 'EEEE', { locale }));
};

export const getMonthMatrix = (year: number, month: number): (Date | null)[][] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = endOfMonth(firstDay);
  const startDate = startOfWeek(firstDay, { weekStartsOn: 0 });
  const endDate = endOfWeek(lastDay, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];
  
  days.forEach((day, index) => {
    week.push(day.getMonth() === month ? day : null);
    if ((index + 1) % 7 === 0) {
      weeks.push(week);
      week = [];
    }
  });
  
  return weeks;
};

export const formatDayLabel = (date: Date, language: Language): string => {
  return format(date, 'd', { locale: getLocale(language) });
};

export const formatMonthYear = (date: Date, language: Language): string => {
  return format(date, 'MMMM yyyy', { locale: getLocale(language) });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};