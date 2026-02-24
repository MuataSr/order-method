'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { AnalyticsOverview } from './analytics-overview';
import { EnrollmentChart } from './enrollment-chart';
import { CoursePopularityChart } from './course-popularity-chart';
import { CategoryDistribution } from './category-distribution';
import { CompletionFunnel } from './completion-funnel';
import { QuizStatsCard } from './quiz-stats-card';
import { DateRangePicker } from './date-range-picker';
import { ExportButton } from './export-button';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

export function AnalyticsDashboard() {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-analytics', dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) {
        params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
      }
      if (dateRange?.to) {
        params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
      }
      const res = await fetch(`/api/admin/analytics?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load analytics. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">
            {dateRange?.from && dateRange?.to && (
              <>
                {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <ExportButton data={data} filename="lms-analytics" />
          {data.cached && (
            <Badge variant="secondary" className="ml-2">Cached</Badge>
          )}
        </div>
      </div>

      <AnalyticsOverview
        data={{
          totalStudents: data.totalStudents,
          activeLearners: data.activeLearners,
          completionRate: data.completionRate,
          certificatesIssued: data.certificatesIssued,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrollmentChart data={data.enrollmentTrend || []} />
        <CoursePopularityChart data={data.topCourses || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistribution data={data.categoryDistribution || []} />
        <QuizStatsCard data={data.quizStats || { totalAttempts: 0, avgScore: 0, passRate: 0, mostAttempted: null }} />
      </div>

      <CompletionFunnel data={data.topCourses || []} />
    </div>
  );
}
