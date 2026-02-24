'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export function LoadingWrapper({ isLoading, children, fallback, delay = 0 }: LoadingWrapperProps) {
  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        className="flex items-center justify-center h-64"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return <>{children}</>;
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-[60vh] gap-4"
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-muted" />
        <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0" />
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </motion.div>
  );
}

interface SkeletonPulseProps {
  className?: string;
}

export function SkeletonPulse({ className }: SkeletonPulseProps) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}
