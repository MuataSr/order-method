'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CourseData {
  id: string;
  title: string;
  enrollments: number;
  completions: number;
  avgProgress: number;
}

interface CompletionFunnelProps {
  data: CourseData[];
}

export function CompletionFunnel({ data }: CompletionFunnelProps) {
  const sortedData = [...data]
    .sort((a, b) => b.avgProgress - a.avgProgress)
    .slice(0, 6);

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Completion Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No course data available</p>
          ) : (
            sortedData.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {course.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {course.avgProgress}% avg
                  </span>
                </div>
                <div className="relative">
                  <Progress value={course.avgProgress} className="h-2" />
                  <div
                    className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(course.avgProgress)}`}
                    style={{ width: `${course.avgProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{course.enrollments} enrolled</span>
                  <span>{course.completions} completed</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
