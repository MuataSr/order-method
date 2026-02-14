/**
 * Phase Gate List Component
 *
 * Displays a list of gates for a phase with completion status.
 * Users can select gates to view details and submit work.
 *
 * @module phase-content/phase-gate-list
 */

import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GateListViewProps, PhaseGate } from '../types';

/**
 * Phase Gate List Component
 *
 * Renders a list of gates with their completion status.
 * Each gate is clickable to view details and submit work.
 *
 * @param gates - Array of gates to display
 * @param completedGates - Array of completed gate names
 * @param onSelectGate - Callback when a gate is selected
 */
export function PhaseGateList({
  gates,
  completedGates,
  onSelectGate,
}: GateListViewProps) {
  return (
    <div className="space-y-3" role="list" aria-label="List of gates">
      {gates.map((gate: PhaseGate, index: number) => {
        const isCompleted = completedGates.includes(gate.name);
        return (
          <button
            key={gate.name}
            onClick={() => onSelectGate(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectGate(index);
              }
            }}
            aria-label={`View ${gate.label} for day ${gate.day}`}
            aria-pressed={isCompleted}
            className={cn(
              'w-full p-4 rounded-lg border-2 transition-all text-left',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isCompleted && 'border-green-500 bg-green-500/10',
              !isCompleted && 'border-border hover:border-primary/50'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Day {gate.day}</span>
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
              <Badge variant={isCompleted ? 'default' : 'secondary'}>
                {isCompleted ? 'Completed' : 'In Progress'}
              </Badge>
            </div>
            <h4 className="font-semibold mb-1">{gate.label}</h4>
            <p className="text-sm text-muted-foreground">{gate.description}</p>
          </button>
        );
      })}
    </div>
  );
}
