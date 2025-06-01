# ABQ Hotspot Admin Dashboard - Testing Guide

## 🧪 Complete Testing Checklist

### Phase 1: Database & API Testing ✅

#### Database Setup
- [x] Prisma schema created with all models
- [x] Database migration successful
- [x] Seed data populated successfully
- [x] Admin user created: `admin@abqhotspot.news`
- [x] Sample posts, categories, and tags created

#### API Endpoints
- [x] GET `/api/posts` - Fetch all posts with filtering
- [x] POST `/api/posts` - Create new post
- [x] GET `/api/posts/[id]` - Fetch single post
- [x] PUT `/api/posts/[id]` - Update post
- [x] DELETE `/api/posts/[id]` - Delete post

### Phase 2: Authentication Testing

#### Login System
- [ ] Visit `/admin/login`
- [ ] Test with correct credentials:
  - Email: `admin@abqhotspot.news`
  - Password: `admin123`
- [ ] Test with incorrect credentials
- [ ] Verify redirect to admin dashboard on success
- [ ] Verify error messages on failure

#### Session Management
- [ ] Verify protected routes redirect to login
- [ ] Test logout functionality
- [ ] Verify session persistence across page refreshes

### Phase 3: Admin Dashboard Testing

#### Dashboard Overview (`/admin`)
- [ ] Statistics cards display correctly
- [ ] Recent posts list shows sample data
- [ ] Quick actions work
- [ ] Navigation sidebar functions
- [ ] User info displays in sidebar

#### Posts Management (`/admin/posts`)
- [ ] Posts list displays with sample data
- [ ] Search functionality works
- [ ] Status filter works (All, Published, Draft, Scheduled)
- [ ] Featured filter works
- [ ] Featured toggle button works
- [ ] Edit button navigates correctly
- [ ] Delete button works with confirmation
- [ ] View post button works for published posts

#### Post Creation (`/admin/posts/new`)
- [ ] Form displays all fields correctly
- [ ] Title and content validation works
- [ ] Featured checkbox works
- [ ] Status dropdown works
- [ ] Scheduled date picker appears when needed
- [ ] Tags can be added and removed
- [ ] Featured image URL preview works
- [ ] SEO fields work
- [ ] Save as Draft button works
- [ ] Publish button works
- [ ] Redirects to edit page after creation

### Phase 4: Public Site Integration

#### Homepage (`/`)
- [ ] Featured posts display from database
- [ ] Recent posts display correctly
- [ ] Navigation works
- [ ] Admin link in navigation works
- [ ] Post links work correctly
- [ ] Images display properly
- [ ] Author information shows
- [ ] Dates format correctly

#### Individual Post Pages
- [ ] Create `/posts/[slug]` page
- [ ] Test with sample post slugs
- [ ] Verify content renders correctly
- [ ] Test 404 for non-existent posts

### Phase 5: Advanced Features Testing

#### Featured Post Management
- [ ] Toggle featured status from posts list
- [ ] Verify featured posts appear on homepage
- [ ] Test multiple featured posts
- [ ] Verify featured post ordering

#### Content Management
- [ ] Create posts with different statuses
- [ ] Test scheduled posts
- [ ] Test draft posts (not visible on public site)
- [ ] Test published posts (visible on public site)

#### Categories and Tags
- [ ] Assign categories to posts
- [ ] Create new tags when creating posts
- [ ] Verify tags display on posts
- [ ] Test category filtering

### Phase 6: Error Handling & Edge Cases

#### Database Errors
- [ ] Test with database disconnected
- [ ] Verify graceful error handling
- [ ] Check error messages are user-friendly

#### Form Validation
- [ ] Test empty required fields
- [ ] Test invalid data formats
- [ ] Test extremely long content
- [ ] Test special characters in titles

#### Authentication Edge Cases
- [ ] Test expired sessions
- [ ] Test concurrent logins
- [ ] Test role-based access (if implemented)

### Phase 7: Performance & UX Testing

#### Loading States
- [ ] Verify loading spinners appear
- [ ] Test with slow network conditions
- [ ] Check for smooth transitions

#### Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Verify sidebar collapses appropriately
- [ ] Check form layouts on small screens

#### User Experience
- [ ] Toast notifications appear for actions
- [ ] Confirmation dialogs work
- [ ] Navigation is intuitive
- [ ] Error states are clear

## 🚀 Quick Test Commands

### Start Development Server
```bash
npm run dev
```

### Test Database Connection
```bash
npx prisma studio
```

### Reset Database (if needed)
```bash
npx prisma db push --force-reset
npx tsx src/lib/seed.ts
```

### Check Environment Variables
```bash
echo $DATABASE_URL
```

## 📋 Test Scenarios

### Scenario 1: New Admin User Workflow
1. Visit `/admin/login`
2. Login with demo credentials
3. Navigate to dashboard
4. Create a new post
5. Publish the post
6. View the post on the homepage
7. Edit the post
8. Toggle featured status
9. Delete the post

### Scenario 2: Content Management Workflow
1. Create multiple posts with different statuses
2. Assign different categories
3. Add various tags
4. Set featured images
5. Test search and filtering
6. Verify public site displays correctly

### Scenario 3: Error Handling Workflow
1. Try to access admin without login
2. Submit forms with invalid data
3. Test with network disconnected
4. Verify error messages are helpful

## ✅ Success Criteria

### Functionality
- [ ] All CRUD operations work correctly
- [ ] Authentication system is secure
- [ ] Public site integrates seamlessly
- [ ] Featured post system works
- [ ] Search and filtering work

### Performance
- [ ] Pages load under 2 seconds
- [ ] Database queries are optimized
- [ ] Images load efficiently
- [ ] No memory leaks

### User Experience
- [ ] Interface is intuitive
- [ ] Error messages are clear
- [ ] Loading states are smooth
- [ ] Mobile experience is good

### Security
- [ ] Protected routes are secure
- [ ] Input validation prevents XSS
- [ ] SQL injection is prevented
- [ ] Sessions are managed properly

## 🐛 Known Issues & Fixes

### Common Issues
1. **Environment Variables**: Ensure `.env` file has correct DATABASE_URL
2. **Database Connection**: Run `npx prisma generate` if client is outdated
3. **Port Conflicts**: Use different port if 3000 is occupied
4. **Cache Issues**: Clear `.next` folder if needed

### Troubleshooting
```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma db push --force-reset
npx tsx src/lib/seed.ts
```

## 🎉 Testing Complete!

Once all items are checked off, the admin dashboard system is fully functional and ready for production deployment! 