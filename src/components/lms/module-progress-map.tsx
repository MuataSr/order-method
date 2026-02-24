'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Gate {
  id: string;
  name: string;
  title: string;
}

interface Phase {
  id: number;
  name: string;
  gates: Gate[];
}

interface ModuleProgressMapProps {
  phases: Phase[];
  completedGates: string[];
  currentPhase: number;
  onGateClick?: (gate: Gate) => void;
}

export function ModuleProgressMap({
  phases,
  completedGates,
  currentPhase,
  onGateClick,
}: ModuleProgressMapProps) {
  const getGateStatus = (gateId: string, phaseIndex: number) => {
    if (completedGates.includes(gateId)) return 'completed';
    if (phaseIndex + 1 < currentPhase) return 'available';
    if (phaseIndex + 1 === currentPhase) return 'current';
    return 'locked';
  };

  return (
    <div className="space-y-6">
      {phases.map((phase, phaseIndex) => {
        const phaseProgress = phase.gates.filter(g => 
          completedGates.includes(g.id)
        ).length;
        const phaseTotal = phase.gates.length;
        const isPhaseComplete = phaseProgress === phaseTotal;

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIndex * 0.1 }}
            className="relative"
          >
            <div className={cn(
              "p-4 rounded-xl border-2 transition-all duration-300",
              isPhaseComplete 
                ? "bg-primary/5 border-primary/30" 
                : phaseIndex + 1 === currentPhase
                  ? "bg-background border-primary"
                  : "bg-muted/30 border-muted"
            )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg",
                    isPhaseComplete 
                      ? "bg-primary text-primary-foreground"
                      : phaseIndex + 1 === currentPhase
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {isPhaseComplete ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      phase.id
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{phase.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {phaseProgress}/{phaseTotal} gates completed
                    </p>
                  </div>
                </div>
                {isPhaseComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-primary"
                  >
                    <Check className="h-6 w-6" />
                  </motion.div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {phase.gates.map((gate, gateIndex) => {
                  const status = getGateStatus(gate.id, phaseIndex);
                  
                  return (
                    <motion.button
                      key={gate.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (phaseIndex * 0.1) + (gateIndex * 0.05) }}
                      onClick={() => status !== 'locked' && onGateClick?.(gate)}
                      disabled={status === 'locked'}
                      className={cn(
                        "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "flex items-center gap-2 min-w-[120px]",
                        status === 'completed' && "bg-primary text-primary-foreground",
                        status === 'current' && "bg-primary/20 text-primary border-2 border-primary hover:bg-primary/30",
                        status === 'available' && "bg-muted hover:bg-muted/80 text-muted-foreground",
                        status === 'locked' && "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      )}
                    >
                      {status === 'completed' ? (
                        <Check className="h-4 w-4" />
                      ) : status === 'locked' ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <span className="truncate">{gate.title}</span>
                      
                      {status === 'current' && (
                        <motion.div
                          className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {phaseIndex < phases.length - 1 && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full h-4 flex items-center justify-center">
                <div className={cn(
                  "h-full w-0.5",
                  phases[phaseIndex + 1] && 
                    phases[phaseIndex + 1].gates.every(g => completedGates.includes(g.id))
                    ? "bg-primary"
                    : "bg-muted"
                )} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

interface LinearProgressMapProps {
  gates: { id: string; title: string }[];
  completedGates: string[];
  onGateClick?: (gateId: string) => void;
}

export function LinearProgressMap({
  gates,
  completedGates,
  onGateClick,
}: LinearProgressMapProps) {
  const progress = (completedGates.length / gates.length) * 100;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-between px-0">
          {gates.map((gate, index) => {
            const isCompleted = completedGates.includes(gate.id);
            const position = (index / (gates.length - 1)) * 100;
            
            return (
              <motion.button
                key={gate.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onGateClick?.(gate.id)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all -translate-x-1/2",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted hover:border-primary"
                )}
                style={{ left: `${position}%`, position: 'absolute' }}
              >
                {isCompleted && <Check className="h-3 w-3" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>Start</span>
        <span>{completedGates.length}/{gates.length} completed</span>
        <span>Complete</span>
      </div>
    </div>
  );
}
