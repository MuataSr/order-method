'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCourseStore } from '@/lib/stores/course-store';
import { Module3PhaseView } from './module-3-phase-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Calendar,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  Star,
  Flame,
  Award,
  Loader2,
  Lock,
  BookOpen,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreviewModeBadge } from '@/components/lms/preview-mode-badge';

// ============================================================================
// IMPORTS FROM MODULE 3 STRUCTURE
// ============================================================================

import {
  MODULE_3_META,
  PHASES,
  TOTAL_GATES_MODULE_3,
  GATES_FOR_SYSTEMS_ARCHITECT,
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
} from './utils';

export function ModuleThreeView() {
  // ------------------------------------------------------------------------
  // STATE & HOOKS
  // ------------------------------------------------------------------------

  const { user } = useAuthStore();
  const {
    moduleThreeData,
    setModuleThreeData,
    currentPhaseModule3,
    setCurrentPhaseModule3,
    completedGatesModule3,
    setCompletedGatesModule3,
    systemsPlaybook,
    setSystemsPlaybook,
    isSystemsArchitect,
    setIsSystemsArchitect,
  } = useCourseStore();

  const [activeView, setActiveView] = useState<'overview' | 'phase'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ------------------------------------------------------------------------
  // DATA FETCHING
  // ------------------------------------------------------------------------

  // Fetch Module 3 progress
  const { data: moduleProgress, isLoading, error: progressError } = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_3'],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required to fetch progress');
      }

      const res = await fetch(`/api/modules/progress?userId=${user.id}&moduleName=MODULE_3`);

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

  // Fetch gate submissions
  const { data: gateSubmissions, error: submissionsError } = useQuery({
    queryKey: ['gate-submissions', user?.id, 'MODULE_3'],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required to fetch submissions');
      }

      const res = await fetch(`/api/modules/gate-submissions?userId=${user.id}&moduleName=MODULE_3`);

      if (!res.ok) {
        console.warn('Failed to fetch gate submissions:', res.statusText);
        return [];
      }

      return res.json();
    },
    enabled: !!user?.id,
    retry: 1,
  });

  // ------------------------------------------------------------------------
  // STATE INITIALIZATION
  // ------------------------------------------------------------------------

  // Parse gates once using useMemo
  const parsedGates = useMemo(() => {
    if (!moduleProgress?.completedGates) return [];
    return parseCompletedGates(moduleProgress.completedGates);
  }, [moduleProgress?.completedGates]);

  // Update completed gates state when parsed gates change
  useEffect(() => {
    if (parsedGates.length > 0) {
      setCompletedGatesModule3(parsedGates);
    }
  }, [parsedGates, setCompletedGatesModule3]);

  // Update other state when module progress changes
  useEffect(() => {
    if (moduleProgress) {
      setCurrentPhaseModule3(moduleProgress.currentPhase || 1);
      setModuleThreeData(moduleProgress);

      // Check if Systems Architect badge earned (all gates completed)
      if (parsedGates.length >= GATES_FOR_SYSTEMS_ARCHITECT) {
        setIsSystemsArchitect(true);
      }
    }
  }, [moduleProgress, setCurrentPhaseModule3, setModuleThreeData, setIsSystemsArchitect, parsedGates.length]);

  // ------------------------------------------------------------------------
  // EVENT HANDLERS
  // ------------------------------------------------------------------------

  /**
   * Handle completion of a gate
   *
   * @param gateName - The identifier of the gate being completed
   * @param data - Optional submission data including workflow information
   */
  const handleCompleteGate = useCallback(async (gateName: string, data?: GateSubmissionData) => {
    if (!user?.id) {
      const errorMsg = 'Cannot complete gate: No user authenticated';
      setSubmitError(errorMsg);
      console.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Submit gate to API
      const submitRes = await fetch('/api/modules/gate-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_3',
          gateName,
          submissionData: JSON.stringify(data || {}),
        }),
      });

      if (!submitRes.ok) {
        throw new Error(`Failed to submit gate: ${submitRes.statusText}`);
      }

      // Calculate new state
      const newCompletedGates = [...completedGatesModule3, gateName];

      // Calculate new phase based on completed gates
      const phase1Complete = isPhaseComplete(PHASES[0].gates, newCompletedGates);
      const phase2Complete = isPhaseComplete(PHASES[1].gates, newCompletedGates);
      const phase3Complete = isPhaseComplete(PHASES[2].gates, newCompletedGates);

      let newPhase = currentPhaseModule3;
      if (phase3Complete) {
        newPhase = 4;
      } else if (phase2Complete) {
        newPhase = 3;
      } else if (phase1Complete) {
        newPhase = 2;
      }

      // Update progress API
      fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_3',
          currentPhase: newPhase,
          completedGates: JSON.stringify(newCompletedGates),
          status: newCompletedGates.length >= TOTAL_GATES_MODULE_3 ? 'COMPLETED' : 'IN_PROGRESS',
        }),
      }).catch(err => {
        console.error('Failed to update progress:', err);
      });

      // Update state
      setCompletedGatesModule3(newCompletedGates);
      setCurrentPhaseModule3(newPhase);

      // Check for Systems Architect badge
      if (newCompletedGates.length >= GATES_FOR_SYSTEMS_ARCHITECT && !isSystemsArchitect) {
        setIsSystemsArchitect(true);
      }

      // Update systems playbook if workflow data included
      if (data?.workflow) {
        setSystemsPlaybook([...systemsPlaybook, data.workflow]);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(errorMsg);
      console.error('Failed to complete gate:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    user?.id,
    currentPhaseModule3,
    isSystemsArchitect,
    setCompletedGatesModule3,
    setCurrentPhaseModule3,
    setIsSystemsArchitect,
    setSystemsPlaybook,
  ]);

  /**
   * Handle clicking on a phase card
   */
  const handlePhaseClick = useCallback((phaseNumber: number) => {
    // Check if phase is unlocked
    if (phaseNumber === 1) {
      setCurrentPhaseModule3(phaseNumber);
      setActiveView('phase');
      return;
    }

    // Phase 2+ require previous phase completion
    const prevPhase = PHASES[phaseNumber - 2];
    const prevPhaseComplete = isPhaseComplete(prevPhase.gates, completedGatesModule3);

    if (prevPhaseComplete) {
      setCurrentPhaseModule3(phaseNumber);
      setActiveView('phase');
    }
  }, [completedGatesModule3, setCurrentPhaseModule3]);

  /**
   * Handle starting the module
   */
  const handleStartModule = useCallback(async () => {
    if (!user?.id) {
      const errorMsg = 'Cannot start module: No user authenticated';
      setSubmitError(errorMsg);
      console.error(errorMsg);
      return;
    }

    setSubmitError(null);

    try {
      const res = await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'order-framework',
          moduleName: 'MODULE_3',
          currentPhase: 1,
          completedGates: '[]',
          status: 'IN_PROGRESS',
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to start module: ${res.statusText}`);
      }

      setActiveView('phase');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(errorMsg);
      console.error('Failed to start module:', error);
    }
  }, [user?.id]);

  // ------------------------------------------------------------------------
  // COMPUTED VALUES
  // ------------------------------------------------------------------------

  // Progress calculations - memoized for performance
  const progressPercentage = useMemo(
    () => calculatePhaseProgress(completedGatesModule3.length, TOTAL_GATES_MODULE_3),
    [completedGatesModule3]
  );

  const isStarted = useMemo(
    () => completedGatesModule3.length > 0 || moduleThreeData?.status === 'IN_PROGRESS',
    [completedGatesModule3, moduleThreeData?.status]
  );

  const isCompleted = useMemo(
    () => completedGatesModule3.length >= TOTAL_GATES_MODULE_3,
    [completedGatesModule3]
  );

  // Phase completion status - memoized for performance
  const phase1Complete = useMemo(
    () => isPhaseComplete(PHASES[0].gates, completedGatesModule3),
    [completedGatesModule3]
  );

  const phase2Complete = useMemo(
    () => isPhaseComplete(PHASES[1].gates, completedGatesModule3),
    [completedGatesModule3]
  );

  const phase3Complete = useMemo(
    () => isPhaseComplete(PHASES[2].gates, completedGatesModule3),
    [completedGatesModule3]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Loading Module 3...</span>
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
              MODULE_3_META.color
            )}>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Module 3 of 5</Badge>
                      <div className="flex items-center">
                        <h1 className="text-3xl font-bold">{MODULE_3_META.title}</h1>
                        {user?.bypassGates && <PreviewModeBadge />}
                      </div>
                    </div>
                  </div>
                  <p className="text-xl text-white/90">{MODULE_3_META.subtitle}</p>
                  <p className="text-white/80 max-w-2xl">{MODULE_3_META.description}</p>

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

                {isSystemsArchitect && (
                  <div role="status" aria-live="assertive" aria-atomic="true">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="hidden lg:block"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-50" />
                        <div className="relative bg-amber-400 text-amber-900 p-6 rounded-2xl">
                          <Building2 className="h-16 w-16 mb-2" aria-hidden="true" />
                          <div className="text-lg font-bold">Systems Architect</div>
                          <div className="text-sm">Badge Earned!</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
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
                      ? 'Congratulations! You have completed Module 3.'
                      : `Complete all 15 gates across 4 phases to earn the Systems Architect badge`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{completedGatesModule3.length}/15</div>
                  <div className="text-sm text-muted-foreground">Gates Completed</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div role="status" aria-live="polite" aria-atomic="true">
                <Progress value={progressPercentage} className="h-3" />
                <p className="sr-only">{progressPercentage.toFixed(0)}% complete</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PHASES.map((phase, index) => {
                  const isUnlocked = phase.number === 1 ||
                    (phase.number === 2 && phase1Complete) ||
                    (phase.number === 3 && phase2Complete) ||
                    (phase.number === 4 && phase3Complete);

                  const phaseGatesCompleted = phase.gates.filter(g => completedGatesModule3.includes(g)).length;
                  const isPhaseComplete = phaseGatesCompleted === phase.gateCount;

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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePhaseClick(phase.number);
                          }
                        }}
                        disabled={!isUnlocked}
                        aria-label={isUnlocked
                          ? `Open ${phase.name} phase, ${phaseGatesCompleted} of ${phase.gateCount} gates completed`
                          : `${phase.name} phase locked`}
                        aria-disabled={!isUnlocked}
                        tabIndex={isUnlocked ? 0 : -1}
                        role="button"
                        className={cn(
                          'w-full p-4 rounded-lg border-2 transition-all text-left',
                          isPhaseComplete && 'border-green-500 bg-green-500/10',
                          !isPhaseComplete && isUnlocked && 'border-primary bg-primary/10',
                          !isUnlocked && 'border-muted bg-muted opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">Phase {phase.number}</span>
                            {isPhaseComplete ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : !isUnlocked ? (
                              <Lock className="h-3 w-3" />
                            ) : (
                              <Target className="h-3 w-3" />
                            )}
                          </div>
                          <Badge variant={isPhaseComplete ? 'default' : 'secondary'} className="text-xs">
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

          {/* Module Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>What You'll Achieve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-amber-500/10 rounded-lg">
                  <BookOpen className="h-8 w-8 text-amber-500 mb-2" />
                  <h3 className="font-semibold mb-1">Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a Systems Playbook with 3 fully documented, scalable workflows
                  </p>
                </div>
                <div className="p-4 bg-orange-500/10 rounded-lg">
                  <Settings className="h-8 w-8 text-orange-500 mb-2" />
                  <h3 className="font-semibold mb-1">Ownership</h3>
                  <p className="text-sm text-muted-foreground">
                    Assign clear owners and accountability for every system you build
                  </p>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <Flame className="h-8 w-8 text-red-500 mb-2" />
                  <h3 className="font-semibold mb-1">Metrics</h3>
                  <p className="text-sm text-muted-foreground">
                    Define success metrics and measurement systems for each workflow
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Systems Architect Badge Info */}
          <Card className={cn(
            'border-2',
            isSystemsArchitect ? 'border-amber-500 bg-amber-500/5' : 'border-dashed'
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'p-4 rounded-lg',
                  isSystemsArchitect ? 'bg-amber-500/20' : 'bg-muted'
                )}>
                  <Building2 className={cn(
                    'h-10 w-10',
                    isSystemsArchitect ? 'text-amber-500' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {isSystemsArchitect ? 'Systems Architect Badge Earned!' : 'Systems Architect Badge'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isSystemsArchitect
                      ? 'You have mastered systems development and scalability. Display your badge with pride!'
                      : 'Complete all 15 gates across all 4 phases to earn the Systems Architect badge and prove your systems building skills.'}
                  </p>
                </div>
                {isSystemsArchitect && (
                  <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: BADGE_ANIMATION_DURATION,
                      ease: 'easeInOut'
                    }}
                    aria-label="Systems Architect badge earned"
                  >
                    <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Systems Playbook Preview */}
          {systemsPlaybook.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Systems Playbook</CardTitle>
                <CardDescription>
                  Your documented systems ({systemsPlaybook.length}/3 minimum)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemsPlaybook.map((workflow, index) => (
                    <div key={index} className="p-4 bg-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{workflow.workflowTitle}</h4>
                        <Badge variant="outline">Owner: {workflow.owner}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Metric:</strong> {workflow.metrics}
                      </p>
                      <div className="text-sm">
                        <strong>Steps:</strong>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          {workflow.steps.slice(0, 3).map((step, i) => (
                            <li key={i} className="text-muted-foreground">{step}</li>
                          ))}
                          {workflow.steps.length > 3 && (
                            <li className="text-muted-foreground">+{workflow.steps.length - 3} more steps</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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

          <Module3PhaseView
            phase={currentPhaseModule3}
            completedGates={completedGatesModule3}
            onCompleteGate={handleCompleteGate}
            onPhaseChange={setCurrentPhaseModule3}
            isSystemsArchitect={isSystemsArchitect}
            phase1Complete={phase1Complete}
            phase2Complete={phase2Complete}
            phase3Complete={phase3Complete}
            bypassGates={user?.bypassGates}
          />

          {isSubmitting && (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <div className="bg-background p-6 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                <p className="mt-2 text-sm">Submitting gate...</p>
              </div>
            </div>
          )}

          {submitError && (
            <div
              role="alert"
              aria-live="assertive"
              className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50"
            >
              <p className="font-semibold">Error</p>
              <p className="text-sm">{submitError}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSubmitError(null)}
                className="mt-2"
              >
                Dismiss
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
