'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from './date-range-picker';
import { EnrollmentChart } from './enrollment-chart';
import { Users, BookOpen, TrendingUp, Clock } from 'lucide-react';

export function InstructorAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['instructor-analytics', dateRange?.from, dateRange?.to],
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

  const overviewStats = [
    {
      label: 'Total Courses',
      value: data.totalCourses,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Enrollments',
      value: data.totalEnrollments,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Completion Rate',
      value: `${data.completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Avg. Progress',
      value: `${data.avgProgress}%`,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Analytics</h2>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrollmentChart data={data.enrollmentTrend || []} />

        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.courseStats?.map((course: any) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate max-w-[200px]">{course.title}</span>
                    <Badge variant="outline">{course.enrollments} students</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={course.avgProgress} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground w-12">{course.avgProgress}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{course.completions} completed</span>
                    <span>Avg quiz: {course.avgQuizScore}%</span>
                  </div>
                </div>
              ))}
              {(!data.courseStats || data.courseStats.length === 0) && (
                <p className="text-center text-muted-foreground py-8">No courses found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data.recentEnrollments && data.recentEnrollments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentEnrollments.slice(0, 5).map((enrollment: any) => (
                <div key={enrollment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{enrollment.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={enrollment.progress >= 100 ? 'default' : 'secondary'}>
                    {enrollment.progress}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
