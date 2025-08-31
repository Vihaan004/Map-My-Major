# AI Agent Instructions for Map My Major

## Project Overview
Map My Major is a college course planning web app for ASU students. Read `README.md` and `ARCHITECTURE.md` thoroughly before making any changes. Always consult `PROJECT_MEMORY.md` for important context and decisions.

## Core Principles

### 1. Data Integrity
- **Course data is sacred**: Never modify course catalog data without explicit approval
- **Requirement tracking must be accurate**: Ensure all requirement calculations are precise
- **User data protection**: Always validate user permissions and data ownership

### 2. Code Quality Standards
- **TypeScript everywhere**: All new code must use TypeScript with strict mode
- **Component patterns**: Follow the established component hierarchy in ARCHITECTURE.md
- **Consistent styling**: Use Tailwind CSS classes and shadcn/ui components only
- **Error handling**: Implement proper error boundaries and loading states

### 3. Performance Requirements
- **Fast search**: Course search must respond within 200ms
- **Optimistic updates**: UI should update immediately for user actions
- **Minimal re-renders**: Use React.memo and useMemo appropriately
- **Database efficiency**: Always consider query performance and indexing

## Development Guidelines

### File Structure Rules
```
NEVER create files outside the established structure in ARCHITECTURE.md
ALWAYS place components in the correct directories:
- /components/ui/ - shadcn/ui components only
- /components/plans/ - Plan-related components
- /components/courses/ - Course-related components
- /components/auth/ - Authentication components
- /components/layout/ - Layout components
```

### Database Operations
```typescript
// ALWAYS use proper TypeScript interfaces
interface CourseSearchParams {
  query?: string;
  subject?: string;
  credits?: number;
  requirements?: string[];
}

// NEVER write raw SQL - use Supabase client methods
const { data, error } = await supabase
  .from('courses')
  .select('*')
  .ilike('title', `%${query}%`)
  .limit(50);
```

### Component Development
```typescript
// ALWAYS follow this component structure
interface ComponentProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // State and effects
  
  // Event handlers
  
  // Render
  return (
    <div className="proper-tailwind-classes">
      {/* Content */}
    </div>
  );
}
```

### State Management Rules
- **Zustand for client state**: User preferences, UI state, current plan data
- **TanStack Query for server state**: Course data, program data, plan CRUD
- **Never mix state management**: Don't put server data in Zustand
- **Optimistic updates**: Always update UI immediately, then sync with server

## Critical Business Logic

### Requirement Tracking System
```typescript
// CRITICAL: This logic calculates degree progress
function calculateRequirementProgress(
  requirement: ProgramRequirement,
  planCourses: PlanCourse[]
): RequirementProgress {
  // Must handle both credit-based and course-count requirements
  // Must filter by course status (completed/in-progress only)
  // Must account for courses satisfying multiple requirements
}
```

### Course Prerequisites
```typescript
// CRITICAL: Must validate prerequisites before allowing course addition
function validatePrerequisites(
  course: Course,
  completedCourses: string[]
): ValidationResult {
  // Check all prerequisites are met
  // Handle OR logic in prerequisites (e.g., "MATH142 OR MATH150")
  // Consider transfer credits and test scores
}
```

### Semester Validation
```typescript
// CRITICAL: Must enforce semester rules
function validateSemesterPlacement(
  course: Course,
  semester: PlanSemester
): ValidationResult {
  // Check if course is offered in that semester
  // Validate credit hour limits (typically 18-20 max)
  // Ensure prerequisites are satisfied by earlier semesters
}
```

## UI/UX Requirements

### Drag and Drop Behavior
- Courses can be moved between semesters
- Must validate prerequisites when moving
- Must update requirement progress in real-time
- Visual feedback for valid/invalid drop zones

### Course Search Modal
- Debounced search (300ms delay)
- Filter by subject, credits, requirements
- Show prerequisite warnings
- Highlight courses that satisfy unmet requirements

### Requirement Tracker
- Real-time progress updates
- Visual progress bars with completion percentages
- Color coding: red (unmet), yellow (in-progress), green (complete)
- Expandable to show which courses satisfy each requirement

## Testing Requirements

### Unit Tests Required For
- All business logic functions (requirement calculations, validations)
- Component state management
- API endpoints
- Database queries

### Integration Tests Required For
- Complete user flows (create plan, add courses, track progress)
- Authentication flows
- Real-time updates between components

### E2E Tests Required For
- Full degree planning workflow
- Course search and addition
- Requirement tracking accuracy

## Security Guidelines

### Authentication
- Always verify user ownership of plans before operations
- Use Supabase RLS policies for all data access
- Never expose sensitive user data in API responses
- Implement proper session management

### Data Validation
```typescript
// ALWAYS validate input data
import { z } from 'zod';

const CreatePlanSchema = z.object({
  name: z.string().min(1).max(100),
  program_id: z.string().uuid(),
  start_semester: z.enum(['fall', 'spring', 'summer']),
  start_year: z.number().min(2020).max(2030)
});
```

## API Guidelines

### Endpoint Naming
```
GET    /api/plans              # List user's plans
POST   /api/plans              # Create new plan
GET    /api/plans/[id]         # Get plan details
PUT    /api/plans/[id]         # Update plan
DELETE /api/plans/[id]         # Delete plan

GET    /api/courses            # Search courses
GET    /api/courses/[code]     # Get course details

GET    /api/programs           # List programs
GET    /api/programs/[id]      # Get program requirements
```

### Response Format
```typescript
// Success response
{
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// Error response
{
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## Common Pitfalls to Avoid

### ❌ DON'T
- Hardcode ASU-specific data in components (keep in database)
- Create duplicate course entries when adding to plans
- Forget to update requirement progress after course changes
- Mix client and server state management
- Skip error boundaries in components
- Use any/unknown types in TypeScript
- Directly manipulate DOM (use React patterns)

### ✅ DO
- Always read PROJECT_MEMORY.md before starting work
- Update PROJECT_MEMORY.md with important decisions
- Use the established component patterns
- Implement proper loading and error states
- Write descriptive commit messages
- Ask for clarification before making architectural changes
- Test edge cases (empty states, error conditions)

## Working with Existing Code

### Before Making Changes
1. Read the component/file thoroughly
2. Understand the existing patterns and conventions
3. Check for related tests that might break
4. Consider impact on other components
5. Update PROJECT_MEMORY.md with your changes

### When Adding Features
1. Check if similar functionality already exists
2. Follow the established patterns in ARCHITECTURE.md
3. Consider how it affects requirement tracking
4. Ensure proper TypeScript types
5. Add appropriate tests

### When Fixing Bugs
1. Reproduce the bug in development
2. Write a test that captures the bug
3. Fix the bug while keeping the test passing
4. Consider if the fix affects other areas
5. Update documentation if needed

## Deployment Checklist

### Before Deploying
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console errors in development
- [ ] Database migrations are ready
- [ ] Environment variables are configured
- [ ] Performance regression tests pass

### After Deploying
- [ ] Verify critical user flows work
- [ ] Check database performance
- [ ] Monitor error rates
- [ ] Update PROJECT_MEMORY.md with deployment notes

## Communication Protocol

### When Working with Other Agents
- Always check PROJECT_MEMORY.md first
- Log important decisions in PROJECT_MEMORY.md
- Use clear commit messages that explain the "why"
- Tag major architectural changes for review
- Document any deviations from the established patterns

### When Asking for Help
- Provide relevant code context
- Explain what you've tried
- Reference specific files and line numbers
- Include error messages or unexpected behavior
- Suggest potential solutions if you have them

## Emergency Procedures

### If You Break Something Critical
1. Immediately revert the problematic changes
2. Log the issue in PROJECT_MEMORY.md
3. Create a detailed bug report with reproduction steps
4. Do not attempt multiple fixes without understanding the root cause

### If You're Unsure About a Change
1. Create a detailed plan in PROJECT_MEMORY.md
2. Explain the change and its potential impacts
3. Ask for explicit approval before proceeding
4. Consider creating a feature branch for complex changes

Remember: This is an MVP for ASU students. Focus on core functionality, user experience, and data accuracy above all else.