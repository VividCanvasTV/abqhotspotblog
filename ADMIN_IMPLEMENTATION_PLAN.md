# ABQ Hotspot News - Admin Dashboard Implementation Plan

## 🎯 Project Goal
Build a complete admin dashboard system for content management with featured post selection and advanced features.

## 📋 Implementation Phases

### Phase 1: Database Setup & Core Infrastructure
- [ ] Install required dependencies (Prisma, NextAuth, etc.)
- [ ] Set up database schema (SQLite for development)
- [ ] Create Post, User, Category, and Media models
- [ ] Set up database migrations
- [ ] Create API routes for CRUD operations
- [ ] Test database connectivity and basic operations

### Phase 2: Authentication System
- [ ] Set up NextAuth.js for admin authentication
- [ ] Create login page with ABQ-themed design
- [ ] Implement user roles (admin, editor, author)
- [ ] Create middleware for protected routes
- [ ] Test authentication flow

### Phase 3: Admin Dashboard Core
- [ ] Create admin layout with navigation
- [ ] Build dashboard overview page with stats
- [ ] Create posts listing page with search/filter
- [ ] Build rich text editor for post creation
- [ ] Implement image upload functionality
- [ ] Test all CRUD operations

### Phase 4: Featured Post Management
- [ ] Add featured post selection interface
- [ ] Create homepage management page
- [ ] Build post ordering/priority system
- [ ] Implement live preview of changes
- [ ] Test featured post functionality

### Phase 5: Advanced Content Features
- [ ] Categories and tags management
- [ ] Post scheduling system
- [ ] Draft/published status control
- [ ] SEO metadata management
- [ ] Media library with organization
- [ ] Test all advanced features

### Phase 6: ABQ-Specific Features
- [ ] Local event calendar management
- [ ] Community spotlight section
- [ ] Weather widget integration
- [ ] Business directory features
- [ ] Newsletter signup management
- [ ] Test ABQ-specific functionality

### Phase 7: UI/UX Polish
- [ ] Implement ABQ-themed admin design
- [ ] Add responsive mobile support
- [ ] Create loading states and animations
- [ ] Add confirmation dialogs
- [ ] Implement toast notifications
- [ ] Test user experience flow

### Phase 8: Integration & Testing
- [ ] Update existing blog pages to use database
- [ ] Migrate existing MDX posts to database
- [ ] Test public site with new backend
- [ ] Performance optimization
- [ ] Error handling and validation
- [ ] Comprehensive testing

## 🛠️ Technical Stack

### Backend
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js
- **API**: Next.js API routes
- **File Upload**: Cloudinary or local storage
- **Validation**: Zod schema validation

### Frontend (Admin)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS (ABQ theme)
- **Components**: Headless UI + custom components
- **Rich Text**: TipTap or React Quill
- **Forms**: React Hook Form + Zod
- **State**: React Query for server state

### Features
- **Content Management**: Full CRUD for posts
- **Media Management**: Image upload and organization
- **User Management**: Role-based access control
- **Homepage Control**: Featured post selection
- **SEO**: Meta tags and descriptions
- **Scheduling**: Future post publication

## 📊 Database Schema

### Posts Table
```sql
- id (Primary Key)
- title (Text)
- slug (Unique Text)
- content (Text)
- excerpt (Text)
- featured (Boolean)
- published (Boolean)
- publishedAt (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)
- authorId (Foreign Key)
- categoryId (Foreign Key)
- featuredImage (Text)
- seoTitle (Text)
- seoDescription (Text)
```

### Users Table
```sql
- id (Primary Key)
- name (Text)
- email (Unique Text)
- role (Enum: ADMIN, EDITOR, AUTHOR)
- avatar (Text)
- createdAt (DateTime)
```

### Categories Table
```sql
- id (Primary Key)
- name (Text)
- slug (Unique Text)
- description (Text)
- color (Text)
```

### Tags Table
```sql
- id (Primary Key)
- name (Text)
- slug (Unique Text)
```

### Media Table
```sql
- id (Primary Key)
- filename (Text)
- originalName (Text)
- mimeType (Text)
- size (Integer)
- url (Text)
- uploadedAt (DateTime)
```

## 🎨 Admin Dashboard Pages

### 1. `/admin` - Dashboard Overview
- Site statistics (total posts, views, etc.)
- Recent posts list
- Quick actions
- ABQ-themed charts and widgets

### 2. `/admin/posts` - Posts Management
- Posts listing with search/filter
- Bulk actions (publish, delete, etc.)
- Featured post toggle
- Status indicators

### 3. `/admin/posts/new` - Create Post
- Rich text editor
- Featured image upload
- Category/tag selection
- SEO settings
- Publish/draft options

### 4. `/admin/posts/[id]/edit` - Edit Post
- Same as create but with existing data
- Preview functionality
- Version history

### 5. `/admin/homepage` - Homepage Management
- Featured post selection
- Hero section settings
- Navigation menu management
- Banner text editing

### 6. `/admin/media` - Media Library
- File upload interface
- Image gallery view
- File organization
- Usage tracking

### 7. `/admin/users` - User Management
- User list with roles
- Invite new users
- Role management
- Activity logs

### 8. `/admin/settings` - Site Settings
- General site settings
- SEO defaults
- Social media links
- ABQ-specific settings

## 🧪 Testing Checklist

### Unit Tests
- [ ] Database models and relationships
- [ ] API route functionality
- [ ] Authentication logic
- [ ] Form validation
- [ ] Utility functions

### Integration Tests
- [ ] Login/logout flow
- [ ] Post creation workflow
- [ ] Featured post selection
- [ ] Image upload process
- [ ] Public site integration

### User Experience Tests
- [ ] Admin dashboard navigation
- [ ] Content creation flow
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Loading states

### Performance Tests
- [ ] Database query optimization
- [ ] Image loading performance
- [ ] Page load speeds
- [ ] Large dataset handling

## 🚀 Deployment Considerations

### Development
- SQLite database
- Local file storage
- Environment variables setup

### Production
- PostgreSQL database (Vercel Postgres/Supabase)
- Cloudinary for image storage
- Environment variables configuration
- SSL certificates

## 📈 Success Metrics

### Functionality
- [ ] Can create/edit/delete posts without code changes
- [ ] Featured posts can be selected from admin
- [ ] Multiple users can access with different permissions
- [ ] Images upload and display correctly
- [ ] Public site works seamlessly with new backend

### Performance
- [ ] Admin dashboard loads under 2 seconds
- [ ] Post creation saves within 3 seconds
- [ ] Image uploads complete within 10 seconds
- [ ] Public site maintains current performance

### User Experience
- [ ] Intuitive navigation for non-technical users
- [ ] Clear feedback for all actions
- [ ] Responsive design on all devices
- [ ] ABQ-themed consistent with public site

## 🔧 Development Tools

### Required Packages
```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "next-auth": "^4.24.0",
    "@next/font": "^14.0.0",
    "react-hook-form": "^7.45.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.22.0",
    "@tanstack/react-query": "^4.35.0",
    "cloudinary": "^1.40.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

## 📝 Implementation Notes

### ABQ Theme Integration
- Use existing color scheme (red, orange, yellow, turquoise)
- Maintain Luckiest Guy font for headings
- Include Southwest design elements
- Keep cultural references (chile peppers, desert themes)

### Content Migration
- Import existing MDX posts into database
- Preserve all metadata and content
- Maintain URL structure for SEO
- Create migration scripts

### Security Considerations
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- File upload security
- Role-based access control
- CSRF protection

---

## 🎯 Ready to Begin Implementation!

This plan covers everything needed for a professional content management system. Let's start building! 🌶️🏜️ 