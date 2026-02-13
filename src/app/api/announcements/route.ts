import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get recent announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');

    let where: Record<string, unknown> = {};

    if (courseId) {
      where.courseId = courseId;
    } else if (userId) {
      // Get announcements from enrolled courses
      const enrollments = await db.enrollment.findMany({
        where: { userId },
        select: { courseId: true },
      });
      where.courseId = { in: enrollments.map((e) => e.courseId) };
    }

    const announcements = await db.announcement.findMany({
      where,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
