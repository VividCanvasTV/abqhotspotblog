# Railway Deployment Guide - ABQ Hotspot Blog

## 🚂 Deploy to Railway in 10 Minutes

Railway is the **perfect choice** for your Next.js blog - easy setup, PostgreSQL included, and automatic deployments from GitHub.

---

## **Prerequisites**
- GitHub account
- Railway account (free to create)
- Your code pushed to GitHub

---

## **Step 1: Push Your Code to GitHub** (2 minutes)

If you haven't already, push your project to GitHub:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - ABQ Hotspot Blog"

# Create GitHub repo and push
# (Create repo on GitHub.com first, then)
git remote add origin https://github.com/yourusername/abqhotspot-blog.git
git branch -M main
git push -u origin main
```

---

## **Step 2: Create Railway Account** (1 minute)

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended for easy integration)

---

## **Step 3: Deploy Your Project** (3 minutes)

1. **Click "Deploy from GitHub repo"**
2. **Select your repository** (`abqhotspot-blog`)
3. **Railway will automatically:**
   - Detect it's a Next.js project
   - Install dependencies
   - Build your application
   - Deploy it

---

## **Step 4: Add PostgreSQL Database** (1 minute)

1. In your Railway project dashboard
2. Click **"+ New Service"**
3. Select **"Database" → "PostgreSQL"**
4. Railway automatically creates and connects the database

---

## **Step 5: Configure Environment Variables** (2 minutes)

In your Railway project dashboard:

1. Click on your **web service**
2. Go to **"Variables"** tab
3. Add these environment variables:

```env
# Database (Railway auto-provides DATABASE_URL)
DATABASE_URL=postgresql://[automatically-provided-by-railway]

# Authentication
NEXTAUTH_URL=https://your-app-name.up.railway.app
NEXTAUTH_SECRET=your-super-secret-key-here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Admin credentials
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-admin-password

# RSS Configuration
RSS_AUTO_IMPORT=true
RSS_IMPORT_INTERVAL=3600000
```

**Important Notes:**
- Railway automatically provides `DATABASE_URL` when you add PostgreSQL
- Replace `your-app-name` with your actual Railway app URL
- Generate a secure `NEXTAUTH_SECRET` (32+ random characters)

---

## **Step 6: Set Up Database Schema** (1 minute)

Railway will automatically run your database migrations. The `postbuild` script in your `package.json` handles this:

```json
{
  "scripts": {
    "postbuild": "npx prisma generate && npx prisma db push"
  }
}
```

---

## **Step 7: Custom Domain (Optional)** (1 minute)

1. In Railway dashboard, go to **"Settings"**
2. Click **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain (e.g., `abqhotspot.com`)
5. Update your domain's DNS settings as instructed

---

## **✅ You're Live!**

Your blog is now deployed at: `https://your-app-name.up.railway.app`

**What happens automatically:**
- ✅ Every git push deploys automatically
- ✅ PostgreSQL database is managed for you
- ✅ SSL certificates are auto-generated
- ✅ Your RSS imports will run automatically
- ✅ Image uploads work via Cloudinary

---

## **Next Steps**

### **1. Test Your Deployment**
- Visit your live site
- Test admin login at `/admin/login`
- Create a test post with image upload
- Verify RSS imports are working

### **2. Set Up Your Content**
- Import your existing posts
- Configure RSS feeds in admin settings
- Upload restaurant and event images

### **3. Configure Cron Jobs (if needed)**
Railway supports cron jobs for RSS imports:
1. Go to **"Settings" → "Cron Jobs"**
2. Add schedule: `0 */6 * * *` (every 6 hours)
3. Command: `npm run rss-import`

---

## **Pricing**
- **Starter Plan**: $5/month (perfect for your blog)
- **Includes**: 
  - Web hosting
  - PostgreSQL database
  - Custom domains
  - SSL certificates
  - Automatic deployments

---

## **Support & Troubleshooting**

### **Common Issues:**

**1. Build Fails**
- Check the build logs in Railway dashboard
- Ensure all dependencies are in `package.json`

**2. Database Connection Issues**
- Railway auto-provides `DATABASE_URL`
- Make sure Prisma schema uses `postgresql`

**3. Environment Variables**
- Double-check all required variables are set
- `NEXTAUTH_URL` should match your Railway app URL

### **Getting Help**
- Railway Discord: Very responsive community
- Railway Docs: Excellent documentation
- GitHub Issues: For code-specific problems

---

## **Why Railway is Perfect for Your Blog**

✅ **Zero DevOps headaches** - Just push code and it works  
✅ **PostgreSQL included** - No separate database setup  
✅ **Automatic HTTPS** - SSL certificates managed for you  
✅ **GitHub integration** - Deploy on every push  
✅ **Fair pricing** - $5/month for everything you need  
✅ **Great performance** - Fast global CDN  
✅ **Easy scaling** - Handles traffic spikes automatically  

**Total setup time: ~10 minutes vs 4+ hours with traditional hosting!** 