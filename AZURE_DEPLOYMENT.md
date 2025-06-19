# Azure Deployment Guide for Map My Major

This guide outlines the steps to deploy the Map My Major application to Azure using your student credits.

## 1. Prerequisites

- Azure account with student credits activated
- Azure CLI installed (`az` command available in your terminal)
- Git repository with your code
- Node.js and npm installed

## 2. Azure Resources to Create

We'll use the following Azure services:

- **Azure App Service**: To host the frontend (React) and backend (Node.js) applications
- **Azure Database for PostgreSQL**: To host the PostgreSQL database
- **Azure Key Vault**: To store secrets securely
- **Azure Application Insights**: For monitoring and analytics (optional)

## 3. Setting up Azure Resources

### 3.1. Azure Database for PostgreSQL

```bash
# Login to Azure
az login

# Create a resource group
az group create --name map-my-major-rg --location eastus

# Create the PostgreSQL server
az postgres server create \
  --resource-group map-my-major-rg \
  --name map-my-major-db \
  --location eastus \
  --admin-user mydbadmin \
  --admin-password <your-secure-password> \
  --sku-name B_Gen5_1 \
  --version 11

# Configure firewall to allow Azure services
az postgres server firewall-rule create \
  --resource-group map-my-major-rg \
  --server-name map-my-major-db \
  --name AllowAllAzureIPs \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create the database
az postgres db create \
  --resource-group map-my-major-rg \
  --server-name map-my-major-db \
  --name map_my_major
```

### 3.2. Backend App Service

```bash
# Create App Service plan
az appservice plan create \
  --resource-group map-my-major-rg \
  --name map-my-major-plan \
  --sku B1 \
  --is-linux

# Create the backend App Service
az webapp create \
  --resource-group map-my-major-rg \
  --plan map-my-major-plan \
  --name map-my-major-api \
  --runtime "NODE|16-lts"

# Set environment variables
az webapp config appsettings set \
  --resource-group map-my-major-rg \
  --name map-my-major-api \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    WEBSITES_PORT=8080 \
    DB_HOST=map-my-major-db.postgres.database.azure.com \
    DB_USER=mydbadmin@map-my-major-db \
    DB_PASS=<your-secure-password> \
    DB_NAME=map_my_major \
    DB_PORT=5432 \
    DB_SSL=true \
    JWT_SECRET=<your-jwt-secret> \
    SESSION_SECRET=<your-session-secret> \
    GOOGLE_CLIENT_ID=<your-google-client-id> \
    GOOGLE_CLIENT_SECRET=<your-google-client-secret> \
    FRONTEND_URL=https://map-my-major-app.azurewebsites.net
```

### 3.3. Frontend App Service

```bash
# Create the frontend App Service
az webapp create \
  --resource-group map-my-major-rg \
  --plan map-my-major-plan \
  --name map-my-major-app \
  --runtime "NODE|16-lts"

# Set environment variables
az webapp config appsettings set \
  --resource-group map-my-major-rg \
  --name map-my-major-app \
  --settings \
    VITE_API_URL=https://map-my-major-api.azurewebsites.net/api
```

## 4. Preparing Your Application for Deployment

### 4.1. Backend Preparation

Create a `web.config` file in the backend root directory if not already present:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <add name="iisnode" path="src/index.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="src/index.js" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering removeServerHeader="true" />
    </security>
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
    <httpErrors existingResponse="PassThrough" />
    <iisnode watchedFiles="web.config;*.js" />
  </system.webServer>
</configuration>
```

Add a start script to your backend `package.json`:

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

### 4.2. Frontend Preparation

In your frontend `package.json`, add a build script if not already present:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## 5. Continuous Deployment Setup

### 5.1. Set Up GitHub Actions for Backend

Create a file `.github/workflows/backend-deploy.yml`:

```yaml
name: Deploy Backend to Azure

on:
  push:
    branches: [ main ]
    paths:
      - 'app/backend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v1
      with:
        node-version: 16.x
    
    - name: Install dependencies
      run: |
        cd app/backend
        npm ci
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'map-my-major-api'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND }}
        package: ./app/backend
```

### 5.2. Set Up GitHub Actions for Frontend

Create a file `.github/workflows/frontend-deploy.yml`:

```yaml
name: Deploy Frontend to Azure

on:
  push:
    branches: [ main ]
    paths:
      - 'app/frontend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v1
      with:
        node-version: 16.x
    
    - name: Install dependencies and build
      run: |
        cd app/frontend
        npm ci
        npm run build
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'map-my-major-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND }}
        package: ./app/frontend/dist
```

## 6. Setting Up Publishing Profiles

1. Go to the Azure Portal
2. Navigate to each of your App Services
3. Go to "Deployment Center" > "Manage publish profile"
4. Download the publish profile
5. In your GitHub repository, go to Settings > Secrets > New repository secret
6. Create two secrets:
   - `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND`: Paste the contents of the backend publish profile
   - `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND`: Paste the contents of the frontend publish profile

## 7. Initial Database Migration

To initialize the database on Azure:

```bash
# SSH into the backend App Service
az webapp ssh --resource-group map-my-major-rg --name map-my-major-api

# Once connected, navigate to your app directory and run migrations
cd site/wwwroot
npx sequelize-cli db:migrate
```

## 8. Testing Your Deployment

1. Visit your frontend URL: `https://map-my-major-app.azurewebsites.net`
2. Test the login functionality, including Google authentication
3. Verify that all features work correctly

## 9. Setting up Custom Domain (Optional)

If you want to use a custom domain:

1. Purchase a domain
2. Navigate to your App Service in the Azure Portal
3. Go to "Custom domains" > "Add custom domain"
4. Follow the instructions to verify domain ownership and add the domain
