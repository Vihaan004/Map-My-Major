# Environment Setup Guide for Map My Major

This guide will help you set up the environment variables needed for both development and production.

## Backend Environment (.env file)

Create or modify the `.env` file in the backend root directory with the following variables:

```
# Application Settings
NODE_ENV=development  # Set to 'production' in Azure
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=map_my_major
DB_PORT=5432

# For Production in Azure
# DB_HOST=your-azure-postgres-server.postgres.database.azure.com
# DB_USER=your_azure_username
# DB_PASS=your_azure_password
# DB_NAME=map_my_major
# DB_SSL=true

# Authentication
JWT_SECRET=your_jwt_secret_key  # Generate a strong secret key for production
SESSION_SECRET=your_session_secret_key  # Generate a strong secret for production

# Google OAuth (Get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000  # Local development
# FRONTEND_URL=https://your-production-domain.com  # Production

# For Azure App Service
WEBSITES_PORT=5000
```

## Frontend Environment (.env file)

Create or modify the `.env` file in the frontend root directory with the following variables:

```
VITE_API_URL=http://localhost:5000/api  # Local development
# VITE_API_URL=https://your-production-domain.com/api  # Production
```

## Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application"
6. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://your-production-domain.com`
7. Add authorized redirect URIs:
   - For development: `http://localhost:5000/api/users/auth/google/callback`
   - For production: `https://your-production-domain.com/api/users/auth/google/callback`
8. Copy the generated Client ID and Client Secret to your backend `.env` file

## Azure Configuration

When deploying to Azure, use Application Settings in the Azure portal to set environment variables securely instead of using the .env file in the repository.
