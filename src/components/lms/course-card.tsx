'use client';

import { Course } from '@/lib/stores/course-store';
import { cn } from '@/lib/utils';
import { Clock, User, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface CourseCardProps {
  course: Course & { totalLessons?: number; _count?: { enrollments: number } };
  progress?: number;
  onClick: () => void;
}

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-green-500/10 text-green-600 dark:text-green-400',
  INTERMEDIATE: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  ADVANCED: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export function CourseCard({ course, progress, onClick }: CourseCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail || '/placeholder-course.jpg'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Category badge */}
          {course.category && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              {course.category}
            </Badge>
          )}

          {/* Level badge */}
          <Badge
            className={cn(
              'absolute top-3 right-3',
              levelColors[course.level] || levelColors.BEGINNER
            )}
          >
            {course.level}
          </Badge>

          {/* Duration */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-sm bg-black/50 px-2 py-1 rounded">
            <Clock className="h-3 w-3" />
            {formatDuration(course.duration)}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {course.description}
            </p>
          )}

          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={course.instructor.avatar || ''} />
                <AvatarFallback className="text-xs">
                  {course.instructor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {course.instructor.name}
              </span>
            </div>
          )}

          {/* Progress bar if enrolled */}
          {progress !== undefined && progress > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>{course.totalLessons || 0} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{course._count?.enrollments || 0} enrolled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
