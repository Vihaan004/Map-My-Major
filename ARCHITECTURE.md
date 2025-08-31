# Map My Major - Architecture Documentation

## System Overview

Map My Major is a web application that helps ASU undergraduate students plan, visualize, and track their degree program requirements through interactive course mapping. The system enables students to create multiple degree plans, organize courses by semester, and monitor progress toward graduation requirements.

## Core Entities & Data Models

### User Management
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Academic Programs
```typescript
interface Program {
  id: string;
  program_code: string; // e.g., "BS-CS"
  name: string; // e.g., "Computer Science"
  college: string; // e.g., "Fulton Schools of Engineering"
  total_credits: number;
  requirements: ProgramRequirement[];
  created_at: timestamp;
  updated_at: timestamp;
}

interface ProgramRequirement {
  id: string;
  program_id: string;
  category: string; // e.g., "HUAD", "SOBE", "SCIT", "QTRS"
  category_name: string; // e.g., "Humanities, Arts and Design"
  required_credits?: number;
  required_courses?: number;
  specific_courses?: string[]; // Array of course codes
  description?: string;
}
```

### Course Catalog
```typescript
interface Course {
  id: string;
  course_code: string; // e.g., "CSE110"
  subject: string; // e.g., "CSE"
  number: string; // e.g., "110"
  title: string; // e.g., "Principles of Programming"
  description: string;
  credit_hours: number;
  prerequisites?: string[]; // Array of course codes
  corequisites?: string[]; // Array of course codes
  requirement_categories: string[]; // e.g., ["QTRS", "CS-CORE"]
  offered_semesters: ("fall" | "spring" | "summer")[];
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Degree Planning
```typescript
interface DegreePlan {
  id: string;
  user_id: string;
  program_id: string;
  name: string; // User-defined plan name
  start_semester: "fall" | "spring" | "summer";
  start_year: number;
  is_active: boolean;
  created_at: timestamp;
  updated_at: timestamp;
}

interface PlanSemester {
  id: string;
  plan_id: string;
  semester: "fall" | "spring" | "summer";
  year: number;
  order_index: number; // For display ordering
  created_at: timestamp;
}

interface PlanCourse {
  id: string;
  semester_id: string;
  course_id: string;
  status: "planned" | "in_progress" | "completed" | "dropped";
  grade?: string; // e.g., "A", "B+", "C", etc.
  grade_points?: number; // Calculated from grade
  notes?: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

## Application Architecture

### Frontend Structure (Next.js 14 App Router)

```
/app
├── layout.tsx                 # Root layout with providers
├── page.tsx                  # Landing page
├── globals.css               # Global styles with Tailwind
├── (auth)/                   # Route group for auth pages
│   ├── login/
│   └── signup/
├── (dashboard)/              # Route group for authenticated pages
│   ├── layout.tsx           # Dashboard layout with navigation
│   ├── dashboard/           # User dashboard
│   ├── plans/               # Plan management
│   │   ├── page.tsx        # Plans list
│   │   ├── [planId]/       # Individual plan pages
│   │   │   ├── page.tsx    # Plan editor/viewer
│   │   │   └── settings/   # Plan settings
│   │   └── new/            # Create new plan
│   └── profile/            # User profile management
├── api/                     # API routes
│   ├── auth/               # Authentication endpoints
│   ├── plans/              # Plan CRUD operations
│   ├── courses/            # Course search and data
│   └── programs/           # Program data endpoints
└── components/
    ├── ui/                 # shadcn/ui components
    ├── auth/               # Authentication components
    ├── plans/              # Plan-related components
    │   ├── PlanEditor.tsx
    │   ├── SemesterColumn.tsx
    │   ├── CourseCard.tsx
    │   ├── CourseSearch.tsx
    │   └── RequirementTracker.tsx
    ├── courses/            # Course-related components
    └── layout/             # Layout components
        ├── Header.tsx
        ├── Sidebar.tsx
        └── Footer.tsx
```

### Component Hierarchy

```
PlanEditor
├── RequirementTracker
│   ├── RequirementCategory
│   │   ├── ProgressBar
│   │   └── CourseList
│   └── OverallProgress
├── SemesterGrid
│   └── SemesterColumn (multiple)
│       ├── SemesterHeader
│       ├── AddCourseButton
│       └── CourseCard (multiple)
│           ├── CourseInfo
│           ├── StatusIndicator
│           └── ActionMenu
└── CourseSearchModal
    ├── SearchInput
    ├── FilterOptions
    └── CourseSearchResults
        └── CourseSearchItem (multiple)
```

### Database Schema (Supabase PostgreSQL)

```sql
-- Users table (managed by Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  college TEXT NOT NULL,
  total_credits INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program requirements table
CREATE TABLE program_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  category_name TEXT NOT NULL,
  required_credits INTEGER,
  required_courses INTEGER,
  specific_courses TEXT[], -- Array of course codes
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  credit_hours INTEGER NOT NULL,
  prerequisites TEXT[], -- Array of course codes
  corequisites TEXT[], -- Array of course codes
  requirement_categories TEXT[], -- Array of requirement categories
  offered_semesters TEXT[] CHECK (offered_semesters <@ ARRAY['fall', 'spring', 'summer']),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Degree plans table
CREATE TABLE degree_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id),
  name TEXT NOT NULL,
  start_semester TEXT NOT NULL CHECK (start_semester IN ('fall', 'spring', 'summer')),
  start_year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan semesters table
CREATE TABLE plan_semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES degree_plans(id) ON DELETE CASCADE,
  semester TEXT NOT NULL CHECK (semester IN ('fall', 'spring', 'summer')),
  year INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_id, semester, year)
);

-- Plan courses table
CREATE TABLE plan_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID REFERENCES plan_semesters(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'dropped')),
  grade TEXT,
  grade_points NUMERIC(3,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_degree_plans_user_id ON degree_plans(user_id);
CREATE INDEX idx_plan_semesters_plan_id ON plan_semesters(plan_id);
CREATE INDEX idx_plan_courses_semester_id ON plan_courses(semester_id);
CREATE INDEX idx_courses_course_code ON courses(course_code);
CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_program_requirements_program_id ON program_requirements(program_id);
```

### State Management Architecture

**Global State (Zustand)**
```typescript
interface AppState {
  // User state
  user: User | null;
  
  // Current plan state
  currentPlan: DegreePlan | null;
  planSemesters: PlanSemester[];
  planCourses: PlanCourse[];
  
  // UI state
  selectedCourse: Course | null;
  isAddingCourse: boolean;
  activeModal: string | null;
  
  // Actions
  setCurrentPlan: (plan: DegreePlan) => void;
  addCourseToSemester: (courseId: string, semesterId: string) => void;
  removeCourseFromPlan: (planCourseId: string) => void;
  updateCourseStatus: (planCourseId: string, status: string) => void;
  moveCourse: (planCourseId: string, newSemesterId: string) => void;
}
```

**Server State (TanStack Query)**
- Course catalog queries with search and filtering
- Program data with requirements
- Plan CRUD operations with optimistic updates
- Real-time plan updates via Supabase subscriptions

### API Design

**REST Endpoints**
```typescript
// Authentication (Supabase Auth)
POST /auth/login
POST /auth/logout
GET  /auth/user

// Programs
GET  /api/programs                    # List all programs
GET  /api/programs/[id]              # Get specific program with requirements

// Courses
GET  /api/courses                    # Search courses with pagination
GET  /api/courses/[courseCode]       # Get specific course details

// Plans
GET  /api/plans                      # Get user's plans
POST /api/plans                      # Create new plan
GET  /api/plans/[planId]            # Get specific plan with all data
PUT  /api/plans/[planId]            # Update plan metadata
DELETE /api/plans/[planId]          # Delete plan

// Plan operations
POST /api/plans/[planId]/courses    # Add course to plan
PUT  /api/plans/[planId]/courses/[id] # Update course in plan
DELETE /api/plans/[planId]/courses/[id] # Remove course from plan
POST /api/plans/[planId]/semesters  # Add semester to plan
```

### Security & Authentication

**Authentication Flow**
1. Supabase Auth with Google OAuth integration
2. JWT tokens for API authentication
3. Row Level Security (RLS) policies on all tables
4. User can only access their own plans and data

**RLS Policies Example**
```sql
-- Users can only see their own plans
CREATE POLICY "Users can view own plans" ON degree_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own plans" ON degree_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Performance Considerations

**Frontend Optimizations**
- Code splitting by route using Next.js App Router
- Virtualization for large course lists
- Debounced search inputs
- Optimistic updates for better UX
- Image optimization for course/program assets

**Backend Optimizations**
- Database indexes on frequently queried columns
- Supabase connection pooling
- Edge functions for computationally intensive operations
- Cached course and program data

### Deployment Architecture

**Vercel (Frontend)**
- Automatic deployments from GitHub
- Edge functions for API routes
- Environment variables for configuration
- Custom domain support

**Supabase (Backend)**
- PostgreSQL database with automatic backups
- Real-time subscriptions for collaborative features
- Authentication management
- File storage for future features (transcripts, etc.)

### Future Scalability Considerations

**Data Growth**
- Partitioned tables for plan_courses by year
- Archived plans for graduated students
- Course catalog versioning for different academic years

**Feature Expansions**
- Multi-university support (additional database schemas)
- AI-powered course recommendations
- Collaborative planning features
- Mobile application (React Native with shared logic)
- Integration with university registration systems

### Monitoring & Analytics

**Error Tracking**
- Sentry integration for error monitoring
- Custom error boundaries in React components
- API error logging and alerting

**User Analytics**
- Plan creation and completion rates
- Course search patterns
- Feature usage metrics
- Performance monitoring