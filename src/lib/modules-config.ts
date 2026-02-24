import { Calendar, Search, Building2, Users, Trophy, LucideIcon } from 'lucide-react';

export interface GateConfig {
  name: string;
  label: string;
  phase: number;
  expectedDays?: number;
}

export interface PhaseConfig {
  number: number;
  name: string;
  gates: GateConfig[];
}

export interface ModuleConfig {
  id: number;
  dbName: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  color: string;
  totalGates: number;
  phases: PhaseConfig[];
}

export const MODULES: ModuleConfig[] = [
  {
    id: 1,
    dbName: 'MODULE_1',
    name: 'Module 1: Own Your Clock',
    shortName: 'Own Your Clock',
    description: 'Time Mastery for Agency Owners',
    icon: Calendar,
    color: 'from-blue-500 to-purple-500',
    totalGates: 10,
    phases: [
      {
        number: 1,
        name: 'Baseline',
        gates: [
          { name: 'baseline_entry', label: 'Baseline Entry', phase: 1, expectedDays: 1 },
          { name: 'task_inventory', label: 'Task Inventory', phase: 1, expectedDays: 2 },
          { name: 'time_log', label: 'Time Log', phase: 1, expectedDays: 2 },
        ],
      },
      {
        number: 2,
        name: 'Analysis',
        gates: [
          { name: 'time_audit', label: 'Time Audit', phase: 2, expectedDays: 2 },
          { name: 'priority_matrix', label: 'Priority Matrix', phase: 2, expectedDays: 2 },
        ],
      },
      {
        number: 3,
        name: 'Planning',
        gates: [
          { name: 'weekly_schedule', label: 'Weekly Schedule', phase: 3, expectedDays: 2 },
          { name: 'daily_rhythm', label: 'Daily Rhythm', phase: 3, expectedDays: 2 },
        ],
      },
      {
        number: 4,
        name: 'Execution',
        gates: [
          { name: 'day1_execution', label: 'Day 1 Execution', phase: 4, expectedDays: 1 },
          { name: 'day2_execution', label: 'Day 2 Execution', phase: 4, expectedDays: 1 },
          { name: 'weekly_review', label: 'Weekly Review', phase: 4, expectedDays: 1 },
        ],
      },
    ],
  },
  {
    id: 2,
    dbName: 'MODULE_2',
    name: 'Module 2: Review What Works',
    shortName: 'Review What Works',
    description: 'Workflow Analysis & Optimization',
    icon: Search,
    color: 'from-emerald-500 to-teal-500',
    totalGates: 10,
    phases: [
      {
        number: 1,
        name: 'Audit',
        gates: [
          { name: 'workflow_audit', label: 'Workflow Audit', phase: 1, expectedDays: 2 },
          { name: 'bottleneck_analysis', label: 'Bottleneck Analysis', phase: 1, expectedDays: 2 },
          { name: 'tool_assessment', label: 'Tool Assessment', phase: 1, expectedDays: 2 },
        ],
      },
      {
        number: 2,
        name: 'Analyze',
        gates: [
          { name: 'time_tracking', label: 'Time Tracking', phase: 2, expectedDays: 2 },
          { name: 'process_mapping', label: 'Process Mapping', phase: 2, expectedDays: 2 },
        ],
      },
      {
        number: 3,
        name: 'Optimize',
        gates: [
          { name: 'automation_plan', label: 'Automation Plan', phase: 3, expectedDays: 2 },
          { name: 'delegation_matrix', label: 'Delegation Matrix', phase: 3, expectedDays: 2 },
        ],
      },
      {
        number: 4,
        name: 'Implement',
        gates: [
          { name: 'quick_wins', label: 'Quick Wins', phase: 4, expectedDays: 2 },
          { name: 'optimization_log', label: 'Optimization Log', phase: 4, expectedDays: 2 },
          { name: 'review_summary', label: 'Review Summary', phase: 4, expectedDays: 1 },
        ],
      },
    ],
  },
  {
    id: 3,
    dbName: 'MODULE_3',
    name: 'Module 3: Develop Systems',
    shortName: 'Develop Systems',
    description: 'Build Scalable Systems & Processes',
    icon: Building2,
    color: 'from-amber-500 to-orange-500',
    totalGates: 15,
    phases: [
      {
        number: 1,
        name: 'Foundation',
        gates: [
          { name: 'system_audit', label: 'System Audit', phase: 1, expectedDays: 2 },
          { name: 'process_documentation', label: 'Process Documentation', phase: 1, expectedDays: 3 },
          { name: 'template_creation', label: 'Template Creation', phase: 1, expectedDays: 2 },
          { name: 'checklist_design', label: 'Checklist Design', phase: 1, expectedDays: 2 },
        ],
      },
      {
        number: 2,
        name: 'Build',
        gates: [
          { name: 'sop_creation', label: 'SOP Creation', phase: 2, expectedDays: 3 },
          { name: 'workflow_automation', label: 'Workflow Automation', phase: 2, expectedDays: 3 },
          { name: 'tool_integration', label: 'Tool Integration', phase: 2, expectedDays: 2 },
          { name: 'quality_control', label: 'Quality Control', phase: 2, expectedDays: 2 },
        ],
      },
      {
        number: 3,
        name: 'Test',
        gates: [
          { name: 'pilot_testing', label: 'Pilot Testing', phase: 3, expectedDays: 3 },
          { name: 'feedback_collection', label: 'Feedback Collection', phase: 3, expectedDays: 2 },
          { name: 'iteration_log', label: 'Iteration Log', phase: 3, expectedDays: 2 },
        ],
      },
      {
        number: 4,
        name: 'Launch',
        gates: [
          { name: 'system_documentation', label: 'System Documentation', phase: 4, expectedDays: 2 },
          { name: 'training_materials', label: 'Training Materials', phase: 4, expectedDays: 2 },
          { name: 'launch_checklist', label: 'Launch Checklist', phase: 4, expectedDays: 1 },
          { name: 'success_metrics', label: 'Success Metrics', phase: 4, expectedDays: 1 },
        ],
      },
    ],
  },
  {
    id: 4,
    dbName: 'MODULE_4',
    name: 'Module 4: Educate & Empower Teams',
    shortName: 'Educate & Empower',
    description: 'Transition Operational Control to Your Team',
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
    totalGates: 10,
    phases: [
      {
        number: 1,
        name: 'Align & Train',
        gates: [
          { name: 'vision_statement', label: 'Vision Statement', phase: 1, expectedDays: 1 },
          { name: 'calendar_confirmation', label: 'Calendar Confirmation', phase: 1, expectedDays: 1 },
          { name: 'training_notes', label: 'Training Notes', phase: 1, expectedDays: 2 },
          { name: 'roles_table', label: 'Roles Table', phase: 1, expectedDays: 3 },
        ],
      },
      {
        number: 2,
        name: 'Practice & Feedback',
        gates: [
          { name: 'pass_fail_log', label: 'Pass/Fail Log', phase: 2, expectedDays: 2 },
          { name: 'feedback_submission', label: 'Feedback Submission', phase: 2, expectedDays: 1 },
          { name: 'sop_upgrade', label: 'SOP Upgrade v1.1', phase: 2, expectedDays: 2 },
          { name: 'win_documentation', label: 'Win Documentation', phase: 2, expectedDays: 1 },
        ],
      },
      {
        number: 3,
        name: 'Empower & Stabilize',
        gates: [
          { name: 'decision_matrix', label: 'Decision Matrix', phase: 3, expectedDays: 2 },
          { name: 'weekly_rhythm_calendar', label: 'Weekly Rhythm Calendar', phase: 3, expectedDays: 2 },
        ],
      },
    ],
  },
  {
    id: 5,
    dbName: 'MODULE_5',
    name: 'Module 5: Results & Celebrate',
    shortName: 'Results & Celebrate',
    description: 'Final Phase & 4-Day Week Celebration',
    icon: Trophy,
    color: 'from-emerald-500 to-teal-500',
    totalGates: 12,
    phases: [
      {
        number: 1,
        name: 'Validate',
        gates: [
          { name: 'metrics_dashboard', label: 'Metrics Dashboard', phase: 1, expectedDays: 2 },
          { name: 'baseline_comparison', label: 'Baseline Comparison', phase: 1, expectedDays: 2 },
          { name: 'roi_calculation', label: 'ROI Calculation', phase: 1, expectedDays: 2 },
        ],
      },
      {
        number: 2,
        name: 'Document',
        gates: [
          { name: 'case_study', label: 'Case Study', phase: 2, expectedDays: 3 },
          { name: 'testimonials', label: 'Testimonials', phase: 2, expectedDays: 2 },
          { name: 'lessons_learned', label: 'Lessons Learned', phase: 2, expectedDays: 2 },
        ],
      },
      {
        number: 3,
        name: 'Celebrate',
        gates: [
          { name: 'celebration_plan', label: 'Celebration Plan', phase: 3, expectedDays: 1 },
          { name: 'team_recognition', label: 'Team Recognition', phase: 3, expectedDays: 1 },
          { name: 'success_story', label: 'Success Story', phase: 3, expectedDays: 2 },
        ],
      },
      {
        number: 4,
        name: 'Transition',
        gates: [
          { name: '4_day_week_plan', label: '4-Day Week Plan', phase: 4, expectedDays: 2 },
          { name: 'maintenance_system', label: 'Maintenance System', phase: 4, expectedDays: 2 },
          { name: 'final_assessment', label: 'Final Assessment', phase: 4, expectedDays: 1 },
        ],
      },
    ],
  },
];

export function getModuleById(id: number): ModuleConfig | undefined {
  return MODULES.find(m => m.id === id);
}

export function getModuleByDbName(dbName: string): ModuleConfig | undefined {
  return MODULES.find(m => m.dbName === dbName);
}

export function getGateByModuleAndName(moduleId: number, gateName: string): GateConfig | undefined {
  const module = getModuleById(moduleId);
  if (!module) return undefined;
  
  for (const phase of module.phases) {
    const gate = phase.gates.find(g => g.name === gateName);
    if (gate) return gate;
  }
  return undefined;
}

export const TOTAL_GATES_ALL_MODULES = MODULES.reduce((sum, m) => sum + m.totalGates, 0);
