import { create } from 'zustand';

export type ViewMode = 'dashboard' | 'catalog' | 'course' | 'lesson' | 'admin';

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
  reset: () => set(initialState),
}));
