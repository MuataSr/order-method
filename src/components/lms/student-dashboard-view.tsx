'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ModuleProgressCard, ModuleProgressCardSkeleton } from './module-progress-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  Bell,
  Target,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { DashboardStatsSkeleton } from './skeletons';
import { parseCompletedGates } from '@/lib/utils/progress';

const TOTAL_GATES = 57;

export function StudentDashboardView() {
  const { user } = useAuthStore();
  const router = useRouter();

  const watchTimeQuery = useQuery({
    queryKey: ['watch-time', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/watch-time?userId=${user?.id}`);
      if (!res.ok) return { total: 0, formatted: '0m' };
      return res.json();
    },
    enabled: !!user?.id,
  });

  const module1Query = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_1'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_1`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  const module2Query = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_2'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_2`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  const module3Query = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_3'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_3`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  const module4Query = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_4'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_4`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  const module5Query = useQuery({
    queryKey: ['module-progress', user?.id, 'MODULE_5'],
    queryFn: async () => {
      const res = await fetch(`/api/modules/progress?userId=${user?.id}&moduleName=MODULE_5`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  const announcementsQuery = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await fetch('/api/announcements');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const module1Progress = module1Query.data;
  const module2Progress = module2Query.data;
  const module3Progress = module3Query.data;
  const module4Progress = module4Query.data;
  const module5Progress = module5Query.data;
  const announcements = announcementsQuery.data || [];

  const isModulesLoading = 
    module1Query.isLoading || 
    module2Query.isLoading || 
    module3Query.isLoading || 
    module4Query.isLoading || 
    module5Query.isLoading;

  const allProgress = [module1Progress, module2Progress, module3Progress, module4Progress, module5Progress];
  
  const completedGates = allProgress.reduce((total, progress) => {
    if (!progress) return total;
    const gates = parseCompletedGates(progress.completedGates);
    return total + gates.length;
  }, 0);

  const completedModules = allProgress.filter(p => p?.status === 'COMPLETED').length;
  
  const currentModule = allProgress.findIndex(p => p?.status !== 'COMPLETED') + 1 || 6;
  const nextModuleToStart = currentModule > 5 ? null : currentModule;

  const overallProgress = Math.round((completedGates / TOTAL_GATES) * 100);

  if (isModulesLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-64 bg-muted rounded animate-pulse" />
            <div className="h-5 w-48 bg-muted rounded animate-pulse mt-1" />
          </div>
        </div>
        <DashboardStatsSkeleton />
        <ModuleProgressCardSkeleton />
        <ModuleProgressCardSkeleton />
        <ModuleProgressCardSkeleton />
        <ModuleProgressCardSkeleton />
        <ModuleProgressCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Continue your O.R.D.E.R. Framework journey
          </p>
        </div>
        {nextModuleToStart && (
          <Button onClick={() => router.push(`/module/${nextModuleToStart}`)}>
            Continue Module {nextModuleToStart}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {completedModules === 5 && (
          <Badge variant="default" className="text-lg px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500">
            🎉 Framework Complete!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Modules Complete</p>
                  <p className="text-2xl font-bold">{completedModules}/5</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gates Completed</p>
                  <p className="text-2xl font-bold">{completedGates}/{TOTAL_GATES}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Time</p>
                  <p className="text-2xl font-bold">{watchTimeQuery.data?.formatted || '0m'}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {completedModules < 5 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Current Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    {nextModuleToStart 
                      ? `Module ${nextModuleToStart} - ${getModuleTitle(nextModuleToStart)}`
                      : 'All modules complete!'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Program Progress</p>
                <div className="flex items-center gap-2">
                  <Progress value={overallProgress} className="w-32 h-2" />
                  <span className="font-medium">{overallProgress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <ModuleProgressCard
        moduleNumber={1}
        progress={module1Progress}
        delay={0.5}
      />
      <ModuleProgressCard
        moduleNumber={2}
        progress={module2Progress}
        delay={0.55}
      />
      <ModuleProgressCard
        moduleNumber={3}
        progress={module3Progress}
        delay={0.6}
      />
      <ModuleProgressCard
        moduleNumber={4}
        progress={module4Progress}
        delay={0.65}
      />
      <ModuleProgressCard
        moduleNumber={5}
        progress={module5Progress}
        delay={0.7}
      />

      {announcements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Program Announcements</h2>
          <Card>
            <CardContent className="p-0">
              {announcements.slice(0, 3).map((announcement: { id: string; title: string; content: string; priority: string; createdAt: string; author?: { name: string; avatar: string | null } }) => (
                <div
                  key={announcement.id}
                  className="flex gap-4 p-4 border-b last:border-0"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{announcement.title}</h3>
                      {announcement.priority === 'HIGH' && (
                        <Badge variant="destructive">Important</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(announcement.createdAt))} ago
                      {announcement.author && ` by ${announcement.author.name}`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function getModuleTitle(moduleNumber: number): string {
  const titles: Record<number, string> = {
    1: 'Own Your Clock',
    2: 'Review What Works',
    3: 'Develop Systems',
    4: 'Educate & Empower Teams',
    5: 'Results & Celebrate',
  };
  return titles[moduleNumber] || '';
}
