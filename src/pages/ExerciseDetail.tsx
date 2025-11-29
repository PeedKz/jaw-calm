import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { exercises } from '@/lib/exercises';
import { ArrowLeft, Play, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, logRelaxation } = useApp();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const exercise = exercises.find((ex) => ex.id === id);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }
  }, [isActive, timeLeft]);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Exercise not found</p>
      </div>
    );
  }

  const title = language === 'pt' ? exercise.titlePt : exercise.titleEn;
  const steps = language === 'pt' ? exercise.stepsPt : exercise.stepsEn;

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setTimeLeft(exercise.duration);
  };

  const handleComplete = () => {
    setIsActive(false);
    logRelaxation('manual');
    toast({
      title: language === 'pt' ? '🎉 Exercício completo!' : '🎉 Exercise complete!',
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
        {!isActive ? (
          /* Pre-Exercise View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card-soft">
              <h2 className="text-lg font-semibold mb-4">
                {language === 'pt' ? 'Passos' : 'Steps'}
              </h2>
              <ol className="space-y-3">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {language === 'pt' ? 'Começar Exercício' : 'Start Exercise'}
            </Button>
          </motion.div>
        ) : (
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
      </div>
    </div>
  );
}
