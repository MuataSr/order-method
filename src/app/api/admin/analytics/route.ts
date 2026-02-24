import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface DateRange {
  start: Date;
  end: Date;
}

interface CachedData {
  data: any;
  timestamp: number;
  expiresAt: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const analyticsCache = new Map<string, CachedData>();

function getDateRange(from: string | null, to: string | null): DateRange {
  const end = to ? new Date(to) : new Date();
  const start = from ? new Date(from) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function getCacheKey(userId: string, start: Date, end: Date, isInstructor: boolean): string {
  return `${userId}-${isInstructor ? 'instructor' : 'admin'}-${start.toISOString()}-${end.toISOString()}`;
}

function getCachedData(key: string): any | null {
  const cached = analyticsCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }
  analyticsCache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  analyticsCache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_TTL,
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isInstructor = session.user.role === 'INSTRUCTOR';
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAdmin && !isInstructor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const { start, end } = getDateRange(from, to);

    const cacheKey = getCacheKey(session.user.id, start, end, isInstructor);
    const cached = getCachedData(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const analytics = isInstructor 
      ? await getInstructorAnalytics(session.user.id, start, end)
      : await getAdminAnalytics(start, end);

    setCachedData(cacheKey, analytics);

    return NextResponse.json({ ...analytics, cached: false });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

async function getAdminAnalytics(start: Date, end: Date) {
  const [
    totalStudents,
    activeLearners,
    certificatesIssued,
    enrollments,
    courses,
    quizAttempts,
  ] = await Promise.all([
    db.user.count({ where: { role: 'STUDENT' } }),
    db.user.count({
      where: {
        role: 'STUDENT',
        lessonProgress: {
          some: { updatedAt: { gte: start, lte: end } },
        },
      },
    }),
    db.certificate.count({ where: { issuedAt: { gte: start, lte: end } } }),
    db.enrollment.findMany({
      where: { enrolledAt: { gte: start, lte: end } },
      include: { course: { select: { id: true, title: true, category: true } } },
    }),
    db.course.findMany({
      where: { isPublished: true },
      include: {
        _count: { select: { enrollments: true } },
        enrollments: {
          select: { progress: true, completedAt: true },
        },
      },
    }),
    db.quizAttempt.findMany({
      where: { completedAt: { gte: start, lte: end } },
      include: { quiz: { select: { title: true } } },
    }),
  ]);

  const allEnrollments = await db.enrollment.findMany({
    select: { progress: true, completedAt: true },
  });

  const completedEnrollments = allEnrollments.filter(e => e.completedAt).length;
  const completionRate = allEnrollments.length > 0 
    ? Math.round((completedEnrollments / allEnrollments.length) * 100) 
    : 0;

  const enrollmentTrend = await getEnrollmentTrend(start, end);

  const topCourses = courses
    .map(course => {
      const completions = course.enrollments.filter(e => e.completedAt).length;
      const avgProgress = course.enrollments.length > 0
        ? course.enrollments.reduce((acc, e) => acc + e.progress, 0) / course.enrollments.length
        : 0;
      return {
        id: course.id,
        title: course.title,
        enrollments: course._count.enrollments,
        completions,
        avgProgress: Math.round(avgProgress),
      };
    })
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 10);

  const categoryMap = new Map<string, number>();
  enrollments.forEach(e => {
    const category = e.course?.category || 'Uncategorized';
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  const totalCategorized = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);
  const categoryDistribution = Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalCategorized > 0 ? Math.round((count / totalCategorized) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const quizStats = {
    totalAttempts: quizAttempts.length,
    avgScore: quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, a) => acc + a.score, 0) / quizAttempts.length)
      : 0,
    passRate: quizAttempts.length > 0
      ? Math.round((quizAttempts.filter(a => a.passed).length / quizAttempts.length) * 100)
      : 0,
    mostAttempted: null as { title: string; attempts: number } | null,
  };

  const quizAttemptCounts = new Map<string, { title: string; count: number }>();
  quizAttempts.forEach(a => {
    const title = a.quiz?.title || 'Unknown Quiz';
    const existing = quizAttemptCounts.get(title);
    if (existing) {
      existing.count++;
    } else {
      quizAttemptCounts.set(title, { title, count: 1 });
    }
  });
  if (quizAttemptCounts.size > 0) {
    const sorted = Array.from(quizAttemptCounts.values()).sort((a, b) => b.count - a.count);
    quizStats.mostAttempted = { title: sorted[0].title, attempts: sorted[0].count };
  }

  return {
    totalStudents,
    activeLearners,
    completionRate,
    certificatesIssued,
    enrollmentTrend,
    topCourses,
    categoryDistribution,
    quizStats,
    dateRange: { start: start.toISOString(), end: end.toISOString() },
  };
}

async function getInstructorAnalytics(instructorId: string, start: Date, end: Date) {
  const instructorCourses = await db.course.findMany({
    where: { instructorId },
    include: {
      _count: { select: { enrollments: true } },
      enrollments: {
        select: { 
          id: true,
          progress: true, 
          completedAt: true,
          enrolledAt: true,
          user: { select: { name: true } },
        },
      },
      modules: {
        include: {
          lessons: {
            include: {
              progress: { select: { completed: true, completedAt: true } },
              quiz: {
                include: {
                  attempts: {
                    where: { completedAt: { gte: start, lte: end } },
                    select: { score: true, passed: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const totalEnrollments = instructorCourses.reduce(
    (acc, c) => acc + c._count.enrollments,
    0
  );

  const allEnrollments = instructorCourses.flatMap(c => c.enrollments);
  const completedCount = allEnrollments.filter(e => e.completedAt).length;
  const completionRate = allEnrollments.length > 0
    ? Math.round((completedCount / allEnrollments.length) * 100)
    : 0;

  const avgProgress = allEnrollments.length > 0
    ? Math.round(allEnrollments.reduce((acc, e) => acc + e.progress, 0) / allEnrollments.length)
    : 0;

  const recentEnrollments = allEnrollments
    .filter(e => e.enrolledAt >= start && e.enrolledAt <= end)
    .sort((a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime())
    .slice(0, 10)
    .map(e => ({
      id: e.id,
      studentName: e.user?.name || 'Unknown',
      enrolledAt: e.enrolledAt.toISOString(),
      progress: Math.round(e.progress),
    }));

  const courseStats = instructorCourses.map(course => {
    const totalLessons = course.modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0
    );
    const totalLessonProgress = course.modules.reduce(
      (acc, m) => acc + m.lessons.reduce(
        (la, l) => la + l.progress.filter(p => p.completed).length,
        0
      ),
      0
    );

    const quizAttempts = course.modules.flatMap(m => 
      m.lessons.flatMap(l => l.quiz?.attempts || [])
    );
    const avgQuizScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, a) => acc + a.score, 0) / quizAttempts.length)
      : 0;

    return {
      id: course.id,
      title: course.title,
      enrollments: course._count.enrollments,
      completions: course.enrollments.filter(e => e.completedAt).length,
      avgProgress: Math.round(
        course.enrollments.reduce((acc, e) => acc + e.progress, 0) / 
        Math.max(course.enrollments.length, 1)
      ),
      avgQuizScore,
    };
  });

  const enrollmentTrend = await getEnrollmentTrend(start, end, instructorId);

  return {
    totalCourses: instructorCourses.length,
    totalEnrollments,
    completionRate,
    avgProgress,
    recentEnrollments,
    courseStats,
    enrollmentTrend,
    dateRange: { start: start.toISOString(), end: end.toISOString() },
  };
}

async function getEnrollmentTrend(start: Date, end: Date, instructorId?: string) {
  const enrollments = await db.enrollment.findMany({
    where: {
      enrolledAt: { gte: start, lte: end },
      ...(instructorId && {
        course: { instructorId },
      }),
    },
    select: { enrolledAt: true },
  });

  const trendMap = new Map<string, number>();
  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    trendMap.set(dateStr, 0);
    current.setDate(current.getDate() + 1);
  }

  enrollments.forEach(e => {
    const dateStr = e.enrolledAt.toISOString().split('T')[0];
    if (trendMap.has(dateStr)) {
      trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
    }
  });

  return Array.from(trendMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
