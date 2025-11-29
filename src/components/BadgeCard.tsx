import { motion } from 'framer-motion';
import { Badge } from '@/types';
import { Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard = ({ badge }: BadgeCardProps) => {
  const { language } = useApp();
  const name = language === 'pt' ? badge.namePt : badge.nameEn;
  const description = language === 'pt' ? badge.descriptionPt : badge.descriptionEn;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
      className={`card-soft p-4 text-center transition-smooth ${
        badge.unlocked ? 'bg-gradient-to-br from-primary/10 to-secondary/10' : 'opacity-50'
      }`}
    >
      <div className="mb-3">
        {badge.unlocked ? (
          <div className="text-5xl">{badge.icon}</div>
        ) : (
          <div className="relative text-5xl grayscale">
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="opacity-30">{badge.icon}</div>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {badge.unlocked && badge.unlockedAt && (
        <p className="text-xs text-primary mt-2">
          {new Date(badge.unlockedAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
};
