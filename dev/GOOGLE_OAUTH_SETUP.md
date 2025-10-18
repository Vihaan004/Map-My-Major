# Google OAuth Setup Guide (2025 - Updated)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Name it "MapMyMajor" (or your preferred name)
5. Click "Create"

## Step 2: Configure OAuth Consent Screen

**Note:** You do NOT need to enable any APIs for basic OAuth!

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in the required information:
   - **App name**: MapMyMajor
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. **Scopes**: Click "Add or Remove Scopes"
   - Add these Google scopes (they're pre-approved, no verification needed):
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Or just skip this - NextAuth will request minimal scopes automatically
7. Click "Save and Continue"
8. **Test users** (Optional for development):
   - Add your email address if you want to test before publishing
   - Click "Save and Continue"
9. Review and click "Back to Dashboard"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Fill in:
   - **Name**: MapMyMajor Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
5. Click "Create"
6. **SAVE THESE CREDENTIALS!**
   - Copy the **Client ID** 
   - Copy the **Client Secret**

## Step 4: Add to .env File

Add the credentials to your `.env` file:

```env
GOOGLE_CLIENT_ID="1234567890-abc123xyz.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your_client_secret_here"
```

## Step 5: Get Supabase Service Role Key

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `zrhdufpoigkhjtlgznkm`
3. Click on "Project Settings" (gear icon)
4. Go to "API" section
5. Under "Project API keys", find and copy the **service_role** key
   - ⚠️ **NOT** the `anon` key - you need the `service_role` key!
6. Add to `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

⚠️ **IMPORTANT**: The service role key bypasses RLS - keep it secret, server-side only!

## Complete .env File

Your `.env` should now have all required variables:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.zrhdufpoigkhjtlgznkm:[AskMMM4*pass]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.zrhdufpoigkhjtlgznkm:[AskMMM4*pass]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="xSY0tQVFzEyf2Vbn46h2tCOvO1MoMVczLm8u9glpjNs="

# Google OAuth
GOOGLE_CLIENT_ID="1234567890-abc123xyz.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your_client_secret_here"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://zrhdufpoigkhjtlgznkm.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyaGR1ZnBvaWdraGp0bGd6bmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjE5MTksImV4cCI6MjA3NjMzNzkxOX0.9Dyh82DYowXcxGOYux4jtfz-kyBucxizHGAIEp3TTo0"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6..." # Get from Supabase
```

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click "Continue with Google"

4. Sign in with your Google account

5. You should be redirected to `/dashboard`

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:** 
- Verify redirect URI in Google Console is exactly: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes, no `https` for localhost

### Error: "Access blocked: This app's request is invalid"
**Solution:**
- Make sure OAuth consent screen is configured
- If testing, add your email as a test user
- Check that you selected "External" user type

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"
**Solution:**
- Go to Supabase Dashboard > Settings > API
- Copy the **service_role** key (bottom one, longer key)
- NOT the anon/public key (top one)

### Sign in works but user not saved to database
**Solution:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase logs for errors
- Ensure RLS policies are enabled (we already set this up)

## Production Deployment

When ready to deploy:

1. **Update Google OAuth settings:**
   - Add production domain to "Authorized JavaScript origins"
   - Add production callback to "Authorized redirect URIs":
     - `https://yourdomain.com/api/auth/callback/google`

2. **Publish OAuth Consent Screen** (optional):
   - Go to OAuth consent screen
   - Click "Publish App" 
   - Only needed if you want anyone to sign in (not just test users)

3. **Update environment variables:**
   - Set `NEXTAUTH_URL` to your production URL
   - Ensure all secrets are set in your hosting platform (Vercel, etc.)

## Summary: What You Actually Need

✅ **Required:**
- Google Cloud Project
- OAuth Consent Screen configured (External, with app name and emails)
- OAuth 2.0 Client ID credentials
- Client ID and Client Secret in `.env`
- Supabase Service Role Key in `.env`

❌ **NOT Required:**
- ~~Google+ API~~ (deprecated, not needed!)
- ~~Any other Google APIs~~
- ~~App verification~~ (only for production with >100 users)
- ~~Additional scopes~~ (NextAuth handles basic profile/email automatically)

---

✅ **Minimal Setup Complete!**
