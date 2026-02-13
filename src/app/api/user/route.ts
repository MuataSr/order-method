import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Simulate getting the current logged-in user (student@lms.com)
export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { email: 'student@lms.com' },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
