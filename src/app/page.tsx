'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCourseStore } from '@/lib/stores/course-store';
import { Sidebar } from '@/components/lms/sidebar';
import { DashboardView } from '@/components/lms/dashboard-view';
import { CatalogView } from '@/components/lms/catalog-view';
import { CourseView } from '@/components/lms/course-view';
import { AdminView } from '@/components/lms/admin-view';
import { ModuleOneView } from '@/components/lms/module-1/module-1-view';
import { ModuleTwoView } from '@/components/lms/module-2/module-2-view';
import { ModuleThreeView } from '@/components/lms/module-3/module-3-view';
import { cn } from '@/lib/utils';

export default function Home() {
  const { setUser, isAuthenticated } = useAuthStore();
  const { currentView, setSidebarOpen } = useCourseStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch current user on mount
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/user/me');
      return res.json();
    },
  });

  useEffect(() => {
    if (user && !isAuthenticated) {
      setUser(user);
    }
  }, [user, isAuthenticated, setUser]);

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'catalog':
        return <CatalogView />;
      case 'course':
        return <CourseView />;
      case 'module-1':
        return <ModuleOneView />;
      case 'module-2':
        return <ModuleTwoView />;
      case 'module-3':
        return <ModuleThreeView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onCollapse={setSidebarCollapsed} />
      
      <main
        className={cn(
          'transition-all duration-300',
          'flex-1 flex flex-col min-h-screen',
          sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
        )}
      >
        <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {renderView()}
        </div>

        {/* Footer - sticky at bottom */}
        <footer className="border-t py-4 px-6 mt-auto bg-background">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>© 2024 LearnHub LMS. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
