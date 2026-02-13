'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCourseStore } from '@/lib/stores/course-store';
import { Module1DayView } from './module-1-day-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  Star,
  Flame,
  Award,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Module 1 metadata
const MODULE_1_META = {
  id: 'module-1',
  title: 'Module 1: Own Your Clock',
  subtitle: 'Time Mastery for Agency Owners',
  description: 'Transform from reactive to intentional. Design your week, protect your focus, and scale without burnout.',
  totalDays: 10,
  icon: Clock,
  color: 'from-blue-500 to-purple-500',
};

// Gate definitions
const GATES = [
  { name: 'baseline_entry', label: 'Baseline Entry', day: 1 },
  { name: 'baseline_completion', label: 'Baseline Completion', day: 2 },
  { name: 'task_inventory', label: 'Task Inventory', day: 3 },
  { name: 'eisenhower_matrix', label: 'Eisenhower Matrix', day: 4 },
  { name: 'time_blocking', label: 'Time Blocking', day: 5 },
  { name: 'theme_days', label: 'Theme Days', day: 6 },
  { name: 'deep_work', label: 'Deep Work', day: 7 },
  { name: 'energy_management', label: 'Energy Management', day: 8 },
  { name: 'boundaries', label: 'Boundaries', day: 9 },
  { name: 'final_system', label: 'Time Master System', day: 10 },
];

export function ModuleOneView() {
  const { user } = useAuthStore();
  const {
    moduleOneData,
    setModuleOneData,
    currentDay,
    setCurrentDay,
    completedGates,
    setCompletedGates,
    isTimeMaster,
    setIsTimeMaster,
  } = useCourseStore();

  const [activeView, setActiveView] = useState<'overview' | 'day'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Module 1 progress
  const { data: moduleProgress, isLoading } = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_1'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_1`);
      if (!res.ok) {
        if (res.status === 404) {
          // No progress yet - return default
          return {
            currentDay: 1,
            completedGates: [],
            status: 'NOT_STARTED',
          };
        }
        throw new Error('Failed to fetch progress');
      }
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Fetch gate submissions
  const { data: gateSubmissions } = useQuery({
    queryKey: ['gate-submissions', user?.id, 'MODULE_1'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/gate-submissions?userId=${user?.id}&moduleName=MODULE_1`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Initialize state from API data
  useEffect(() => {
    if (moduleProgress) {
      setCurrentDay(moduleProgress.currentDay || 1);
      const gates = moduleProgress.completedGates
        ? typeof moduleProgress.completedGates === 'string'
          ? JSON.parse(moduleProgress.completedGates)
          : moduleProgress.completedGates
        : [];
      setCompletedGates(gates);
      setModuleOneData(moduleProgress);

      // Check if Time Master badge earned (all gates completed)
      if (gates.length >= 10) {
        setIsTimeMaster(true);
      }
    }
  }, [moduleProgress, setCurrentDay, setCompletedGates, setModuleOneData, setIsTimeMaster]);

  const handleCompleteGate = async (gateName: string, data?: any) => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      // Submit gate
      const res = await fetch('/api/modules/gate-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_1',
          gateName,
          submissionData: JSON.stringify(data || {}),
        }),
      });

      if (!res.ok) throw new Error('Failed to submit gate');

      // Update progress
      const newCompletedGates = [...completedGates, gateName];
      const newDay = currentDay < 10 ? currentDay + 1 : currentDay;

      await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_1',
          currentDay: newDay,
          completedGates: JSON.stringify(newCompletedGates),
          status: newCompletedGates.length >= 10 ? 'COMPLETED' : 'IN_PROGRESS',
        }),
      });

      setCompletedGates(newCompletedGates);
      setCurrentDay(newDay);

      // Check for Time Master badge
      if (newCompletedGates.length >= 10) {
        setIsTimeMaster(true);
      }

      // Move to next day automatically after completing a gate
      if (newDay <= 10) {
        setCurrentDay(newDay);
      }
    } catch (error) {
      console.error('Failed to complete gate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDayChange = (day: number) => {
    if (day >= 1 && day <= 10) {
      setCurrentDay(day);
      setActiveView('day');
    }
  };

  const handleStartModule = async () => {
    if (!user?.id) return;

    try {
      await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_1',
          currentDay: 1,
          completedGates: '[]',
          status: 'IN_PROGRESS',
        }),
      });
      setActiveView('day');
    } catch (error) {
      console.error('Failed to start module:', error);
    }
  };

  const progressPercentage = (completedGates.length / 10) * 100;
  const isStarted = completedGates.length > 0 || moduleOneData?.status === 'IN_PROGRESS';
  const isCompleted = completedGates.length >= 10;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {activeView === 'overview' ? (
        <motion.div
          key="overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Hero Section */}
          <Card className="overflow-hidden">
            <div className={cn(
              'bg-gradient-to-r p-8 text-white',
              MODULE_1_META.color
            )}>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <MODULE_1_META.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Module 1 of 5</Badge>
                      <h1 className="text-3xl font-bold">{MODULE_1_META.title}</h1>
                    </div>
                  </div>
                  <p className="text-xl text-white/90">{MODULE_1_META.subtitle}</p>
                  <p className="text-white/80 max-w-2xl">{MODULE_1_META.description}</p>

                  {!isStarted && (
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={handleStartModule}
                      className="mt-4"
                    >
                      Start Module
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}

                  {isStarted && (
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => setActiveView('day')}
                      className="mt-4"
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>

                {isTimeMaster && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="hidden lg:block"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50" />
                      <div className="relative bg-yellow-400 text-yellow-900 p-6 rounded-2xl">
                        <Trophy className="h-16 w-16 mb-2" />
                        <div className="text-lg font-bold">Time Master</div>
                        <div className="text-sm">Badge Earned!</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>
                    {isCompleted
                      ? 'Congratulations! You have completed Module 1.'
                      : `Complete all 10 gates to earn the Time Master badge`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{completedGates.length}/10</div>
                  <div className="text-sm text-muted-foreground">Gates Completed</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressPercentage} className="h-3" />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {GATES.map((gate, index) => {
                  const isCompleted = completedGates.includes(gate.name);
                  const isCurrent = gate.day === currentDay;
                  const isLocked = gate.day > currentDay && !isCompleted;

                  return (
                    <motion.div
                      key={gate.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => !isLocked && handleDayChange(gate.day)}
                        disabled={isLocked}
                        className={cn(
                          'w-full p-3 rounded-lg border-2 transition-all text-left',
                          isCompleted && 'border-green-500 bg-green-500/10',
                          isCurrent && !isCompleted && 'border-primary bg-primary/10',
                          isLocked && 'border-muted bg-muted opacity-50 cursor-not-allowed',
                          !isLocked && !isCompleted && !isCurrent && 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">Day {gate.day}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : isLocked ? (
                            <div className="h-3 w-3 rounded-full bg-muted" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border-2 border-primary" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{gate.label}</div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Module Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>What You'll Achieve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <Target className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-semibold mb-1">Clarity</h3>
                  <p className="text-sm text-muted-foreground">
                    Know exactly where your time goes and what deserves your attention
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold mb-1">Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Design your week instead of reacting to emergencies and distractions
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <Flame className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-semibold mb-1">Sustainability</h3>
                  <p className="text-sm text-muted-foreground">
                    Build systems that prevent burnout and scale your business sustainably
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Master Badge Info */}
          <Card className={cn(
            'border-2',
            isTimeMaster ? 'border-yellow-500 bg-yellow-500/5' : 'border-dashed'
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'p-4 rounded-lg',
                  isTimeMaster ? 'bg-yellow-500/20' : 'bg-muted'
                )}>
                  <Trophy className={cn(
                    'h-10 w-10',
                    isTimeMaster ? 'text-yellow-500' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {isTimeMaster ? 'Time Master Badge Earned!' : 'Time Master Badge'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isTimeMaster
                      ? 'You have mastered the art of time management. Display your badge with pride!'
                      : 'Complete all 10 gates to earn the Time Master badge and prove your time mastery skills.'}
                  </p>
                </div>
                {isTimeMaster && (
                  <motion.div
                    initial={{ rotate: -20 }}
                    animate={{ rotate: 0 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}
                  >
                    <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="day"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => setActiveView('overview')}
              className="mb-4"
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Overview
            </Button>
          </div>

          <Module1DayView
            day={currentDay}
            completedGates={completedGates}
            onCompleteGate={handleCompleteGate}
            onDayChange={handleDayChange}
            isTimeMaster={isTimeMaster}
          />

          {isSubmitting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm">Submitting gate...</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
