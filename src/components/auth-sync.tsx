'use client';

import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useEffect } from 'react';

export function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.avatar,
        role: session.user.role as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN',
        bio: null,
      });
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status, setUser]);

  return <>{children}</>;
}
