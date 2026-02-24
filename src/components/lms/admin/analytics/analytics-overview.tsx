'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, Award, TrendingUp } from 'lucide-react';

interface AnalyticsOverviewProps {
  data: {
    totalStudents: number;
    activeLearners: number;
    completionRate: number;
    certificatesIssued: number;
  };
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const stats = [
    {
      label: 'Total Students',
      value: data.totalStudents,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Active Learners',
      value: data.activeLearners,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Completion Rate',
      value: `${data.completionRate}%`,
      icon: GraduationCap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Certificates Issued',
      value: data.certificatesIssued,
      icon: Award,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
  );
}
