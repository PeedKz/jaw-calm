import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { exercises } from '@/lib/exercises';
import { Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '@/types';

export default function Exercises() {
  const { language } = useApp();
  const navigate = useNavigate();

  const handleStartExercise = (exercise: Exercise) => {
    navigate(`/exercises/${exercise.id}`);
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
          <Dumbbell className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('exercises', language)}</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          {t('exercisesSubtitle', language)}
        </motion.p>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ExerciseCard exercise={exercise} onStart={handleStartExercise} />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
