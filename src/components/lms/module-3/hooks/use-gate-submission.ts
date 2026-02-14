/**
 * useGateSubmission Hook
 *
 * Custom hook for handling gate submissions in Module 3.
 * Encapsulates all gate submission logic, state management, and error handling.
 *
 * @module hooks/use-gate-submission
 */

import { useState, useCallback } from 'react';
import { useCourseStore } from '@/lib/stores/course-store';
import { PHASES } from '../constants';
import { GateSubmissionData } from '../types';
import { parseCompletedGates } from '../utils';

interface UseGateSubmissionReturn {
  /** Whether a gate submission is currently in progress */
  isSubmitting: boolean;
  /** Error message from the last failed submission, if any */
  error: string | null;
  /** Submit a gate completion */
  submitGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  /** Clear the current error state */
  clearError: () => void;
}

/**
 * Hook for submitting gate completions in Module 3
 *
 * Handles:
 * - API calls to submit gate completions
 * - State updates for completed gates and phase progress
 * - Systems Architect badge logic
 * - Systems Playbook updates
 * - Error handling and loading states
 *
 * @returns Object containing submission state and functions
 *
 * @example
 * ```typescript
 * const { submitGate, isSubmitting, error, clearError } = useGateSubmission();
 *
 * await submitGate('workflow_identification', {
 *   notes: 'Identified 3 key workflows'
 * });
 * ```
 */
export function useGateSubmission(): UseGateSubmissionReturn {
  const { user } = useAuthStore();
  const {
    completedGatesModule3,
    setCompletedGatesModule3,
    currentPhaseModule3,
    setCurrentPhaseModule3,
    systemsPlaybook,
    setSystemsPlaybook,
    isSystemsArchitect,
    setIsSystemsArchitect,
  } = useCourseStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit a gate completion
   *
   * @param gateName - The identifier of the gate being completed
   * @param data - Optional submission data (workflow info, notes, etc.)
   * @throws {Error} If user is not authenticated or API call fails
   */
  const submitGate = useCallback(
    async (gateName: string, data?: GateSubmissionData) => {
      if (!user?.id) {
        const errorMsg = 'Cannot submit gate: No user authenticated';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setIsSubmitting(true);
      setError(null);

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

        // Calculate new state using functional updates
        setCompletedGatesModule3(prev => {
          const newCompletedGates = [...prev, gateName];

          // Calculate new phase based on completed gates
          const phase1Complete = PHASES[0].gates.every(g =>
            newCompletedGates.includes(g)
          );
          const phase2Complete = PHASES[1].gates.every(g =>
            newCompletedGates.includes(g)
          );
          const phase3Complete = PHASES[2].gates.every(g =>
            newCompletedGates.includes(g)
          );

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
              status:
                newCompletedGates.length >= 15 ? 'COMPLETED' : 'IN_PROGRESS',
            }),
          }).catch(err => {
            console.error('Failed to update progress:', err);
            // Non-critical error, don't throw
          });

          setCurrentPhaseModule3(newPhase);

          // Check for Systems Architect badge
          if (newCompletedGates.length >= 15 && !isSystemsArchitect) {
            setIsSystemsArchitect(true);
          }

          // Update systems playbook if workflow data included
          if (data?.workflow) {
            setSystemsPlaybook(prev => [...prev, data.workflow]);
          }

          return newCompletedGates;
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        console.error('Failed to complete gate:', err);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      user?.id,
      currentPhaseModule3,
      isSystemsArchitect,
      setCompletedGatesModule3,
      setCurrentPhaseModule3,
      setIsSystemsArchitect,
      setSystemsPlaybook,
    ]
  );

  /**
   * Clear the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSubmitting,
    error,
    submitGate,
    clearError,
  };
}

// Import auth store for user context
import { useAuthStore } from '@/lib/stores/auth-store';
