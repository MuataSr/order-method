'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AuthSync } from '@/components/auth-sync';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (failureCount >= 3) return false;
              if (error instanceof Error && error.message.includes('401')) return false;
              return true;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            onError: (error) => {
              const message = error instanceof Error ? error.message : 'An unexpected error occurred';
              toast.error(message, {
                action: {
                  label: 'Retry',
                  onClick: () => toast.info('Retrying...'),
                },
              });
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthSync>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthSync>
      </SessionProvider>
    </QueryClientProvider>
  );
}
