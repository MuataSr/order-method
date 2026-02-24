'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  Download,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { StudentDetailModal } from './student-detail-modal';
import { ExportPDFButton } from './export-pdf-button';

interface GateAnalysis {
  gateName: string;
  label: string;
  phase: number;
  completed: number;
  inProgress: number;
  avgTimeSeconds: number | null;
  avgTimeFormatted: string | null;
  status: 'ok' | 'slow' | 'stuck';
  completionRate: number;
}

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  status: string;
  currentPhase: number;
  gatesCompleted: number;
  totalGates: number;
  progress: number;
  lastActive: string | null;
}

interface ModuleAnalyticsData {
  module: {
    id: number;
    name: string;
    shortName: string;
    description: string;
    color: string;
    totalGates: number;
    phases: { number: number; name: string; gateCount: number }[];
  };
  summary: {
    totalStudents: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    avgProgress: number;
  };
  phaseBreakdown: {
    phase: number;
    name: string;
    count: number;
    percentage: number;
  }[];
  gateAnalysis: GateAnalysis[];
  studentProgress: StudentProgress[];
  allModulesComparison: {
    id: number;
    name: string;
    totalGates: number;
    color: string;
    studentCount: number;
  }[];
}

export function ModuleAnalyticsView() {
  const params = useParams();
  const moduleId = params.id as string;
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<ModuleAnalyticsData>({
    queryKey: ['module-analytics', moduleId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/modules/${moduleId}/analytics`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
  });

  if (isLoading) {
    return <ModuleAnalyticsSkeleton />;
  }

  if (error || !data) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-muted-foreground">Failed to load module analytics</p>
      </Card>
    );
  }

  const { module, summary, phaseBreakdown, gateAnalysis, studentProgress, allModulesComparison } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{module.name}</h1>
          <p className="text-muted-foreground mt-1">{module.description}</p>
        </div>
        <ExportPDFButton data={data} moduleId={moduleId} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Students"
          value={summary.totalStudents}
          icon={Users}
          color="bg-primary/10"
          iconColor="text-primary"
        />
        <SummaryCard
          title="In Progress"
          value={summary.inProgress}
          subtitle={`${Math.round((summary.inProgress / summary.totalStudents) * 100)}%`}
          icon={TrendingUp}
          color="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <SummaryCard
          title="Completed"
          value={summary.completed}
          subtitle={`${summary.avgProgress}% avg`}
          icon={CheckCircle2}
          color="bg-green-500/10"
          iconColor="text-green-500"
        />
        <SummaryCard
          title="Not Started"
          value={summary.notStarted}
          icon={Clock}
          color="bg-yellow-500/10"
          iconColor="text-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Phase Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhaseFunnel phases={phaseBreakdown} moduleColor={module.color} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Module Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleComparison 
              modules={allModulesComparison} 
              currentModuleId={module.id}
              studentCount={summary.totalStudents}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gate Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Identify stuck points and slow gates
          </p>
        </CardHeader>
        <CardContent>
          <GateAnalysisTable gates={gateAnalysis} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click a student to view detailed progress
          </p>
        </CardHeader>
        <CardContent>
          <StudentProgressTable 
            students={studentProgress} 
            onSelectStudent={setSelectedStudentId}
          />
        </CardContent>
      </Card>

      {selectedStudentId && (
        <StudentDetailModal
          moduleId={moduleId}
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
}

function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  iconColor 
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  iconColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PhaseFunnel({ phases, moduleColor }: { phases: ModuleAnalyticsData['phaseBreakdown']; moduleColor: string }) {
  const maxCount = Math.max(...phases.map(p => p.count));
  
  return (
    <div className="space-y-4">
      {phases.map((phase, index) => {
        const width = maxCount > 0 ? (phase.count / maxCount) * 100 : 0;
        const isCompleted = phase.name === 'Completed';
        
        return (
          <div key={phase.phase} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {isCompleted ? '🎉' : `Phase ${phase.phase}`}: {phase.name}
              </span>
              <span className="text-muted-foreground">
                {phase.count} students ({phase.percentage}%)
              </span>
            </div>
            <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`absolute top-0 left-0 h-full ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : `bg-gradient-to-r ${moduleColor}`
                } rounded-lg flex items-center justify-end pr-2`}
              >
                {width > 15 && (
                  <span className="text-white text-xs font-medium">
                    {phase.count}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModuleComparison({ 
  modules, 
  currentModuleId,
  studentCount 
}: { 
  modules: ModuleAnalyticsData['allModulesComparison'];
  currentModuleId: number;
  studentCount: number;
}) {
  return (
    <div className="space-y-3">
      {modules.map((mod) => {
        const isCurrent = mod.id === currentModuleId;
        
        return (
          <div 
            key={mod.id}
            className={`p-3 rounded-lg border ${isCurrent ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${mod.color}`} />
                <span className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                  {mod.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {mod.totalGates} gates
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GateAnalysisTable({ gates }: { gates: GateAnalysis[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'slow':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'stuck':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge variant="default" className="bg-green-500">OK</Badge>;
      case 'slow':
        return <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">Slow</Badge>;
      case 'stuck':
        return <Badge variant="destructive">Stuck</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 font-medium">Gate</th>
            <th className="text-center py-3 px-2 font-medium">Phase</th>
            <th className="text-center py-3 px-2 font-medium">Completed</th>
            <th className="text-center py-3 px-2 font-medium">In Progress</th>
            <th className="text-center py-3 px-2 font-medium">Avg Time</th>
            <th className="text-center py-3 px-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {gates.map((gate) => (
            <tr key={gate.gateName} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(gate.status)}
                  <span className="font-medium">{gate.label}</span>
                </div>
              </td>
              <td className="py-3 px-2 text-center">
                <Badge variant="outline">P{gate.phase}</Badge>
              </td>
              <td className="py-3 px-2 text-center">
                <span className="text-green-600 font-medium">{gate.completed}</span>
              </td>
              <td className="py-3 px-2 text-center">
                <span className="text-blue-600">{gate.inProgress}</span>
              </td>
              <td className="py-3 px-2 text-center text-muted-foreground">
                {gate.avgTimeFormatted || '-'}
              </td>
              <td className="py-3 px-2 text-center">
                {getStatusBadge(gate.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudentProgressTable({ 
  students, 
  onSelectStudent 
}: { 
  students: StudentProgress[];
  onSelectStudent: (id: string) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 font-medium">Name</th>
            <th className="text-left py-3 px-2 font-medium">Email</th>
            <th className="text-center py-3 px-2 font-medium">Phase</th>
            <th className="text-center py-3 px-2 font-medium">Gates</th>
            <th className="text-center py-3 px-2 font-medium">Progress</th>
            <th className="text-center py-3 px-2 font-medium">Status</th>
            <th className="text-center py-3 px-2 font-medium">Last Active</th>
            <th className="py-3 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr 
              key={student.id} 
              className="border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => onSelectStudent(student.id)}
            >
              <td className="py-3 px-2 font-medium">{student.name}</td>
              <td className="py-3 px-2 text-muted-foreground text-sm">{student.email}</td>
              <td className="py-3 px-2 text-center">
                <Badge variant="outline">P{student.currentPhase}</Badge>
              </td>
              <td className="py-3 px-2 text-center">
                {student.gatesCompleted}/{student.totalGates}
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <Progress value={student.progress} className="h-2 w-16" />
                  <span className="text-sm text-muted-foreground w-10">{student.progress}%</span>
                </div>
              </td>
              <td className="py-3 px-2 text-center">
                {getStatusBadge(student.status)}
              </td>
              <td className="py-3 px-2 text-center text-sm text-muted-foreground">
                {student.lastActive 
                  ? new Date(student.lastActive).toLocaleDateString()
                  : '-'
                }
              </td>
              <td className="py-3 px-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModuleAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
