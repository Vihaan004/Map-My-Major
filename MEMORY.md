# Project Memory - MapMyMajor
**Last Updated:** October 18, 2025

## Project Essentials

**Core Idea:** A Web App to plan, visualize, and track academic programs by creating interactive and customizable 'maps' coupled with advising support and college data integrations. Designed to assist students in organizing their academic journey effectively. 

**Tech Stack:**
- Frontend: Next.js + React + TypeScript + Tailwind CSS
- Backend and APIs: Next.js Server Actions + route handlers + Supabase Postgres  
- Deployment: Vercel + Supabase

**Key Information Files:**
- `AGENTS.md` - Development guidelines for agents
- `README.md` - Primary project description, features, and deliverables
- `WORKFLOW.md` - Application workflow and data structure
- `MEMORY.md` - Record important changes in project structure and workflow

---

## Memory Entries

### Phase 1 Backend Setup COMPLETED ✅

#### Database & Authentication (Completed)
- **Supabase Setup:** Database URL `https://zrhdufpoigkhjtlgznkm.supabase.co`
- **9 Tables Created:** users, accounts, sessions, verification_tokens, maps, semesters, courses, classes, requirements
- **RLS Enabled:** Users can only access their own maps/data; courses/requirements are public
- **NextAuth.js:** JWT-based auth with Google OAuth, manual Supabase sync using service role key
- **Key Decision:** Abandoned Prisma adapter approach due to connection pooler complexity, using direct Supabase client instead

#### API Routes (Completed)
All backend API routes have been implemented with proper authentication, validation, and error handling:

**Maps API:**
- `GET /api/maps` - List all user maps
- `POST /api/maps` - Create new map
- `GET /api/maps/[id]` - Get single map
- `PUT /api/maps/[id]` - Update map
- `DELETE /api/maps/[id]` - Delete map (cascades to semesters and classes)

**Courses API:**
- `GET /api/courses` - List all courses with filtering (search, subject, credit_hours)
- `POST /api/courses` - Create new course
- `GET /api/courses/[id]` - Get single course
- `PUT /api/courses/[id]` - Update course
- `DELETE /api/courses/[id]` - Delete course (prevents deletion if used in any maps)

**Semesters API:**
- `POST /api/maps/[mapId]/semesters` - Create semester in map
- `GET /api/maps/[mapId]/semesters` - List all semesters in map
- `GET /api/semesters/[id]` - Get single semester
- `PUT /api/semesters/[id]` - Update semester
- `DELETE /api/semesters/[id]` - Delete semester (prevents deletion if contains classes)

**Classes API:**
- `POST /api/maps/[mapId]/classes` - Create class in map
- `GET /api/maps/[mapId]/classes` - List all classes in map (optional semester filter)
- `GET /api/classes/[id]` - Get single class
- `PUT /api/classes/[id]` - Update class
- `DELETE /api/classes/[id]` - Delete class
- `PATCH /api/classes/[id]` - Move class to different semester (special endpoint)

**Requirements API:**
- `GET /api/requirements` - List all requirements with filtering (search, type, category, is_custom)
- `POST /api/requirements` - Create new requirement
- `GET /api/requirements/[id]` - Get single requirement
- `PUT /api/requirements/[id]` - Update requirement
- `DELETE /api/requirements/[id]` - Delete requirement (only custom requirements can be deleted)

**Important Implementation Details:**
- All routes use `getServerSession(authOptions)` for authentication
- All routes use `supabaseAdmin` client for database operations (bypasses RLS)
- All routes use Zod schemas for request validation
- All routes use `nanoid()` for generating unique IDs
- Enum values are UPPERCASE (e.g., 'FALL', 'SPRING', 'SUMMER', 'PLANNED', 'IN_PROGRESS', 'COMPLETED')
- Courses table uses split fields: `course_code`, `subject`, `number`, `name`, `credit_hours`
- Classes table duplicates course data for historical preservation: `class_code`, `class_subject`, `class_number`, `class_name`, `class_credits`
- Ownership verification for nested resources (semesters, classes) done through joins with maps table

#### Key Files Created
- `lib/auth/auth-options.ts` - NextAuth configuration with JWT sessions and Supabase sync
- `lib/db/supabase-admin.ts` - Centralized admin client with service role key
- `app/api/maps/route.ts` & `app/api/maps/[mapId]/route.ts` - Maps CRUD (consolidated from [id])
- `app/api/courses/route.ts` & `app/api/courses/[id]/route.ts` - Courses CRUD
- `app/api/maps/[mapId]/semesters/route.ts` & `app/api/semesters/[id]/route.ts` - Semesters CRUD
- `app/api/maps/[mapId]/classes/route.ts` & `app/api/classes/[id]/route.ts` - Classes CRUD
- `app/api/requirements/route.ts` & `app/api/requirements/[id]/route.ts` - Requirements CRUD
- `app/test-api/page.tsx` - Interactive API testing dashboard with comprehensive cleanup

#### Backend Testing Complete ✅
- **Testing Dashboard:** Created interactive React-based testing UI at `/test-api`
- **Test Coverage:** All 26 API endpoints tested successfully
- **Cleanup Function:** Enhanced to delete ALL user data (not just tracked test data)
  - Fetches all classes, courses, maps, requirements
  - Deletes each resource via API calls
  - Includes confirmation dialog to prevent accidental data loss
  - Button styled in red with warning emoji for visibility
- **Route Conflict Fixed:** Consolidated map routes under `[mapId]` naming (removed duplicate `[id]` folder)

#### Next Steps
- Phase 2: Frontend UI development (maps list, map builder, course search, etc.)
- Configured NextAuth.js with Supabase adapter
- Google OAuth provider setup (requires Google Cloud credentials)
- JWT session strategy with 30-day expiration
- Server-side helpers: `getSession()`, `getCurrentUser()`, `requireAuth()`
- Client-side hook: `useAuth()` for React components
- Route protection via middleware for `/dashboard`, `/maps`, `/courses`, `/account`
- Authentication pages: `/login` (Google OAuth), `/dashboard` (protected)
- Session provider wrapped in root layout

**Environment Variables Added:**
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Generated secret for session encryption
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for NextAuth adapter

**Documentation Created:**
- `GOOGLE_OAUTH_SETUP.md` - Complete guide for Google Cloud setup
- `PHASE1_AUTH_COMPLETE.md` - Authentication implementation summary

**Next:** API route creation for Maps, Courses, Semesters, Classes, and Requirements

---

**Note:** Keep this file clean and only add entries when specifically requested.