'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useCourseStore } from '@/lib/stores/course-store';

export type AppRoute = 
  | 'dashboard' 
  | 'catalog' 
  | 'course' 
  | 'lesson' 
  | 'module-1' 
  | 'module-2' 
  | 'module-3' 
  | 'admin';

const routeMap: Record<AppRoute, string> = {
  dashboard: '/',
  catalog: '/catalog',
  course: '/course',
  lesson: '/lesson',
  'module-1': '/module/1',
  'module-2': '/module/2',
  'module-3': '/module/3',
  admin: '/admin',
};

export function useAppRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentCourse, setCurrentLesson, setCurrentModuleId } = useCourseStore();

  const navigate = useCallback((route: AppRoute, params?: { id?: string; moduleId?: string }) => {
    let path = routeMap[route];
    
    if (params?.id) {
      if (route === 'course') {
        path = `/course/${params.id}`;
      } else if (route === 'lesson') {
        path = `/lesson/${params.id}`;
      }
    }

    router.push(path);
  }, [router]);

  const navigateToCourse = useCallback((courseId: string) => {
    router.push(`/course/${courseId}`);
  }, [router]);

  const navigateToLesson = useCallback((lessonId: string, courseId?: string) => {
    if (courseId) {
      router.push(`/course/${courseId}?lesson=${lessonId}`);
    } else {
      router.push(`/lesson/${lessonId}`);
    }
  }, [router]);

  const navigateToModule = useCallback((moduleId: string | number) => {
    router.push(`/module/${moduleId}`);
  }, [router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const currentView = useMemo((): AppRoute => {
    if (pathname === '/') return 'dashboard';
    if (pathname === '/catalog') return 'catalog';
    if (pathname === '/admin') return 'admin';
    if (pathname.startsWith('/course/')) return 'course';
    if (pathname.startsWith('/lesson/')) return 'lesson';
    if (pathname === '/module/1') return 'module-1';
    if (pathname === '/module/2') return 'module-2';
    if (pathname === '/module/3') return 'module-3';
    return 'dashboard';
  }, [pathname]);

  const isActive = useCallback((route: AppRoute) => {
    return currentView === route;
  }, [currentView]);

  return {
    navigate,
    navigateToCourse,
    navigateToLesson,
    navigateToModule,
    goBack,
    currentView,
    isActive,
    pathname,
  };
}
