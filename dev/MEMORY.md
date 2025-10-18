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

### Phase 1 Backend Setup (October 18, 2025)
✅ **SUPABASE SETUP COMPLETED**
- Database URL: `https://zrhdufpoigkhjtlgznkm.supabase.co`
- Successfully created all 9 tables with proper relationships and indexes
- Enabled Row-Level Security (RLS) with appropriate access policies
- Generated TypeScript types from Supabase schema (`types/database.ts`)
- All connection strings configured in `.env`

**Key Schema Details:**
- 4 NextAuth.js tables (users, accounts, sessions, verification_tokens)
- 5 core application tables (maps, semesters, courses, classes, requirements)
- 4 custom enums (term, map_status, class_status, requirement_type)
- All JSONB fields for flexible data storage
- Proper cascade delete relationships

**RLS Policies Implemented:**
- Users can only access their own data (maps, semesters, classes)
- Courses and requirements are publicly readable
- NextAuth tables have permissive policies for authentication flow

**Other Key Files Created:**
- `prisma/schema.prisma` - Prisma ORM schema (complementary to SQL)
- `lib/db/prisma.ts` - Prisma client singleton
- `types/database.ts` - Generated TypeScript types from Supabase
- `types/index.ts` - Application-specific TypeScript types
- `lib/utils/helpers.ts` - Utility functions for calculations and formatting

---

**Note:** Keep this file clean and only add entries when specifically requested.