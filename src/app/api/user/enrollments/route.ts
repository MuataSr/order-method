import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Get user enrollments with progress
export async function GET(request: Request) {
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
              select: { id: true, name: true, avatar: true },
            },
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    // Calculate total lessons for each course
    const enrollmentsWithStats = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0
      );

      return {
        ...enrollment,
        course: {
          ...enrollment.course,
          totalLessons,
        },
      };
    });

    return NextResponse.json(enrollmentsWithStats);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

// Create new enrollment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    // Check if already enrolled
    const existing = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
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
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 });
  }
}
