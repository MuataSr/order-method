# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ORDER is a Learning Management System (LMS) built with Next.js 16, TypeScript, and Prisma. It supports three user roles (Student, Instructor, Admin) and provides course management, progress tracking, quizzes, and social features.

## Development Commands

```bash
# Development (runs on port 3000, logs to dev.log)
bun run dev

# Production build
bun run build

# Production server (logs to server.log)
bun start

# Linting
bun run lint

# Database operations
bun run db:push      # Push schema changes to database
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run migrations
bun run db:reset     # Reset database (destructive)
```

**Note:** This project uses Bun as the runtime, not npm or yarn.

## Architecture

### State Management Pattern

The app uses a dual-state architecture:

1. **Client State (Zustand)** - `src/lib/stores/`
   - `auth-store.ts` - User authentication with persistence (key: `lms-auth-store`)
   - `course-store.ts` - View routing, current course/lesson selection, sidebar state, search/filters

2. **Server State (TanStack Query)** - API data fetching with caching

### View Routing System

The app uses **client-side view routing** via Zustand store, not Next.js routing:
- Views: `dashboard`, `catalog`, `course`, `lesson`, `admin`, `module-1`, `module-2`, `module-3`
- Controlled by `useCourseStore` state in `course-store.ts`
- The main `page.tsx` renders different views based on `currentView`

### API Structure

RESTful API routes in `src/app/api/`:
- `/api/admin/*` - Admin-only endpoints
- `/api/courses/*` - Course CRUD and enrollment
- `/api/user/*` - User profile and authentication
- `/api/modules/progress` - GET/POST for module progress tracking (currentPhase, completedGates, status)
- `/api/modules/gate-submissions` - GET/POST for gate submission data

### Database Models (Prisma)

Key relationships to understand:
- `User` has three roles: STUDENT, INSTRUCTOR, ADMIN
- `Course` → `Module` → `Lesson` (cascade delete)
- `Quiz` belongs to `Lesson` (1:1)
- `Enrollment` joins `User` + `Course` (unique constraint)
- `LessonProgress` joins `User` + `Lesson` (unique constraint, tracks completion)

### Component Organization

- `src/components/ui/` - shadcn/ui components (56+ Radix-based components)
- `src/components/lms/` - Domain-specific components (sidebar, views, course player)

### Production Build

The app uses Next.js standalone output. After `bun run build`:
- Static assets are copied to `.next/standalone/`
- Production runs with `NODE_ENV=production bun .next/standalone/server.js`

## Key Type Definitions

TypeScript types are centralized in store files:
- `UserRole` and `User` in `auth-store.ts`
- `Course`, `Module`, `Lesson`, `Quiz`, `Enrollment` in `course-store.ts`

When adding new features, keep types in sync with Prisma schema.

## Database Provider

Currently uses SQLite (`provider = "sqlite"` in schema.prisma). For production, update the `datasource db` provider and `DATABASE_URL` environment variable.

## O.R.D.E.R. Framework Modules

The LMS contains specialized modules implementing the O.R.D.E.R. framework:

### Module Structure
- `src/components/lms/module-1/` - "Owning Your Clock" - Time Management (10-day course)
- `src/components/lms/module-2/` - "Review What Works" - Workflow Analysis
- `src/components/lms/module-3/` - "Develop Systems" - Systems Architecture (4 phases, 15 gates)

### Module 3 Architecture
Module 3 has a more complex structure than other modules:
- `module-3-view.tsx` - Main entry point with overview/phase view toggle
- `module-3-phase-view.tsx` - Phase-specific content rendering
- `phase-content/` - Sub-components for phase details (overview, gate list, gate content, navigation)
- `hooks/` - Custom React hooks (e.g., `use-gate-submission.ts`)
- `constants.ts` - Module metadata, phases, gates, animation settings
- `types.ts` - TypeScript interfaces specific to Module 3
- `utils.ts` - Helper functions for progress calculation, phase completion checks

### Module-Specific API Routes
- `/api/modules/progress` - GET/POST for module progress tracking (currentPhase, completedGates, status)
- `/api/modules/gate-submissions` - GET/POST for gate submission data
- Both routes accept `userId`, `courseId`, `moduleName` parameters

### Badge System
Each module awards a completion badge:
- Module 1: "Time Master" - after completing all gates
- Module 2: "Workflow Analyst" - after completing all gates
- Module 3: "Systems Architect" - after completing all 15 gates across 4 phases

### Module Progress State
Store fields for tracking module progress:
- `moduleOneData`, `moduleTwoData`, `moduleThreeData` - Progress data objects
- `currentDay`, `currentDayModule2`, `currentPhaseModule3` - Current position in module
- `completedGates`, `completedGatesModule2`, `completedGatesModule3` - Array of completed gate names
- `systemsPlaybook` - Module 3: Array of documented workflows with `{workflowTitle, steps, owner, metrics}`
