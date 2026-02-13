import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Get lesson progress for a user in a course
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID required' }, { status: 400 });
    }

    // Get all lessons for the course
    const modules = await db.module.findMany({
      where: { courseId },
      include: {
        lessons: { orderBy: { order: 'asc' } },
      },
    });

    const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));

    // Get progress for all lessons
    const progress = await db.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
      },
    });

    // Calculate overall progress
    const completedLessons = progress.filter((p) => p.completed).length;
    const totalLessons = lessonIds.length;
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return NextResponse.json({
      progress,
      completedLessons,
      totalLessons,
      overallProgress,
      lessonProgress: progress.reduce((acc, p) => {
        acc[p.lessonId] = p;
        return acc;
      }, {} as Record<string, typeof progress[0]>),
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
