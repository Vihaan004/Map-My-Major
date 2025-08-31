# MapMyMajor - Vercel + Supabase Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free)
- Supabase account (free)
- GoDaddy domain: mapmymajor.com

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to SQL Editor and run the `supabase-schema.sql` file
4. Go to Settings > API to get:
   - Project URL
   - Anon (public) key
   - Service role key

## Step 2: Prepare Your Repository

1. Push your code to GitHub (if not already done):
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Create environment files:
- Copy `.env.example` files and rename to `.env`
- Fill in the Supabase credentials

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project" and import your GitHub repository
3. Vercel will auto-detect the configuration from `vercel.json`

### Environment Variables to Set in Vercel:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-app.vercel.app/api
FRONTEND_URL=https://mapmymajor.com
GOOGLE_CLIENT_ID=your-google-client-id (optional for now)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional for now)
```

## Step 4: Connect Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add `mapmymajor.com` and `www.mapmymajor.com`
4. Vercel will provide DNS records to add in GoDaddy

### GoDaddy DNS Settings:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61 (Vercel's IP)
```

## Step 5: Test Your Deployment

1. Visit `https://mapmymajor.com`
2. Test user registration/login
3. Test creating maps and adding classes
4. Verify database operations work

## Troubleshooting

- Check Vercel deployment logs for errors
- Verify all environment variables are set
- Check Supabase logs for database issues
- Ensure CORS settings allow your domain

## Next Steps

- Set up Google OAuth for social login
- Add monitoring and analytics
- Set up automated backups for Supabase
