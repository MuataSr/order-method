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
    const { courseId, title, description, order } = body;

    if (!courseId || !title) {
      return NextResponse.json(
        { error: 'Course ID and title are required' },
        { status: 400 }
      );
    }

    const moduleCount = await db.module.count({ where: { courseId } });
    const newModule = await db.module.create({
      data: {
        title,
        description,
        order: order ?? moduleCount,
        courseId,
      },
    });

    return NextResponse.json(newModule);
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const modules = await db.module.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}
