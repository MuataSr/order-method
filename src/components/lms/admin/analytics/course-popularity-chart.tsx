'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CourseData {
  id: string;
  title: string;
  enrollments: number;
  completions: number;
  avgProgress: number;
}

interface CoursePopularityChartProps {
  data: CourseData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(220, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(320, 70%, 50%)',
  'hsl(30, 70%, 50%)',
];

export function CoursePopularityChart({ data }: CoursePopularityChartProps) {
  const chartData = data.slice(0, 5).map((course) => ({
    name: course.title.length > 20 ? course.title.slice(0, 20) + '...' : course.title,
    enrollments: course.enrollments,
    completions: course.completions,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Courses by Enrollment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="enrollments" name="Enrollments" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
