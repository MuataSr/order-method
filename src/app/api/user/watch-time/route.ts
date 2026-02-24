import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await db.lessonProgress.aggregate({
      where: { userId },
      _sum: { watchTime: true },
    });

    const totalSeconds = result._sum.watchTime || 0;

    return NextResponse.json({ 
      total: totalSeconds,
      formatted: formatDuration(totalSeconds)
    });
  } catch (error) {
    console.error('Error fetching watch time:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watch time' },
      { status: 500 }
    );
  }
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}
