import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { getModuleById, MODULES } from '@/lib/modules-config';

interface GateProgressRecord {
  userId: string;
  moduleName: string;
  gateName: string;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

interface ModuleProgressRecord {
  userId: string;
  moduleName: string;
  status: string;
  completedGates: string;
  currentDay: number;
  startedAt: Date;
  completedAt: Date | null;
  updatedAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const moduleId = parseInt(id);
    
    if (isNaN(moduleId) || moduleId < 1 || moduleId > 5) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }

    const moduleConfig = getModuleById(moduleId);
    if (!moduleConfig) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const students = await db.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true, role: true },
    });

    const moduleProgress = await db.moduleProgress.findMany({
      where: { moduleName: moduleConfig.dbName },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const gateProgress = await db.gateProgress.findMany({
      where: { moduleName: moduleConfig.dbName },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const summary = calculateSummary(students, moduleProgress);
    const phaseBreakdown = calculatePhaseBreakdown(moduleConfig, moduleProgress, gateProgress);
    const gateAnalysis = calculateGateAnalysis(moduleConfig, gateProgress);
    const studentProgress = calculateStudentProgress(students, moduleConfig, moduleProgress, gateProgress);
    const allModulesComparison = calculateAllModulesComparison(students.length);

    return NextResponse.json({
      module: {
        id: moduleConfig.id,
        name: moduleConfig.name,
        shortName: moduleConfig.shortName,
        description: moduleConfig.description,
        color: moduleConfig.color,
        totalGates: moduleConfig.totalGates,
        phases: moduleConfig.phases.map(p => ({
          number: p.number,
          name: p.name,
          gateCount: p.gates.length,
        })),
      },
      summary,
      phaseBreakdown,
      gateAnalysis,
      studentProgress,
      allModulesComparison,
    });
  } catch (error) {
    console.error('Error fetching module analytics:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Failed to fetch module analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateSummary(students: { id: string }[], moduleProgress: ModuleProgressRecord[]) {
  const totalStudents = students.length;
  const progressMap = new Map<string, ModuleProgressRecord>();
  
  moduleProgress.forEach(mp => {
    progressMap.set(mp.userId, mp);
  });

  let notStarted = 0;
  let inProgress = 0;
  let completed = 0;

  students.forEach(student => {
    const progress = progressMap.get(student.id);
    if (!progress || progress.status === 'NOT_STARTED') {
      notStarted++;
    } else if (progress.status === 'COMPLETED') {
      completed++;
    } else {
      inProgress++;
    }
  });

  const avgProgress = totalStudents > 0 
    ? Math.round((completed / totalStudents) * 100)
    : 0;

  return {
    totalStudents,
    notStarted,
    inProgress,
    completed,
    avgProgress,
  };
}

function calculatePhaseBreakdown(
  moduleConfig: ReturnType<typeof getModuleById>,
  moduleProgress: ModuleProgressRecord[],
  gateProgress: GateProgressRecord[]
) {
  if (!moduleConfig) return [];

  const studentPhases = new Map<string, number>();

  moduleProgress.forEach(mp => {
    if (mp.status === 'COMPLETED') {
      studentPhases.set(mp.userId, moduleConfig.phases.length + 1);
      return;
    }

    let maxPhase = 0;
    const completedGates: string[] = mp.completedGates 
      ? JSON.parse(mp.completedGates)
      : [];

    moduleConfig.phases.forEach(phase => {
      const phaseGatesCompleted = phase.gates.filter(g => 
        completedGates.includes(g.name)
      ).length;
      
      if (phaseGatesCompleted > 0) {
        maxPhase = Math.max(maxPhase, phase.number);
      }
    });

    if (maxPhase === 0 && mp.status !== 'NOT_STARTED') {
      maxPhase = 1;
    }

    if (maxPhase > 0) {
      studentPhases.set(mp.userId, maxPhase);
    }
  });

  const phaseBreakdown = moduleConfig.phases.map(phase => {
    const count = Array.from(studentPhases.values()).filter(p => p >= phase.number).length;
    return {
      phase: phase.number,
      name: phase.name,
      count,
      percentage: moduleProgress.length > 0 
        ? Math.round((count / moduleProgress.length) * 100)
        : 0,
    };
  });

  const completedCount = moduleProgress.filter(mp => mp.status === 'COMPLETED').length;
  phaseBreakdown.push({
    phase: moduleConfig.phases.length + 1,
    name: 'Completed',
    count: completedCount,
    percentage: moduleProgress.length > 0 
      ? Math.round((completedCount / moduleProgress.length) * 100)
      : 0,
  });

  return phaseBreakdown;
}

function calculateGateAnalysis(
  moduleConfig: ReturnType<typeof getModuleById>,
  gateProgress: GateProgressRecord[]
) {
  if (!moduleConfig) return [];

  return moduleConfig.phases.flatMap(phase => 
    phase.gates.map(gate => {
      const gateRecords = gateProgress.filter(gp => gp.gateName === gate.name);
      const completed = gateRecords.filter(gp => gp.status === 'COMPLETED').length;
      const inProgress = gateRecords.filter(gp => gp.status === 'IN_PROGRESS').length;
      
      const completedTimes = gateRecords
        .filter(gp => gp.status === 'COMPLETED' && gp.startedAt && gp.completedAt)
        .map(gp => {
          const started = new Date(gp.startedAt!).getTime();
          const completed = new Date(gp.completedAt!).getTime();
          return (completed - started) / 1000;
        });

      const avgTimeSeconds = completedTimes.length > 0
        ? completedTimes.reduce((a, b) => a + b, 0) / completedTimes.length
        : null;

      const completionRate = (completed + inProgress) > 0 
        ? (completed / (completed + inProgress)) * 100
        : 0;

      let status: 'ok' | 'slow' | 'stuck' = 'ok';
      const expectedSeconds = (gate.expectedDays || 2) * 24 * 60 * 60;

      if (completionRate < 70) {
        status = 'stuck';
      } else if (avgTimeSeconds && avgTimeSeconds > expectedSeconds * 2) {
        status = 'slow';
      } else if (completionRate < 85) {
        status = 'slow';
      }

      return {
        gateName: gate.name,
        label: gate.label,
        phase: gate.phase,
        completed,
        inProgress,
        avgTimeSeconds,
        avgTimeFormatted: formatDuration(avgTimeSeconds),
        status,
        completionRate: Math.round(completionRate),
      };
    })
  );
}

function calculateStudentProgress(
  students: { id: string; name: string | null; email: string }[],
  moduleConfig: ReturnType<typeof getModuleById>,
  moduleProgress: ModuleProgressRecord[],
  gateProgress: GateProgressRecord[]
) {
  if (!moduleConfig) return [];

  const progressMap = new Map<string, ModuleProgressRecord>();
  moduleProgress.forEach(mp => progressMap.set(mp.userId, mp));

  return students.map(student => {
    const progress = progressMap.get(student.id);
    
    if (!progress) {
      return {
        id: student.id,
        name: student.name || 'Unknown',
        email: student.email,
        status: 'NOT_STARTED',
        currentPhase: 0,
        gatesCompleted: 0,
        totalGates: moduleConfig.totalGates,
        progress: 0,
        lastActive: null,
      };
    }

    const completedGates: string[] = progress.completedGates 
      ? JSON.parse(progress.completedGates)
      : [];

    const gatesCompleted = completedGates.length;
    const progressPercent = Math.round((gatesCompleted / moduleConfig.totalGates) * 100);

    let currentPhase = 1;
    moduleConfig.phases.forEach(phase => {
      const phaseGatesCompleted = phase.gates.filter(g => 
        completedGates.includes(g.name)
      ).length;
      if (phaseGatesCompleted === phase.gates.length) {
        currentPhase = phase.number + 1;
      }
    });

    if (progress.status === 'COMPLETED') {
      currentPhase = moduleConfig.phases.length + 1;
    }

    return {
      id: student.id,
      name: student.name || 'Unknown',
      email: student.email,
      status: progress.status,
      currentPhase,
      gatesCompleted,
      totalGates: moduleConfig.totalGates,
      progress: progressPercent,
      lastActive: progress.updatedAt.toISOString(),
    };
  }).sort((a, b) => b.progress - a.progress);
}

function calculateAllModulesComparison(studentCount: number) {
  return MODULES.map(module => ({
    id: module.id,
    name: module.shortName,
    totalGates: module.totalGates,
    color: module.color,
    studentCount,
  }));
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  }
}
