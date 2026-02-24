import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('instructorId');

    const where: any = {};

    if (instructorId) {
      where.instructorId = instructorId;
    } else {
      where.isPublished = true;
    }

    const courses = await db.course.findMany({
      where,
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true, bio: true },
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
        enrollments: instructorId ? {
          select: {
            id: true,
            progress: true,
            completedAt: true,
            enrolledAt: true,
            user: {
              select: { name: true, email: true },
            },
          },
        } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
