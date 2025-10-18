# Supabase Setup Guide for MapMyMajor

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in/sign up
2. Click "New Project"
3. Fill in the details:
   - **Name**: MapMyMajor (or your preferred name)
   - **Database Password**: Choose a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development
4. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Get Your Database Connection Strings

1. In your Supabase project dashboard, click on "Project Settings" (gear icon in sidebar)
2. Go to "Database" section
3. Scroll down to "Connection string"
4. You'll need TWO connection strings:

### Connection Pooler (for serverless/edge functions):
```
postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Direct Connection (for migrations):
```
postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**Important**: Replace `[YOUR-PASSWORD]` with the database password you created earlier!

## Step 3: Configure Your .env File

1. In your project root, create a `.env` file (or copy from `.env.example`)
2. Add your connection strings:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# NextAuth.js (we'll configure these later)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="" # Leave empty for now

# Google OAuth (we'll configure these later)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Step 4: Run Prisma Migrations

Once your `.env` is configured, run:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all the tables in your Supabase database
- Generate the Prisma Client
- Apply the initial migration

## Step 5: Verify in Supabase Dashboard

1. Go back to your Supabase project
2. Click "Table Editor" in the sidebar
3. You should see all your tables: users, maps, semesters, courses, classes, requirements, etc.

## Step 6: Generate Prisma Client

If not already generated, run:

```bash
npx prisma generate
```

## Optional: Get Supabase API Keys (for future features)

1. In Supabase project, go to "Project Settings" → "API"
2. Copy these values for later use:
   - **Project URL**: `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Your public API key

Add to `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Troubleshooting

### Migration fails with "relation already exists"
```bash
npx prisma migrate reset
```
This will drop all tables and re-run migrations.

### Connection timeout
- Check your database password is correct
- Ensure you're using the correct connection string format
- Check if your IP is allowed (Supabase allows all IPs by default)

### Prisma Client not found
```bash
npx prisma generate
```

---

## Next Steps

Once Supabase is connected and migrations are complete, we'll move on to:
1. Setting up NextAuth.js authentication
2. Creating API routes
3. Building the frontend

🎉 **You're ready to build!**
