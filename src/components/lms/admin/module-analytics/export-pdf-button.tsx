'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

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
  gateAnalysis: {
    gateName: string;
    label: string;
    phase: number;
    completed: number;
    inProgress: number;
    avgTimeSeconds: number | null;
    avgTimeFormatted: string | null;
    status: string;
    completionRate: number;
  }[];
  studentProgress: {
    id: string;
    name: string;
    email: string;
    status: string;
    currentPhase: number;
    gatesCompleted: number;
    totalGates: number;
    progress: number;
    lastActive: string | null;
  }[];
}

interface ExportPDFButtonProps {
  data: ModuleAnalyticsData;
  moduleId: string;
}

export function ExportPDFButton({ data, moduleId }: ExportPDFButtonProps) {
  const generateCSV = () => {
    const rows: string[] = [];
    
    rows.push(`O.R.D.E.R. Framework - ${data.module.name}`);
    rows.push(`Generated,${new Date().toISOString()}`);
    rows.push('');
    
    rows.push('SUMMARY');
    rows.push('Metric,Value');
    rows.push(`Total Students,${data.summary.totalStudents}`);
    rows.push(`Not Started,${data.summary.notStarted}`);
    rows.push(`In Progress,${data.summary.inProgress}`);
    rows.push(`Completed,${data.summary.completed}`);
    rows.push(`Average Progress,${data.summary.avgProgress}%`);
    rows.push('');
    
    rows.push('PHASE BREAKDOWN');
    rows.push('Phase,Name,Count,Percentage');
    data.phaseBreakdown.forEach(phase => {
      rows.push(`${phase.phase},"${phase.name}",${phase.count},${phase.percentage}%`);
    });
    rows.push('');
    
    rows.push('GATE ANALYSIS');
    rows.push('Gate,Phase,Completed,In Progress,Avg Time,Status,Completion Rate');
    data.gateAnalysis.forEach(gate => {
      rows.push(`"${gate.label}",${gate.phase},${gate.completed},${gate.inProgress},"${gate.avgTimeFormatted || 'N/A'}",${gate.status},${gate.completionRate}%`);
    });
    rows.push('');
    
    rows.push('STUDENT PROGRESS');
    rows.push('Name,Email,Status,Current Phase,Gates Completed,Progress,Last Active');
    data.studentProgress.forEach(student => {
      rows.push(`"${student.name}","${student.email}",${student.status},${student.currentPhase},${student.gatesCompleted}/${student.totalGates},${student.progress}%,"${student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'N/A'}"`);
    });
    
    return rows.join('\n');
  };

  const generatePDFContent = () => {
    const rows: string[] = [];
    
    rows.push('='.repeat(60));
    rows.push(`O.R.D.E.R. Framework`);
    rows.push(`${data.module.name}`);
    rows.push(`Analytics Report`);
    rows.push(`Generated: ${new Date().toLocaleDateString()}`);
    rows.push('='.repeat(60));
    rows.push('');
    
    rows.push('SUMMARY');
    rows.push('-'.repeat(40));
    rows.push(`Total Students: ${data.summary.totalStudents}`);
    rows.push(`Not Started: ${data.summary.notStarted}`);
    rows.push(`In Progress: ${data.summary.inProgress}`);
    rows.push(`Completed: ${data.summary.completed}`);
    rows.push(`Average Progress: ${data.summary.avgProgress}%`);
    rows.push('');
    
    rows.push('PHASE BREAKDOWN');
    rows.push('-'.repeat(40));
    data.phaseBreakdown.forEach(phase => {
      const bar = '█'.repeat(Math.round(phase.percentage / 5));
      rows.push(`Phase ${phase.phase} (${phase.name}): ${bar} ${phase.count} (${phase.percentage}%)`);
    });
    rows.push('');
    
    rows.push('GATE ANALYSIS');
    rows.push('-'.repeat(40));
    data.gateAnalysis.forEach(gate => {
      const statusIcon = gate.status === 'ok' ? '✓' : gate.status === 'slow' ? '⚠' : '✗';
      rows.push(`${statusIcon} ${gate.label} [P${gate.phase}]: ${gate.completed} completed, ${gate.inProgress} in progress (${gate.status})`);
    });
    rows.push('');
    
    rows.push('STUDENT PROGRESS');
    rows.push('-'.repeat(40));
    data.studentProgress.slice(0, 20).forEach(student => {
      rows.push(`${student.name}: Phase ${student.currentPhase}, ${student.progress}% complete`);
    });
    if (data.studentProgress.length > 20) {
      rows.push(`... and ${data.studentProgress.length - 20} more students`);
    }
    rows.push('');
    rows.push('='.repeat(60));
    
    return rows.join('\n');
  };

  const handleExportCSV = () => {
    try {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `module-${moduleId}-analytics-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPDF = () => {
    try {
      const content = generatePDFContent();
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `module-${moduleId}-analytics-${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
