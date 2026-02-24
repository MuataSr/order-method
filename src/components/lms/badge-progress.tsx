'use client';

import { motion } from 'framer-motion';
import { Trophy, Clock, Search, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CircularProgress } from '@/components/lms/animated-progress';

interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  totalGates: number;
}

export const BADGES: Record<string, BadgeConfig> = {
  TIME_MASTER: {
    id: 'time-master',
    name: 'Time Master',
    description: 'Complete all Module 1 gates',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    totalGates: 10,
  },
  WORKFLOW_ANALYST: {
    id: 'workflow-analyst',
    name: 'Workflow Analyst',
    description: 'Complete all Module 2 gates',
    icon: Search,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
    totalGates: 10,
  },
  SYSTEMS_ARCHITECT: {
    id: 'systems-architect',
    name: 'Systems Architect',
    description: 'Complete all Module 3 gates',
    icon: Building2,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    totalGates: 15,
  },
};

interface BadgeProgressProps {
  badgeId: keyof typeof BADGES;
  completedGates: number;
  isEarned?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeProgress({
  badgeId,
  completedGates,
  isEarned = false,
  showLabel = true,
  size = 'md',
}: BadgeProgressProps) {
  const badge = BADGES[badgeId];
  if (!badge) return null;

  const progress = (completedGates / badge.totalGates) * 100;
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };
  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-10 w-10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
        isEarned 
          ? 'border-primary/50 bg-primary/5' 
          : 'border-muted bg-muted/30'
      )}
    >
      <div className={cn('relative', sizeClasses[size])}>
        <CircularProgress
          value={progress}
          size={size === 'lg' ? 96 : size === 'md' ? 64 : 48}
          strokeWidth={3}
          showValue={false}
        />
        <div className={cn(
          'absolute inset-0 flex items-center justify-center rounded-full',
          badge.bgColor
        )}>
          <badge.icon className={cn(
            iconSizes[size],
            isEarned ? badge.color : 'text-muted-foreground'
          )} />
        </div>
        {isEarned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-1 -right-1"
          >
            <Trophy className="h-5 w-5 text-yellow-500" />
          </motion.div>
        )}
      </div>

      {showLabel && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              'font-semibold truncate',
              isEarned ? badge.color : 'text-muted-foreground'
            )}>
              {badge.name}
            </h4>
            {isEarned && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full"
              >
                Earned
              </motion.span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {badge.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {completedGates}/{badge.totalGates} gates completed
          </p>
        </div>
      )}
    </motion.div>
  );
}

interface BadgeGridProps {
  badges: Array<{
    id: keyof typeof BADGES;
    completedGates: number;
    isEarned: boolean;
  }>;
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <BadgeProgress
            badgeId={badge.id}
            completedGates={badge.completedGates}
            isEarned={badge.isEarned}
          />
        </motion.div>
      ))}
    </div>
  );
}

interface BadgeEarnedAnimationProps {
  badge: BadgeConfig;
  onComplete?: () => void;
}

export function BadgeEarnedAnimation({ badge, onComplete }: BadgeEarnedAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="relative"
      >
        <div className={cn(
          'h-32 w-32 rounded-full flex items-center justify-center',
          badge.bgColor,
          'border-4 border-primary'
        )}>
          <badge.icon className={cn('h-16 w-16', badge.color)} />
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-4 -right-4"
        >
          <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-900" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <h3 className="text-xl font-bold text-white text-center">
            {badge.name}
          </h3>
          <p className="text-white/80 text-center">Badge Earned!</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
