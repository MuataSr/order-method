'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PartyPopper, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'gate' | 'module' | 'badge' | 'course';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function Celebration({
  isOpen,
  onClose,
  title,
  description,
  type = 'gate',
  autoClose = true,
  autoCloseDelay = 4000,
}: CelebrationProps) {
  
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'badge':
        return <Sparkles className="h-8 w-8 text-yellow-400" />;
      case 'module':
      case 'course':
        return <PartyPopper className="h-8 w-8 text-primary" />;
      default:
        return <Sparkles className="h-8 w-8 text-primary" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'badge':
        return 'from-yellow-500/20 via-amber-500/20 to-yellow-500/20';
      case 'module':
        return 'from-primary/20 via-purple-500/20 to-primary/20';
      case 'course':
        return 'from-green-500/20 via-emerald-500/20 to-green-500/20';
      default:
        return 'from-primary/20 via-blue-500/20 to-primary/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative max-w-md w-full rounded-2xl p-8 text-center overflow-hidden',
              'bg-background border-2 border-primary/20 shadow-2xl'
            )}
          >
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-50',
              getGradient()
            )} />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative"
            >
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                {getIcon()}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative mt-6"
            >
              <Button onClick={onClose}>
                Continue
              </Button>
            </motion.div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <Confetti />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Confetti() {
  const colors = ['#hsl(var(--primary))', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];
  const confettiCount = 50;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: confettiCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 400 - 200,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: 500,
            rotate: Math.random() * 360 * 5,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
          className={cn(
            'absolute top-0 left-1/2 w-2 h-2 rounded-sm',
            'bg-primary'
          )}
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            transform: `translateX(${Math.random() * 400 - 200}px)`,
          }}
        />
      ))}
    </div>
  );
}

interface UseCelebrationOptions {
  onCelebrate?: () => void;
}

export function useCelebration(options: UseCelebrationOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    title: string;
    description?: string;
    type?: 'gate' | 'module' | 'badge' | 'course';
  } | null>(null);

  const celebrate = useCallback((
    title: string,
    description?: string,
    type?: 'gate' | 'module' | 'badge' | 'course'
  ) => {
    setCelebrationData({ title, description, type });
    setIsOpen(true);
    options.onCelebrate?.();
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setCelebrationData(null), 300);
  }, []);

  return {
    celebrate,
    close,
    CelebrationComponent: celebrationData ? (
      <Celebration
        isOpen={isOpen}
        onClose={close}
        title={celebrationData.title}
        description={celebrationData.description}
        type={celebrationData.type}
      />
    ) : null,
  };
}
