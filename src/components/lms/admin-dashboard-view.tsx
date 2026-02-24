'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Search,
  Building2,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { AnalyticsDashboard } from './admin/analytics';
import { UserManagement } from './admin/user-management';
import { parseCompletedGates } from '@/lib/utils/progress';

const MODULES = [
  { id: 1, name: 'Module 1: Own Your Clock', icon: Calendar, color: 'from-blue-500 to-purple-500', gates: 10, dbName: 'MODULE_1' },
  { id: 2, name: 'Module 2: Review What Works', icon: Search, color: 'from-emerald-500 to-teal-500', gates: 10, dbName: 'MODULE_2' },
  { id: 3, name: 'Module 3: Develop Systems', icon: Building2, color: 'from-amber-500 to-orange-500', gates: 15, dbName: 'MODULE_3' },
  { id: 4, name: 'Module 4: Educate & Empower Teams', icon: Users, color: 'from-indigo-500 to-purple-500', gates: 10, dbName: 'MODULE_4' },
  { id: 5, name: 'Module 5: Results & Celebrate', icon: Trophy, color: 'from-emerald-500 to-teal-500', gates: 12, dbName: 'MODULE_5' },
];

const TOTAL_GATES = 57;

export function AdminDashboardView() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'users');

  const { data: usersData = [] } = useQuery({
    queryKey: ['admin-users', 'all', ''],
    queryFn: async () => {
      const res = await fetch('/api/admin/users');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: allModuleProgress = [] } = useQuery({
    queryKey: ['all-module-progress'],
    queryFn: async () => {
      const res = await fetch('/api/modules/progress/all');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const studentCount = usersData.filter((u: { role: string }) => u.role === 'STUDENT').length;
  const adminCount = usersData.filter((u: { role: string }) => u.role === 'ADMIN').length;

  const moduleStats = MODULES.map(module => {
    const moduleProgress = allModuleProgress.filter((p: { moduleName: string }) => p.moduleName === module.dbName);
    const completedCount = moduleProgress.filter((p: { status: string }) => p.status === 'COMPLETED').length;
    const inProgressCount = moduleProgress.filter((p: { status: string }) => p.status === 'IN_PROGRESS').length;
    const totalGatesCompleted = moduleProgress.reduce((acc: number, p: { completedGates: string | string[] }) => {
      return acc + parseCompletedGates(p.completedGates).length;
    }, 0);
    const avgProgress = moduleProgress.length > 0 
      ? Math.round((totalGatesCompleted / (moduleProgress.length * module.gates)) * 100)
      : 0;

    return {
      ...module,
      completedCount,
      inProgressCount,
      avgProgress,
    };
  });

  const totalGatesCompleted = allModuleProgress.reduce((acc: number, p: { completedGates: string | string[] }) => {
    return acc + parseCompletedGates(p.completedGates).length;
  }, 0);

  const overallProgress = studentCount > 0 
    ? Math.round((totalGatesCompleted / (studentCount * TOTAL_GATES)) * 100)
    : 0;

  const completedPrograms = usersData.filter((u: { role: string }) => u.role === 'STUDENT').filter((student: { id: string }) => {
    const studentProgress = allModuleProgress.filter((p: { userId: string }) => p.userId === student.id);
    const completedModules = studentProgress.filter((p: { status: string }) => p.status === 'COMPLETED').length;
    return completedModules === 5;
  }).length;

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">You don't have access to this page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users and track O.R.D.E.R. Framework progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{studentCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Programs Completed</p>
                <p className="text-2xl font-bold">{completedPrograms}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gates Completed</p>
                <p className="text-2xl font-bold">{totalGatesCompleted}/{studentCount * TOTAL_GATES || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {moduleStats.map((module) => {
              const IconComponent = module.icon;
              return (
                <div key={module.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{module.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {module.gates} gates • {module.completedCount} completed • {module.inProgressCount} in progress
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{module.avgProgress}%</p>
                      <p className="text-sm text-muted-foreground">avg progress</p>
                    </div>
                  </div>
                  <Progress value={module.avgProgress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
