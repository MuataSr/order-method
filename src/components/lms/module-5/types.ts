export interface GateSubmissionData {
  founderValueAudit?: FounderValueAudit;
  themedSchedule?: ThemedScheduleEntry[];
  idealCalendar?: {
    confirmed: boolean;
    details: string;
  };
  delegationRoadmap?: DelegationItem[];
  handoffConfirmation?: HandoffItem[];
  communicationPolicy?: string;
  founderDashboard?: DashboardMetric[];
  reviewCalendar?: ReviewCalendarData;
  roleDescription?: RoleDescription;
  testWeekLog?: TestDayLog[];
  finalAdjustments?: string;
  freedomCommitment?: FreedomCommitment;
}

export interface FounderValueAudit {
  onlyYouTasks: string[];
  delegatedTasks: string[];
}

export interface ThemedScheduleEntry {
  day: string;
  theme: string;
  isOffDay: boolean;
}

export interface DelegationItem {
  task: string;
  newOwner: string;
  trainingNeeded: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface HandoffItem {
  systemName: string;
  handedOffTo: string;
  handoffDate: string;
  confirmed: boolean;
}

export interface DashboardMetric {
  id: string;
  name: string;
  category: string;
  currentValue?: string;
  targetValue?: string;
  dataSource: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface ReviewCalendarData {
  weeklyReviewDay: string;
  weeklyReviewTime: string;
  monthlyReviewDay: string;
  monthlyReviewTime: string;
  confirmed: boolean;
}

export interface RoleDescription {
  responsibleFor: string[];
  noLongerResponsibleFor: string[];
  signedAt: string;
}

export interface TestDayLog {
  date: string;
  isWorkDay: boolean;
  plannedActivities: string;
  actualActivities: string;
  slippedIntoOldHabits: boolean;
  notes: string;
}

export interface FreedomCommitment {
  targetDate2DayWeek: string;
  stepsTo3Days: string;
  stepsTo2Days: string;
  signedAt: string;
}

export interface PhaseProgress {
  phase: number;
  gatesCompleted: number;
  totalGates: number;
  isComplete: boolean;
}
