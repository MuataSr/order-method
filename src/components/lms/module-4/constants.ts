import { Users, Target, MessageSquare, Shield, Calendar, Award } from 'lucide-react';

export const MODULE_4_META = {
  id: 'module-4',
  title: 'Module 4: Educate & Empower Teams',
  subtitle: 'Transition Operational Control to Your Team',
  description: 'This 21-day sprint transitions operational control to your team so they can run systems without founder intervention. Focus shifts from creation to deployment, ensuring systems are understood, practiced, and owned by team members with clear decision-making boundaries.',
  totalDays: 21,
  totalGates: 10,
  icon: Users,
  color: 'from-indigo-500 to-purple-500',
  badgeName: 'Team Champion',
  badgeIcon: Users,
};

export const PHASES_MODULE_4 = [
  {
    number: 1,
    name: 'Align & Train',
    days: 'Days 1-7',
    description: 'Build buy-in, conduct training, and assign ownership',
    gates: [
      { name: 'vision_statement', label: 'Vision Statement', day: 1 },
      { name: 'calendar_confirmation', label: 'Calendar Confirmation', day: 2 },
      { name: 'training_notes', label: 'Training Notes', day: 4 },
      { name: 'roles_table', label: 'Roles Table', day: 7 },
    ],
    gateCount: 4,
  },
  {
    number: 2,
    name: 'Practice & Feedback',
    days: 'Days 8-14',
    description: 'Test team independence and refine based on feedback',
    gates: [
      { name: 'pass_fail_log', label: 'Pass/Fail Log', day: 10 },
      { name: 'feedback_submission', label: 'Feedback Submission', day: 11 },
      { name: 'sop_upgrade', label: 'SOP Upgrade v1.1', day: 13 },
      { name: 'win_documentation', label: 'Win Documentation', day: 14 },
    ],
    gateCount: 4,
  },
  {
    number: 3,
    name: 'Empower & Stabilize',
    days: 'Days 15-21',
    description: 'Set decision boundaries and establish weekly rhythms',
    gates: [
      { name: 'decision_matrix', label: 'Decision Matrix', day: 17 },
      { name: 'weekly_rhythm_calendar', label: 'Weekly Rhythm Calendar', day: 19 },
      { name: 'team_empowerment_audit', label: 'Team Empowerment Audit', day: 21 },
    ],
    gateCount: 2,
  },
];

export const ALL_GATES_MODULE_4 = PHASES_MODULE_4.flatMap(phase => phase.gates);

export const TOTAL_GATES_MODULE_4 = MODULE_4_META.totalGates;

export const GATES_FOR_TEAM_CHAMPION = TOTAL_GATES_MODULE_4;

export const ANIMATION_DURATION = 0.3;
export const ANIMATION_STAGGER = 0.1;
export const BADGE_ANIMATION_DURATION = 0.6;

export const MODULE_4_FINAL_ASSESSMENT = [
  {
    question: "Why is the 'Why' Narrative essential before training the team?",
    options: [
      "To justify the founder's decisions",
      "To prevent systems from feeling like policing rather than empowerment",
      "To create formal documentation",
      "To satisfy HR requirements",
    ],
    correctAnswer: 1,
    explanation: "Systems fail when teams feel policed. A clear 'why' builds buy-in and reduces resistance.",
  },
  {
    question: "What should you do during the Hands-Off Test (Days 8-10)?",
    options: [
      "Intervene at the first sign of trouble",
      "Observe without intervening unless there is a catastrophe",
      "Take over when mistakes happen",
      "Skip the test if you're busy",
    ],
    correctAnswer: 1,
    explanation: "The test is meaningless if you intervene. Learning requires space to make and correct mistakes.",
  },
  {
    question: "What is the purpose of the Decision Matrix?",
    options: [
      "To document all possible decisions",
      "To define what the team can decide vs. when they must escalate",
      "To limit team authority",
      "To create approval bottlenecks",
    ],
    correctAnswer: 1,
    explanation: "Clear boundaries enable confident decision-making without constant founder involvement.",
  },
  {
    question: "Why celebrate a 'System Win' on Day 14?",
    options: [
      "To make the team feel good",
      "To reinforce the behavior you want to see more of",
      "To mark the halfway point",
      "To compare with other teams",
    ],
    correctAnswer: 1,
    explanation: "Recognition shapes behavior. Celebrating wins signals what success looks like.",
  },
  {
    question: "What belongs in the weekly meeting agenda?",
    options: [
      "Only problems and issues",
      "Quick wins, key metrics, issues, and improvements",
      "Founder's announcements only",
      "A review of all systems every week",
    ],
    correctAnswer: 1,
    explanation: "Balanced agendas maintain momentum (wins), accountability (metrics), and improvement (issues + fixes).",
  },
];

export const MODULE_4_LEARNING_OBJECTIVES = [
  'Articulate a compelling narrative for why systems benefit everyone',
  'Design and deliver effective team training sessions',
  'Assign clear roles and responsibilities with accountability',
  'Create feedback mechanisms for continuous improvement',
  'Define decision boundaries that empower without creating risk',
  'Establish sustainable weekly rhythms for system maintenance',
];

export const MODULE_4_OUTCOMES = [
  {
    title: 'Buy-In',
    description: 'Team understands and believes in the systems approach',
    icon: Target,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    title: 'Ownership',
    description: 'Clear owners with accountability for every system',
    icon: Shield,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Rhythm',
    description: 'Sustainable weekly cadence for continuous improvement',
    icon: Calendar,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
];
