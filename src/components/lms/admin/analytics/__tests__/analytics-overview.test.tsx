import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsOverview } from '../analytics-overview';

describe('AnalyticsOverview', () => {
  const mockData = {
    totalStudents: 150,
    activeLearners: 45,
    completionRate: 68,
    certificatesIssued: 23,
  };

  it('renders all stat cards', () => {
    render(<AnalyticsOverview data={mockData} />);
    
    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('Active Learners')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('Certificates Issued')).toBeInTheDocument();
  });

  it('displays correct values', () => {
    render(<AnalyticsOverview data={mockData} />);
    
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('handles zero values', () => {
    const zeroData = {
      totalStudents: 0,
      activeLearners: 0,
      completionRate: 0,
      certificatesIssued: 0,
    };
    
    render(<AnalyticsOverview data={zeroData} />);
    
    expect(screen.getAllByText('0')).toHaveLength(3);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
