import { parseCompletedGates as parseGatesBase } from '@/lib/utils/progress';
import { PHASES_MODULE_5, TOTAL_GATES_MODULE_5 } from './constants';

export const parseCompletedGates = parseGatesBase;

export function isPhaseComplete(
  phaseGates: Array<{ name: string }>,
  completedGates: string[]
): boolean {
  return phaseGates.every(gate => completedGates.includes(gate.name));
}

export function calculatePhaseProgress(
  completedGates: number,
  totalGates: number
): number {
  if (totalGates === 0) return 0;
  return Math.round((completedGates / totalGates) * 100);
}

export function isPhaseUnlocked(
  phaseNumber: number,
  completedGates: string[]
): boolean {
  if (phaseNumber === 1) return true;

  const previousPhase = PHASES_MODULE_5[phaseNumber - 2];
  if (!previousPhase) return false;

  return isPhaseComplete(previousPhase.gates, completedGates);
}

export function getPhaseGatesCompleted(
  phaseNumber: number,
  completedGates: string[]
): number {
  const phase = PHASES_MODULE_5[phaseNumber - 1];
  if (!phase) return 0;

  return phase.gates.filter(gate => completedGates.includes(gate.name)).length;
}

export function getCurrentPhase(completedGates: string[]): number {
  for (let i = 0; i < PHASES_MODULE_5.length; i++) {
    const phase = PHASES_MODULE_5[i];
    if (!isPhaseComplete(phase.gates, completedGates)) {
      return phase.number;
    }
  }
  return PHASES_MODULE_5.length;
}

export function getNextGate(completedGates: string[]): string | null {
  const allGates = PHASES_MODULE_5.flatMap(p => p.gates);
  const nextGate = allGates.find(gate => !completedGates.includes(gate.name));
  return nextGate?.name || null;
}

export function isFreedomFounderEarned(completedGates: string[]): boolean {
  return completedGates.length >= TOTAL_GATES_MODULE_5;
}

export function getProgressPercentage(completedGates: string[]): number {
  return calculatePhaseProgress(completedGates.length, TOTAL_GATES_MODULE_5);
}

export function generateMetricId(): string {
  return `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
