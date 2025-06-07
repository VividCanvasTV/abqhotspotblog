# ABQ Hotspot Blog - Netlify Deployment Guide

## ⚠️ Important Limitations

Netlify has significant limitations for your blog's current features:
- **10-second function timeout** (free tier)
- **No built-in database** (need external service)
- **No cron jobs** (need external scheduling)
- **Limited server-side features**

## Required Changes

### 1. Switch to Static Site Generation (SSG)

Update your pages to use Static Site Generation where possible:

```typescript
// pages/posts/[slug].tsx
export async function getStaticProps({ params }) {
  // Fetch data at build time
  const post = await getPost(params.slug)
  return {
    props: { post },
    revalidate: 60 // Regenerate every minute
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts()
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking'
  }
}
```

### 2. External Database Required

**Option A: PlanetScale (Recommended)**
```env
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/abqhotspot?sslaccept=strict"
```

**Option B: Railway**
```env
DATABASE_URL="postgresql://username:password@containers-us-west-xxx.railway.app:7xxx/railway"
```

### 3. External Cron Service

Since Netlify doesn't support cron jobs, use:

**Option A: GitHub Actions**
```yaml
# .github/workflows/rss-import.yml
name: RSS Import
on:
  schedule:
    - cron: '0 */6 * * *'
jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger RSS Import
        run: |
          curl -X POST https://yoursite.netlify.app/api/rss/import
```

**Option B: Zapier/Make.com**
- Set up webhook to call your RSS import endpoint every 6 hours

### 4. Netlify Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  directory = "netlify/functions"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### 5. Convert API Routes to Netlify Functions

Create `netlify/functions/` directory and convert your API routes:

```javascript
// netlify/functions/posts.js
const { PrismaClient } = require('@prisma/client')

exports.handler = async (event, context) => {
  const prisma = new PrismaClient()
  
  if (event.httpMethod === 'GET') {
    const posts = await prisma.post.findMany()
    return {
      statusCode: 200,
      body: JSON.stringify(posts)
    }
  }
}
```

## Deployment Steps

1. **Connect to Git:**
   - Push code to GitHub
   - Connect repository to Netlify

2. **Environment Variables:**
   - Add all environment variables in Netlify dashboard

3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

## Estimated Costs
- Netlify Pro (if needed): $19/month
- PlanetScale: $29/month for production
- **Total: $48/month** (significantly more expensive)

## Recommendation

❌ **Not recommended for your blog** because:
- Complex workarounds needed
- Higher costs than other options
- Loss of server-side functionality
- RSS import complications 