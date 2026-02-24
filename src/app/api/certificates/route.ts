import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    const certificates = await db.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });

    const courseIds = [...new Set(certificates.map(c => c.courseId))];
    const courses = await db.course.findMany({
      where: { id: { in: courseIds } },
      select: {
        id: true,
        title: true,
        instructor: { select: { name: true } },
      },
    });

    const courseMap = new Map(courses.map(c => [c.id, c]));
    const result = certificates.map(cert => ({
      ...cert,
      course: courseMap.get(cert.courseId),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const existing = await db.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const certificate = await db.certificate.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}
