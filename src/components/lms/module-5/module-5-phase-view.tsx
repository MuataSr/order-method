'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PHASES_MODULE_5 } from './constants';
import { GateSubmissionData } from './types';
import { isPhaseComplete, getPhaseGatesCompleted } from './utils';
import { Phase1Content } from './phase-content/phase-1-content';
import { Phase2Content } from './phase-content/phase-2-content';
import { Phase3Content } from './phase-content/phase-3-content';
import { Phase4Content } from './phase-content/phase-4-content';

interface Module5PhaseViewProps {
  phase: number;
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  onPhaseChange: (phase: number) => void;
  isFreedomFounder: boolean;
  phase1Complete: boolean;
  phase2Complete: boolean;
  phase3Complete: boolean;
}

export function Module5PhaseView({
  phase,
  completedGates,
  onCompleteGate,
  onPhaseChange,
  isFreedomFounder,
  phase1Complete,
  phase2Complete,
  phase3Complete,
}: Module5PhaseViewProps) {
  const currentPhaseData = PHASES_MODULE_5[phase - 1];
  const phaseGatesCompleted = getPhaseGatesCompleted(phase, completedGates);
  const thisPhaseComplete = phaseGatesCompleted === currentPhaseData.gateCount;

  const canGoPrevious = phase > 1;
  const canGoNext = (phase === 1 && phase1Complete) || 
                    (phase === 2 && phase2Complete) || 
                    (phase === 3 && phase3Complete) || 
                    (phase === 4 && isFreedomFounder);

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPhaseChange(phase - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && phase < 4) {
      onPhaseChange(phase + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <Trophy className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{currentPhaseData.name}</h2>
              {thisPhaseComplete && (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{currentPhaseData.days} • {currentPhaseData.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium px-3">
            Phase {phase} of 4
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={!canGoNext || phase >= 4}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Phase Navigation Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {PHASES_MODULE_5.map((p) => {
          const isComplete = isPhaseComplete(p.gates, completedGates);
          const isActive = p.number === phase;
          const gatesCompleted = getPhaseGatesCompleted(p.number, completedGates);

          const isUnlocked = p.number === 1 || 
            (p.number === 2 && phase1Complete) || 
            (p.number === 3 && phase2Complete) || 
            (p.number === 4 && phase3Complete);

          return (
            <button
              key={p.number}
              onClick={() => {
                if (isUnlocked) {
                  onPhaseChange(p.number);
                }
              }}
              disabled={!isUnlocked}
              className={cn(
                'p-3 rounded-lg border-2 transition-all text-left',
                isActive && 'border-primary bg-primary/10',
                isComplete && !isActive && 'border-green-500 bg-green-500/5',
                !isComplete && !isActive && 'border-border hover:border-primary/50',
                !isUnlocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Phase {p.number}</span>
                {isComplete ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : (
                  <span className="text-xs text-muted-foreground">{gatesCompleted}/{p.gateCount}</span>
                )}
              </div>
              <p className="text-sm font-medium truncate">{p.name}</p>
            </button>
          );
        })}
      </div>

      {/* Phase Content */}
      <motion.div
        key={phase}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {phase === 1 && (
          <Phase1Content
            completedGates={completedGates}
            onCompleteGate={onCompleteGate}
          />
        )}
        {phase === 2 && (
          <Phase2Content
            completedGates={completedGates}
            onCompleteGate={onCompleteGate}
          />
        )}
        {phase === 3 && (
          <Phase3Content
            completedGates={completedGates}
            onCompleteGate={onCompleteGate}
          />
        )}
        {phase === 4 && (
          <Phase4Content
            completedGates={completedGates}
            onCompleteGate={onCompleteGate}
            isFreedomFounder={isFreedomFounder}
          />
        )}
      </motion.div>
    </div>
  );
}
