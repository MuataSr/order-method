import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, title, description, type, content, videoUrl, duration, order, isFree } = body;

    if (!moduleId || !title || !type) {
      return NextResponse.json(
        { error: 'Module ID, title, and type are required' },
        { status: 400 }
      );
    }

    const lessonCount = await db.lesson.count({ where: { moduleId } });
    const lesson = await db.lesson.create({
      data: {
        title,
        description,
        type,
        content,
        videoUrl,
        duration: duration || 0,
        order: order ?? lessonCount,
        isFree: isFree ?? false,
        moduleId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    const lessons = await db.lesson.findMany({
      where: moduleId ? { moduleId } : undefined,
      include: {
        module: {
          select: { id: true, title: true, courseId: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
