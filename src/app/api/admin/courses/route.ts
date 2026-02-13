import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Create a new course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, level, duration, thumbnail, instructorId } = body;

    const course = await db.course.create({
      data: {
        title,
        description,
        category,
        level: level || 'BEGINNER',
        duration: duration || 0,
        thumbnail,
        instructorId,
        isPublished: false,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
