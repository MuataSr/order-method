import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const discussion = await db.discussion.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true, avatar: true, role: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        lesson: {
          select: { id: true, title: true, moduleId: true },
        },
      },
    });

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    return NextResponse.json(discussion);
  } catch (error) {
    console.error('Error fetching discussion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discussion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const discussion = await db.discussion.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    if (discussion.authorId !== session.user.id && 
        session.user.role !== 'ADMIN' && 
        session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.discussion.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return NextResponse.json(
      { error: 'Failed to delete discussion' },
      { status: 500 }
    );
  }
}
