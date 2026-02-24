import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const progress = await db.moduleProgress.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { moduleName: 'asc' },
        { updatedAt: 'desc' },
      ],
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching all module progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module progress' },
      { status: 500 }
    );
  }
}
