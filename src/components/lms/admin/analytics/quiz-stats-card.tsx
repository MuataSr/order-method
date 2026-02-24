'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Target, TrendingUp } from 'lucide-react';

interface QuizStats {
  totalAttempts: number;
  avgScore: number;
  passRate: number;
  mostAttempted: { title: string; attempts: number } | null;
}

interface QuizStatsCardProps {
  data: QuizStats;
}

export function QuizStatsCard({ data }: QuizStatsCardProps) {
  const stats = [
    {
      label: 'Total Attempts',
      value: data.totalAttempts,
      icon: Target,
      color: 'text-blue-500',
    },
    {
      label: 'Average Score',
      value: `${data.avgScore}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      label: 'Pass Rate',
      value: `${data.passRate}%`,
      icon: CheckCircle,
      color: 'text-green-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        {data.mostAttempted && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Most Attempted Quiz</p>
            <p className="font-medium truncate">{data.mostAttempted.title}</p>
            <p className="text-sm text-muted-foreground">
              {data.mostAttempted.attempts} attempts
            </p>
          </div>
        )}
        {!data.mostAttempted && data.totalAttempts === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <XCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No quiz attempts in this period</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
