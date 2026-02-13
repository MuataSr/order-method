import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch gate submissions for a user
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

    const submissions = await db.gateSubmission.findMany({
      where: {
        userId,
        moduleName,
        courseId: 'order-framework',
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching gate submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST - Create a new gate submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      courseId = 'order-framework',
      moduleName,
      gateName,
      submissionData,
      fileUrl,
    } = body;

    if (!userId || !moduleName || !gateName) {
      return NextResponse.json(
        { error: 'userId, moduleName, and gateName are required' },
        { status: 400 }
      );
    }

    // Check if submission already exists for this gate
    const existing = await db.gateSubmission.findFirst({
      where: {
        userId,
        courseId,
        moduleName,
        gateName,
      },
    });

    let submission;

    if (existing) {
      // Update existing submission
      submission = await db.gateSubmission.update({
        where: { id: existing.id },
        data: {
          submissionData: submissionData ?? existing.submissionData,
          fileUrl: fileUrl ?? existing.fileUrl,
          status: 'PENDING',
          submittedAt: new Date(),
        },
      });
    } else {
      // Create new submission
      submission = await db.gateSubmission.create({
        data: {
          userId,
          courseId,
          moduleName,
          gateName,
          submissionData,
          fileUrl,
          status: 'PENDING',
        },
      });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error creating gate submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
