// ============================================================================
// MODULE 3: DEVELOP SYSTEMS - Utility Functions
// ============================================================================

import type { PhaseGate } from '@/components/lms/module-3/types';
import { PHASES, TOTAL_PHASES, TOTAL_GATES_MODULE_3, MODULE_3_META } from '@/components/lms/module-3/constants';

/**
 * Safely parses completed gates from API response
 * Handles both JSON string and array formats
 */
export function parseCompletedGates(data: string | string[]): string[] {
  if (!data) return [];

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Determines the current phase based on completed gates
 * Returns current phase number (1-4) or defaults to 1
 */
export function calculateCurrentPhase(completedGates: string[]): number {
  if (completedGates.length === 0) return 1;

  const phase1Gates = PHASES[0].gates;
  const phase1Complete = phase1Gates.every(g => completedGates.includes(g));
  if (phase1Complete) return 1;

  const phase2Gates = PHASES[1].gates;
  const phase2Complete = phase2Gates.every(g => completedGates.includes(g));
  if (phase2Complete && phase1Complete) return 2;

  const phase3Gates = PHASES[2].gates;
  const phase3Complete = phase3Gates.every(g => completedGates.includes(g));
  if (phase3Complete && phase2Complete) return 3;

  return 4;
}

/**
 * Calculates the percentage of gates completed in a phase
 */
export function calculatePhaseProgress(completed: number, total: number): number {
  return (completed / total) * 100;
}

/**
 * Counts how many gates in a phase are completed
 */
export function countCompletedGates(completedGates: string[], phaseGates: PhaseGate[]): number {
  return phaseGates.filter(g => completedGates.includes(g.name)).length;
}

/**
 * Checks if all gates in a phase are completed
 */
export function isPhaseComplete(phaseGates: readonly string[], completedGates: string[]): boolean {
  return phaseGates.every(g => completedGates.includes(g));
}

/**
 * Validates if a phase should be locked based on phase completion status
 * Phase 2 requires all Phase 1 gates
 * Phase 3 requires all Phase 2 gates
 * Phase 4 requires all Phase 3 gates
 */
export function isPhaseUnlocked(
  currentPhase: number, 
  phase1Complete: boolean, 
  phase2Complete: boolean, 
  phase3Complete: boolean,
  bypassGates: boolean = false
): boolean {
  if (bypassGates) return true;
  if (currentPhase === 1) return true;
  if (currentPhase === 2) return phase1Complete;
  if (currentPhase === 3) return phase2Complete;
  if (currentPhase === 4) return phase3Complete;
  return false;
}

/**
 * Validates gate submission data before processing
 * Checks for required fields and valid data types
 */
export function validateGateSubmission(gateName: string, data: unknown): { valid: boolean, errors: string[] } {
  const errors: string[] = [];

  if (!data || (typeof data !== 'object')) {
    errors.push('Submission data is required');
    return { valid: false, errors };
  }

  const d = data as Record<string, unknown>;

  if (d.workflowTitle && typeof d.workflowTitle !== 'string') {
    errors.push('Workflow title must be a string');
  }

  if (d.steps && (!Array.isArray(d.steps) || !d.steps.every(s => typeof s === 'string'))) {
    errors.push('Workflow steps must be an array of strings');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Module 3 Data interface
 * Systems Playbook workflow structure
 */
export interface SystemsPlaybookWorkflow {
  workflowTitle: string;
  steps: string[];
  owner: string;
  metrics: string;
}
