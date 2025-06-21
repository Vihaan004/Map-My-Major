# Railway Deployment Guide for Map My Major

## Overview
This guide explains how to deploy the Map My Major full-stack application (React + Node.js + PostgreSQL) on Railway.

## Prerequisites
- Railway account connected to your GitHub
- Google Cloud Console account for OAuth setup

## Step-by-Step Deployment

### 1. Create Services on Railway

1. **Backend Service:**
   - Go to your Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `Map-My-Major` repository
   - Click "Add Service" → "GitHub Repo"
   - Set the **Root Directory** to: `app/backend`
   - Railway will automatically detect it's a Node.js app

2. **Frontend Service:**
   - In the same project, click "Add Service" → "GitHub Repo"
   - Select your `Map-My-Major` repository again
   - Set the **Root Directory** to: `app/frontend`
   - Railway will automatically detect it's a Vite app

3. **Database Service:**
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Railway will automatically create a PostgreSQL database

### 2. Configure Environment Variables

#### Backend Service Environment Variables:
```
NODE_ENV=production
JWT_SECRET=your-strong-jwt-secret-here
SESSION_SECRET=your-strong-session-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-service.railway.app
```

**Note:** Railway automatically provides `DATABASE_URL` for PostgreSQL connection.

#### Frontend Service Environment Variables:
```
VITE_API_URL=https://your-backend-service.railway.app/api
```

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add authorized origins:
   - `https://your-frontend-service.railway.app`
5. Add authorized redirect URIs:
   - `https://your-backend-service.railway.app/api/users/auth/google/callback`

### 4. Deploy Order

1. **Deploy Backend First:**
   - The backend service will automatically deploy
   - Database migrations will run via the `postinstall` script
   - Check logs to ensure successful deployment

2. **Deploy Frontend:**
   - Update the `VITE_API_URL` environment variable with your backend URL
   - The frontend will build and deploy automatically

### 5. Custom Domains (Optional)

If you want custom domains:
1. Go to your service settings
2. Click "Domains"
3. Add your custom domain
4. Update environment variables accordingly

### 6. Monitoring and Logs

- Use Railway's built-in logging to monitor deployments
- Check both services are running without errors
- Test the authentication flow end-to-end

## Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Ensure `DATABASE_URL` is automatically set by Railway
   - Check if migrations ran successfully in logs

2. **CORS Errors:**
   - Verify `FRONTEND_URL` is set correctly in backend
   - Check that frontend is using correct API URL

3. **Authentication Issues:**
   - Verify Google OAuth credentials are correct
   - Check redirect URIs match your Railway domains

4. **Build Failures:**
   - Check that all dependencies are listed in `package.json`
   - Verify Node.js version compatibility

### Useful Commands for Debugging:

```bash
# Check backend logs
railway logs --service backend

# Check frontend logs  
railway logs --service frontend

# Check database connection
railway connect postgresql
```

## Environment Variables Summary

### Backend (.env):
- `NODE_ENV=production`
- `JWT_SECRET=your-jwt-secret`
- `SESSION_SECRET=your-session-secret`
- `GOOGLE_CLIENT_ID=your-google-client-id`
- `GOOGLE_CLIENT_SECRET=your-google-client-secret`
- `FRONTEND_URL=https://your-frontend.railway.app`
- `DATABASE_URL` (automatically provided by Railway)

### Frontend (.env):
- `VITE_API_URL=https://your-backend.railway.app/api`

## Post-Deployment Checklist

- [ ] Backend service is running
- [ ] Frontend service is running  
- [ ] Database is connected and migrations ran
- [ ] Google OAuth is configured with correct URLs
- [ ] Can register/login users
- [ ] Can create and manage maps
- [ ] All API endpoints are working
- [ ] Frontend can communicate with backend
- [ ] No CORS errors in browser console

## Security Notes

- Always use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Keep Google OAuth credentials secure
- Regularly update dependencies
- Monitor logs for security issues
