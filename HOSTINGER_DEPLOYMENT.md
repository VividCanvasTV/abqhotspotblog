# ABQ Hotspot Blog - Hostinger Deployment Guide

## Prerequisites
- Hostinger Premium or Business hosting plan (Node.js support required)
- Access to cPanel or hPanel
- FTP/SFTP access

## Step 1: Database Setup (MySQL)

1. **Create MySQL Database in hPanel:**
   ```
   - Go to hPanel > Databases > MySQL Databases
   - Create new database: abqhotspot_blog
   - Create database user with full privileges
   - Note down: database name, username, password, host
   ```

2. **Update Prisma Schema for MySQL:**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Environment Variables:**
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/abqhotspot_blog"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="your-secret-key"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

## Step 2: Build and Upload

1. **Build the application locally:**
   ```bash
   npm run build
   ```

2. **Upload files via FTP:**
   - Upload entire project folder to `/public_html/`
   - Make sure `node_modules` is uploaded or run `npm install` on server

## Step 3: Configure Node.js

1. **In hPanel > Advanced > Node.js:**
   - Select Node.js version (18+ recommended)
   - Set Application Root: `/public_html/your-project-folder`
   - Set Application URL: your domain
   - Set Application Startup File: `server.js`

2. **Create server.js in your project root:**
   ```javascript
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')

   const dev = process.env.NODE_ENV !== 'production'
   const app = next({ dev })
   const handle = app.getRequestHandler()

   const PORT = process.env.PORT || 3000

   app.prepare().then(() => {
     createServer((req, res) => {
       const parsedUrl = parse(req.url, true)
       handle(req, res, parsedUrl)
     }).listen(PORT, (err) => {
       if (err) throw err
       console.log(`> Ready on http://localhost:${PORT}`)
     })
   })
   ```

## Step 4: Database Migration

```bash
# SSH into your hosting account and run:
npx prisma migrate deploy
npx prisma generate
```

## Step 5: Set up Cron Jobs

In hPanel > Advanced > Cron Jobs:
```bash
# RSS Import every 6 hours
0 */6 * * * /usr/bin/node /path/to/your/app/scripts/rss-import.js
```

## Estimated Costs
- Hostinger Premium: $2.99/month
- Domain (if needed): $8.99/year
- **Total: ~$3-4/month** 