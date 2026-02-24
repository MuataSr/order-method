'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface OptimisticMutationOptions<TData, TVariables, TContext> {
  queryKey: unknown[];
  mutationFn: (variables: TVariables) => Promise<TData>;
  onOptimisticUpdate: (old: TContext | undefined, variables: TVariables) => TContext;
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  onError?: (error: Error, variables: TVariables, context: TContext | undefined) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useOptimisticMutation<TData, TVariables, TContext>({
  queryKey,
  mutationFn,
  onOptimisticUpdate,
  onSuccess,
  onError,
  successMessage,
  errorMessage = 'An error occurred. Please try again.',
}: OptimisticMutationOptions<TData, TVariables, TContext>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      
      const previousData = queryClient.getQueryData<TContext>(queryKey);
      
      queryClient.setQueryData<TContext>(queryKey, (old) => 
        onOptimisticUpdate(old, variables)
      );

      return previousData;
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context);
      toast.error(errorMessage);
      onError?.(error as Error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.(data, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

interface LessonProgressVariables {
  lessonId: string;
  userId: string;
  completed: boolean;
  watchTime?: number;
}

export function useLessonProgressMutation(courseId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['progress', courseId];

  return useMutation({
    mutationFn: async (variables: LessonProgressVariables) => {
      const res = await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });
      if (!res.ok) throw new Error('Failed to update progress');
      return res.json();
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      
      const previousData = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          lessonProgress: {
            ...old.lessonProgress,
            [variables.lessonId]: {
              completed: variables.completed,
              watchTime: variables.watchTime || 0,
            },
          },
        };
      });

      return previousData;
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context);
      toast.error('Failed to update lesson progress');
    },
    onSuccess: () => {
      toast.success('Progress saved!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

interface GateSubmissionVariables {
  userId: string;
  courseId: string;
  moduleName: string;
  gateName: string;
  submissionData?: Record<string, any>;
}

export function useGateSubmissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: GateSubmissionVariables) => {
      const res = await fetch('/api/modules/gate-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...variables,
          submissionData: JSON.stringify(variables.submissionData || {}),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit gate');
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success('Gate completed! 🎉');
      queryClient.invalidateQueries({ 
        queryKey: ['module-progress', variables.userId, variables.moduleName] 
      });
    },
    onError: () => {
      toast.error('Failed to submit gate. Please try again.');
    },
  });
}

interface EnrollmentVariables {
  userId: string;
  courseId: string;
}

export function useEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: EnrollmentVariables) => {
      const res = await fetch('/api/user/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });
      if (!res.ok) throw new Error('Failed to enroll');
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success('Successfully enrolled! 🎓');
      queryClient.invalidateQueries({ 
        queryKey: ['enrollments', variables.userId] 
      });
    },
    onError: () => {
      toast.error('Failed to enroll. Please try again.');
    },
  });
}
