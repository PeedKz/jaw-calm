import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { UserProfile } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Sparkles } from 'lucide-react';
import onboardingHero from '@/assets/onboarding-hero.png';
import { calculateIntervalFromGoal } from '@/lib/reminderCalculator';
export default function Onboarding() {
  const { language, setUserProfile, completeOnboarding, reminders, setReminders } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    bruxismType: 'both' as 'daytime' | 'nighttime' | 'both',
    dailyGoal: 6,
    stressLevel: 5,
    bruxismIntensity: 5,
  });

  const handleComplete = () => {
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      ...formData,
      createdAt: new Date(),
      language,
    };
    setUserProfile(profile);
    
    // Calculate and set the reminder interval based on daily goal
    const calculatedInterval = calculateIntervalFromGoal(formData.dailyGoal);
    setReminders({
      ...reminders,
      frequency: calculatedInterval,
      enabled: true,
    });
    
    completeOnboarding();
    navigate('/');
  };

  const steps = [
    // Welcome Step
    <div key="welcome" className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mb-6"
      >
        <img 
          src={onboardingHero} 
          alt="Peaceful relaxation" 
          className="w-48 h-48 mx-auto rounded-3xl shadow-glow"
        />
      </motion.div>
      <h1 className="text-3xl font-bold gradient-text">{t('welcome', language)}</h1>
      <p className="text-muted-foreground text-lg">{t('onboardingSubtitle', language)}</p>
    </div>,

    // Bruxism Type
    <div key="type" className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">{t('bruxismType', language)}</h2>
      <div className="grid gap-4">
        {(['daytime', 'nighttime', 'both'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFormData({ ...formData, bruxismType: type })}
            className={`card-soft p-6 text-left transition-smooth border-2 ${
              formData.bruxismType === type
                ? 'border-primary bg-primary/5'
                : 'border-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">
                {type === 'daytime' && <Sun />}
                {type === 'nighttime' && <Moon />}
                {type === 'both' && <Sparkles />}
              </div>
              <span className="text-lg font-medium">{t(type, language)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Daily Goal
    <div key="goal" className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">{t('dailyGoal', language)}</h2>
      <div className="card-soft p-8 text-center">
        <div className="text-6xl font-bold text-primary mb-4">{formData.dailyGoal}</div>
        <p className="text-muted-foreground mb-6">
          {language === 'pt' ? 'vezes por dia' : 'times per day'}
        </p>
        <Slider
          value={[formData.dailyGoal]}
          onValueChange={([value]) => setFormData({ ...formData, dailyGoal: value })}
          min={3}
          max={12}
          step={1}
          className="w-full"
        />
      </div>
    </div>,

    // Stress Level
    <div key="stress" className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">{t('stressLevel', language)}</h2>
      <div className="card-soft p-8">
        <div className="flex justify-between mb-4 text-sm text-muted-foreground">
          <span>{t('low', language)}</span>
          <span>{t('veryHigh', language)}</span>
        </div>
        <Slider
          value={[formData.stressLevel]}
          onValueChange={([value]) => setFormData({ ...formData, stressLevel: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="text-center mt-4 text-4xl font-semibold text-primary">
          {formData.stressLevel}/10
        </div>
      </div>
    </div>,

    // Bruxism Intensity
    <div key="intensity" className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">{t('bruxismIntensity', language)}</h2>
      <div className="card-soft p-8">
        <div className="flex justify-between mb-4 text-sm text-muted-foreground">
          <span>{t('low', language)}</span>
          <span>{t('veryHigh', language)}</span>
        </div>
        <Slider
          value={[formData.bruxismIntensity]}
          onValueChange={([value]) => setFormData({ ...formData, bruxismIntensity: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="text-center mt-4 text-4xl font-semibold text-primary">
          {formData.bruxismIntensity}/10
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 space-y-4">
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              size="lg"
            >
              {t('continue', language)}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              size="lg"
            >
              {t('done', language)}
            </Button>
          )}

          {step > 0 && (
            <Button onClick={() => setStep(step - 1)} variant="ghost" className="w-full" size="lg">
              {t('back', language)}
            </Button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 justify-center mt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-smooth ${
                index === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
