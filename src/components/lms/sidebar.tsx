'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useCourseStore } from '@/lib/stores/course-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Calendar,
  Lock,
  Search,
  Building2,
  LogOut,
  User,
  Users,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  locked?: boolean;
}

const studentNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'module-1', label: 'Module 1: Own Your Clock', icon: Calendar, href: '/module/1' },
  { id: 'module-2', label: 'Module 2: Review What Works', icon: Search, href: '/module/2' },
  { id: 'module-3', label: 'Module 3: Develop Systems', icon: Building2, href: '/module/3' },
  { id: 'module-4', label: 'Module 4: Educate & Empower Teams', icon: Users, href: '/module/4' },
  { id: 'module-5', label: 'Module 5: Results & Celebrate', icon: Trophy, href: '/module/5' },
];

const adminNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'users', label: 'User Management', icon: Users, href: '/admin?tab=users' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin?tab=analytics' },
  { id: 'module-1', label: 'Module 1: Own Your Clock', icon: Calendar, href: '/admin/module/1' },
  { id: 'module-2', label: 'Module 2: Review What Works', icon: Search, href: '/admin/module/2' },
  { id: 'module-3', label: 'Module 3: Develop Systems', icon: Building2, href: '/admin/module/3' },
  { id: 'module-4', label: 'Module 4: Educate & Empower Teams', icon: Users, href: '/admin/module/4' },
  { id: 'module-5', label: 'Module 5: Results & Celebrate', icon: Trophy, href: '/admin/module/5' },
];

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSidebarOpen, setSidebarOpen } = useCourseStore();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = useMemo(() => {
    if (user?.role === 'ADMIN') {
      return adminNavItems;
    }
    return studentNavItems;
  }, [user?.role]);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapse?.(value);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    if (href.includes('?')) {
      const [basePath, query] = href.split('?');
      const [paramKey, paramValue] = query.split('=');
      return pathname === basePath && searchParams.get(paramKey) === paramValue;
    }
    if (pathname === '/admin') {
      return href === '/admin' && !searchParams.get('tab');
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

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

      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          x: isMobile ? (isSidebarOpen ? 0 : -280) : 0,
        }}
        className={cn(
          'fixed left-0 top-0 h-full bg-card border-r border-border z-50',
          'transition-all duration-300',
          'flex flex-col'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Trophy className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">O.R.D.E.R.</span>
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

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isLocked = item.locked;
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-2',
                  isLocked && 'opacity-60 pointer-events-none'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="truncate flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && isLocked && (
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-3 w-full rounded-lg p-2 hover:bg-muted transition-colors',
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
                      className="flex-1 min-w-0 text-left"
                    >
                      <p className="font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.role}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={collapsed ? 'center' : 'end'} side="top" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>
    </>
  );
}
