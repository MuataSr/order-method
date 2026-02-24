'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface CategoryDistributionProps {
  data: CategoryData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(220, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(320, 70%, 50%)',
  'hsl(30, 70%, 50%)',
  'hsl(60, 70%, 45%)',
  'hsl(180, 70%, 40%)',
];

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
