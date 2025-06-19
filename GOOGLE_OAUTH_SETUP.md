# Setting up Google OAuth for Map My Major

This guide will walk you through the process of setting up Google OAuth for your Map My Major application.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click on "New Project"
4. Name your project "Map My Major" and click "Create"
5. Wait for the project to be created and then select it

## 2. Configure OAuth Consent Screen

1. In the Google Cloud Console, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type and click "Create"
3. Fill in the required fields:
   - App name: Map My Major
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue"
5. Under "Scopes," add the following scopes:
   - `email`
   - `profile`
6. Click "Save and Continue"
7. Skip the "Test users" section by clicking "Save and Continue" again
8. Review your settings and click "Back to Dashboard"

## 3. Create OAuth Client ID

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name your OAuth client (e.g., "Map My Major Web Client")
5. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://map-my-major-app.azurewebsites.net` (or your custom domain)
6. Add authorized redirect URIs:
   - For development: `http://localhost:5000/api/users/auth/google/callback`
   - For production: `https://map-my-major-api.azurewebsites.net/api/users/auth/google/callback`
7. Click "Create"
8. A popup will appear with your client ID and client secret. Copy these values as you'll need them for your application configuration.

## 4. Configure Your Application

1. Update your backend `.env` file with the Google credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

2. For production on Azure, add these values as Application Settings in your Azure App Service.

## 5. Testing Your Google OAuth Integration

1. Start your frontend and backend applications
2. Navigate to the login page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's consent screen
5. After logging in, you should be redirected back to your application and be authenticated

## Troubleshooting

If you encounter issues:

1. Check the browser console and server logs for errors
2. Verify that the redirect URIs are correctly set in the Google Cloud Console
3. Ensure that the OAuth consent screen is properly configured
4. Confirm that the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are set correctly
5. Make sure the frontend URL in your backend configuration is correct
