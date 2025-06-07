# ABQ Hotspot Blog - Deployment Guide

## Hosting on Vercel (Recommended)

This guide walks you through deploying your Next.js blog to Vercel with all necessary configurations.

## Prerequisites

1. A Vercel account (free): https://vercel.com
2. A PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. A Cloudinary account for media storage (free): https://cloudinary.com

## Step 1: Environment Variables

Create a `.env.local` file in your project root with these variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_URL="https://your-site.vercel.app"
NEXTAUTH_SECRET="your-random-secret-key-here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Step 2: Database Setup

### Option A: Using Neon (Recommended)
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the PostgreSQL connection string
4. Add it to your `DATABASE_URL` environment variable

### Option B: Using Supabase
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (make sure to replace the password)
5. Add it to your `DATABASE_URL` environment variable

## Step 3: Cloudinary Setup

1. Go to https://cloudinary.com and create a free account
2. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your environment variables

## Step 4: Update Dependencies

Run these commands to ensure all dependencies are ready:

```bash
npm install @vercel/postgres
npm run build
```

## Step 5: Database Migration

Once you have your PostgreSQL URL, run:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Step 6: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Option B: Using Git Integration
1. Push your code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in Vercel dashboard
6. Deploy

## Step 7: Environment Variables in Vercel

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the variables from your `.env.local` file

## Step 8: Initial Setup

After deployment, you'll need to:
1. Create your first admin user
2. Set up categories and tags
3. Configure RSS feeds

## Important Notes

- The database migration from SQLite to PostgreSQL means you'll need to recreate your data
- File uploads now use Cloudinary instead of local storage
- Make sure to update your `NEXTAUTH_URL` to your actual Vercel domain

## Troubleshooting

### Build Failures
- Ensure all environment variables are set
- Check that PostgreSQL connection is working
- Verify Cloudinary credentials

### Database Issues
- Make sure to run `prisma migrate deploy` after database setup
- Check that your DATABASE_URL is correctly formatted

### Media Upload Issues
- Verify Cloudinary credentials
- Check that the cloud name is correct

## Alternative Hosting Options

### Railway
- Similar to Vercel but includes database hosting
- Good for full-stack applications
- Automatic PostgreSQL setup

### Render
- Free tier available
- Built-in PostgreSQL database
- Good alternative to Vercel

### DigitalOcean App Platform
- Managed hosting with database options
- Good for production applications 