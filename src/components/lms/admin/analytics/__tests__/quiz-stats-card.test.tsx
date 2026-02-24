import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizStatsCard } from '../quiz-stats-card';

describe('QuizStatsCard', () => {
  it('renders quiz stats correctly', () => {
    const data = {
      totalAttempts: 50,
      avgScore: 78,
      passRate: 85,
      mostAttempted: { title: 'JavaScript Basics', attempts: 25 },
    };
    
    render(<QuizStatsCard data={data} />);
    
    expect(screen.getByText('Quiz Performance')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('displays most attempted quiz', () => {
    const data = {
      totalAttempts: 50,
      avgScore: 78,
      passRate: 85,
      mostAttempted: { title: 'JavaScript Basics', attempts: 25 },
    };
    
    render(<QuizStatsCard data={data} />);
    
    expect(screen.getByText('Most Attempted Quiz')).toBeInTheDocument();
    expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
    expect(screen.getByText('25 attempts')).toBeInTheDocument();
  });

  it('handles empty state', () => {
    const data = {
      totalAttempts: 0,
      avgScore: 0,
      passRate: 0,
      mostAttempted: null,
    };
    
    render(<QuizStatsCard data={data} />);
    
    expect(screen.getByText('No quiz attempts in this period')).toBeInTheDocument();
  });
});
