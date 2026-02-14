'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCourseStore } from '@/lib/stores/course-store';
import { ModuleOneView } from '@/components/lms/module-1/module-1-view';
import { ModuleTwoView } from '@/components/lms/module-2/module-2-view';
import { DashboardView } from '@/components/lms/dashboard-view';
import { CatalogView } from '@/components/lms/catalog-view';
import { CourseView } from '@/components/lms/course-view';
import { LessonView } from '@/components/lms/lesson-view';
import { AdminView } from '@/components/lms/admin-view';
import { Sidebar } from '@/components/lms/sidebar';
import { Header } from '@/components/lms/header';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { currentView } = useCourseStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Show loading or redirecting while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'catalog':
        return <CatalogView />;
      case 'course':
        return <CourseView />;
      case 'lesson':
        return <LessonView />;
      case 'module-1':
        return <ModuleOneView />;
      case 'module-2':
        return <ModuleTwoView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
