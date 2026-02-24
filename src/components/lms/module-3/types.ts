/**
 * Module 3 Type Definitions
 *
 * This file contains all TypeScript type definitions for Module 3 components.
 * Centralized typing eliminates 'any' types and provides type safety throughout.
 */

import { SystemsPlaybookWorkflow } from '@/lib/stores/course-store';

// ============================================================================
// GATE SUBMISSION TYPES
// ============================================================================

/**
 * Data submitted when completing a gate
 * @property workflow - Optional workflow data for Systems Playbook gates
 * @property notes - Optional notes or responses for gate completion
 * @property workflowTitle - Title of the workflow being documented
 * @property steps - Workflow steps (array or newline-separated string)
 * @property owner - Person or team responsible for the workflow
 * @property metrics - Success metrics for the workflow
 */
export interface GateSubmissionData {
  workflow?: SystemsPlaybookWorkflow;
  notes?: string;
  workflowTitle?: string;
  steps?: string | string[];
  owner?: string;
  metrics?: string;
  [key: string]: string | string[] | SystemsPlaybookWorkflow | undefined;
}

/**
 * Form data for gate submission forms
 * Used in Module3PhaseView for collecting user input
 */
export interface GateFormData {
  workflowTitle?: string;
  steps?: string;
  owner?: string;
  metrics?: string;
  notes?: string;
  [key: string]: string | undefined;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for Module3PhaseView component
 * @property phase - Current phase number (1-4)
 * @property completedGates - Array of completed gate names
 * @property onCompleteGate - Callback when a gate is completed
 * @property onPhaseChange - Callback when phase changes
 * @property isSystemsArchitect - Whether user has earned Systems Architect badge
 * @property phase1Complete - Whether Phase 1 is complete
 * @property phase2Complete - Whether Phase 2 is complete
 * @property phase3Complete - Whether Phase 3 is complete
 */
export interface Module3PhaseViewProps {
  phase: number;
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => void;
  onPhaseChange: (phase: number) => void;
  isSystemsArchitect: boolean;
  phase1Complete: boolean;
  phase2Complete: boolean;
  phase3Complete: boolean;
}

// ============================================================================
// PHASE CONTENT TYPES
// ============================================================================

/**
 * Gate definition within a phase
 */
export interface PhaseGate {
  name: string;
  label: string;
  day: number;
  description: string;
}

/**
 * Phase content configuration
 */
export interface PhaseContent {
  title: string;
  subtitle: string;
  description: string;
  gateCount: number;
  gates: PhaseGate[];
}

/**
 * Phase definition
 */
export interface PhaseDefinition {
  number: number;
  name: string;
  days: string;
  gateCount: number;
  description: string;
  gates: string[];
}

// ============================================================================
// GATE LIST VIEW TYPES
// ============================================================================

/**
 * Props for GateListView component
 */
export interface GateListViewProps {
  gates: readonly PhaseGate[];
  completedGates: string[];
  onSelectGate: (index: number) => void;
}

// ============================================================================
// GATE CONTENT VIEW TYPES
// ============================================================================

/**
 * Props for GateContentView component
 */
export interface GateContentViewProps {
  gate: PhaseGate;
  isCompleted: boolean;
  formData: GateFormData;
  setFormData: (data: GateFormData) => void;
  onSubmit: () => void;
  onBack: () => void;
}

// ============================================================================
// LEARN CONTENT TYPES
// ============================================================================

/**
 * Props for LearnContent component
 */
export interface LearnContentProps {
  phase: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Result of gate parsing operation
 */
export type ParsedGates = string[];

/**
 * Phase completion status
 */
export type PhaseCompletionStatus = 'locked' | 'unlocked' | 'completed';
