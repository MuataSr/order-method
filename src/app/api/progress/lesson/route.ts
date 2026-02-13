import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Update lesson progress
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lessonId, completed, watchTime } = body;

    const existing = await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    let progress;
    if (existing) {
      progress = await db.lessonProgress.update({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        data: {
          completed: completed ?? existing.completed,
          completedAt: completed ? new Date() : null,
          watchTime: watchTime ?? existing.watchTime,
        },
      });
    } else {
      progress = await db.lessonProgress.create({
        data: {
          userId,
          lessonId,
          completed: completed ?? false,
          completedAt: completed ? new Date() : null,
          watchTime: watchTime ?? 0,
        },
      });
    }

    // Update enrollment progress
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (lesson) {
      const modules = await db.module.findMany({
        where: { courseId: lesson.module.courseId },
        include: { lessons: true },
      });

      const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
      const allProgress = await db.lessonProgress.findMany({
        where: {
          userId,
          lessonId: { in: lessonIds },
        },
      });

      const completedCount = allProgress.filter((p) => p.completed).length;
      const totalCount = lessonIds.length;
      const overallProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

      await db.enrollment.update({
        where: {
          userId_courseId: { userId, courseId: lesson.module.courseId },
        },
        data: {
          progress: overallProgress,
          lastAccessedAt: new Date(),
          completedAt: overallProgress === 100 ? new Date() : null,
        },
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
