'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LessonSkeleton() {
  return (
    <div className="flex h-full">
      <div className="w-80 border-r bg-card hidden lg:block">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, moduleIndex) => (
            <div key={moduleIndex} className="space-y-2">
              <Skeleton className="h-5 w-full" />
              {Array.from({ length: 3 }).map((_, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="flex items-center gap-3 p-2 rounded-lg"
                >
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="aspect-video bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
