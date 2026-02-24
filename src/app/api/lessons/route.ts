import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get lesson details with user progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const userId = searchParams.get('userId');

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });
    }

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                question: true,
                type: true,
                options: true,
                points: true,
                order: true,
                // Don't include correctAnswer for security
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get user progress for this lesson
    let progress: Awaited<ReturnType<typeof db.lessonProgress.findUnique>> = null;
    if (userId) {
      progress = await db.lessonProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId },
        },
      });
    }

    // Get previous and next lessons
    const moduleLessons = await db.lesson.findMany({
      where: { moduleId: lesson.moduleId },
      orderBy: { order: 'asc' },
      select: { id: true, order: true },
    });

    const currentIndex = moduleLessons.findIndex((l) => l.id === lessonId);
    const previousLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null;

    // For quiz questions, include correct answers only if needed for submission
    const response = {
      ...lesson,
      progress: progress
        ? {
            id: progress.id,
            completed: progress.completed,
            completedAt: progress.completedAt?.toISOString() || null,
            watchTime: progress.watchTime,
          }
        : null,
      navigation: {
        previous: previousLesson,
        next: nextLesson,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
