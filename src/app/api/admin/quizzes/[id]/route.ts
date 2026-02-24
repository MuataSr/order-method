import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        lesson: {
          select: { id: true, title: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, passingScore, maxAttempts, timeLimit, questions } = body;

    if (questions && Array.isArray(questions)) {
      await db.quizQuestion.deleteMany({ where: { quizId: id } });
      
      await db.quizQuestion.createMany({
        data: questions.map((q: any, index: number) => ({
          quizId: id,
          question: q.question,
          type: q.type,
          options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points || 1,
          order: index,
        })),
      });
    }

    const quiz = await db.quiz.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(passingScore !== undefined && { passingScore }),
        ...(maxAttempts !== undefined && { maxAttempts }),
        ...(timeLimit !== undefined && { timeLimit }),
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await db.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}
