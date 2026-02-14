/**
 * Phase Navigation Component
 *
 * Displays navigation controls for moving between phases.
 * Shows current phase indicator and prev/next buttons.
 *
 * @module phase-content/phase-navigation
 */

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PhaseNavigationProps {
  /** Current phase number (1-4) */
  phase: number;
  /** Whether the current phase is accessible */
  isPhaseAccessible: boolean;
  /** Callback when phase changes */
  onPhaseChange: (phase: number) => void;
}

/**
 * Phase Navigation Component
 *
 * Provides navigation controls for moving between phases.
 * Disables prev/next buttons appropriately based on phase.
 *
 * @param phase - Current phase number
 * @param isPhaseAccessible - Whether current phase is accessible
 * @param onPhaseChange - Callback when user changes phase
 */
export function PhaseNavigation({
  phase,
  isPhaseAccessible,
  onPhaseChange,
}: PhaseNavigationProps) {
  return (
    <div className="flex items-center justify-between" role="navigation" aria-label="Phase navigation">
      <Button
        variant="outline"
        onClick={() => onPhaseChange(phase - 1)}
        disabled={phase === 1}
        aria-label="Go to previous phase"
      >
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        Previous Phase
      </Button>
      <div className="text-center">
        <Badge variant="outline" className="text-lg px-4 py-1">
          Phase {phase} of 4
        </Badge>
      </div>
      <Button
        variant="outline"
        onClick={() => onPhaseChange(phase + 1)}
        disabled={phase === 4 || !isPhaseAccessible}
        aria-label="Go to next phase"
      >
        Next Phase
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
