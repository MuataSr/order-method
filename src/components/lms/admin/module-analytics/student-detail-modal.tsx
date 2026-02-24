'use client';

import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Calendar,
  FileText,
} from 'lucide-react';

interface StudentDetailModalProps {
  moduleId: string;
  studentId: string;
  onClose: () => void;
}

interface StudentDetailData {
  student: {
    id: string;
    name: string;
    email: string;
  };
  module: {
    id: number;
    name: string;
    totalGates: number;
  };
  moduleProgress: {
    status: string;
    startedAt: string | null;
    completedAt: string | null;
    currentPhase: number;
    gatesCompleted: number;
    progress: number;
  };
  gates: {
    name: string;
    label: string;
    phase: number;
    status: string;
    startedAt: string | null;
    completedAt: string | null;
    timeSpent: number | null;
    timeSpentFormatted: string | null;
    hasSubmission: boolean;
    submissionStatus: string | null;
  }[];
  submissions: {
    gateName: string;
    submittedAt: string;
    status: string;
    feedback: string | null;
  }[];
}

export function StudentDetailModal({ moduleId, studentId, onClose }: StudentDetailModalProps) {
  const { data, isLoading, error } = useQuery<StudentDetailData>({
    queryKey: ['student-module-detail', moduleId, studentId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/modules/${moduleId}/students/${studentId}`);
      if (!res.ok) throw new Error('Failed to fetch student detail');
      return res.json();
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-muted-foreground">Failed to load student details</p>
          </div>
        )}

        {data && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {data.student.name}
                <Badge variant="outline">{data.student.email}</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">{data.moduleProgress.status.replace('_', ' ')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Current Phase</p>
                    <p className="font-semibold">Phase {data.moduleProgress.currentPhase}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Gates</p>
                    <p className="font-semibold">
                      {data.moduleProgress.gatesCompleted}/{data.module.totalGates}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="font-semibold">{data.moduleProgress.progress}%</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </h3>
                {data.moduleProgress.startedAt && (
                  <p className="text-sm text-muted-foreground">
                    Started: {new Date(data.moduleProgress.startedAt).toLocaleDateString()}
                    {data.moduleProgress.completedAt && (
                      <> • Completed: {new Date(data.moduleProgress.completedAt).toLocaleDateString()}</>
                    )}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Gate Progress
                </h3>
                <div className="space-y-2">
                  {data.gates.map((gate) => {
                    const getStatusIcon = () => {
                      switch (gate.status) {
                        case 'COMPLETED':
                          return <CheckCircle2 className="h-4 w-4 text-green-500" />;
                        case 'IN_PROGRESS':
                          return <Clock className="h-4 w-4 text-blue-500" />;
                        default:
                          return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
                      }
                    };

                    return (
                      <div
                        key={gate.name}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon()}
                          <div>
                            <p className="font-medium text-sm">{gate.label}</p>
                            <p className="text-xs text-muted-foreground">
                              Phase {gate.phase}
                              {gate.timeSpentFormatted && ` • ${gate.timeSpentFormatted}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {gate.hasSubmission && (
                            <Badge variant="outline" className="text-xs">
                              Submitted
                            </Badge>
                          )}
                          <Badge
                            variant={gate.status === 'COMPLETED' ? 'default' : 'secondary'}
                            className={
                              gate.status === 'COMPLETED' 
                                ? 'bg-green-500' 
                                : gate.status === 'IN_PROGRESS' 
                                  ? 'bg-blue-500' 
                                  : ''
                            }
                          >
                            {gate.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {data.submissions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Submissions</h3>
                    <div className="space-y-2">
                      {data.submissions.map((submission, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium text-sm">{submission.gateName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              submission.status === 'APPROVED' 
                                ? 'default' 
                                : submission.status === 'REJECTED' 
                                  ? 'destructive' 
                                  : 'secondary'
                            }
                          >
                            {submission.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
