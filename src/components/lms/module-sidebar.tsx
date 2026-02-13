'use client';

import { Module, Lesson, LessonProgress } from '@/lib/stores/course-store';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  FileText,
  HelpCircle,
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModuleSidebarProps {
  modules: Module[];
  currentLessonId: string | null;
  lessonProgress: Record<string, LessonProgress>;
  onLessonClick: (lesson: Lesson, moduleId: string) => void;
  enrolled: boolean;
}

const lessonTypeIcons = {
  VIDEO: Play,
  TEXT: FileText,
  QUIZ: HelpCircle,
  ASSIGNMENT: FileText,
};

export function ModuleSidebar({
  modules,
  currentLessonId,
  lessonProgress,
  onLessonClick,
  enrolled,
}: ModuleSidebarProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getModuleProgress = (module: Module) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    const completed = module.lessons.filter(
      (lesson) => lessonProgress[lesson.id]?.completed
    ).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  // Find which module contains the current lesson
  const currentModuleId = modules.find((m) =>
    m.lessons?.some((l) => l.id === currentLessonId)
  )?.id;

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="font-semibold mb-4">Course Content</h2>
        
        <Accordion
          type="multiple"
          defaultValue={currentModuleId ? [currentModuleId] : [modules[0]?.id]}
          className="space-y-2"
        >
          {modules.map((module) => (
            <AccordionItem
              key={module.id}
              value={module.id}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Module {module.order}
                    </span>
                    {getModuleProgress(module) === 100 && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <span className="font-medium">{module.title}</span>
                  {module.lessons && (
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.filter((l) => lessonProgress[l.id]?.completed).length} / {module.lessons.length} completed
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="border-t">
                  {module.lessons?.map((lesson) => {
                    const Icon = lessonTypeIcons[lesson.type as keyof typeof lessonTypeIcons] || FileText;
                    const isCompleted = lessonProgress[lesson.id]?.completed;
                    const isLocked = !enrolled && !lesson.isFree;
                    const isCurrent = lesson.id === currentLessonId;

                    return (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 rounded-none py-3 px-4 h-auto',
                          isCurrent && 'bg-primary/10',
                          isCompleted && 'text-green-600 dark:text-green-400'
                        )}
                        onClick={() => !isLocked && onLessonClick(lesson, module.id)}
                        disabled={isLocked}
                      >
                        <div className="flex items-center justify-center w-6 h-6 shrink-0">
                          {isLocked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{lesson.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {lesson.type}
                            </Badge>
                            {lesson.duration > 0 && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(lesson.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                        {lesson.isFree && !enrolled && (
                          <Badge variant="secondary" className="text-xs">
                            Free
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
}
