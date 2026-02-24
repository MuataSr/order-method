import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};

    if (status === 'pending') {
      where.passed = null;
    } else if (status === 'passed') {
      where.passed = true;
    } else if (status === 'failed') {
      where.passed = false;
    }

    if (session.user.role === 'INSTRUCTOR') {
      where.quiz = {
        lesson: {
          module: {
            course: {
              instructorId: session.user.id,
            },
          },
        },
      };
    }

    const submissions = await db.quizAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                title: true,
                module: {
                  select: {
                    title: true,
                    course: {
                      select: {
                        title: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      score: submission.score,
      passed: submission.passed,
      submittedAt: submission.completedAt || submission.startedAt,
      studentId: submission.user.id,
      studentName: submission.user.name,
      studentEmail: submission.user.email,
      studentAvatar: submission.user.avatar,
      quizId: submission.quiz.id,
      quizTitle: submission.quiz.title,
      lessonTitle: submission.quiz.lesson?.title,
      courseTitle: submission.quiz.lesson?.module?.course?.title,
    }));

    return NextResponse.json(formattedSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
