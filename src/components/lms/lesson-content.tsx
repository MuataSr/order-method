'use client';

import { Lesson, Quiz, QuizQuestion, LessonProgress } from '@/lib/stores/course-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Play,
  FileText,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonContentProps {
  lesson: Lesson;
  progress?: LessonProgress;
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete: (completed: boolean) => void;
  hasPrevious: boolean;
  hasNext: boolean;
  userId: string;
}

const lessonTypeIcons = {
  VIDEO: Play,
  TEXT: FileText,
  QUIZ: HelpCircle,
  ASSIGNMENT: FileText,
};

export function LessonContent({
  lesson,
  progress,
  onPrevious,
  onNext,
  onComplete,
  hasPrevious,
  hasNext,
  userId,
}: LessonContentProps) {
  // Derive completed state from progress prop, allow local override for immediate UI feedback
  const initialCompleted = progress?.completed || false;
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    passed: boolean;
    results: Array<{
      questionId: string;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      explanation: string | null;
    }>;
  } | null>(null);

  // Use a key to reset state when lesson changes
  const lessonKey = lesson.id;

  const handleComplete = async () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    
    try {
      await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          lessonId: lesson.id,
          completed: newCompleted,
        }),
      });
      onComplete(newCompleted);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const Icon = lessonTypeIcons[lesson.type as keyof typeof lessonTypeIcons] || FileText;

  if (lesson.type === 'QUIZ' && lesson.quiz) {
    return (
      <QuizContent
        quiz={lesson.quiz}
        quizResults={quizResults}
        setQuizResults={setQuizResults}
        isCompleted={isCompleted}
        userId={userId}
        onComplete={handleComplete}
        onPrevious={onPrevious}
        onNext={onNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Badge variant={isCompleted ? 'default' : 'secondary'}>
            <Icon className="h-3 w-3 mr-1" />
            {lesson.type}
          </Badge>
          <h1 className="text-xl font-semibold">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {lesson.duration > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {lesson.duration} min
            </div>
          )}
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            onClick={handleComplete}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              'Mark Complete'
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {lesson.type === 'VIDEO' && lesson.videoUrl && (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={lesson.videoUrl.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {lesson.type === 'TEXT' && lesson.content && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        )}

        {lesson.description && (
          <p className="text-muted-foreground mt-4">{lesson.description}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!hasNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

interface QuizContentProps {
  quiz: Quiz;
  quizResults: {
    score: number;
    passed: boolean;
    results: Array<{
      questionId: string;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      explanation: string | null;
    }>;
  } | null;
  setQuizResults: (results: typeof quizResults) => void;
  isCompleted: boolean;
  userId: string;
  onComplete: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

function QuizContent({
  quiz,
  quizResults,
  setQuizResults,
  isCompleted,
  userId,
  onComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: QuizContentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const questions = quiz.questions || [];
  const question = questions[currentQuestion];
  const options = question ? JSON.parse(question.options) : [];

  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quiz/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          quizId: quiz.id,
          answers: questions.map((_, i) => answers[i] || ''),
        }),
      });
      const data = await response.json();
      setQuizResults(data);
      setShowResults(true);
      if (data.passed) {
        onComplete();
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && quizResults) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {quizResults.passed ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    Congratulations! You passed!
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-6 w-6 text-red-500" />
                    Keep trying!
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{quizResults.score}%</div>
                <Progress value={quizResults.score} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {quizResults.passed
                    ? `You scored ${quizResults.score}% (passing: ${quiz.passingScore}%)`
                    : `You need ${quiz.passingScore}% to pass`}
                </p>
              </div>

              <div className="space-y-4">
                {quizResults.results.map((result, index) => (
                  <div
                    key={result.questionId}
                    className={cn(
                      'p-4 rounded-lg border',
                      result.isCorrect
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    )}
                  >
                    <p className="font-medium mb-2">
                      {index + 1}. {result.question}
                    </p>
                    <p className="text-sm">
                      Your answer:{' '}
                      <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {result.userAnswer || 'Not answered'}
                      </span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm">
                        Correct answer:{' '}
                        <span className="text-green-600">{result.correctAnswer}</span>
                      </p>
                    )}
                    {result.explanation && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {result.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-6">
                {!quizResults.passed && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResults(false);
                      setQuizResults(null);
                      setAnswers({});
                      setCurrentQuestion(0);
                    }}
                  >
                    Try Again
                  </Button>
                )}
                <Button onClick={onNext} disabled={!hasNext}>
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-sm text-muted-foreground">{quiz.description}</p>
        )}
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Passing score: {quiz.passingScore}%</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-2">
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-1" />
      </div>

      {/* Question */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-medium">{question?.question}</h2>

            <div className="space-y-3">
              {options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={answers[currentQuestion] === option ? 'default' : 'outline'}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            disabled={!answers[currentQuestion]}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
