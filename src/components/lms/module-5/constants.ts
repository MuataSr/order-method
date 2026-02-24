import { Trophy, Target, Clock, Calendar, Shield, Award, Zap } from 'lucide-react';

export const MODULE_5_META = {
  id: 'module-5',
  title: 'Module 5: Replace Yourself & Review',
  subtitle: 'The Path to the 2-Day Work Week',
  description: 'This 30-day capstone project is where founders prove they have successfully extracted themselves from daily operations. Focus on redefining the founder role, establishing a 4-day work week, building monitoring dashboards, and mapping the path to a 2-day work week.',
  totalDays: 30,
  totalGates: 12,
  icon: Trophy,
  color: 'from-emerald-500 to-teal-500',
  badgeName: 'Freedom Founder',
  badgeIcon: Trophy,
};

export const PHASES_MODULE_5 = [
  {
    number: 1,
    name: 'Redefine Role & Week',
    days: 'Days 1-7',
    description: 'Identify your unique value and design your ideal schedule',
    gates: [
      { name: 'founder_value_audit', label: 'Founder Value Audit', day: 2 },
      { name: 'themed_schedule', label: 'Themed Schedule', day: 4 },
      { name: 'ideal_calendar', label: 'Ideal Calendar', day: 7 },
    ],
    gateCount: 3,
  },
  {
    number: 2,
    name: 'Handoff & Boundaries',
    days: 'Days 8-15',
    description: 'Execute delegation and set communication boundaries',
    gates: [
      { name: 'delegation_roadmap', label: 'Delegation Roadmap', day: 10 },
      { name: 'handoff_confirmation', label: 'Handoff Confirmation', day: 13 },
      { name: 'communication_policy', label: 'Communication Policy', day: 15 },
    ],
    gateCount: 3,
  },
  {
    number: 3,
    name: 'Dashboard & Reviews',
    days: 'Days 16-23',
    description: 'Build monitoring systems and establish review rhythms',
    gates: [
      { name: 'founder_dashboard', label: 'Founder Dashboard', day: 18 },
      { name: 'review_calendar', label: 'Review Calendar', day: 21 },
      { name: 'role_description', label: 'Role Description', day: 23 },
    ],
    gateCount: 3,
  },
  {
    number: 4,
    name: 'Test & Lock In',
    days: 'Days 24-30',
    description: 'Test the 4-day week and create the 2-day roadmap',
    gates: [
      { name: 'test_week_log', label: 'Test Week Log', day: 27 },
      { name: 'final_adjustments', label: 'Final Adjustments', day: 29 },
      { name: 'freedom_commitment', label: 'Freedom Commitment', day: 30 },
    ],
    gateCount: 3,
  },
];

export const ALL_GATES_MODULE_5 = PHASES_MODULE_5.flatMap(phase => phase.gates);

export const TOTAL_GATES_MODULE_5 = MODULE_5_META.totalGates;

export const GATES_FOR_FREEDOM_FOUNDER = TOTAL_GATES_MODULE_5;

export const ANIMATION_DURATION = 0.3;
export const ANIMATION_STAGGER = 0.1;
export const BADGE_ANIMATION_DURATION = 0.6;

export const MODULE_5_FINAL_ASSESSMENT = [
  {
    question: "Which activities should appear on your 'Only You' list?",
    options: [
      "All tasks you currently do",
      "3-5 highest-value activities that uniquely require your expertise",
      "Tasks that generate the most revenue",
      "Tasks you enjoy the most",
    ],
    correctAnswer: 1,
    explanation: "The 'Only You' list should be SHORT and focused on irreplaceable contributions.",
  },
  {
    question: "Why assign themes to each work day?",
    options: [
      "To make the schedule look organized",
      "To create predictable focus and reduce context-switching",
      "To fill all available time",
      "To impress the team",
    ],
    correctAnswer: 1,
    explanation: "Themed days reduce cognitive load and improve deep work by batching similar activities.",
  },
  {
    question: "What is the purpose of the Communication Policy?",
    options: [
      "To reduce the founder's workload",
      "To set clear expectations about when you're available for decisions",
      "To avoid team questions",
      "To create hierarchy",
    ],
    correctAnswer: 1,
    explanation: "Clear availability boundaries enable team autonomy while preserving founder focus time.",
  },
  {
    question: "How many key metrics should the Founder Dashboard track?",
    options: [
      "As many as possible",
      "5-7 key health metrics across business categories",
      "Only revenue metrics",
      "Just one metric",
    ],
    correctAnswer: 1,
    explanation: "5-7 metrics provide comprehensive visibility without overwhelming detail.",
  },
  {
    question: "What is the ultimate goal of the O.R.D.E.R. Framework?",
    options: [
      "To work 4 days per week forever",
      "To achieve a 2-day work week in the business",
      "To eliminate all work",
      "To hire more employees",
    ],
    correctAnswer: 1,
    explanation: "The 4-day week is a milestone on the path to a sustainable 2-day work week.",
  },
];

export const MODULE_5_LEARNING_OBJECTIVES = [
  'Identify and protect the 3-5 highest-value activities only the founder can do',
  'Design and implement a sustainable 4-day themed work week',
  'Execute final delegation of tasks with proper handoff protocols',
  'Build a founder dashboard for managing by metrics rather than presence',
  'Establish weekly and monthly review rhythms for business oversight',
  'Create a roadmap from 4-day to 2-day work week in the business',
];

export const MODULE_5_OUTCOMES = [
  {
    title: 'Extraction',
    description: 'Successfully removed from daily operations',
    icon: Zap,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Freedom',
    description: '4-day work week established and tested',
    icon: Trophy,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  {
    title: 'Roadmap',
    description: 'Clear path to 2-day work week defined',
    icon: Target,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
];

export const DAY_THEMES = [
  { value: 'ceo', label: 'CEO Day', description: 'Strategy, vision, big decisions' },
  { value: 'sales', label: 'Sales Day', description: 'Business development, client calls' },
  { value: 'delivery', label: 'Delivery Day', description: 'Client work, project execution' },
  { value: 'systems', label: 'Systems Day', description: 'Process improvement, team development' },
  { value: 'creative', label: 'Creative Day', description: 'Content, innovation, new ideas' },
  { value: 'admin', label: 'Admin Day', description: 'Email, paperwork, catch-up' },
  { value: 'off', label: 'Off Day', description: 'Non-work / rest day' },
];

export const DASHBOARD_METRIC_CATEGORIES = [
  { value: 'revenue', label: 'Revenue/Pipeline', icon: '💰' },
  { value: 'delivery', label: 'Delivery/Client Health', icon: '📦' },
  { value: 'team', label: 'Team/Capacity', icon: '👥' },
  { value: 'cash', label: 'Cash/Profit', icon: '💵' },
  { value: 'growth', label: 'Growth/Leads', icon: '📈' },
  { value: 'productivity', label: 'Productivity/Systems', icon: '⚙️' },
  { value: 'custom', label: 'Custom Metric', icon: '🔧' },
];

export const TIME_BLOCKS = [
  { id: 'early-morning', label: 'Early Morning', time: '6:00 AM - 9:00 AM' },
  { id: 'late-morning', label: 'Late Morning', time: '9:00 AM - 12:00 PM' },
  { id: 'early-afternoon', label: 'Early Afternoon', time: '12:00 PM - 3:00 PM' },
  { id: 'late-afternoon', label: 'Late Afternoon', time: '3:00 PM - 6:00 PM' },
  { id: 'evening', label: 'Evening', time: '6:00 PM - 9:00 PM' },
];

export const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday', short: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'thursday', label: 'Thursday', short: 'Thu' },
  { id: 'friday', label: 'Friday', short: 'Fri' },
  { id: 'saturday', label: 'Saturday', short: 'Sat' },
  { id: 'sunday', label: 'Sunday', short: 'Sun' },
];
