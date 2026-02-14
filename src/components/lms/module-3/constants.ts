/**
 * Module 3 Constants
 *
 * This file contains all magic numbers and configuration values for Module 3.
 * Extracted for maintainability and to eliminate magic numbers from components.
 */

// ============================================================================
// GATE & PHASE COUNTS
// ============================================================================

export const TOTAL_GATES_MODULE_3 = 15;
export const GATES_FOR_SYSTEMS_ARCHITECT = 15;
export const TOTAL_PHASES = 4;

// Phase gate counts
export const PHASE_1_GATE_COUNT = 3;
export const PHASE_2_GATE_COUNT = 4;
export const PHASE_3_GATE_COUNT = 4;
export const PHASE_4_GATE_COUNT = 4;

// Progress thresholds for phase unlocking
export const PROGRESS_PHASE_2_THRESHOLD = 3; // gates in phase 1
export const PROGRESS_PHASE_3_THRESHOLD = 7; // gates in phases 1+2
export const PROGRESS_PHASE_4_THRESHOLD = 11; // gates in phases 1+2+3

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

export const ANIMATION_DURATION = 0.3;
export const ANIMATION_STAGGER = 0.1;
export const BADGE_ANIMATION_DURATION = 0.5;

// ============================================================================
// PHASE DEFINITIONS
// ============================================================================

export const PHASES = [
  {
    number: 1,
    name: 'The Blueprint',
    days: 'Days 1-5',
    gateCount: PHASE_1_GATE_COUNT,
    description: 'Identify workflows, define triggers/outcomes, map steps',
    gates: ['workflow_identification', 'trigger_definition', 'step_mapping'],
  },
  {
    number: 2,
    name: 'Simplification',
    days: 'Days 6-12',
    gateCount: PHASE_2_GATE_COUNT,
    description: 'Essential filter, build checklists, create templates',
    gates: ['essential_filter', 'checklist_creation', 'template_building', 'simplification_review'],
  },
  {
    number: 3,
    name: 'Infrastructure',
    days: 'Days 13-20',
    gateCount: PHASE_3_GATE_COUNT,
    description: 'Owner assignment, repository, metrics definition',
    gates: ['owner_assignment', 'repository_setup', 'metrics_definition', 'infrastructure_review'],
  },
  {
    number: 4,
    name: 'Reality Test',
    days: 'Days 21-30',
    gateCount: PHASE_4_GATE_COUNT,
    description: 'Test runs, refine, finalize v1.0',
    gates: ['test_runs', 'refinement', 'finalization', 'systems_playbook_v1'],
  },
] as const;

// ============================================================================
// MODULE METADATA
// ============================================================================

export const MODULE_3_META = {
  id: 'module-3',
  title: 'Module 3: Develop Systems',
  subtitle: 'Build Scalable Systems & Processes',
  description: 'Transform your optimized workflows into documented, owned, and measurable systems that scale.',
  totalGates: TOTAL_GATES_MODULE_3,
  color: 'from-amber-500 to-orange-500',
} as const;

// ============================================================================
// PHASE CONTENT CONFIGURATION
// ============================================================================

export const PHASE_CONTENT = {
  1: {
    title: 'Phase 1: The Blueprint',
    subtitle: 'Days 1-5',
    description: 'Identify workflows, define triggers and outcomes, and map every step. Foundation for scalable systems.',
    gateCount: PHASE_1_GATE_COUNT,
    gates: [
      {
        name: 'workflow_identification',
        label: 'Workflow Identification',
        day: 1,
        description: 'Identify 3 workflows to systemize. Choose recurring, high-impact processes.',
      },
      {
        name: 'trigger_definition',
        label: 'Trigger Definition',
        day: 3,
        description: 'Define clear start triggers and desired outcomes for each workflow.',
      },
      {
        name: 'step_mapping',
        label: 'Step Mapping',
        day: 5,
        description: 'Map every step from trigger to outcome. Include decision points and handoffs.',
      },
    ],
  },
  2: {
    title: 'Phase 2: Simplification',
    subtitle: 'Days 6-12',
    description: 'Apply essential filter, build checklists, and create templates. Make systems foolproof.',
    gateCount: PHASE_2_GATE_COUNT,
    gates: [
      {
        name: 'essential_filter',
        label: 'Essential Filter',
        day: 6,
        description: 'Apply Pareto Principle. Identify 20% of steps that drive 80% of results.',
      },
      {
        name: 'checklist_creation',
        label: 'Checklist Creation',
        day: 8,
        description: 'Build bulletproof checklists for each workflow. No steps left to memory.',
      },
      {
        name: 'template_building',
        label: 'Template Building',
        day: 10,
        description: 'Create reusable templates for recurring workflow components.',
      },
      {
        name: 'simplification_review',
        label: 'Simplification Review',
        day: 12,
        description: 'Review and validate simplified workflows. Test with real scenarios.',
      },
    ],
  },
  3: {
    title: 'Phase 3: Infrastructure',
    subtitle: 'Days 13-20',
    description: 'Assign ownership, set up repository, and define metrics. Build for long-term success.',
    gateCount: PHASE_3_GATE_COUNT,
    gates: [
      {
        name: 'owner_assignment',
        label: 'Owner Assignment',
        day: 13,
        description: 'Assign clear owner for each system. Define accountability and review process.',
      },
      {
        name: 'repository_setup',
        label: 'Repository Setup',
        day: 15,
        description: 'Create central repository for systems. Ensure accessibility and version control.',
      },
      {
        name: 'metrics_definition',
        label: 'Metrics Definition',
        day: 17,
        description: 'Define success metrics and measurement systems for each workflow.',
      },
      {
        name: 'infrastructure_review',
        label: 'Infrastructure Review',
        day: 20,
        description: 'Review ownership, repository, and metrics. Validate infrastructure readiness.',
      },
    ],
  },
  4: {
    title: 'Phase 4: Reality Test',
    subtitle: 'Days 21-30',
    description: 'Test systems in real conditions, refine based on feedback, and finalize v1.0 of your Systems Playbook.',
    gateCount: PHASE_4_GATE_COUNT,
    gates: [
      {
        name: 'test_runs',
        label: 'Test Runs',
        day: 21,
        description: 'Run each system through real scenarios. Document failures and friction points.',
      },
      {
        name: 'refinement',
        label: 'Refinement',
        day: 24,
        description: 'Refine systems based on test results. Simplify further where possible.',
      },
      {
        name: 'finalization',
        label: 'Finalization',
        day: 27,
        description: 'Finalize all 3 workflows. Complete documentation and handoff materials.',
      },
      {
        name: 'systems_playbook_v1',
        label: 'Systems Playbook v1.0',
        day: 30,
        description: 'Compile Systems Playbook v1.0 with all workflows, checklists, and templates.',
      },
    ],
  },
} as const;
