import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { X, Play, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RelaxationReminderPopupProps {
  isOpen: boolean;
  onDismiss: () => void;
  onStartExercise: () => void;
}

export const RelaxationReminderPopup = ({
  isOpen,
  onDismiss,
  onStartExercise,
}: RelaxationReminderPopupProps) => {
  const { language } = useApp();
  const navigate = useNavigate();

  const handleStartExercise = () => {
    onStartExercise();
    navigate('/exercises');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300 
            }}
            className="relative w-full max-w-sm bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Header with Icon */}
            <div className="pt-8 pb-4 px-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Clock className="w-8 h-8 text-primary" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-semibold text-foreground mb-2"
              >
                {t('reminderPopupTitle', language)}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {t('reminderPopupMessage', language)}
              </motion.p>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="px-6 pb-6 space-y-3"
            >
              <Button
                onClick={handleStartExercise}
                className="w-full h-12 text-base font-medium"
              >
                <Play className="w-5 h-5 mr-2" />
                {t('startExercise', language)}
              </Button>
              
              <Button
                onClick={onDismiss}
                variant="ghost"
                className="w-full h-10 text-muted-foreground"
              >
                {t('dismiss', language)}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
