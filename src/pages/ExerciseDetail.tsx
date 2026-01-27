import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { exercises } from '@/lib/exercises';
import { ArrowLeft, Play, Check, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/translations';

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, logRelaxation } = useApp();
  const { toast } = useToast();
  const [phase, setPhase] = useState<'instructions' | 'exercise' | 'complete'>('instructions');
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const exercise = exercises.find((ex) => ex.id === id);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase === 'exercise' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else if (phase === 'exercise' && timeLeft === 0) {
      handleComplete();
    }
  }, [phase, timeLeft]);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Exercise not found</p>
      </div>
    );
  }

  const title = language === 'pt' ? exercise.titlePt : exercise.titleEn;
  const steps = language === 'pt' ? exercise.stepsPt : exercise.stepsEn;

  const handleStartTimer = () => {
    setPhase('exercise');
    setCurrentStep(0);
    setTimeLeft(exercise.duration);
  };

  const handleComplete = () => {
    setPhase('complete');
    logRelaxation('manual');
    toast({
      title: language === 'pt' ? '🎉 Protocolo completo!' : '🎉 Protocol complete!',
      description: language === 'pt' ? '+10 XP ganhos' : '+10 XP earned',
    });
    setTimeout(() => navigate('/exercises'), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-6 pt-8 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/exercises')}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{exercise.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">
              {exercise.duration} {language === 'pt' ? 'segundos' : 'seconds'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {phase === 'instructions' && (
          /* Instructions Phase - Show all steps clearly before starting */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card-soft">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  {language === 'pt' ? 'Instruções do Protocolo' : 'Protocol Instructions'}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'pt' 
                  ? 'Leia todas as instruções antes de iniciar o temporizador:' 
                  : 'Read all instructions before starting the timer:'}
              </p>
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <motion.li 
                    key={index} 
                    className="flex gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-foreground leading-relaxed pt-0.5">{step}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleStartTimer}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                size="lg"
              >
                <Timer className="w-5 h-5 mr-2" />
                {language === 'pt' ? 'Entendi, Iniciar Temporizador' : 'Got it, Start Timer'}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {phase === 'exercise' && (
          /* During Exercise View */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Timer */}
            <div className="card-soft p-12 text-center">
              <motion.div
                key={timeLeft}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-8xl font-bold gradient-text mb-4"
              >
                {timeLeft}
              </motion.div>
              <p className="text-muted-foreground">
                {language === 'pt' ? 'segundos restantes' : 'seconds remaining'}
              </p>
            </div>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-soft p-8 text-center"
              >
                <div className="text-4xl mb-4">{exercise.icon}</div>
                <p className="text-lg text-foreground">{steps[currentStep]}</p>
              </motion.div>
            </AnimatePresence>

            {/* Step Indicators */}
            <div className="flex gap-2 justify-center">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-smooth ${
                    index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="outline"
                className="w-full"
              >
                {language === 'pt' ? 'Próximo Passo' : 'Next Step'}
              </Button>
            )}
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">
              {language === 'pt' ? 'Protocolo Concluído!' : 'Protocol Complete!'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'pt' ? 'Redirecionando...' : 'Redirecting...'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
