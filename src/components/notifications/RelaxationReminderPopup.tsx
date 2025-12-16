import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { X, Play, Clock, AlertCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UrgencyLevel } from '@/hooks/useRelaxationPopupTrigger';
import { useModalBackHandler } from '@/hooks/useAndroidBackButton';

interface RelaxationReminderPopupProps {
  isOpen: boolean;
  urgencyLevel: UrgencyLevel;
  onDismiss: () => void;
  onStartExercise: () => void;
}

const urgencyConfig = {
  0: {
    icon: Clock,
    titleKey: 'reminderLevel0Title' as const,
    messageKey: 'reminderLevel0Message' as const,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    buttonVariant: 'default' as const,
  },
  1: {
    icon: Heart,
    titleKey: 'reminderLevel1Title' as const,
    messageKey: 'reminderLevel1Message' as const,
    iconBg: 'bg-secondary/20',
    iconColor: 'text-secondary-foreground',
    buttonVariant: 'default' as const,
  },
  2: {
    icon: AlertCircle,
    titleKey: 'reminderLevel2Title' as const,
    messageKey: 'reminderLevel2Message' as const,
    iconBg: 'bg-urgency/15',
    iconColor: 'text-urgency',
    buttonVariant: 'default' as const,
  },
};

export const RelaxationReminderPopup = ({
  isOpen,
  urgencyLevel,
  onDismiss,
  onStartExercise,
}: RelaxationReminderPopupProps) => {
  const { language } = useApp();
  const navigate = useNavigate();
  const config = urgencyConfig[urgencyLevel];
  const Icon = config.icon;

  // Register back button handler for closing modal on Android
  useModalBackHandler(isOpen, onDismiss);

  const handleStartExercise = () => {
    onStartExercise();
    navigate('/exercises');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };

  // Different border accent based on urgency
  const borderClass = urgencyLevel === 2 
    ? 'border-urgency/30' 
    : urgencyLevel === 1 
      ? 'border-secondary/30' 
      : 'border-border';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
            className={`relative w-full max-w-sm bg-card rounded-2xl shadow-xl border-2 ${borderClass} overflow-hidden`}
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
                className={`w-16 h-16 mx-auto mb-4 rounded-full ${config.iconBg} flex items-center justify-center`}
              >
                <motion.div
                  animate={urgencyLevel === 2 ? { 
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ 
                    repeat: urgencyLevel === 2 ? Infinity : 0, 
                    duration: 2,
                    ease: 'easeInOut'
                  }}
                >
                  <Icon className={`w-8 h-8 ${config.iconColor}`} />
                </motion.div>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-semibold text-foreground mb-2"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                {t(config.titleKey, language)}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {t(config.messageKey, language)}
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
                className={`w-full h-12 text-base font-medium ${
                  urgencyLevel === 2 ? 'bg-urgency hover:bg-urgency/90' : ''
                }`}
                aria-label="Start Relaxation"
              >
                <Play className="w-5 h-5 mr-2" />
                {t('startExercise', language)}
              </Button>
              
              <Button
                onClick={onDismiss}
                variant="ghost"
                className="w-full h-10 text-muted-foreground"
              >
                {urgencyLevel === 2 ? t('dismissUrgent', language) : t('dismiss', language)}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
