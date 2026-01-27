import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { Settings as SettingsIcon, Bell, Globe, Info, RotateCcw, Moon } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  checkNotificationPermission,
  requestNotificationPermission,
  cancelReminderNotifications,
} from '@/services/notifications';
import { getReminderScheduleDescription } from '@/lib/reminderCalculator';

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

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setReminders({ ...reminders, enabled: true });
        setNotificationPermission('granted');
        toast.success(language === 'pt' ? 'Notificações ativadas!' : 'Notifications enabled!');
      } else {
        setNotificationPermission('denied');
      }
    } else {
      await cancelReminderNotifications();
      setReminders({ ...reminders, enabled: false });
      toast.info(language === 'pt' ? 'Notificações desativadas' : 'Notifications disabled');
    }
  };

  const handleFrequencyChange = (value: string) => {
    setReminders({ ...reminders, frequency: parseInt(value, 10) });
  };

  const handleResetOnboarding = () => {
    // Clear only the onboarding completion flag
    localStorage.removeItem('bruxism_onboarding_completed');
    // Navigate to onboarding
    navigate('/onboarding');
  };

  const intervalOptions = [
    { value: '15', label: t('interval15', language) },
    { value: '30', label: t('interval30', language) },
    { value: '45', label: t('interval45', language) },
    { value: '60', label: t('interval60', language) },
    { value: '90', label: t('interval90', language) },
    { value: '120', label: t('interval120', language) },
  ];

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

        {/* Reminders */}
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
                  {language === 'pt' ? 'Ativar lembretes (Notificações)' : 'Enable reminders (Notifications)'}
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

            {/* Reminder Interval */}
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                {t('intervalLabel', language)}
              </label>
              <Select
                value={reminders.frequency.toString()}
                onValueChange={handleFrequencyChange}
                disabled={!reminders.enabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {intervalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {getReminderScheduleDescription(reminders.frequency, language)}
                {userProfile && (
                  <span className="block mt-1">
                    {language === 'pt' 
                      ? `Meta diária: ${userProfile.dailyGoal} relaxamentos` 
                      : `Daily goal: ${userProfile.dailyGoal} relaxations`}
                  </span>
                )}
              </p>
            </div>

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

            {/* Silent Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('silentMode', language)}</span>
              <Switch
                checked={reminders.silentMode}
                onCheckedChange={(checked) =>
                  setReminders({ ...reminders, silentMode: checked })
                }
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
              ? 'Desencostaê ajuda você a lembrar de relaxar a mandíbula e soltar os dentes através de lembretes inteligentes, exercícios e gamificação.'
              : 'Desencostaê helps you remember to relax your jaw and unclench your teeth through smart reminders, exercises, and gamification.'}
          </p>
          <p className="text-xs text-muted-foreground mt-4">Version 1.0.0</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
