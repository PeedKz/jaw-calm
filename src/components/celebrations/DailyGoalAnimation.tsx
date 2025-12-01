import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/translations';
import { Language } from '@/lib/translations';

interface DailyGoalAnimationProps {
  show: boolean;
  onDismiss: () => void;
  language: Language;
}

export const DailyGoalAnimation = ({ show, onDismiss, language }: DailyGoalAnimationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="card-soft relative overflow-hidden">
              {/* Animated particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-20, -100, -150],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10), (i % 2 === 0 ? 1 : -1) * (40 + i * 15)],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeOut',
                  }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                  style={{
                    background: `hsl(var(--${i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'}))`,
                  }}
                />
              ))}

              {/* Content */}
              <div className="relative text-center pt-8 pb-6 px-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mb-6"
                >
                  <PartyPopper className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                >
                  {t('dailyGoalComplete', language)}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  {t('dailyGoalMessage', language)}
                </motion.p>

                {/* Sparkles decoration */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles className="w-6 h-6 text-secondary" />
                </motion.div>

                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                  className="absolute top-4 left-4"
                >
                  <Sparkles className="w-6 h-6 text-accent" />
                </motion.div>

                {/* Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={onDismiss}
                    className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    {t('keepGoing', language)}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};