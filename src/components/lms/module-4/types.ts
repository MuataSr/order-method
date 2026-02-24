export interface GateSubmissionData {
  visionStatement?: string;
  calendarConfirmation?: string;
  trainingNotes?: TrainingNotes;
  rolesTable?: RoleAssignment[];
  passFailLog?: SystemTest[];
  feedback?: FeedbackItem[];
  sopUpgrade?: {
    fileName: string;
    fileUrl: string;
    changes: string;
  };
  winDocumentation?: WinDocumentation;
  decisionMatrix?: DecisionItem[];
  weeklyRhythmCalendar?: string;
  teamEmpowermentAudit?: TeamEmpowermentAudit;
}

export interface TrainingNotes {
  sessionDate?: string;
  attendees?: string[];
  workflowsCovered?: string[];
  teamQuestions?: string[];
  concerns?: string[];
}

export interface RoleAssignment {
  systemName: string;
  primaryOwner: string;
  backupOwner: string;
  acknowledged: boolean;
  supportNeeded?: string;
}

export interface SystemTest {
  systemName: string;
  owner: string;
  passed: boolean;
  notes: string;
  testDate?: string;
}

export interface FeedbackItem {
  category: 'working_well' | 'confusing' | 'still_need_help';
  feedback: string;
  actionItem?: string;
}

export interface WinDocumentation {
  winDescription: string;
  systemName: string;
  teamMember: string;
  celebratedAt: string;
}

export interface DecisionItem {
  decisionType: string;
  teamCanDecide: string;
  mustEscalate?: boolean;
  escalationPath?: string;
}

export interface TeamEmpowermentAudit {
  steppedUpMost: string;
  stillTooInvolved: string;
  nextWorkflow: string;
  lessonsLearned: string;
  adjustmentsNeeded: string;
  signedAt: string;
}

export interface PhaseProgress {
  phase: number;
  gatesCompleted: number;
  totalGates: number;
  isComplete: boolean;
}
