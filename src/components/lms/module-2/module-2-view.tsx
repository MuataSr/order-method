'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCourseStore } from '@/lib/stores/course-store';
import { Module2DayView } from './module-2-day-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
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
import { PreviewModeBadge } from '@/components/lms/preview-mode-badge';

// Module 2 metadata
const MODULE_2_META = {
  id: 'module-2',
  title: 'Module 2: Review What Works',
  subtitle: 'Workflow Analysis & Optimization',
  description: 'Analyze your existing workflows, identify bottlenecks, and optimize what already works.',
  totalDays: 10,
  icon: Search,
  color: 'from-emerald-500 to-teal-500',
};

// Gate definitions
const GATES = [
  { name: 'current_state_audit', label: 'Current State Audit', day: 1 },
  { name: 'time_assessment', label: 'Time Assessment', day: 2 },
  { name: 'workflow_mapping', label: 'Workflow Mapping', day: 3 },
  { name: 'bottleneck_id', label: 'Bottleneck Identification', day: 4 },
  { name: 'energy_analysis', label: 'Energy Analysis', day: 5 },
  { name: 'tool_audit', label: 'Tool Audit', day: 6 },
  { name: 'communication_review', label: 'Communication Review', day: 7 },
  { name: 'success_patterns', label: 'Success Patterns', day: 8 },
  { name: 'optimization_plan', label: 'Optimization Plan', day: 9 },
  { name: 'implementation_commit', label: 'Implementation Commitment', day: 10 },
];

export function ModuleTwoView() {
  const { user } = useAuthStore();
  const {
    moduleTwoData,
    setModuleTwoData,
    currentDayModule2,
    setCurrentDayModule2,
    completedGatesModule2,
    setCompletedGatesModule2,
    isWorkflowAnalyst,
    setIsWorkflowAnalyst,
  } = useCourseStore();

  const [activeView, setActiveView] = useState<'overview' | 'day'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Module 2 progress
  const { data: moduleProgress, isLoading } = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_2'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_2`);
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
    queryKey: ['gate-submissions', user?.id, 'MODULE_2'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/gate-submissions?userId=${user?.id}&moduleName=MODULE_2`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Initialize state from API data
  useEffect(() => {
    if (moduleProgress) {
      setCurrentDayModule2(moduleProgress.currentDay || 1);
      const gates = moduleProgress.completedGates
        ? typeof moduleProgress.completedGates === 'string'
          ? JSON.parse(moduleProgress.completedGates)
          : moduleProgress.completedGates
        : [];
      setCompletedGatesModule2(gates);
      setModuleTwoData(moduleProgress);

      // Check if Workflow Analyst badge earned (all gates completed)
      if (gates.length >= 10) {
        setIsWorkflowAnalyst(true);
      }
    }
  }, [moduleProgress, setCurrentDayModule2, setCompletedGatesModule2, setModuleTwoData, setIsWorkflowAnalyst]);

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
          moduleName: 'MODULE_2',
          gateName,
          submissionData: JSON.stringify(data || {}),
        }),
      });

      if (!res.ok) throw new Error('Failed to submit gate');

      // Update progress
      const newCompletedGates = [...completedGatesModule2, gateName];
      const newDay = currentDayModule2 < 10 ? currentDayModule2 + 1 : currentDayModule2;

      await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_2',
          currentDay: newDay,
          completedGates: JSON.stringify(newCompletedGates),
          status: newCompletedGates.length >= 10 ? 'COMPLETED' : 'IN_PROGRESS',
        }),
      });

      setCompletedGatesModule2(newCompletedGates);
      setCurrentDayModule2(newDay);

      // Check for Workflow Analyst badge
      if (newCompletedGates.length >= 10) {
        setIsWorkflowAnalyst(true);
      }

      // Move to next day automatically after completing a gate
      if (newDay <= 10) {
        setCurrentDayModule2(newDay);
      }
    } catch (error) {
      console.error('Failed to complete gate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDayChange = (day: number) => {
    if (day >= 1 && day <= 10) {
      setCurrentDayModule2(day);
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
          moduleName: 'MODULE_2',
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

  const progressPercentage = (completedGatesModule2.length / 10) * 100;
  const isStarted = completedGatesModule2.length > 0 || moduleTwoData?.status === 'IN_PROGRESS';
  const isCompleted = completedGatesModule2.length >= 10;

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
              MODULE_2_META.color
            )}>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <MODULE_2_META.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Module 2 of 5</Badge>
                      <h1 className="text-3xl font-bold">{MODULE_2_META.title}</h1>
                        {user?.bypassGates && <PreviewModeBadge />}
                      </div>
                  </div>
                  <p className="text-xl text-white/90">{MODULE_2_META.subtitle}</p>
                  <p className="text-white/80 max-w-2xl">{MODULE_2_META.description}</p>

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

                {isWorkflowAnalyst && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="hidden lg:block"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-50" />
                      <div className="relative bg-emerald-400 text-emerald-900 p-6 rounded-2xl">
                        <Trophy className="h-16 w-16 mb-2" />
                        <div className="text-lg font-bold">Workflow Analyst</div>
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
                      ? 'Congratulations! You have completed Module 2.'
                      : `Complete all 10 gates to earn the Workflow Analyst badge`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{completedGatesModule2.length}/10</div>
                  <div className="text-sm text-muted-foreground">Gates Completed</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressPercentage} className="h-3" />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {GATES.map((gate, index) => {
                  const isCompleted = completedGatesModule2.includes(gate.name);
                  const isCurrent = gate.day === currentDayModule2;
                  const isLocked = gate.day > currentDayModule2 && !isCompleted;

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
                <div className="p-4 bg-emerald-500/10 rounded-lg">
                  <Target className="h-8 w-8 text-emerald-500 mb-2" />
                  <h3 className="font-semibold mb-1">Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    See exactly how your workflows operate and where time is being spent
                  </p>
                </div>
                <div className="p-4 bg-teal-500/10 rounded-lg">
                  <Calendar className="h-8 w-8 text-teal-500 mb-2" />
                  <h3 className="font-semibold mb-1">Efficiency</h3>
                  <p className="text-sm text-muted-foreground">
                    Eliminate bottlenecks and streamline processes that work well
                  </p>
                </div>
                <div className="p-4 bg-cyan-500/10 rounded-lg">
                  <Flame className="h-8 w-8 text-cyan-500 mb-2" />
                  <h3 className="font-semibold mb-1">Sustainability</h3>
                  <p className="text-sm text-muted-foreground">
                    Build optimized workflows that scale without burnout
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Analyst Badge Info */}
          <Card className={cn(
            'border-2',
            isWorkflowAnalyst ? 'border-emerald-500 bg-emerald-500/5' : 'border-dashed'
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'p-4 rounded-lg',
                  isWorkflowAnalyst ? 'bg-emerald-500/20' : 'bg-muted'
                )}>
                  <Trophy className={cn(
                    'h-10 w-10',
                    isWorkflowAnalyst ? 'text-emerald-500' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {isWorkflowAnalyst ? 'Workflow Analyst Badge Earned!' : 'Workflow Analyst Badge'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isWorkflowAnalyst
                      ? 'You have mastered workflow analysis and optimization. Display your badge with pride!'
                      : 'Complete all 10 gates to earn the Workflow Analyst badge and prove your workflow optimization skills.'}
                  </p>
                </div>
                {isWorkflowAnalyst && (
                  <motion.div
                    initial={{ rotate: -20 }}
                    animate={{ rotate: 0 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}
                  >
                    <Star className="h-8 w-8 text-emerald-500 fill-emerald-500" />
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

          <Module2DayView
            day={currentDayModule2}
            completedGates={completedGatesModule2}
            onCompleteGate={handleCompleteGate}
            onDayChange={handleDayChange}
            isWorkflowAnalyst={isWorkflowAnalyst}
            bypassGates={user?.bypassGates}
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
