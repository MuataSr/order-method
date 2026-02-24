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
    const { lessonId, title, description, passingScore, maxAttempts, timeLimit, questions } = body;

    if (!lessonId || !title) {
      return NextResponse.json(
        { error: 'Lesson ID and title are required' },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.create({
      data: {
        title,
        description,
        passingScore: passingScore ?? 70,
        maxAttempts: maxAttempts ?? 3,
        timeLimit,
        lessonId,
        questions: questions ? {
          create: questions.map((q: any, index: number) => ({
            question: q.question,
            type: q.type,
            options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points || 1,
            order: index,
          })),
        } : undefined,
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
