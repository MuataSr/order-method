'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCourseStore } from '@/lib/stores/course-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  Star,
  Loader2,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MODULE_4_META,
  PHASES_MODULE_4,
  TOTAL_GATES_MODULE_4,
  ANIMATION_DURATION,
  ANIMATION_STAGGER,
  BADGE_ANIMATION_DURATION,
} from './constants';
import { GateSubmissionData } from './types';
import {
  parseCompletedGates,
  isPhaseComplete,
  calculatePhaseProgress,
  isPhaseUnlocked,
  getPhaseGatesCompleted,
} from './utils';

interface ModuleFourViewProps {
  phaseViewComponent: React.ComponentType<{
    phase: number;
    completedGates: string[];
    onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
    onPhaseChange: (phase: number) => void;
    isTeamChampion: boolean;
    phase1Complete: boolean;
    phase2Complete: boolean;
  }>;
}

export function ModuleFourView({ phaseViewComponent: PhaseView }: ModuleFourViewProps) {
  const { user } = useAuthStore();
  const {
    moduleFourData,
    setModuleFourData,
    currentPhaseModule4,
    setCurrentPhaseModule4,
    completedGatesModule4,
    setCompletedGatesModule4,
    isTeamChampion,
    setIsTeamChampion,
  } = useCourseStore();

  const [activeView, setActiveView] = useState<'overview' | 'phase'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: moduleProgress, isLoading } = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_4'],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      const res = await fetch(`/api/modules/progress?userId=${user.id}&moduleName=MODULE_4`);
      if (!res.ok) {
        if (res.status === 404) {
          return {
            currentPhase: 1,
            completedGates: [],
            status: 'NOT_STARTED',
          };
        }
        throw new Error(`Failed to fetch progress: ${res.statusText}`);
      }
      return res.json();
    },
    enabled: !!user?.id,
    retry: 1,
  });

  const parsedGates = useMemo(() => {
    if (!moduleProgress?.completedGates) return [];
    return parseCompletedGates(moduleProgress.completedGates);
  }, [moduleProgress?.completedGates]);

  useEffect(() => {
    if (parsedGates.length > 0) {
      setCompletedGatesModule4(parsedGates);
    }
  }, [parsedGates, setCompletedGatesModule4]);

  useEffect(() => {
    if (moduleProgress) {
      setCurrentPhaseModule4(moduleProgress.currentPhase || 1);
      setModuleFourData(moduleProgress);

      if (parsedGates.length >= TOTAL_GATES_MODULE_4) {
        setIsTeamChampion(true);
      }
    }
  }, [moduleProgress, setCurrentPhaseModule4, setModuleFourData, setIsTeamChampion, parsedGates.length]);

  const handleCompleteGate = useCallback(async (gateName: string, data?: GateSubmissionData) => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      const submitRes = await fetch('/api/modules/gate-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_4',
          gateName,
          submissionData: JSON.stringify(data || {}),
        }),
      });

      if (!submitRes.ok) {
        throw new Error(`Failed to submit gate: ${submitRes.statusText}`);
      }

      const newCompletedGates = [...completedGatesModule4, gateName];

      const phase1Complete = isPhaseComplete(PHASES_MODULE_4[0].gates, newCompletedGates);
      const phase2Complete = isPhaseComplete(PHASES_MODULE_4[1].gates, newCompletedGates);

      let newPhase = currentPhaseModule4;
      if (phase2Complete) {
        newPhase = 3;
      } else if (phase1Complete) {
        newPhase = 2;
      }

      await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_4',
          currentPhase: newPhase,
          completedGates: JSON.stringify(newCompletedGates),
          status: newCompletedGates.length >= TOTAL_GATES_MODULE_4 ? 'COMPLETED' : 'IN_PROGRESS',
        }),
      });

      setCompletedGatesModule4(newCompletedGates);
      setCurrentPhaseModule4(newPhase);

      if (newCompletedGates.length >= TOTAL_GATES_MODULE_4 && !isTeamChampion) {
        setIsTeamChampion(true);
      }
    } catch (error) {
      console.error('Failed to complete gate:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [user?.id, currentPhaseModule4, isTeamChampion, setCompletedGatesModule4, setCurrentPhaseModule4, setIsTeamChampion, completedGatesModule4]);

  const handlePhaseClick = useCallback((phaseNumber: number) => {
    if (phaseNumber === 1) {
      setCurrentPhaseModule4(phaseNumber);
      setActiveView('phase');
      return;
    }

    const prevPhase = PHASES_MODULE_4[phaseNumber - 2];
    const prevPhaseComplete = isPhaseComplete(prevPhase.gates, completedGatesModule4);

    if (prevPhaseComplete) {
      setCurrentPhaseModule4(phaseNumber);
      setActiveView('phase');
    }
  }, [completedGatesModule4, setCurrentPhaseModule4]);

  const handleStartModule = useCallback(async () => {
    if (!user?.id) return;

    try {
      await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_4',
          currentPhase: 1,
          completedGates: '[]',
          status: 'IN_PROGRESS',
        }),
      });
      setActiveView('phase');
    } catch (error) {
      console.error('Failed to start module:', error);
    }
  }, [user?.id]);

  const progressPercentage = useMemo(
    () => calculatePhaseProgress(completedGatesModule4.length, TOTAL_GATES_MODULE_4),
    [completedGatesModule4]
  );

  const isStarted = useMemo(
    () => completedGatesModule4.length > 0 || moduleFourData?.status === 'IN_PROGRESS',
    [completedGatesModule4, moduleFourData?.status]
  );

  const isCompleted = useMemo(
    () => completedGatesModule4.length >= TOTAL_GATES_MODULE_4,
    [completedGatesModule4]
  );

  const phase1Complete = useMemo(
    () => isPhaseComplete(PHASES_MODULE_4[0].gates, completedGatesModule4),
    [completedGatesModule4]
  );

  const phase2Complete = useMemo(
    () => isPhaseComplete(PHASES_MODULE_4[1].gates, completedGatesModule4),
    [completedGatesModule4]
  );

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
          <Card className="overflow-hidden">
            <div className={cn(
              'bg-gradient-to-r p-8 text-white',
              MODULE_4_META.color
            )}>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <MODULE_4_META.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Module 4 of 5</Badge>
                      <h1 className="text-3xl font-bold">{MODULE_4_META.title}</h1>
                    </div>
                  </div>
                  <p className="text-xl text-white/90">{MODULE_4_META.subtitle}</p>
                  <p className="text-white/80 max-w-2xl">{MODULE_4_META.description}</p>

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
                      onClick={() => setActiveView('phase')}
                      className="mt-4"
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>

                {isTeamChampion && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="hidden lg:block"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-400 blur-2xl opacity-50" />
                      <div className="relative bg-purple-400 text-purple-900 p-6 rounded-2xl">
                        <Users className="h-16 w-16 mb-2" />
                        <div className="text-lg font-bold">Team Champion</div>
                        <div className="text-sm">Badge Earned!</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>
                    {isCompleted
                      ? 'Congratulations! You have completed Module 4.'
                      : `Complete all ${TOTAL_GATES_MODULE_4} gates across 3 phases to earn the Team Champion badge`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{completedGatesModule4.length}/{TOTAL_GATES_MODULE_4}</div>
                  <div className="text-sm text-muted-foreground">Gates Completed</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressPercentage} className="h-3" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PHASES_MODULE_4.map((phase, index) => {
                  const isUnlocked = isPhaseUnlocked(phase.number, completedGatesModule4);
                  const phaseGatesCompleted = getPhaseGatesCompleted(phase.number, completedGatesModule4);
                  const thisPhaseComplete = phaseGatesCompleted === phase.gateCount;

                  return (
                    <motion.div
                      key={phase.number}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        delay: index * ANIMATION_STAGGER,
                        layout: { duration: ANIMATION_DURATION }
                      }}
                      layout
                    >
                      <button
                        onClick={() => handlePhaseClick(phase.number)}
                        disabled={!isUnlocked}
                        className={cn(
                          'w-full p-4 rounded-lg border-2 transition-all text-left',
                          thisPhaseComplete && 'border-green-500 bg-green-500/10',
                          !thisPhaseComplete && isUnlocked && 'border-primary bg-primary/10',
                          !isUnlocked && 'border-muted bg-muted opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">Phase {phase.number}</span>
                            {thisPhaseComplete ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : !isUnlocked ? (
                              <Lock className="h-3 w-3" />
                            ) : (
                              <Target className="h-3 w-3" />
                            )}
                          </div>
                          <Badge variant={thisPhaseComplete ? 'default' : 'secondary'} className="text-xs">
                            {phase.gateCount} gates
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{phase.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{phase.days}</p>
                        <p className="text-xs text-muted-foreground">{phase.description}</p>
                        <div className="mt-2">
                          <Progress value={(phaseGatesCompleted / phase.gateCount) * 100} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {phaseGatesCompleted}/{phase.gateCount} gates
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What You'll Achieve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-500/10 rounded-lg">
                  <Target className="h-8 w-8 text-indigo-500 mb-2" />
                  <h3 className="font-semibold mb-1">Buy-In</h3>
                  <p className="text-sm text-muted-foreground">
                    Team understands and believes in the systems approach
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg">
                  <Users className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold mb-1">Ownership</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear owners with accountability for every system
                  </p>
                </div>
                <div className="p-4 bg-violet-500/10 rounded-lg">
                  <Trophy className="h-8 w-8 text-violet-500 mb-2" />
                  <h3 className="font-semibold mb-1">Rhythm</h3>
                  <p className="text-sm text-muted-foreground">
                    Sustainable weekly cadence for continuous improvement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            'border-2',
            isTeamChampion ? 'border-purple-500 bg-purple-500/5' : 'border-dashed'
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'p-4 rounded-lg',
                  isTeamChampion ? 'bg-purple-500/20' : 'bg-muted'
                )}>
                  <Users className={cn(
                    'h-10 w-10',
                    isTeamChampion ? 'text-purple-500' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {isTeamChampion ? 'Team Champion Badge Earned!' : 'Team Champion Badge'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isTeamChampion
                      ? 'You have successfully transitioned operational control to your team. Display your badge with pride!'
                      : `Complete all ${TOTAL_GATES_MODULE_4} gates across all 3 phases to earn the Team Champion badge and prove your team leadership skills.`}
                  </p>
                </div>
                {isTeamChampion && (
                  <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: BADGE_ANIMATION_DURATION,
                      ease: 'easeInOut'
                    }}
                  >
                    <Star className="h-8 w-8 text-purple-500 fill-purple-500" />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="phase"
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

          <PhaseView
            phase={currentPhaseModule4}
            completedGates={completedGatesModule4}
            onCompleteGate={handleCompleteGate}
            onPhaseChange={setCurrentPhaseModule4}
            isTeamChampion={isTeamChampion}
            phase1Complete={phase1Complete}
            phase2Complete={phase2Complete}
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
