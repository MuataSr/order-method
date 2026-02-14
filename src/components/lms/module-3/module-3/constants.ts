// ============================================================================
// MODULE 3: DEVELOP SYSTEMS - Constants and Configuration
// ============================================================================

// Phase Configuration
export const TOTAL_PHASES = 4;
export const TOTAL_GATES = 15;

export interface Gate {
  name: string;
  label: string;
  day: number;
  description: string;
}

export interface PhaseConfig {
  number: number;
  name: string;
  days: string;
  description: string;
  gates: Gate[];
  gateCount: number;
}

export const PHASES: PhaseConfig[] = [
  {
    number: 1,
    name: 'The Blueprint',
    days: 'Days 1-5',
    description: 'Identify workflows, define triggers and outcomes, and map every step. Foundation for scalable systems.',
    gates: [
      { name: 'workflow_identification', label: 'Workflow Identification', day: 1, description: 'Identify 3 workflows to systemize. Choose recurring, high-impact processes.' },
      { name: 'trigger_definition', label: 'Trigger Definition', day: 3, description: 'Define clear start triggers and desired outcomes for each workflow.' },
      { name: 'step_mapping', label: 'Step Mapping', day: 5, description: 'Map every step from trigger to outcome. Include decision points and handoffs.' },
    ],
    gateCount: 3,
  },
  {
    number: 2,
    name: 'Simplification',
    days: 'Days 6-12',
    description: 'Apply essential filter, build checklists, and create templates. Make systems foolproof.',
    gates: [
      { name: 'essential_filter', label: 'Essential Filter', day: 6, description: 'Apply Pareto Principle. Identify 20% of steps that drive 80% of results.' },
      { name: 'checklist_creation', label: 'Checklist Creation', day: 8, description: 'Build bulletproof checklists for each workflow. No steps left to memory.' },
      { name: 'template_building', label: 'Template Building', day: 10, description: 'Create reusable templates for recurring workflow components.' },
      { name: 'simplification_review', label: 'Simplification Review', day: 12, description: 'Review and validate simplified workflows. Test with real scenarios.' },
    ],
    gateCount: 4,
  },
  {
    number: 3,
    name: 'Infrastructure',
    days: 'Days 13-20',
    description: 'Assign ownership, set up repository, and define metrics. Build for long-term success.',
    gates: [
      { name: 'owner_assignment', label: 'Owner Assignment', day: 13, description: 'Assign clear owner for each system. Define accountability and review process.' },
      { name: 'repository_setup', label: 'Repository Setup', day: 15, description: 'Create central repository for systems. Ensure accessibility and version control.' },
      { name: 'metrics_definition', label: 'Metrics Definition', day: 17, description: 'Define success metrics and measurement systems for each workflow.' },
      { name: 'infrastructure_review', label: 'Infrastructure Review', day: 20, description: 'Review ownership, repository, and metrics. Validate infrastructure readiness.' },
    ],
    gateCount: 4,
  },
  {
    number: 4,
    name: 'Reality Test',
    days: 'Days 21-30',
    description: 'Test systems in real conditions, refine based on feedback, and finalize v1.0 of your Systems Playbook.',
    gates: [
      { name: 'test_runs', label: 'Test Runs', day: 21, description: 'Run each system through real scenarios. Document failures and friction points.' },
      { name: 'refinement', label: 'Refinement', day: 24, description: 'Refine systems based on test results. Simplify further where possible.' },
      { name: 'finalization', label: 'Finalization', day: 27, description: 'Finalize all 3 workflows. Complete documentation and handoff materials.' },
      { name: 'systems_playbook_v1', label: 'Systems Playbook v1.0', day: 30, description: 'Compile Systems Playbook v1.0 with all workflows, checklists, and templates.' },
    ],
    gateCount: 4,
  },
];

// Progress thresholds for phase unlocking
export const PHASE_UNLOCK_THRESHOLDS = {
  1: 0, // Phase 1 starts unlocked
  2: 3, // Need all 3 Phase 1 gates
  3: 7, // Need all 4 Phase 2 gates
  4: 11, // Need all 4 Phase 3 gates
};

// Animation durations (ms)
export const ANIMATION_DURATION = {
  PHASE_TRANSITION: 300,
  BADGE_ANIMATION: 500,
  PROGRESS_UPDATE: 150,
};

// Module metadata
export const MODULE_3_META = {
  id: 'module-3',
  title: 'Module 3: Develop Systems',
  subtitle: 'Build Scalable Systems & Processes',
  description: 'Transform your optimized workflows into documented, owned, and measurable systems that scale.',
  totalGates: TOTAL_GATES,
  icon: Building2,
  color: 'from-amber-500 to-orange-500',
};

// Gate name constants
export const GATE_NAMES = {
  WORKFLOW_IDENTIFICATION: 'Workflow Identification',
  TRIGGER_DEFINITION: 'Trigger Definition',
  STEP_MAPPING: 'Step Mapping',
  ESSENTIAL_FILTER: 'Essential Filter',
  CHECKLIST_CREATION: 'Checklist Creation',
  TEMPLATE_BUILDING: 'Template Building',
  SIMPLIFICATION_REVIEW: 'Simplification Review',
  OWNER_ASSIGNMENT: 'Owner Assignment',
  REPOSITORY_SETUP: 'Repository Setup',
  METRICS_DEFINITION: 'Metrics Definition',
  INFRASTRUCTURE_REVIEW: 'Infrastructure Review',
  TEST_RUNS: 'Test Runs',
  REFINEMENT: 'Refinement',
  FINALIZATION: 'Finalization',
  SYSTEMS_PLAYBOOK_V1: 'Systems Playbook v1.0',
} as const;
