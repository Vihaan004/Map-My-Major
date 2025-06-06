# Map My Major Frontend

This is the frontend application for Map My Major, a tool to help students plan their course progression.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```
   
## Environment Variables

Create a `.env` file with the following variables:
```
VITE_API_URL=http://localhost:5000/api
```

## Build for Production

```
npm run build
```

## Project Structure

- `src/` - Source code directory
  - `Components/` - React components
  - `services/` - API services and utilities
  - `assets/` - Static assets (images, styles, etc.)

## Note

This frontend was migrated from the prototype/map-my-major directory. The original frontend has been backed up to backup/frontend-backup.
