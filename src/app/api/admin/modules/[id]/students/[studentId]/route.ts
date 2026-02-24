import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getModuleById } from '@/lib/modules-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  try {
    const { id, studentId } = await params;
    const moduleId = parseInt(id);
    
    if (isNaN(moduleId) || moduleId < 1 || moduleId > 5) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }

    const moduleConfig = getModuleById(moduleId);
    if (!moduleConfig) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const student = await db.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const moduleProgress = await db.moduleProgress.findFirst({
      where: {
        userId: studentId,
        moduleName: moduleConfig.dbName,
      },
    });

    const gateProgress = await db.gateProgress.findMany({
      where: {
        userId: studentId,
        moduleName: moduleConfig.dbName,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const submissions = await db.gateSubmission.findMany({
      where: {
        userId: studentId,
        moduleName: moduleConfig.dbName,
      },
      orderBy: { submittedAt: 'desc' },
    });

    const completedGates: string[] = moduleProgress?.completedGates 
      ? JSON.parse(moduleProgress.completedGates)
      : [];

    const gates = moduleConfig.phases.flatMap(phase => 
      phase.gates.map(gate => {
        const progress = gateProgress.find(gp => gp.gateName === gate.name);
        const submission = submissions.find(s => s.gateName === gate.name);
        
        let timeSpent: number | null = null;
        if (progress?.startedAt && progress?.completedAt) {
          timeSpent = Math.floor(
            (new Date(progress.completedAt).getTime() - new Date(progress.startedAt).getTime()) / 1000
          );
        }

        return {
          name: gate.name,
          label: gate.label,
          phase: gate.phase,
          status: progress?.status || (completedGates.includes(gate.name) ? 'COMPLETED' : 'NOT_STARTED'),
          startedAt: progress?.startedAt?.toISOString() || null,
          completedAt: progress?.completedAt?.toISOString() || null,
          timeSpent,
          timeSpentFormatted: formatDuration(timeSpent),
          hasSubmission: !!submission,
          submissionStatus: submission?.status || null,
        };
      })
    );

    let currentPhase = 0;
    if (moduleProgress?.status === 'COMPLETED') {
      currentPhase = moduleConfig.phases.length + 1;
    } else if (moduleProgress) {
      moduleConfig.phases.forEach(phase => {
        const phaseGatesCompleted = phase.gates.filter(g => 
          completedGates.includes(g.name)
        ).length;
        if (phaseGatesCompleted > 0) {
          currentPhase = phase.number;
        }
      });
    }

    const progressPercent = Math.round((completedGates.length / moduleConfig.totalGates) * 100);

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
      module: {
        id: moduleConfig.id,
        name: moduleConfig.name,
        totalGates: moduleConfig.totalGates,
      },
      moduleProgress: {
        status: moduleProgress?.status || 'NOT_STARTED',
        startedAt: moduleProgress?.startedAt?.toISOString() || null,
        completedAt: moduleProgress?.completedAt?.toISOString() || null,
        currentPhase,
        gatesCompleted: completedGates.length,
        progress: progressPercent,
      },
      gates,
      submissions: submissions.map(s => ({
        gateName: s.gateName,
        submittedAt: s.submittedAt.toISOString(),
        status: s.status,
        feedback: s.feedback,
      })),
    });
  } catch (error) {
    console.error('Error fetching student module detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student module detail' },
      { status: 500 }
    );
  }
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
