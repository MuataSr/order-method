import { create } from 'zustand';

export type ViewMode = 'dashboard' | 'catalog' | 'course' | 'lesson' | 'admin' | 'module-1' | 'module-2' | 'module-3';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  category: string | null;
  level: string;
  duration: number;
  isPublished: boolean;
  instructorId: string;
  instructor?: {
    id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
  };
  modules?: Module[];
  enrollments?: Enrollment[];
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  courseId: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  type: string;
  content: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  isFree: boolean;
  moduleId: string;
  quiz?: Quiz;
  progress?: LessonProgress;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  maxAttempts: number;
  timeLimit: number | null;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options: string;
  correctAnswer: string;
  explanation: string | null;
  points: number;
  order: number;
}

export interface LessonProgress {
  id: string;
  completed: boolean;
  completedAt: string | null;
  watchTime: number;
}

export interface Enrollment {
  id: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  lastAccessedAt: string;
  courseId: string;
  course?: Course;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: string;
  courseId: string;
  author?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

// ============================================================================
// MODULE 1: OWNING YOUR CLOCK - Time Management Module
// ============================================================================

export interface DailyTimeLog {
  id: string;
  userId: string;
  moduleId: string;
  dayNumber: number;
  startTime: string | null;
  endTime: string | null;
  totalHours: number;
  events: string | null;
  notes: string | null;
  loggedAt: string;
}

export interface TaskInventory {
  id: string;
  userId: string;
  moduleId: string;
  title: string;
  category: string;
  description: string | null;
  estimatedHours: number | null;
}

export interface EisenhowerMatrixItem {
  id: string;
  userId: string;
  taskId: string | null;
  taskTitle: string;
  importance: string;
  urgency: string;
  quadrant: string;
  notes: string | null;
}

export interface WeeklyScheduleEntry {
  id: string;
  userId: string;
  moduleId: string;
  dayOfWeek: number;
  timeBlocks: string;
  theme: string | null;
  isNonWorkDay: boolean;
}

export interface GateSubmission {
  id: string;
  userId: string;
  courseId: string;
  moduleName: string;
  gateName: string;
  submissionData: string;
  fileUrl: string | null;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  feedback: string | null;
}

export interface ModuleOneData {
  currentDay: number;
  completedGates: string[];
  baselineData?: DailyTimeLog[];
  tasks?: TaskInventory[];
  eisenhowerMatrix?: EisenhowerMatrixItem[];
  weeklySchedule?: WeeklyScheduleEntry[];
  gateSubmissions?: GateSubmission[];
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt?: string;
  completedAt?: string;
}

// Module 2: Review What Works
export interface ModuleTwoData {
  currentDay: number;
  completedGates: string[];
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt?: string;
  completedAt?: string;
}

// Module 3: Develop Systems
export interface SystemsPlaybookWorkflow {
  workflowTitle: string;
  steps: string[];
  owner: string;
  metrics: string;
}

export interface ModuleThreeData {
  currentPhase: number;
  completedGatesModule3: string[];
  systemsPlaybook: SystemsPlaybookWorkflow[];
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt?: string;
  completedAt?: string;
}

interface CourseState {
  // View state
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;

  // Course state
  currentCourse: Course | null;
  setCurrentCourse: (course: Course | null) => void;

  // Lesson state
  currentLesson: Lesson | null;
  setCurrentLesson: (lesson: Lesson | null) => void;
  currentModuleId: string | null;
  setCurrentModuleId: (moduleId: string | null) => void;

  // Sidebar state
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Admin panel state
  isAdminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;

  // Search and filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedLevel: string | null;
  setSelectedLevel: (level: string | null) => void;

  // Module 1 state
  moduleOneData: ModuleOneData | null;
  setModuleOneData: (data: ModuleOneData | null) => void;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  completedGates: string[];
  setCompletedGates: (gates: string[]) => void;
  isTimeMaster: boolean;
  setIsTimeMaster: (isMaster: boolean) => void;

  // Module 2 state
  moduleTwoData: ModuleTwoData | null;
  setModuleTwoData: (data: ModuleTwoData | null) => void;
  currentDayModule2: number;
  setCurrentDayModule2: (day: number) => void;
  completedGatesModule2: string[];
  setCompletedGatesModule2: (gates: string[]) => void;
  isWorkflowAnalyst: boolean;
  setIsWorkflowAnalyst: (isAnalyst: boolean) => void;

  // Module 3 state
  moduleThreeData: ModuleThreeData | null;
  setModuleThreeData: (data: ModuleThreeData | null) => void;
  currentPhaseModule3: number;
  setCurrentPhaseModule3: (phase: number) => void;
  completedGatesModule3: string[];
  setCompletedGatesModule3: (gates: string[]) => void;
  systemsPlaybook: SystemsPlaybookWorkflow[];
  setSystemsPlaybook: (playbook: SystemsPlaybookWorkflow[]) => void;
  isSystemsArchitect: boolean;
  setIsSystemsArchitect: (isArchitect: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  currentView: 'dashboard' as ViewMode,
  currentCourse: null,
  currentLesson: null,
  currentModuleId: null,
  isSidebarOpen: false,
  isAdminPanelOpen: false,
  searchQuery: '',
  selectedCategory: null,
  selectedLevel: null,
  moduleOneData: null,
  currentDay: 1,
  completedGates: [],
  isTimeMaster: false,
  moduleTwoData: null,
  currentDayModule2: 1,
  completedGatesModule2: [],
  isWorkflowAnalyst: false,
  moduleThreeData: null,
  currentPhaseModule3: 1,
  completedGatesModule3: [],
  systemsPlaybook: [],
  isSystemsArchitect: false,
};

export const useCourseStore = create<CourseState>((set) => ({
  ...initialState,
  setCurrentView: (view) => set({ currentView: view }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  setCurrentModuleId: (moduleId) => set({ currentModuleId: moduleId }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setAdminPanelOpen: (open) => set({ isAdminPanelOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedLevel: (level) => set({ selectedLevel: level }),
  setModuleOneData: (data) => set({ moduleOneData: data }),
  setCurrentDay: (day) => set({ currentDay: day }),
  setCompletedGates: (gates) => set({ completedGates: gates }),
  setIsTimeMaster: (isMaster) => set({ isTimeMaster: isMaster }),
  setModuleTwoData: (data) => set({ moduleTwoData: data }),
  setCurrentDayModule2: (day) => set({ currentDayModule2: day }),
  setCompletedGatesModule2: (gates) => set({ completedGatesModule2: gates }),
  setIsWorkflowAnalyst: (isAnalyst) => set({ isWorkflowAnalyst: isAnalyst }),
  setModuleThreeData: (data) => set({ moduleThreeData: data }),
  setCurrentPhaseModule3: (phase) => set({ currentPhaseModule3: phase }),
  setCompletedGatesModule3: (gates) => set({ completedGatesModule3: gates }),
  setSystemsPlaybook: (playbook) => set({ systemsPlaybook: playbook }),
  setIsSystemsArchitect: (isArchitect) => set({ isSystemsArchitect: isArchitect }),
  reset: () => set(initialState),
}));
