import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get admin stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get user to check role
    const user = await db.user.findUnique({
      where: { id: userId || '' },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get stats
    const [
      totalCourses,
      totalStudents,
      totalEnrollments,
      courses,
    ] = await Promise.all([
      db.course.count({
        where: user.role === 'INSTRUCTOR' ? { instructorId: user.id } : undefined,
      }),
      db.user.count({ where: { role: 'STUDENT' } }),
      db.enrollment.count(),
      db.course.findMany({
        where: user.role === 'INSTRUCTOR' ? { instructorId: user.id } : undefined,
        include: {
          instructor: {
            select: { name: true },
          },
          modules: {
            include: {
              lessons: { select: { id: true } },
            },
          },
          enrollments: { select: { id: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      isPublished: course.isPublished,
      level: course.level,
      category: course.category,
      duration: course.duration,
      instructorName: course.instructor.name,
      moduleCount: course.modules.length,
      lessonCount: course.modules.reduce((acc, m) => acc + m.lessons.length, 0),
      enrollmentCount: course.enrollments.length,
    }));

    return NextResponse.json({
      stats: {
        totalCourses,
        totalStudents,
        totalEnrollments,
      },
      courses: formattedCourses,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create or update course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { course, modules, userId } = body;

    if (!course || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check user role
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let createdCourse;

    if (course.id) {
      // Update existing course
      createdCourse = await db.course.update({
        where: { id: course.id },
        data: {
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          category: course.category,
          level: course.level,
          duration: course.duration,
          isPublished: course.isPublished,
        },
      });
    } else {
      // Create new course
      createdCourse = await db.course.create({
        data: {
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          category: course.category,
          level: course.level,
          duration: course.duration,
          isPublished: course.isPublished || false,
          instructorId: userId,
        },
      });
    }

    return NextResponse.json(createdCourse);
  } catch (error) {
    console.error('Error creating/updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
