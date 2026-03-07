'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/lms/sidebar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { setUser, isAuthenticated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      setUser(null);
      router.push('/login');
      return;
    }

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        avatar: session.user.avatar,
        role: session.user.role as UserRole,
        bypassGates: session.user.bypassGates ?? false,
        bio: null,
      });
    }
  }, [session, status, setUser, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onCollapse={setSidebarCollapsed} />
      
      <main
        className={cn(
          'transition-[margin] duration-300 ease-in-out',
          'flex-1 flex flex-col min-h-screen',
          sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
        )}
      >
        <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>

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

import { UserRole } from '@/lib/stores/auth-store';
