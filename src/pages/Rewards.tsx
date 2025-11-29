import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { BadgeCard } from '@/components/BadgeCard';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { Trophy } from 'lucide-react';

export default function Rewards() {
  const { language, badges } = useApp();
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('rewards', language)}</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          {unlockedCount} / {badges.length} {t('unlocked', language).toLowerCase()}
        </motion.p>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft"
        >
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <BadgeCard badge={badge} />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
