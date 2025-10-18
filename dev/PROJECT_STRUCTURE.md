# MapMyMajor - Project Structure

```
map-my-major/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Protected routes group
│   │   ├── dashboard/
│   │   ├── maps/[mapId]/
│   │   ├── courses/
│   │   └── account/
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth.js endpoints
│   │   ├── maps/
│   │   ├── courses/
│   │   ├── semesters/
│   │   ├── classes/
│   │   └── requirements/
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── maps/                     # Map-related components
│   ├── courses/                  # Course-related components
│   └── layout/                   # Layout components
│
├── lib/                          # Utility libraries
│   ├── db/
│   │   └── prisma.ts             # Prisma client singleton
│   ├── auth/
│   │   └── auth-options.ts       # NextAuth configuration
│   └── utils/
│       └── helpers.ts            # Utility functions
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Shared types
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
│
├── middleware/                   # Next.js middleware
│   └── auth-middleware.ts        # Authentication middleware
│
├── public/                       # Static assets
│
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
│
└── Documentation/
    ├── README.md                 # Project overview
    ├── AGENTS.md                 # Development guidelines
    ├── ARCHITECTURE.md           # Technical architecture
    ├── WORKFLOW.md               # Application workflows
    ├── MEMORY.md                 # Project memory/changelog
    └── SUPABASE_SETUP.md         # Database setup guide
```

## Key Folders Explained

### `/app`
- Next.js 14+ App Router structure
- Route groups for organization (e.g., `(auth)`, `(dashboard)`)
- API routes in `/app/api`

### `/lib`
- Business logic and utilities
- Database connections
- Authentication configuration
- Helper functions

### `/types`
- TypeScript interfaces and types
- Shared across application
- Complements Prisma-generated types

### `/components`
- Reusable React components
- Organized by feature/domain

### `/prisma`
- Database schema definition
- Migration history
- Seed files (future)

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - Supabase connection string (pooler)
- `DIRECT_URL` - Supabase direct connection (for migrations)
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret

## Development Workflow

1. **Database Changes**: Edit `prisma/schema.prisma` → Run `npx prisma migrate dev`
2. **API Routes**: Create in `app/api/[route]/route.ts`
3. **Components**: Create in `components/[domain]/[component].tsx`
4. **Types**: Add to `types/index.ts` or create new type file
5. **Utilities**: Add to `lib/utils/helpers.ts` or create new utility file

## Important Files

- `SUPABASE_SETUP.md` - How to connect database
- `ARCHITECTURE.md` - Complete data structure and workflows
- `AGENTS.md` - Development principles and guidelines
- `MEMORY.md` - Project decisions and changes log
