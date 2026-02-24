import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const courseId = searchParams.get('courseId');

    const discussions = await db.discussion.findMany({
      where: {
        ...(lessonId && { lessonId }),
        ...(courseId && { lesson: { module: { courseId } } }),
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discussions' },
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
    const { lessonId, title, content } = body;

    if (!lessonId || !title || !content) {
      return NextResponse.json(
        { error: 'Lesson ID, title, and content are required' },
        { status: 400 }
      );
    }

    const discussion = await db.discussion.create({
      data: {
        title,
        content,
        lessonId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    });

    return NextResponse.json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
