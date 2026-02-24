'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Search,
  Building2,
  Users,
  Trophy,
  Star,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { parseCompletedGates } from '@/lib/utils/progress';

interface ModuleProgress {
  completedGates: string | string[];
  status: string;
  currentDay?: number;
  currentPhase?: number;
}

interface ModuleConfig {
  number: number;
  title: string;
  subtitle: string;
  gradient: string;
  icon: LucideIcon;
  badgeName: string;
  badgeIcon: LucideIcon;
  badgeBg: string;
  totalGates: number;
  progressLabel: 'day' | 'phase';
}

const MODULE_CONFIGS: Record<number, ModuleConfig> = {
  1: {
    number: 1,
    title: 'Module 1: Own Your Clock',
    subtitle: 'Time Mastery for Agency Owners',
    gradient: 'from-blue-500 to-purple-500',
    icon: Calendar,
    badgeName: 'Time Master',
    badgeIcon: Trophy,
    badgeBg: 'bg-yellow-400 text-yellow-900',
    totalGates: 10,
    progressLabel: 'day',
  },
  2: {
    number: 2,
    title: 'Module 2: Review What Works',
    subtitle: 'Workflow Analysis & Optimization',
    gradient: 'from-emerald-500 to-teal-500',
    icon: Search,
    badgeName: 'Workflow Analyst',
    badgeIcon: Trophy,
    badgeBg: 'bg-emerald-400 text-emerald-900',
    totalGates: 10,
    progressLabel: 'day',
  },
  3: {
    number: 3,
    title: 'Module 3: Develop Systems',
    subtitle: 'Build Scalable Systems & Processes',
    gradient: 'from-amber-500 to-orange-500',
    icon: Building2,
    badgeName: 'Systems Architect',
    badgeIcon: Building2,
    badgeBg: 'bg-amber-400 text-amber-900',
    totalGates: 15,
    progressLabel: 'phase',
  },
  4: {
    number: 4,
    title: 'Module 4: Educate & Empower Teams',
    subtitle: 'Transition Operational Control to Your Team',
    gradient: 'from-indigo-500 to-purple-500',
    icon: Users,
    badgeName: 'Team Champion',
    badgeIcon: Users,
    badgeBg: 'bg-purple-400 text-purple-900',
    totalGates: 10,
    progressLabel: 'phase',
  },
  5: {
    number: 5,
    title: 'Module 5: Results & Celebrate',
    subtitle: 'Final Phase & 4-Day Week Celebration',
    gradient: 'from-emerald-500 to-teal-500',
    icon: Trophy,
    badgeName: 'Freedom Founder',
    badgeIcon: Star,
    badgeBg: 'bg-emerald-400 text-emerald-900',
    totalGates: 12,
    progressLabel: 'phase',
  },
};

interface ModuleProgressCardProps {
  moduleNumber: 1 | 2 | 3 | 4 | 5;
  progress: ModuleProgress | null;
  delay?: number;
}

export function ModuleProgressCard({
  moduleNumber,
  progress,
  delay = 0.5,
}: ModuleProgressCardProps) {
  const router = useRouter();
  const config = MODULE_CONFIGS[moduleNumber];
  const IconComponent = config.icon;
  const BadgeIconComponent = config.badgeIcon;

  if (!progress) return null;

  const completedGates = parseCompletedGates(progress.completedGates);
  const gatesCount = completedGates.length;
  const progressPercent = (gatesCount / config.totalGates) * 100;

  const progressValue =
    config.progressLabel === 'day'
      ? progress.currentDay || 1
      : progress.currentPhase || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="overflow-hidden">
        <div className={`bg-gradient-to-r ${config.gradient} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-semibold text-lg">{config.title}</h3>
                <p className="text-white/80 text-sm">{config.subtitle}</p>
              </div>
            </div>
            {progress.status === 'COMPLETED' && (
              <div
                className={`flex items-center gap-2 ${config.badgeBg} px-3 py-1.5 rounded-full text-sm font-medium`}
              >
                <BadgeIconComponent className="h-4 w-4" />
                {config.badgeName}
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium">
                  {gatesCount}/{config.totalGates} Gates
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Current {config.progressLabel === 'day' ? 'Day' : 'Phase'}:{' '}
                <span className="font-medium">{progressValue}</span>
              </div>
              <Button
                size="sm"
                onClick={() => router.push(`/module/${moduleNumber}`)}
              >
                {progress.status === 'NOT_STARTED' ? (
                  <>Start Module</>
                ) : (
                  <>
                    Continue Learning
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ModuleProgressCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-[88px] bg-muted animate-pulse" />
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-2 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
            <div className="h-8 w-28 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
