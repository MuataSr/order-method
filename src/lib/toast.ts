import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration ?? 4000,
    });
  },

  error: (message: string, options?: ToastOptions & { retry?: () => void }) => {
    return sonnerToast.error(message, {
      description: options?.description,
      action: options?.retry 
        ? { label: 'Retry', onClick: options.retry }
        : options?.action,
      duration: options?.duration ?? 5000,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration ?? 4000,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration ?? 5000,
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      description: options?.description,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};

export const showToast = {
  enrolled: (courseName: string) => 
    toast.success(`Enrolled in ${courseName}!`, {
      description: 'Start learning now',
    }),

  completed: (itemName: string) =>
    toast.success(`Completed ${itemName}!`, {
      description: 'Great progress!',
    }),

  gateCompleted: (gateName: string, progress: { current: number; total: number }) =>
    toast.success(`Gate completed! 🎉`, {
      description: `${progress.current}/${progress.total} gates completed`,
    }),

  badgeEarned: (badgeName: string) =>
    toast.success(`Badge earned: ${badgeName}! 🏆`, {
      description: 'Congratulations on your achievement!',
      duration: 6000,
    }),

  progressSaved: () =>
    toast.success('Progress saved', {
      duration: 2000,
    }),

  networkError: (retry?: () => void) =>
    toast.error('Network error', {
      description: 'Please check your connection',
      retry,
    }),

  sessionExpired: () =>
    toast.error('Session expired', {
      description: 'Please log in again',
    }),

  featureComingSoon: () =>
    toast.info('Coming soon!', {
      description: 'This feature is under development',
    }),
};
