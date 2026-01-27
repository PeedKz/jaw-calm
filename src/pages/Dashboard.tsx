import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ProgressRing';
import { ExerciseCard } from '@/components/ExerciseCard';
import { DailyFactCard } from '@/components/DailyFactCard';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { gamification } from '@/lib/gamification';
import { exercises } from '@/lib/exercises';
import { Flame, Zap, Sparkles, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Exercise } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { language, userProgress, todayCount, logRelaxation, reminders } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogging, setIsLogging] = useState(false);

  const dailyGoal = reminders.dailyNotificationCount || 6;
  const progressPercent = Math.min((todayCount / dailyGoal) * 100, 100);
  const levelProgress = gamification.getLevelProgress(userProgress.totalXP);

  const handleQuickRelax = async () => {
    setIsLogging(true);
    logRelaxation('manual');
    
    toast({
      title: language === 'pt' ? '✨ Relaxamento registrado!' : '✨ Relaxation logged!',
      description:
        language === 'pt'
          ? `+10 XP • ${todayCount + 1}/${dailyGoal} hoje`
          : `+10 XP • ${todayCount + 1}/${dailyGoal} today`,
    });

    setTimeout(() => setIsLogging(false), 1000);
  };

  const handleFactRead = () => {
    // Award 5 XP for reading daily fact
    gamification.awardFactXP();
    
    toast({
      title: language === 'pt' ? '💡 Curiosidade lida!' : '💡 Fact read!',
      description: '+5 XP',
    });
  };

  const handleStartExercise = (exercise: Exercise) => {
    navigate(`/exercises/${exercise.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-6 pt-8 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2"
        >
          {language === 'pt' ? 'Olá!' : 'Hello!'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          {language === 'pt'
            ? 'Como está sua mandíbula hoje?'
            : 'How is your jaw feeling today?'}
        </motion.p>
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            {language === 'pt' ? 'Como funciona' : 'How it works'}
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">
                {language === 'pt' ? '📊 Progresso:' : '📊 Progress:'}
              </span>{' '}
              {language === 'pt'
                ? 'Mostra quantas vezes você desencostou os dentes hoje.'
                : 'Shows how many times you unclenched your teeth today.'}
            </p>
            <p>
              <span className="font-medium text-foreground">
                {language === 'pt' ? '⚡ XP:' : '⚡ XP:'}
              </span>{' '}
              {language === 'pt'
                ? 'Pontos que você ganha ao registrar relaxamentos e interagir com o app.'
                : 'Points you earn by logging relaxations and interacting with the app.'}
            </p>
            <p>
              <span className="font-medium text-foreground">
                {language === 'pt' ? '🔔 Alertas:' : '🔔 Alerts:'}
              </span>{' '}
              {language === 'pt'
                ? 'Configure quantos lembretes quer receber e em qual período do dia nas Configurações.'
                : 'Set how many reminders you want and when to receive them in Settings.'}
            </p>
          </div>
        </motion.div>

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft"
        >
          <h2 className="text-lg font-semibold mb-4">{t('todayProgress', language)}</h2>
          <div className="flex items-center justify-between">
            <ProgressRing progress={progressPercent} size={100}>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{todayCount}</div>
                <div className="text-xs text-muted-foreground">/ {dailyGoal}</div>
              </div>
            </ProgressRing>

            <div className="flex-1 ml-6 space-y-3">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-sm text-muted-foreground">{t('currentStreak', language)}</div>
                  <div className="text-xl font-bold">
                    {userProgress.currentStreak} {t('days', language)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">{t('level', language)}</div>
                  <div className="text-xl font-bold">{userProgress.level}</div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleQuickRelax}
            disabled={isLogging}
            className="w-full mt-6 bg-gradient-to-r from-primary to-secondary text-white"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {language === 'pt' ? 'Registrar Relaxamento' : 'Log Relaxation'}
          </Button>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-soft"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('level', language)} {userProgress.level}
            </h3>
            <span className="text-sm text-muted-foreground">
              {userProgress.totalXP} / {gamification.getXPForNextLevel(userProgress.totalXP)} XP
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </motion.div>

        {/* Daily Fact */}
        <DailyFactCard language={language} onFactRead={handleFactRead} />

        {/* Quick Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t('quickExercise', language)}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/exercises')}>
              {t('viewAll', language)}
            </Button>
          </div>
          <div className="space-y-3">
            {exercises.slice(0, 2).map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} onStart={handleStartExercise} />
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
