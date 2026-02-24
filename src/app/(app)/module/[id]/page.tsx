'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { ModuleOneView } from '@/components/lms/module-1/module-1-view';
import { ModuleTwoView } from '@/components/lms/module-2/module-2-view';
import { ModuleThreeView } from '@/components/lms/module-3/module-3-view';
import { ModuleFourView } from '@/components/lms/module-4/module-4-view';
import { Module4PhaseView } from '@/components/lms/module-4/module-4-phase-view';
import { ModuleFiveView } from '@/components/lms/module-5/module-5-view';
import { Module5PhaseView } from '@/components/lms/module-5/module-5-phase-view';

interface ModulePageProps {
  params: Promise<{ id: string }>;
}

export default function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.id;

  switch (moduleId) {
    case '1':
      return <ModuleOneView />;
    case '2':
      return <ModuleTwoView />;
    case '3':
      return <ModuleThreeView />;
    case '4':
      return <ModuleFourView phaseViewComponent={Module4PhaseView} />;
    case '5':
      return <ModuleFiveView phaseViewComponent={Module5PhaseView} />;
    default:
      notFound();
  }
}
