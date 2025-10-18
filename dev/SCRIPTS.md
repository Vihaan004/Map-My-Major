# Development Scripts for MapMyMajor

## Generate NextAuth Secret

Run this command to generate a secure secret for NextAuth.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or using OpenSSL:

```bash
openssl rand -base64 32
```

Copy the output and add it to your `.env` file as `NEXTAUTH_SECRET`.

## Database Commands

### Reset Database (Development Only)
⚠️ **Warning**: This will delete all data!

```bash
npx prisma migrate reset
```

### Create New Migration

After changing `schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

### View Database

Open Prisma Studio (database GUI):

```bash
npx prisma studio
```

## Development Server

Start the Next.js development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Useful Prisma Commands

```bash
# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Generate Prisma Client
npx prisma generate

# Push schema changes without migration (dev only)
npx prisma db push
```

## Check for Issues

```bash
# Run TypeScript type checking
npx tsc --noEmit

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

## Package Management

```bash
# Install new package
npm install package-name

# Install as dev dependency
npm install -D package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated
```
