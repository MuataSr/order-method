'use client';

import { useQuery } from '@tanstack/react-query';
import { useCourseStore, Course } from '@/lib/stores/course-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CourseCard } from './course-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Web Development', 'Frontend', 'Data Science', 'Design', 'Backend'];
const levels = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export function CatalogView() {
  const { setCurrentCourse, setCurrentView } = useCourseStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      return res.json();
    },
  });

  // Fetch enrollments to show progress
  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/enrollments?userId=${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Filter courses
  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get enrollment progress for a course
  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find((e: { courseId: string; progress: number }) => e.courseId === courseId);
    return enrollment?.progress;
  };

  const handleCourseClick = (course: Course) => {
    setCurrentCourse(course);
    setCurrentView('course');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Course Catalog</h1>
        <p className="text-muted-foreground mt-1">
          Explore {courses.length} courses to enhance your skills
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level filter */}
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level === 'All' ? level : level.charAt(0) + level.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="rounded-r-none"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="rounded-l-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory !== 'All' || selectedLevel !== 'All') && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedCategory !== 'All' && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSelectedCategory('All')}
            >
              {selectedCategory} ×
            </Badge>
          )}
          {selectedLevel !== 'All' && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSelectedLevel('All')}
            >
              {selectedLevel} ×
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredCourses.length} of {courses.length} courses
      </p>

      {/* Course grid/list */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses found matching your criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredCourses.map((course: Course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CourseCard
                  course={course}
                  progress={getEnrollmentProgress(course.id)}
                  onClick={() => handleCourseClick(course)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course: Course) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <img
                src={course.thumbnail || '/placeholder-course.jpg'}
                alt={course.title}
                className="w-32 h-24 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{course.category}</span>
                  <Badge variant="outline">{course.level}</Badge>
                  <span>{Math.round(course.duration / 60)}h</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
