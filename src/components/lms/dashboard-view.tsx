'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCourseStore, Course, Enrollment } from '@/lib/stores/course-store';
import { CourseCard } from './course-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  ArrowRight,
  Bell,
  Calendar,
  Trophy,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export function DashboardView() {
  const { user } = useAuthStore();
  const { setCurrentView, setCurrentCourse, currentView } = useCourseStore();

  // Fetch enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/enrollments?userId=${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Fetch all courses for recommendations
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      return res.json();
    },
  });

  // Fetch Module 1 progress
  const { data: module1Progress } = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_1'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_1`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Fetch Module 2 progress
  const { data: module2Progress } = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_2'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_2`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Stats calculation
  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e: Enrollment) => e.completedAt).length;
  const totalProgress = enrollments.reduce((acc: number, e: Enrollment) => acc + e.progress, 0);
  const avgProgress = totalEnrolled > 0 ? totalProgress / totalEnrolled : 0;

  // Continue learning - courses in progress
  const inProgressCourses = enrollments
    .filter((e: Enrollment) => e.progress > 0 && e.progress < 100)
    .sort((a: Enrollment, b: Enrollment) =>
      new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
    )
    .slice(0, 3);

  // Recommended courses - not enrolled
  const enrolledCourseIds = new Set(enrollments.map((e: Enrollment) => e.courseId));
  const recommendedCourses = courses
    .filter((c: Course) => !enrolledCourseIds.has(c.id))
    .slice(0, 4);

  const handleContinueCourse = (course: Course) => {
    setCurrentCourse(course);
    setCurrentView('course');
  };

  const handleBrowseCourses = () => {
    setCurrentView('catalog');
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Continue your learning journey
          </p>
        </div>
        <Button onClick={handleBrowseCourses}>
          Browse Courses
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-2xl font-bold">{totalEnrolled}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCourses}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">{Math.round(avgProgress)}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Time</p>
                  <p className="text-2xl font-bold">12h</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Module 1 Progress Card */}
      {module1Progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">Module 1: Own Your Clock</h3>
                    <p className="text-white/80 text-sm">Time Mastery for Agency Owners</p>
                  </div>
                </div>
                {module1Progress.status === 'COMPLETED' && (
                  <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Trophy className="h-4 w-4" />
                    Time Master
                  </div>
                )}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Your Progress</span>
                    <span className="font-medium">
                      {(() => {
                        const gates = typeof module1Progress.completedGates === 'string'
                          ? JSON.parse(module1Progress.completedGates)
                          : module1Progress.completedGates || [];
                        return `${gates.length}/10 Gates`;
                      })()}
                    </span>
                  </div>
                  <Progress
                    value={(() => {
                      const gates = typeof module1Progress.completedGates === 'string'
                        ? JSON.parse(module1Progress.completedGates)
                        : module1Progress.completedGates || [];
                      return (gates.length / 10) * 100;
                    })()}
                    className="h-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Current Day: <span className="font-medium">{module1Progress.currentDay}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setCurrentView('module-1')}
                  >
                    {module1Progress.status === 'NOT_STARTED' ? (
                      <>Start Module</>
                    ) : (
                      <>
                        Continue Learning
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Module 2 Progress Card */}
      {module2Progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">Module 2: Review What Works</h3>
                    <p className="text-white/80 text-sm">Workflow Analysis & Optimization</p>
                  </div>
                </div>
                {module2Progress.status === 'COMPLETED' && (
                  <div className="flex items-center gap-2 bg-emerald-400 text-emerald-900 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Trophy className="h-4 w-4" />
                    Workflow Analyst
                  </div>
                )}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Your Progress</span>
                    <span className="font-medium">
                      {(() => {
                        const gates = typeof module2Progress.completedGates === 'string'
                          ? JSON.parse(module2Progress.completedGates)
                          : module2Progress.completedGates || [];
                        return `${gates.length}/10 Gates`;
                      })()}
                    </span>
                  </div>
                  <Progress
                    value={(() => {
                      const gates = typeof module2Progress.completedGates === 'string'
                        ? JSON.parse(module2Progress.completedGates)
                        : module2Progress.completedGates || [];
                      return (gates.length / 10) * 100;
                    })()}
                    className="h-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Current Day: <span className="font-medium">{module2Progress.currentDay}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setCurrentView('module-2')}
                  >
                    {module2Progress.status === 'NOT_STARTED' ? (
                      <>Start Module</>
                    ) : (
                      <>
                        Continue Learning
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressCourses.map((enrollment: Enrollment) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow">
                  <div
                    className="relative aspect-video"
                    onClick={() => enrollment.course && handleContinueCourse(enrollment.course)}
                  >
                    <img
                      src={enrollment.course?.thumbnail || '/placeholder-course.jpg'}
                      alt={enrollment.course?.title || 'Course'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1">{enrollment.course?.title}</h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(enrollment.progress)}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last accessed {formatDistanceToNow(new Date(enrollment.lastAccessedAt))} ago
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended for You</h2>
            <Button variant="ghost" onClick={handleBrowseCourses}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map((course: Course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => {
                  setCurrentCourse(course);
                  setCurrentView('course');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Announcements */}
      {enrollments.length > 0 && enrollments[0].course.announcements && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
          <Card>
            <CardContent className="p-0">
              {enrollments[0].course.announcements.map((announcement: { id: string; title: string; content: string; priority: string; createdAt: string; author?: { name: string; avatar: string | null } }) => (
                <div
                  key={announcement.id}
                  className="flex gap-4 p-4 border-b last:border-0"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{announcement.title}</h3>
                      {announcement.priority === 'HIGH' && (
                        <Badge variant="destructive">Important</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(announcement.createdAt))} ago
                      {announcement.author && ` by ${announcement.author.name}`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {enrollments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Your Learning Journey</h3>
            <p className="text-muted-foreground mb-6">
              Explore our catalog and enroll in your first course
            </p>
            <Button onClick={handleBrowseCourses}>
              Browse Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
