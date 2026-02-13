import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET/PUT - Fetch module progress for authenticated user
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
    const completedGates = existing?.completedGates ?? [];

    // Add new gate to completedGates if provided
    if (body.completedGate && !completedGates.includes(body.completedGate)) {
      completedGates.push(body.completedGate);
    }

    const updateData: any = {
      currentDay: currentDay ?? existing?.currentDay ?? 1,
      completedGates,
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
        ...updateData,
        updatedAt: new Date(),
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
