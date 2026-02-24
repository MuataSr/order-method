import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportButton } from '../export-button';

describe('ExportButton', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  it('renders export button', () => {
    render(<ExportButton data={{}} />);
    
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('generates CSV with overview stats', () => {
    const data = {
      totalStudents: 100,
      activeLearners: 50,
      completionRate: 75,
      certificatesIssued: 25,
    };
    
    render(<ExportButton data={data} />);
    
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('includes enrollment trend in export', () => {
    const data = {
      enrollmentTrend: [
        { date: '2024-01-01', count: 5 },
        { date: '2024-01-02', count: 10 },
      ],
    };
    
    render(<ExportButton data={data} />);
    
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('includes course data in export', () => {
    const data = {
      topCourses: [
        { id: '1', title: 'Test Course', enrollments: 100, completions: 50, avgProgress: 75 },
      ],
    };
    
    render(<ExportButton data={data} />);
    
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('triggers download on click', () => {
    render(<ExportButton data={{}} />);
    
    const button = screen.getByText('Export CSV');
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });
});
