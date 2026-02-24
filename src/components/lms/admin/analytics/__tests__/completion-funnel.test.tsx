import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompletionFunnel } from '../completion-funnel';

describe('CompletionFunnel', () => {
  const mockCourses = [
    {
      id: '1',
      title: 'Course A',
      enrollments: 100,
      completions: 80,
      avgProgress: 85,
    },
    {
      id: '2',
      title: 'Course B',
      enrollments: 50,
      completions: 20,
      avgProgress: 45,
    },
    {
      id: '3',
      title: 'Course C',
      enrollments: 200,
      completions: 150,
      avgProgress: 75,
    },
  ];

  it('renders course completion progress', () => {
    render(<CompletionFunnel data={mockCourses} />);
    
    expect(screen.getByText('Course Completion Progress')).toBeInTheDocument();
    expect(screen.getByText('Course A')).toBeInTheDocument();
    expect(screen.getByText('Course B')).toBeInTheDocument();
    expect(screen.getByText('Course C')).toBeInTheDocument();
  });

  it('displays enrollment and completion counts', () => {
    render(<CompletionFunnel data={mockCourses} />);
    
    expect(screen.getByText('100 enrolled')).toBeInTheDocument();
    expect(screen.getByText('80 completed')).toBeInTheDocument();
  });

  it('displays average progress percentages', () => {
    render(<CompletionFunnel data={mockCourses} />);
    
    expect(screen.getByText('85% avg')).toBeInTheDocument();
    expect(screen.getByText('45% avg')).toBeInTheDocument();
    expect(screen.getByText('75% avg')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<CompletionFunnel data={[]} />);
    
    expect(screen.getByText('No course data available')).toBeInTheDocument();
  });

  it('sorts courses by average progress', () => {
    render(<CompletionFunnel data={mockCourses} />);
    
    const progressTexts = screen.getAllByText(/% avg/);
    const progressValues = progressTexts.map(el => parseInt(el.textContent || '0'));
    
    for (let i = 1; i < progressValues.length; i++) {
      expect(progressValues[i - 1]).toBeGreaterThanOrEqual(progressValues[i]);
    }
  });
});
