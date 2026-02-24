# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

ORDER is a Learning Management System (LMS) built with Next.js 16, TypeScript, and Prisma. It supports three user roles (Student, Instructor, Admin) and provides course management, progress tracking, quizzes, and the O.R.D.E.R. framework modules.

## Build/Lint/Test Commands

```bash
bun run dev              # Development server (port 3000)
bun run build            # Production build
bun run lint             # Run ESLint

# Unit/Component tests (Vitest)
bun run test             # Run tests in watch mode
bun run test:run         # Run all tests once
bun run test:coverage    # Run tests with coverage
bun run test path/to/file.test.ts     # Run single test file
bun run test:run path/to/file.test.ts # Run single test once

# E2E tests (Playwright)
bun run test:e2e         # Run E2E tests
bun run test:e2e:ui      # Run E2E tests with UI

# Database operations
bun run db:push          # Push schema changes (dev)
bun run db:generate      # Generate Prisma client
bun run db:migrate       # Run migrations (prod)
```

**Note:** Use `bun` commands, not npm or yarn.

## Test Stack

- **Vitest** - Unit/component tests (Jest-compatible API)
- **React Testing Library** - Component testing
- **Playwright** - E2E browser testing

Test locations:
- Unit tests: `src/**/*.test.{ts,tsx}` or `src/**/__tests__/*.test.{ts,tsx}`
- E2E tests: `e2e/*.spec.ts`

## Code Style Guidelines

### Imports

```typescript
// Order: React/Next → External libraries → Internal modules
import { useState } from 'react';
import { NextResponse } from 'next/server';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { db } from '@/lib/db';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CourseCard } from '@/components/lms/course-card';
import { cn } from '@/lib/utils';
```

- Use `@/*` path alias for internal imports
- Use `import type` when only types are needed

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CourseCard`, `ModuleOneView` |
| Component files | kebab-case | `course-card.tsx` |
| Hooks | camelCase with `use` prefix | `useGateSubmission` |
| Hook files | kebab-case | `use-gate-submission.ts` |
| Types/Interfaces | PascalCase | `Course`, `LessonProgress` |
| Constants | SCREAMING_SNAKE_CASE | `PHASES` |
| Store files | kebab-case with `-store` | `auth-store.ts` |
| API routes | lowercase | `route.ts` |
| DB models | PascalCase | `User`, `Course` |
| DB tables | snake_case (via `@@map`) | `users`, `module_progress` |

### TypeScript

```typescript
// Prefer interface for object types
interface CourseCardProps {
  course: Course;
  progress?: number;
  onClick: () => void;
}

// Use type for unions
export type ViewMode = 'dashboard' | 'catalog' | 'course' | 'lesson' | 'admin';
export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

// Use const assertions for readonly objects
const levelColors: Record<string, string> = {
  BEGINNER: 'bg-green-500/10 text-green-600',
  INTERMEDIATE: 'bg-yellow-500/10 text-yellow-600',
};
```

- TypeScript strict mode enabled, `noImplicitAny` disabled
- ESLint config is relaxed - many rules are off
- Avoid adding comments unless requested

### Component Structure

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  isActive?: boolean;
  onAction: () => void;
}

export function MyComponent({ title, isActive = false, onAction }: MyComponentProps) {
  const [localState, setLocalState] = useState(false);

  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className={cn('base-classes', isActive && 'active-classes')}>
        <CardContent>
          {/* content */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

- Include `'use client'` directive at top of client components
- Use named exports: `export function ComponentName()`
- Use `cn()` utility for conditional class names
- Destructure props with defaults for optional props

### State Management

**Client State (Zustand):**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'lms-auth-store' }
  )
);
```

**Server State (TanStack Query):**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: async () => {
    const res = await fetch('/api/courses');
    return res.json();
  },
});
```

- Stores are in `src/lib/stores/`
- Use `persist` middleware for data surviving page refresh
- Store types defined in same file as store

### API Routes

```typescript
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.course.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await db.course.create({ data: body });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
```

- Use `db` from `@/lib/db` for Prisma operations
- Always wrap in try-catch with `console.error`
- Return errors as JSON with status codes

### Error Handling

- API routes: try-catch with `console.error()`, return JSON errors
- Client components: React state for error messages or toast notifications
- Hooks: Throw errors for caller to handle

### UI Components

- shadcn/ui components: `src/components/ui/` - use for UI primitives
- Domain components: `src/components/lms/`
- Use Radix UI via shadcn for complex interactions (dialog, dropdown)
- Use Framer Motion (`motion`) for animations
- Use Lucide React for icons: `import { Clock, User } from 'lucide-react'`

### Database

- Prisma schema: `prisma/schema.prisma`
- After schema changes: `bun run db:push` (dev) or `bun run db:migrate` (prod)
- Use `@@map("table_name")` for snake_case table names

## Architecture Notes

### View Routing

App uses client-side view routing via Zustand store, not Next.js routing:
- Views: `dashboard`, `catalog`, `course`, `lesson`, `admin`, `module-1`, `module-2`, `module-3`
- Controlled by `useCourseStore` in `course-store.ts`
- Main `page.tsx` renders views based on `currentView` state

### Module Structure

- Module 1: `src/components/lms/module-1/` - Time Management
- Module 2: `src/components/lms/module-2/` - Workflow Analysis
- Module 3: `src/components/lms/module-3/` - Systems Architecture

## Environment

- Runtime: Bun
- Database: SQLite (dev), configurable for production
- Framework: Next.js 16 with App Router
