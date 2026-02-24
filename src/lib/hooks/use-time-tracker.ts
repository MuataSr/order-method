'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

interface UseTimeTrackerOptions {
  onTick?: (elapsedSeconds: number) => void;
  onSave?: (elapsedSeconds: number) => void;
  saveInterval?: number;
  autoStart?: boolean;
}

export function useTimeTracker(options: UseTimeTrackerOptions = {}) {
  const { onTick, onSave, saveInterval = 60000 } = options;
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const tick = useCallback(() => {
    elapsedRef.current += 1;
    setElapsedSeconds(elapsedRef.current);
    onTick?.(elapsedRef.current);
  }, [onTick]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    
    setIsTracking(true);
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(tick, 1000);
    
    if (saveInterval > 0) {
      saveIntervalRef.current = setInterval(() => {
        onSave?.(elapsedRef.current);
      }, saveInterval);
    }
  }, [tick, onSave, saveInterval]);

  const stop = useCallback(() => {
    setIsTracking(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
    
    onSave?.(elapsedRef.current);
  }, [onSave]);

  const reset = useCallback(() => {
    stop();
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    startTimeRef.current = null;
  }, [stop]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        intervalRef.current = setInterval(tick, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tick]);

  return {
    isTracking,
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    start,
    stop,
    reset,
    formatTime,
  };
}

interface UseLessonTimeTrackerOptions {
  lessonId: string;
  userId: string;
  onSave?: (data: { lessonId: string; timeSpent: number }) => void;
}

export function useLessonTimeTracker({
  lessonId,
  userId,
  onSave,
}: UseLessonTimeTrackerOptions) {
  const [totalTime, setTotalTime] = useState(0);

  const handleSave = useCallback(async (elapsedSeconds: number) => {
    try {
      const res = await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          userId,
          watchTime: elapsedSeconds,
        }),
      });
      
      if (res.ok) {
        setTotalTime(prev => prev + elapsedSeconds);
        onSave?.({ lessonId, timeSpent: elapsedSeconds });
      }
    } catch (error) {
      console.error('Failed to save lesson time:', error);
    }
  }, [lessonId, userId, onSave]);

  const tracker = useTimeTracker({
    onSave: handleSave,
    saveInterval: 30000,
    autoStart: false,
  });

  return {
    ...tracker,
    totalTime,
  };
}
