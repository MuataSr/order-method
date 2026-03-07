/**
 * Module 3 Phase View Component (Main Container)
 *
 * Main container for Module 3 phase view. Orchestrates sub-components
 * for navigation, overview, gate list, and gate content.
 *
 * This file has been refactored from 626 lines to ~150 lines by extracting
 * logical sub-components into separate files.
 *
 * @module module-3-phase-view
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Building2, Lock, Trophy } from 'lucide-react';

// ============================================================================
// IMPORTS FROM MODULE 3 STRUCTURE
// ============================================================================

import { PHASE_CONTENT, TOTAL_GATES_MODULE_3, ANIMATION_DURATION } from './constants';
import {
  Module3PhaseViewProps,
  GateFormData,
} from './types';
import { isPhaseUnlocked } from './utils';

// ============================================================================
// IMPORT SUB-COMPONENTS
// ============================================================================

import { PhaseNavigation } from './phase-content/phase-navigation';
import { PhaseOverview } from './phase-content/phase-overview';
import { PhaseGateList } from './phase-content/phase-gate-list';
import { PhaseGateContent } from './phase-content/phase-gate-content';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Module 3 Phase View Component
 *
 * Main container for Module 3 phase view. Manages state for:
 * - Active tab (overview vs gate)
 * - Selected gate for viewing
 * - Form data for gate submissions
 *
 * @param props - Component props (see Module3PhaseViewProps)
 */
export function Module3PhaseView({
  phase,
  completedGates,
  onCompleteGate,
  onPhaseChange,
  isSystemsArchitect,
  phase1Complete,
  phase2Complete,
  phase3Complete,
  bypassGates,
}: Module3PhaseViewProps) {
  const bypassGatesEnabled = bypassGates ?? false;
  // ------------------------------------------------------------------------
  // STATE
  // ------------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState<'overview' | 'gate'>('overview');
  const [selectedGate, setSelectedGate] = useState<number | null>(null);
  const [formData, setFormData] = useState<GateFormData>({});

  // ------------------------------------------------------------------------
  // COMPUTED VALUES
  // ------------------------------------------------------------------------

  const phaseContent = PHASE_CONTENT[phase as keyof typeof PHASE_CONTENT];
  const phaseGatesCompleted = phaseContent.gates.filter(g => completedGates.includes(g.name)).length;
  const allGatesCompleted = completedGates.length >= TOTAL_GATES_MODULE_3;
  const isPhaseAccessible = isPhaseUnlocked(phase, phase1Complete, phase2Complete, phase3Complete, bypassGatesEnabled);

  // ------------------------------------------------------------------------
  // EVENT HANDLERS
  // ------------------------------------------------------------------------

  /**
   * Handle gate form submission
   *
   * @param gate - The gate object being submitted
   */
  const handleGateSubmit = (gate: { name: string; label: string; day: number; description: string }) => {
    // For final gate, we collect workflow data
    if (gate.name === 'systems_playbook_v1') {
      // Parse form data for workflow entries
      const workflowData = {
        workflowTitle: formData.workflowTitle || '',
        steps: formData.steps ? formData.steps.split('\n').filter((s: string) => s.trim()) : [],
        owner: formData.owner || '',
        metrics: formData.metrics || '',
      };
      onCompleteGate(gate.name, { workflow: workflowData });
    } else {
      onCompleteGate(gate.name, { notes: formData.notes });
    }
    setFormData({});
    setSelectedGate(null);
  };

  // ------------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------------

  if (!phaseContent) {
    return (
      <div className="text-center py-12" role="alert">
        <h2 className="text-2xl font-bold mb-2">Phase not found</h2>
        <p>Please select a valid phase (1-4)</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase Navigation */}
      <PhaseNavigation
        phase={phase}
        isPhaseAccessible={isPhaseAccessible}
        onPhaseChange={onPhaseChange}
      />

      {/* Module Progress Overview */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-semibold">Module 3 Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedGates.length}/{TOTAL_GATES_MODULE_3} Gates Completed
            </span>
          </div>
          <Progress value={(completedGates.length / TOTAL_GATES_MODULE_3) * 100} className="h-2" />
          {allGatesCompleted && !isSystemsArchitect && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg" role="status" aria-live="polite">
              <p className="text-sm font-medium text-center">
                Congratulations! You've completed all gates. You're now a Systems Architect!
              </p>
            </div>
          )}
          {isSystemsArchitect && (
            <div className="mt-4 p-4 bg-amber-500/10 rounded-lg flex items-center justify-center gap-2" role="status" aria-live="assertive">
              <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Systems Architect Badge Earned!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Locked State */}
      {!isPhaseAccessible && (
        <div className="rounded-lg border border-dashed bg-card text-card-foreground shadow-sm">
          <div className="p-12 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold mb-2">Phase {phase} is Locked</h3>
            <p className="text-muted-foreground">
              {phase === 2 && 'Complete all Phase 1 gates to unlock this phase.'}
              {phase === 3 && 'Complete all Phase 2 gates to unlock this phase.'}
              {phase === 4 && 'Complete all Phase 3 gates to unlock this phase.'}
            </p>
          </div>
        </div>
      )}

      {/* Phase Content */}
      {isPhaseAccessible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: ANIMATION_DURATION }}
          key={activeTab} // Force re-animation on tab change
        >
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{phaseContent.subtitle}</Badge>
                    <Badge variant="secondary">
                      {phaseGatesCompleted}/{phaseContent.gateCount} Gates
                    </Badge>
                  </div>
                  <h3 className="text-2xl mb-1 font-semibold">{phaseContent.title}</h3>
                  <p className="text-base text-muted-foreground">{phaseContent.description}</p>
                </div>
                <div className="hidden sm:block">
                  <Building2 className="h-12 w-12 text-amber-500/20" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={(v) => {
                setActiveTab(v as 'overview' | 'gate');
                if (v === 'gate' && selectedGate === null) {
                  // Select first incomplete gate
                  const firstIncomplete = phaseContent.gates.findIndex(g => !completedGates.includes(g.name));
                  setSelectedGate(firstIncomplete >= 0 ? firstIncomplete : 0);
                }
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Phase Overview</TabsTrigger>
                  <TabsTrigger value="gate">
                    Gates
                    {phaseGatesCompleted > 0 && (
                      <span className="ml-1 text-xs">({phaseGatesCompleted}/{phaseContent.gateCount})</span>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <PhaseOverview phase={phase} />
                </TabsContent>

                <TabsContent value="gate" className="space-y-4 mt-6">
                  {selectedGate !== null ? (
                    <PhaseGateContent
                      gate={phaseContent.gates[selectedGate]}
                      isCompleted={completedGates.includes(phaseContent.gates[selectedGate].name)}
                      formData={formData}
                      setFormData={setFormData}
                      onSubmit={() => handleGateSubmit(phaseContent.gates[selectedGate])}
                      onBack={() => setSelectedGate(null)}
                      bypassGates={bypassGatesEnabled}
                    />
                  ) : (
                    <PhaseGateList
                      gates={phaseContent.gates}
                      completedGates={completedGates}
                      onSelectGate={(index) => setSelectedGate(index)}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
