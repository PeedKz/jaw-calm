import { motion } from 'framer-motion';
import { Exercise } from '@/types';
import { Clock, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: (exercise: Exercise) => void;
}

export const ExerciseCard = ({ exercise, onStart }: ExerciseCardProps) => {
  const { language } = useApp();
  const title = language === 'pt' ? exercise.titlePt : exercise.titleEn;
  const description = language === 'pt' ? exercise.descriptionPt : exercise.descriptionEn;

  const getDifficultyColor = () => {
    switch (exercise.difficulty) {
      case 'easy':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'hard':
        return 'text-destructive';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card-soft hover:shadow-soft transition-smooth cursor-pointer"
      onClick={() => onStart(exercise)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{exercise.icon}</span>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground capitalize {getDifficultyColor()}">
                {exercise.difficulty}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {exercise.duration} {t('seconds', language)}
            </span>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="shrink-0">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};
