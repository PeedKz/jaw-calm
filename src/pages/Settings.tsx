import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { Settings as SettingsIcon, Bell, Globe, Info, RotateCcw, Moon, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  checkNotificationPermission,
  requestNotificationPermission,
  cancelAllScheduledNotifications,
  scheduleNotificationsForDay,
  getScheduledTimesDisplay,
  calculateIntervalFromCount,
} from '@/services/notifications';

export default function Settings() {
  const { language, setLanguage, reminders, setReminders, darkMode, setDarkMode, userProfile } = useApp();
  const navigate = useNavigate();
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Check notification permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const permission = await checkNotificationPermission();
      setNotificationPermission(permission);
    };
    checkPermission();
  }, []);

  // Calculate scheduled times for display
  const scheduledTimes = useMemo(() => {
    if (!reminders.enabled) return [];
    return getScheduledTimesDisplay(reminders);
  }, [reminders.activeHoursStart, reminders.activeHoursEnd, reminders.dailyNotificationCount, reminders.enabled]);

  // Calculate interval for display
  const intervalMinutes = useMemo(() => {
    return calculateIntervalFromCount(
      reminders.activeHoursStart,
      reminders.activeHoursEnd,
      reminders.dailyNotificationCount
    );
  }, [reminders.activeHoursStart, reminders.activeHoursEnd, reminders.dailyNotificationCount]);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        const newReminders = { ...reminders, enabled: true };
        setReminders(newReminders);
        setNotificationPermission('granted');
        
        // Schedule notifications
        await scheduleNotificationsForDay(newReminders);
        toast.success(language === 'pt' ? 'Notificações ativadas!' : 'Notifications enabled!');
      } else {
        setNotificationPermission('denied');
      }
    } else {
      await cancelAllScheduledNotifications();
      setReminders({ ...reminders, enabled: false });
      toast.info(language === 'pt' ? 'Notificações desativadas' : 'Notifications disabled');
    }
  };

  const handleNotificationCountChange = async (value: string) => {
    const count = parseInt(value, 10);
    const interval = calculateIntervalFromCount(
      reminders.activeHoursStart,
      reminders.activeHoursEnd,
      count
    );
    const newReminders = { ...reminders, dailyNotificationCount: count, frequency: interval };
    setReminders(newReminders);
    
    // Reschedule notifications
    if (reminders.enabled) {
      await scheduleNotificationsForDay(newReminders);
      toast.success(
        language === 'pt' 
          ? `${count} notificações agendadas para hoje` 
          : `${count} notifications scheduled for today`
      );
    }
  };

  const handleActiveHoursChange = async (field: 'activeHoursStart' | 'activeHoursEnd', value: string) => {
    const newReminders = { ...reminders, [field]: value };
    const interval = calculateIntervalFromCount(
      newReminders.activeHoursStart,
      newReminders.activeHoursEnd,
      newReminders.dailyNotificationCount
    );
    newReminders.frequency = interval;
    setReminders(newReminders);
    
    // Reschedule notifications
    if (reminders.enabled) {
      await scheduleNotificationsForDay(newReminders);
    }
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('bruxism_onboarding_completed');
    navigate('/onboarding');
  };

  const notificationCountOptions = [
    { value: '4', label: '4' },
    { value: '6', label: '6' },
    { value: '8', label: '8' },
    { value: '10', label: '10' },
    { value: '12', label: '12' },
  ];

  const formatInterval = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (language === 'pt') {
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
      }
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes} ${language === 'pt' ? 'min' : 'min'}`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('settings', language)}</h1>
        </motion.div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('language', language)}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setLanguage('en')}
              variant={language === 'en' ? 'default' : 'outline'}
              className={language === 'en' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              English
            </Button>
            <Button
              onClick={() => setLanguage('pt')}
              variant={language === 'pt' ? 'default' : 'outline'}
              className={language === 'pt' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              Português
            </Button>
          </div>
        </motion.div>

        {/* Dark Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">{t('darkMode', language)}</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-soft"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('remindersTitle', language)}</h2>
          </div>

          <div className="space-y-6">
            {/* Enable Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">
                  {language === 'pt' ? 'Ativar notificações push' : 'Enable push notifications'}
                </span>
                {notificationPermission === 'denied' && (
                  <p className="text-xs text-destructive mt-1">
                    {language === 'pt' 
                      ? 'Permissão negada. Ative nas configurações do dispositivo.' 
                      : 'Permission denied. Enable in device settings.'}
                  </p>
                )}
              </div>
              <Switch
                checked={reminders.enabled}
                onCheckedChange={handleNotificationToggle}
                disabled={notificationPermission === 'denied'}
              />
            </div>

            {/* Notification Count */}
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                {t('notificationCountLabel', language)}
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                {t('notificationCountDesc', language)}
              </p>
              <Select
                value={reminders.dailyNotificationCount?.toString() || '6'}
                onValueChange={handleNotificationCountChange}
                disabled={!reminders.enabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationCountOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} {t('notificationsPerDay', language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {reminders.enabled && (
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'pt' 
                    ? `Intervalo: ~${formatInterval(intervalMinutes)}` 
                    : `Interval: ~${formatInterval(intervalMinutes)}`}
                </p>
              )}
            </div>

            {/* Active Hours */}
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                {t('activeHoursLabel', language)}
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                {t('activeHoursDesc', language)}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground block mb-1">
                    {t('activeHoursStart', language)}
                  </label>
                  <input
                    type="time"
                    value={reminders.activeHoursStart || '09:00'}
                    onChange={(e) => handleActiveHoursChange('activeHoursStart', e.target.value)}
                    disabled={!reminders.enabled}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground block mb-1">
                    {t('activeHoursEnd', language)}
                  </label>
                  <input
                    type="time"
                    value={reminders.activeHoursEnd || '21:00'}
                    onChange={(e) => handleActiveHoursChange('activeHoursEnd', e.target.value)}
                    disabled={!reminders.enabled}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Scheduled Times Display */}
            {reminders.enabled && scheduledTimes.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t('scheduledTimes', language)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scheduledTimes.map((time, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('enableSound', language)}</span>
              <Switch
                checked={reminders.sound}
                onCheckedChange={(checked) => setReminders({ ...reminders, sound: checked })}
                disabled={!reminders.enabled}
              />
            </div>

            {/* Vibration Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('enableVibration', language)}</span>
              <Switch
                checked={reminders.vibration}
                onCheckedChange={(checked) => setReminders({ ...reminders, vibration: checked })}
                disabled={!reminders.enabled}
              />
            </div>
          </div>
        </motion.div>

        {/* Reset Onboarding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-soft"
        >
          <div className="flex items-center gap-3 mb-3">
            <RotateCcw className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('resetOnboarding', language)}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {t('resetOnboardingDesc', language)}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('resetOnboardingButton', language)}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('resetOnboardingConfirmTitle', language)}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('resetOnboardingConfirmDesc', language)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel', language)}</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetOnboarding}>
                  {t('confirm', language)}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-soft"
        >
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('about', language)}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === 'pt'
              ? 'Desencosta ajuda você a lembrar de relaxar a mandíbula e soltar os dentes através de lembretes inteligentes, exercícios e gamificação.'
              : 'Desencosta helps you remember to relax your jaw and unclench your teeth through smart reminders, exercises, and gamification.'}
          </p>
          <p className="text-xs text-muted-foreground mt-4">Version 1.0.0</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
