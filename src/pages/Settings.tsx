import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { Settings as SettingsIcon, Bell, Globe, Info } from 'lucide-react';

export default function Settings() {
  const { language, setLanguage, reminders, setReminders } = useApp();

  const handleFrequencyChange = ([value]: number[]) => {
    setReminders({ ...reminders, frequency: value });
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
            {/* Reminder Frequency */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {t('reminderFrequency', language)}
                </span>
                <span className="text-sm font-medium">
                  {t('every', language)} {reminders.frequency} {t('minutes', language)}
                </span>
              </div>
              <Slider
                value={[reminders.frequency]}
                onValueChange={handleFrequencyChange}
                min={30}
                max={240}
                step={30}
                className="w-full"
              />
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('enableSound', language)}</span>
              <Switch
                checked={reminders.sound}
                onCheckedChange={(checked) => setReminders({ ...reminders, sound: checked })}
              />
            </div>

            {/* Vibration Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('enableVibration', language)}</span>
              <Switch
                checked={reminders.vibration}
                onCheckedChange={(checked) => setReminders({ ...reminders, vibration: checked })}
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
              />
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-soft"
        >
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('about', language)}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === 'pt'
              ? 'JawRelax ajuda você a desenvolver hábitos mais saudáveis para sua mandíbula através de lembretes inteligentes, exercícios e gamificação.'
              : 'JawRelax helps you develop healthier jaw habits through smart reminders, exercises, and gamification.'}
          </p>
          <p className="text-xs text-muted-foreground mt-4">Version 1.0.0</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
