import { PHASES_MODULE_4, TOTAL_GATES_MODULE_4 } from './constants';

export function parseCompletedGates(completedGates: string | string[]): string[] {
  if (!completedGates) return [];
  if (Array.isArray(completedGates)) return completedGates;
  try {
    const parsed = JSON.parse(completedGates);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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
  completedGates: string[],
  bypassGates: boolean = false
): boolean {
  if (bypassGates) return true;
  if (phaseNumber === 1) return true;

  const previousPhase = PHASES_MODULE_4[phaseNumber - 2];
  if (!previousPhase) return false;

  return isPhaseComplete(previousPhase.gates, completedGates);
}

export function getPhaseGatesCompleted(
  phaseNumber: number,
  completedGates: string[]
): number {
  const phase = PHASES_MODULE_4[phaseNumber - 1];
  if (!phase) return 0;

  return phase.gates.filter(gate => completedGates.includes(gate.name)).length;
}

export function getCurrentPhase(completedGates: string[]): number {
  for (let i = 0; i < PHASES_MODULE_4.length; i++) {
    const phase = PHASES_MODULE_4[i];
    if (!isPhaseComplete(phase.gates, completedGates)) {
      return phase.number;
    }
  }
  return PHASES_MODULE_4.length;
}

export function getNextGate(completedGates: string[]): string | null {
  const allGates = PHASES_MODULE_4.flatMap(p => p.gates);
  const nextGate = allGates.find(gate => !completedGates.includes(gate.name));
  return nextGate?.name || null;
}

export function isTeamChampionEarned(completedGates: string[]): boolean {
  return completedGates.length >= TOTAL_GATES_MODULE_4;
}

export function getProgressPercentage(completedGates: string[]): number {
  return calculatePhaseProgress(completedGates.length, TOTAL_GATES_MODULE_4);
}
