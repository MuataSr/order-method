'use client';

import { useCourseStore, ViewMode } from '@/lib/stores/course-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'catalog', label: 'Course Catalog', icon: BookOpen },
  { id: 'admin', label: 'Admin Panel', icon: Settings },
];

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapse }: SidebarProps) {
  const { currentView, setCurrentView, isSidebarOpen, setSidebarOpen } = useCourseStore();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapse?.(value);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          x: isSidebarOpen ? 0 : -280,
        }}
        className={cn(
          'fixed left-0 top-0 h-full bg-card border-r border-border z-50',
          'lg:translate-x-0 transition-all duration-300',
          'flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">LearnHub</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => handleCollapse(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                collapsed && 'justify-center px-2'
              )}
              onClick={() => {
                setCurrentView(item.id);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div
            className={cn(
              'flex items-center gap-3',
              collapsed && 'justify-center'
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || ''} />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.role}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
