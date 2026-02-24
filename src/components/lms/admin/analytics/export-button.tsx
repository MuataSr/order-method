'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  totalStudents?: number;
  activeLearners?: number;
  completionRate?: number;
  certificatesIssued?: number;
  enrollmentTrend?: { date: string; count: number }[];
  topCourses?: {
    id: string;
    title: string;
    enrollments: number;
    completions: number;
    avgProgress: number;
  }[];
  categoryDistribution?: {
    category: string;
    count: number;
    percentage: number;
  }[];
  quizStats?: {
    totalAttempts: number;
    avgScore: number;
    passRate: number;
    mostAttempted: { title: string; attempts: number } | null;
  };
  dateRange?: { start: string; end: string };
}

interface ExportButtonProps {
  data: AnalyticsData;
  filename?: string;
}

export function ExportButton({ data, filename = 'analytics-export' }: ExportButtonProps) {
  const convertToCSV = (analyticsData: AnalyticsData): string => {
    const rows: string[] = [];
    
    rows.push('ORDER LMS Analytics Export');
    rows.push(`Generated,${new Date().toISOString()}`);
    if (analyticsData.dateRange) {
      rows.push(`Date Range,${analyticsData.dateRange.start} to ${analyticsData.dateRange.end}`);
    }
    rows.push('');
    
    rows.push('Overview Stats');
    rows.push('Metric,Value');
    rows.push(`Total Students,${analyticsData.totalStudents ?? 'N/A'}`);
    rows.push(`Active Learners,${analyticsData.activeLearners ?? 'N/A'}`);
    rows.push(`Completion Rate,${analyticsData.completionRate ?? 'N/A'}%`);
    rows.push(`Certificates Issued,${analyticsData.certificatesIssued ?? 'N/A'}`);
    rows.push('');
    
    if (analyticsData.enrollmentTrend && analyticsData.enrollmentTrend.length > 0) {
      rows.push('Enrollment Trend');
      rows.push('Date,Enrollments');
      analyticsData.enrollmentTrend.forEach((item) => {
        rows.push(`${item.date},${item.count}`);
      });
      rows.push('');
    }
    
    if (analyticsData.topCourses && analyticsData.topCourses.length > 0) {
      rows.push('Top Courses');
      rows.push('Title,Enrollments,Completions,Average Progress');
      analyticsData.topCourses.forEach((course) => {
        rows.push(`"${course.title}",${course.enrollments},${course.completions},${course.avgProgress}%`);
      });
      rows.push('');
    }
    
    if (analyticsData.categoryDistribution && analyticsData.categoryDistribution.length > 0) {
      rows.push('Category Distribution');
      rows.push('Category,Count,Percentage');
      analyticsData.categoryDistribution.forEach((cat) => {
        rows.push(`"${cat.category}",${cat.count},${cat.percentage}%`);
      });
      rows.push('');
    }
    
    if (analyticsData.quizStats) {
      rows.push('Quiz Stats');
      rows.push('Metric,Value');
      rows.push(`Total Attempts,${analyticsData.quizStats.totalAttempts}`);
      rows.push(`Average Score,${analyticsData.quizStats.avgScore}%`);
      rows.push(`Pass Rate,${analyticsData.quizStats.passRate}%`);
      if (analyticsData.quizStats.mostAttempted) {
        rows.push(`Most Attempted,"${analyticsData.quizStats.mostAttempted.title}" (${analyticsData.quizStats.mostAttempted.attempts} attempts)`);
      }
    }
    
    return rows.join('\n');
  };

  const handleExport = () => {
    try {
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Analytics exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics');
    }
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
