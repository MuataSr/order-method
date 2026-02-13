import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get quiz with answers (for submission) or submit quiz
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    const userId = searchParams.get('userId');

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        attempts: userId
          ? {
              where: { userId },
              orderBy: { startedAt: 'desc' },
              take: 1,
            }
          : false,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Submit quiz answers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, quizId, answers, timeSpent } = body;

    if (!userId || !quizId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Check attempt count
    const previousAttempts = await db.quizAttempt.count({
      where: { userId, quizId },
    });

    if (previousAttempts >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: 'Maximum attempts reached' },
        { status: 400 }
      );
    }

    // Calculate score
    let correctCount = 0;
    const results = quiz.questions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect =
        question.type === 'TRUE_FALSE'
          ? userAnswer === question.correctAnswer
          : userAnswer === question.correctAnswer;

      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await db.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed,
        answers: JSON.stringify(answers),
        completedAt: new Date(),
      },
    });

    // If passed, mark the lesson as complete
    if (passed) {
      await db.lessonProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId: quiz.lessonId },
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId,
          lessonId: quiz.lessonId,
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
      attemptsRemaining: quiz.maxAttempts - previousAttempts - 1,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
