import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const moduleName = searchParams.get('moduleName');

    if (!userId || !moduleName) {
      return NextResponse.json(
        { error: 'userId and moduleName are required' },
        { status: 400 }
      );
    }

    const progress = await db.moduleProgress.findUnique({
      where: {
        userId_courseId_moduleName: {
          userId,
          courseId: 'order-framework',
          moduleName,
        },
      },
    });
    // Return default if no progress exists
    if (!progress) {
      return NextResponse.json({
        currentDay: 1,
        completedGates: [],
        status: 'NOT_STARTED',
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching module progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId;
    const moduleName = body.moduleName;

    if (!userId || !moduleName) {
      return NextResponse.json(
        { error: 'userId and moduleName are required' },
        { status: 400 }
      );
    }

    const currentDay = body.currentDay ?? 1;
    const completedGatesRaw = body.completedGates ?? '[]';
    const completedGates: string[] = typeof completedGatesRaw === 'string' 
      ? JSON.parse(completedGatesRaw) 
      : completedGatesRaw;

    const progress = await db.moduleProgress.upsert({
      where: {
        userId_courseId_moduleName: {
          userId,
          courseId: 'order-framework',
          moduleName,
        },
      },
      create: {
        userId,
        courseId: 'order-framework',
        moduleName,
        currentDay,
        completedGates: JSON.stringify(completedGates),
        status: body.status ?? 'IN_PROGRESS',
        startedAt: new Date(),
      },
      update: {
        currentDay,
        completedGates: JSON.stringify(completedGates),
        status: body.status ?? 'IN_PROGRESS',
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating module progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const moduleName = searchParams.get('moduleName');
    const body = await request.json();

    if (!userId || !moduleName) {
      return NextResponse.json(
        { error: 'userId and moduleName are required' },
        { status: 400 }
      );
    }

    // Check if progress exists
    const existing = await db.moduleProgress.findUnique({
      where: {
        userId_courseId_moduleName: {
          userId,
          courseId: 'order-framework',
          moduleName,
        },
      },
    });

    const currentDay = body.currentDay ?? existing?.currentDay ?? 1;
    const existingGates = existing?.completedGates 
      ? (typeof existing.completedGates === 'string' 
          ? JSON.parse(existing.completedGates) 
          : existing.completedGates)
      : [];
    const completedGates: string[] = [...existingGates];

    if (body.completedGate && !completedGates.includes(body.completedGate)) {
      completedGates.push(body.completedGate);
    }

    const updateData = {
      currentDay: currentDay ?? existing?.currentDay ?? 1,
      completedGates: JSON.stringify(completedGates),
      status: completedGates.length >= 10 ? 'COMPLETED' : 'IN_PROGRESS',
      startedAt: existing?.startedAt ?? new Date(),
    };

    // Update or create
    const progress = await db.moduleProgress.upsert({
      where: {
        userId_courseId_moduleName: {
          userId,
          courseId: 'order-framework',
          moduleName,
        },
      },
      create: {
        userId,
        courseId: 'order-framework',
        moduleName,
        ...updateData,
      },
      update: {
        ...updateData,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating module progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
