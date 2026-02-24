'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { StudentDashboardView } from '@/components/lms/student-dashboard-view';
import { AdminDashboardView } from '@/components/lms/admin-dashboard-view';

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user.role === 'ADMIN') {
    return <AdminDashboardView />;
  }

  return <StudentDashboardView />;
}
