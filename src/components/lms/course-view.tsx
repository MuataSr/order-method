'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useCourseStore, Module, Lesson, LessonProgress } from '@/lib/stores/course-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ModuleSidebar } from './module-sidebar';
import { LessonContent } from './lesson-content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  Play,
  Award,
  User,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function CourseView() {
  const { currentCourse, setCurrentView, setCurrentLesson, currentLesson } = useCourseStore();
  const { user } = useAuthStore();
  const [showLesson, setShowLesson] = useState(false);

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', currentCourse?.id],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${currentCourse?.id}`);
      return res.json();
    },
    enabled: !!currentCourse?.id,
  });

  // Fetch enrollment progress
  const { data: progressData, refetch: refetchProgress } = useQuery({
    queryKey: ['progress', user?.id, currentCourse?.id],
    queryFn: async () => {
      const res = await fetch(`/api/progress?userId=${user?.id}&courseId=${currentCourse?.id}`);
      return res.json();
    },
    enabled: !!user?.id && !!currentCourse?.id,
  });

  // Check enrollment
  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/enrollments?userId=${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  const isEnrolled = enrollments.some((e: { courseId: string }) => e.courseId === currentCourse?.id);

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/user/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, courseId: currentCourse?.id }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success('Successfully enrolled!');
      refetchProgress();
    },
  });

  // Derive lesson progress from query data
  const lessonProgress = useMemo(
    () => progressData?.lessonProgress || {},
    [progressData?.lessonProgress]
  );

  // Calculate stats
  const totalLessons = course?.modules?.reduce(
    (acc: number, m: Module) => acc + (m.lessons?.length || 0),
    0
  ) || 0;

  const handleLessonClick = (lesson: Lesson, moduleId: string) => {
    if (!isEnrolled && !lesson.isFree) {
      toast.error('Please enroll to access this lesson');
      return;
    }
    setCurrentLesson(lesson);
    setShowLesson(true);
  };

  const handleBackToCourse = () => {
    setShowLesson(false);
    setCurrentLesson(null);
    refetchProgress();
  };

  const handleProgressUpdate = () => {
    refetchProgress();
  };

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please log in to enroll');
      return;
    }
    enrollMutation.mutate();
  };

  // Find all lessons for navigation
  const allLessons = course?.modules?.flatMap((m: Module) =>
    (m.lessons || []).map((l: Lesson) => ({ ...l, moduleId: m.id }))
  ) || [];

  const currentLessonIndex = allLessons.findIndex((l: Lesson) => l.id === currentLesson?.id);

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      setCurrentLesson(prevLesson);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLesson(nextLesson);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button onClick={() => setCurrentView('catalog')} className="mt-4">
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Sidebar - Course content */}
      <div className="w-80 border-r bg-card hidden lg:block overflow-hidden">
        <ModuleSidebar
          modules={course.modules || []}
          currentLessonId={currentLesson?.id || null}
          lessonProgress={lessonProgress}
          onLessonClick={handleLessonClick}
          enrolled={isEnrolled}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {showLesson && currentLesson ? (
            <motion.div
              key="lesson"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              {/* Lesson header */}
              <div className="p-4 border-b flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToCourse}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {course.title}
                  </p>
                </div>
              </div>

              {/* Lesson content */}
              <LessonContent
                lesson={currentLesson}
                progress={lessonProgress[currentLesson.id]}
                onPrevious={handlePreviousLesson}
                onNext={handleNextLesson}
                onComplete={handleProgressUpdate}
                hasPrevious={currentLessonIndex > 0}
                hasNext={currentLessonIndex < allLessons.length - 1}
                userId={user?.id || ''}
              />
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto"
            >
              {/* Course header */}
              <div className="relative">
                <div className="aspect-video md:aspect-[21/9] overflow-hidden">
                  <img
                    src={course.thumbnail || '/placeholder-course.jpg'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('catalog')}
                    className="mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Catalog
                  </Button>

                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                      <h1 className="text-3xl font-bold">{course.title}</h1>
                    </div>

                    {!isEnrolled ? (
                      <Button size="lg" onClick={handleEnroll} disabled={enrollMutation.isPending}>
                        <Play className="h-5 w-5 mr-2" />
                        Enroll Now
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={() => {
                          const firstLesson = course.modules?.[0]?.lessons?.[0];
                          if (firstLesson) handleLessonClick(firstLesson, course.modules[0].id);
                        }}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Continue Learning
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Course content */}
              <div className="p-6 space-y-8">
                {/* Progress bar for enrolled students */}
                {isEnrolled && progressData && (
                  <Card className="bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Your Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {progressData.completedLessons} / {progressData.totalLessons} lessons
                        </span>
                      </div>
                      <Progress value={progressData.overallProgress} className="h-2" />
                    </CardContent>
                  </Card>
                )}

                {/* Course description */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">About This Course</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Course stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{Math.round(course.duration / 60)}h</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{course.modules?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Modules</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Play className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{totalLessons}</p>
                      <p className="text-sm text-muted-foreground">Lessons</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{course._count?.enrollments || 0}</p>
                      <p className="text-sm text-muted-foreground">Enrolled</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Instructor</h2>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={course.instructor.avatar || ''} />
                            <AvatarFallback>
                              <User className="h-8 w-8" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{course.instructor.name}</h3>
                            {course.instructor.bio && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {course.instructor.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Curriculum */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
                  <div className="space-y-4">
                    {course.modules?.map((module: Module) => (
                      <Card key={module.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Module {module.order}</Badge>
                              <h3 className="font-medium">{module.title}</h3>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {module.lessons?.length || 0} lessons
                            </span>
                          </div>
                          {module.description && (
                            <p className="text-sm text-muted-foreground">
                              {module.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Mobile: Course content */}
                <div className="lg:hidden">
                  <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                  <div className="border rounded-lg max-h-96 overflow-auto">
                    <ModuleSidebar
                      modules={course.modules || []}
                      currentLessonId={null}
                      lessonProgress={lessonProgress}
                      onLessonClick={handleLessonClick}
                      enrolled={isEnrolled}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
