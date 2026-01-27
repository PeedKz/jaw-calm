import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Check, Sparkles } from 'lucide-react';
import { getDailyFact, getTodayFactNumber } from '@/lib/dailyFacts';
import { Language, t } from '@/lib/translations';

const FACT_READ_KEY = 'desencosta_facts_read';

interface DailyFactCardProps {
  language: Language;
  onFactRead: () => void;
}

function getReadFacts(): string[] {
  const data = localStorage.getItem(FACT_READ_KEY);
  return data ? JSON.parse(data) : [];
}

function markFactAsRead(factId: number): boolean {
  const today = new Date().toISOString().split('T')[0];
  const key = `${today}-${factId}`;
  const readFacts = getReadFacts();
  
  if (readFacts.includes(key)) {
    return false; // Already read today
  }
  
  readFacts.push(key);
  localStorage.setItem(FACT_READ_KEY, JSON.stringify(readFacts));
  return true;
}

function isFactReadToday(factId: number): boolean {
  const today = new Date().toISOString().split('T')[0];
  const key = `${today}-${factId}`;
  return getReadFacts().includes(key);
}

export function DailyFactCard({ language, onFactRead }: DailyFactCardProps) {
  const fact = getDailyFact();
  const factNumber = getTodayFactNumber();
  const [isRead, setIsRead] = useState(false);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    setIsRead(isFactReadToday(fact.id));
  }, [fact.id]);

  const handleMarkAsRead = () => {
    if (!isRead) {
      const wasNew = markFactAsRead(fact.id);
      if (wasNew) {
        setIsRead(true);
        setShowXP(true);
        onFactRead();
        setTimeout(() => setShowXP(false), 2000);
      }
    }
  };

  const title = language === 'pt' ? fact.titlePt : fact.titleEn;
  const description = language === 'pt' ? fact.descriptionPt : fact.descriptionEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {fact.emoji}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {t('dailyFact', language)} #{factNumber}
                </span>
              </div>
              
              <h3 className="font-semibold text-foreground mb-2 leading-tight">
                {title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {isRead ? (
                <span className="flex items-center gap-1 text-primary">
                  <Check className="w-3 h-3" />
                  {t('factRead', language)}
                </span>
              ) : (
                <span>+5 XP</span>
              )}
            </div>
            
            <div className="relative">
              <AnimatePresence>
                {showXP && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="absolute -top-2 right-0 flex items-center gap-1 text-primary font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    +5 XP
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Button
                size="sm"
                variant={isRead ? 'outline' : 'default'}
                onClick={handleMarkAsRead}
                disabled={isRead}
                className="text-xs"
              >
                {isRead ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    {t('understood', language)}
                  </>
                ) : (
                  t('gotIt', language)
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
