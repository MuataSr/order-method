import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Submit quiz attempt
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, quizId, answers } = body;

    // Get quiz with questions
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Check attempt limit
    const attempts = await db.quizAttempt.count({
      where: { userId, quizId },
    });

    if (attempts >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: 'Maximum attempts reached' },
        { status: 400 }
      );
    }

    // Calculate score
    let correctCount = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index] ?? '';
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
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

    return NextResponse.json({
      attempt,
      results,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
  }
}

// Get quiz attempts for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const quizId = searchParams.get('quizId');

    if (!userId || !quizId) {
      return NextResponse.json({ error: 'User ID and Quiz ID required' }, { status: 400 });
    }

    const attempts = await db.quizAttempt.findMany({
      where: { userId, quizId },
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
