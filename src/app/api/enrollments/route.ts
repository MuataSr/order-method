import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get all enrollments for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            modules: {
              include: {
                lessons: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    // Get lesson progress for each enrolled course
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const allLessonIds = enrollment.course.modules.flatMap((m) =>
          m.lessons.map((l) => l.id)
        );

        const completedLessons = await db.lessonProgress.count({
          where: {
            userId,
            lessonId: { in: allLessonIds },
            completed: true,
          },
        });

        return {
          id: enrollment.id,
          progress: enrollment.progress,
          enrolledAt: enrollment.enrolledAt,
          completedAt: enrollment.completedAt,
          lastAccessedAt: enrollment.lastAccessedAt,
          course: {
            id: enrollment.course.id,
            title: enrollment.course.title,
            description: enrollment.course.description,
            thumbnail: enrollment.course.thumbnail,
            category: enrollment.course.category,
            level: enrollment.course.level,
            duration: enrollment.course.duration,
            instructor: enrollment.course.instructor,
            totalLessons: allLessonIds.length,
            completedLessons,
          },
        };
      })
    );

    return NextResponse.json(enrollmentsWithProgress);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create a new enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID required' }, { status: 400 });
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(existingEnrollment);
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
