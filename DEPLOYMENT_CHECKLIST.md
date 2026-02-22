# ✅ DEPLOYMENT & VERIFICATION CHECKLIST

## Pre-Deployment Checklist

### Prerequisites
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional, but recommended)
- [ ] Supabase account created (free tier OK)

### Environment Setup
- [ ] Created Supabase project
  - [ ] Noted project URL: `https://[project-id].supabase.co`
  - [ ] Noted anon key from Settings → API Keys
  - [ ] Noted service role key (backup only)
- [ ] Created `.env.local` file in project root
  - [ ] Added: `NEXT_PUBLIC_SUPABASE_URL=...`
  - [ ] Added: `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
  - [ ] Added: `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### Database Setup
- [ ] Ran `sql/schema.sql` in Supabase SQL Editor
  - [ ] All 10 tables created without errors
  - [ ] All indexes created
  - [ ] All RLS policies enabled
- [ ] (Optional) Ran `sql/sample-inserts.sql` for test data
  - [ ] 10 regions exist
  - [ ] 5 zones exist
  - [ ] Pastors/deacons/members created
- [ ] Created Supabase Storage bucket named `qr-codes` (public)

### Application Setup
- [ ] Cloned/downloaded project from GitHub
- [ ] Opened project folder in VS Code
- [ ] Terminal open in project root directory

---

## Installation Checklist

### Dependencies
- [ ] Ran `npm install` (installs Next.js, React, etc)
  - Verify: `node_modules/` folder created
  - Verify: `package-lock.json` created
- [ ] Ran `npm install qrcode react-leaflet leaflet lucide-react csv-parse`
  - Verify: Each package added to `node_modules/`
  - Verify: `package.json` dependencies updated

### Configuration
- [ ] `tsconfig.json` exists and configured
- [ ] `next.config.js` exists
- [ ] `middleware.ts` exists in project root
- [ ] `.env.local` has correct Supabase credentials

---

## Pre-Launch Checklist

### Supabase Auth Setup
- [ ] Created at least 1 test user in Supabase
  - [ ] Email entered
  - [ ] Password set
  - [ ] User appears in Authentication → Users
- [ ] (Optional) Created additional test users for different roles

### File Verification
- [ ] All API files exist:
  - [ ] `app/api/regions/route.ts`
  - [ ] `app/api/zones/route.ts`
  - [ ] `app/api/pastors/route.ts`
  - [ ] `app/api/deacons/route.ts`
  - [ ] `app/api/members/route.ts`
  - [ ] `app/api/departments/route.ts`
  - [ ] `app/api/transfers/route.ts`
  - [ ] `app/api/activity-log/route.ts`
  - [ ] `app/api/export/route.ts`
- [ ] All component files exist:
  - [ ] `components/dashboard/DashboardOverview.tsx`
  - [ ] `components/map/MapComponent.tsx`
  - [ ] `components/qr/QRCodeCard.tsx`
- [ ] All library files exist:
  - [ ] `lib/supabaseClient.ts`
  - [ ] `lib/idGenerator.ts`
  - [ ] `lib/idGeneratorDb.ts`
  - [ ] `lib/qrCodeGenerator.ts`

---

## Launch Checklist

### Start Development Server
- [ ] Terminal in project root
- [ ] Run: `npm run dev`
  - Should show: "Local: http://localhost:3000"
  - Should show: "Ready in XXms"
  - No error messages should appear

### Access Application
- [ ] Open browser to `http://localhost:3000`
  - [ ] Should see login page (not a blank page)
  - [ ] Should have Heartfelt Ministry branding
  - [ ] Email and password input fields visible
  - [ ] "Login" button visible

---

## Login Flow Checklist

### Test Login
- [ ] Enter test user email in email field
- [ ] Enter test user password in password field
- [ ] Click "Login" button
  - Expected: Page shows loading indicator
  - Expected: Wait 2-3 seconds
  - Expected: Auto-redirect to `/app/dashboard`

### Verify Redirect
- [ ] URL changed to `http://localhost:3000/app/dashboard`
- [ ] No error messages in browser console
- [ ] Page is loading (may see skeleton loaders)

---

## Dashboard Verification Checklist

### Dashboard Should Show
- [ ] Dashboard heading visible
- [ ] 7 KPI cards loading and showing:
  - [ ] Regions (should show "10" if sample data loaded)
  - [ ] Zones (should show "5" if sample data loaded)
  - [ ] Pastors (should show "3" if sample data loaded)
  - [ ] Deacons (should show "2" if sample data loaded)
  - [ ] Departments (should show "3" if sample data loaded)
  - [ ] Church Members (should show "3" if sample data loaded)
  - [ ] Activity Log Entries (count may vary)

### Dashboard Features
- [ ] All cards loaded without errors
- [ ] Numbers match database (or show 0 if no sample data)
- [ ] Statistics displaying under some cards (e.g., "X members per zone")
- [ ] Sidebar visible with navigation links
- [ ] Header visible with ministry branding
- [ ] Footer visible with copyright info

### No Errors
- [ ] No red error messages on page
- [ ] Browser console has no error messages (F12 → Console)
- [ ] Network tab shows successful API calls

---

## API Testing Checklist

### Test API Endpoints (Use Postman or curl)

**Regions Endpoint**
- [ ] GET `http://localhost:3000/api/regions`
  - Expected: JSON array with regions
  - Expected: Status 200

**Zones Endpoint**
- [ ] GET `http://localhost:3000/api/zones`
  - Expected: JSON array with zones
  - Expected: Status 200

**Pastors Endpoint**
- [ ] GET `http://localhost:3000/api/pastors`
  - Expected: JSON array with pastors and QR URLs
  - Expected: Status 200

**Deacons Endpoint**
- [ ] GET `http://localhost:3000/api/deacons`
  - Expected: JSON array with deacons
  - Expected: Status 200

**Members & Departments**
- [ ] GET `http://localhost:3000/api/members` → Status 200
- [ ] GET `http://localhost:3000/api/departments` → Status 200

**Advanced Endpoints**
- [ ] GET `http://localhost:3000/api/transfers` → Status 200
- [ ] GET `http://localhost:3000/api/activity-log` → Status 200
- [ ] GET `http://localhost:3000/api/export?entity=regions` → CSV file downloads

### All APIs Return Valid JSON
- [ ] No parsing errors when opening in browser
- [ ] Data structure matches expected format
- [ ] No database connection errors

---

## QR Code Testing Checklist

### QR Code Generation (If Testing with pastors)
- [ ] Dashboard shows Pastors count > 0
- [ ] Navigate to pastor in database or create new one via API
- [ ] Check if QR code generated (check `qr_codes` table in Supabase)
- [ ] Check Supabase Storage → `qr-codes` bucket for PNG files
  - [ ] Files named like: `RZWXXXXPXX.png`
  - [ ] Files accessible via public URL

### QR Code Download (If Component Implemented)
- [ ] (When QRCodeCard component available)
- [ ] Click "Download QR Code" button
  - Expected: PNG file downloads to computer
  - Expected: File named `[ID].png`
- [ ] Open downloaded PNG in image viewer
  - Expected: Visible QR code
  - Expected: Can scan with phone camera

---

## Database Verification Checklist

### Supabase Dashboard - Tables
- [ ] Regions table exists
  - [ ] Has columns: id, region_code, name, country, etc
  - [ ] Table Settings → RLS enabled
- [ ] Zones table exists
  - [ ] Has columns: id, full_code, name, region_id, etc
  - [ ] Row count matches (5 if sample data loaded)
- [ ] Pastors table exists
  - [ ] Has columns: id, full_code, name, zone_id, qr_code_url, etc
  - [ ] Row count matches (3 if sample data loaded)
- [ ] Users table exists
  - [ ] User records created matching auth users
- [ ] Other tables exist:
  - [ ] Deacons, Members, Departments, Transfers, Activity Log

### Supabase Auth
- [ ] Authentication → Users shows created test user(s)
- [ ] Test user can login via application
- [ ] Session created successfully

### Sample Data
- [ ] Regions: 10 records exist (if sample data loaded)
- [ ] Zones: 5 records exist
- [ ] Pastors: 3 records exist
- [ ] If data missing, run `sql/sample-inserts.sql`

---

## Browser Console Checklist

### Open Developer Tools (F12)

**Console Tab**
- [ ] No red error messages
- [ ] No Network errors
- [ ] Expected logs visible (if any)

**Network Tab**
- [ ] All API requests show Status 200 or 304
- [ ] No 404 errors
- [ ] No 500 errors
- [ ] All requests complete (green checkmark)

**Application Tab**
- [ ] LocalStorage contains `sb-...` session token (from Supabase)
- [ ] No authentication errors

**Sources Tab**
- [ ] Can see source code in debugger
- [ ] Breakpoints work (if debugging)

---

## Authentication Verification Checklist

### Session Management
- [ ] Session token stored in browser localStorage
- [ ] Token persists on page refresh
- [ ] Token valid for API requests
- [ ] Can logout (if logout button implemented)

### Protected Routes
- [ ] Cannot access `/app/dashboard` without login
  - [ ] Redirects to `/login` if not authenticated
- [ ] Can access `/app/dashboard` with valid login
- [ ] Cannot access other admin routes without admin role (if implemented)

### Middleware
- [ ] `middleware.ts` running on protected routes
- [ ] Session verified on each request
- [ ] Invalid token redirects to login

---

## Performance Checklist

### Loading Times
- [ ] Login page loads in < 2 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] API responses in < 1 second (local)
- [ ] Map component loads smooth

### Build Output
- [ ] `npm run build` completes without errors
- [ ] Build folder created (`/.next/standalone` or `/.next`)
- [ ] No warnings about unoptimized images
- [ ] TypeScript compilation successful (`npm run type-check`)

### Database Performance
- [ ] Queries are fast (< 100ms)
- [ ] Indexes are created
- [ ] RLS policies not causing slowdowns
- [ ] No N+1 query problems

---

## Mobile Testing Checklist

### Responsive Design
- [ ] Open in mobile Chrome DevTools
- [ ] Set to iPhone 12 viewport (390x844)
- [ ] Login page responsive
  - [ ] Text readable
  - [ ] Buttons clickable
  - [ ] Inputs visible
- [ ] Dashboard responsive
  - [ ] KPI cards stack vertically
  - [ ] All text visible
  - [ ] No horizontal scroll
- [ ] Map displays on mobile

### Touch Interactions
- [ ] Buttons clickable with touch
- [ ] Inputs work on mobile keyboard
- [ ] Map zoomable with pinch (if available)

---

## Production Readiness Checklist

### Code Quality
- [ ] No `console.log()` debugging statements left
- [ ] No `TODO` or `FIXME` comments in production code
- [ ] All functions have proper error handling
- [ ] No hardcoded passwords or secrets

### Environment
- [ ] `.env.local` NOT committed to git
- [ ] `.gitignore` includes `.env.local`
- [ ] No console errors in production build
- [ ] All secrets in environment variables

### Security
- [ ] RLS policies enabled on all tables
- [ ] Passwords never logged or stored
- [ ] API endpoints require authentication
- [ ] CORS configured if needed
- [ ] No sensitive data exposed in frontend

### Documentation
- [ ] README.md explains setup
- [ ] API documentation available
- [ ] Database schema documented
- [ ] Deployment instructions clear

### Backup & Recovery
- [ ] Database backup strategy planned
- [ ] QR code storage backup planned
- [ ] User data export method tested
- [ ] Disaster recovery plan documented

---

## Deployment Checklist (Before Going Live)

### Deployment Platform Setup
- [ ] Account created on Vercel/Netlify/Railway/etc
- [ ] GitHub repository synchronized
- [ ] Deployment connected to main branch

### Environment Variables
- [ ] Production Supabase project created
- [ ] Environment variables added to deployment platform
- [ ] All secrets properly configured
- [ ] No local `.env.local` values in production

### Database
- [ ] Schema.sql run on production database
- [ ] Sample data NOT imported to production
- [ ] RLS policies enabled
- [ ] Backups configured

### Security Audit
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] API rate limiting considered
- [ ] Input validation on all endpoints

### Final Tests
- [ ] Test login on production URL
- [ ] Test dashboard loads
- [ ] Test API endpoints work
- [ ] Test QR code generation
- [ ] Test data export
- [ ] No console errors

---

## Troubleshooting Guide

### Problem: Blank page on login
- [ ] Check `.env.local` has correct Supabase URL
- [ ] Check console (F12) for errors
- [ ] Verify Supabase project is accessible
- [ ] Try `npm run dev` again

### Problem: 404 errors on API calls
- [ ] Verify API files exist in `app/api/`
- [ ] Check file names match route paths
- [ ] Verify no typos in endpoint URLs
- [ ] Restart dev server (`npm run dev`)

### Problem: Dashboard shows 0 for all stats
- [ ] Verify sample data was imported
- [ ] Check Supabase tables have data
- [ ] Run `sql/sample-inserts.sql`
- [ ] Verify API endpoints work in browser

### Problem: Cannot login
- [ ] Verify user exists in Supabase Authentication
- [ ] Check user email spelling
- [ ] Verify password is correct
- [ ] Check browser localStorage not full
- [ ] Try incognito/private window

### Problem: QR codes not generating
- [ ] Verify `qr-codes` storage bucket exists
- [ ] Check bucket is public
- [ ] Verify API has write permissions
- [ ] Check Supabase logs in dashboard

### Problem: Map not showing
- [ ] Verify Leaflet libraries installed
- [ ] Check zone data in database
- [ ] Verify API returns zone data
- [ ] Check browser console for errors

### Problem: Build fails
- [ ] Run `npm install` again
- [ ] Delete `node_modules/` and `.next/`
- [ ] Run `npm install` and `npm run build` again
- [ ] Check Node.js version (need 18+)

### Problem: TypeScript errors
- [ ] Run `npm run type-check`
- [ ] Fix any reported type errors
- [ ] Ensure all imports have correct paths
- [ ] Check type definitions are installed

---

## Success Criteria

✅ **System is ready when:**
- [ ] Can login with test user
- [ ] Dashboard loads with KPI data
- [ ] All 7 API endpoints return 200 status
- [ ] Sample data displays correctly
- [ ] No errors in browser console
- [ ] QR codes generate and display (if implemented)
- [ ] Map shows zones (if implemented)
- [ ] Can export data to CSV
- [ ] Activity log records actions
- [ ] Build completes without errors

---

## After Launch

### Ongoing Tasks
- [ ] Monitor error logs
- [ ] Track performance metrics
- [ ] Plan database backups
- [ ] Create user accounts for staff
- [ ] Import real ministry data
- [ ] Train users on system
- [ ] Gather feedback for improvements

### Future Enhancements
- [ ] Form UI for creating entities
- [ ] Data table components
- [ ] Advanced reporting/charts
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Mobile app
- [ ] API documentation site

---

## Quick Reference

**Common Commands:**
```bash
npm install                    # Install dependencies
npm run dev                   # Start dev server
npm run build                # Build for production
npm run start                # Start production server
npm run lint                 # Check code quality
npm run type-check           # Check TypeScript
npm run migrate              # Run data migration
```

**File Locations:**
```
Login page:        app/login/page.tsx
Dashboard:         app/dashboard/page.tsx
APIs:             app/api/*/route.ts
Components:       components/
Database schema:  sql/schema.sql
Sample data:      sql/sample-inserts.sql
Config:           .env.local, tsconfig.json, next.config.js
```

**Useful URLs:**
```
http://localhost:3000/              Login page
http://localhost:3000/app/dashboard Dashboard
http://localhost:3000/api/regions   Regions API
http://localhost:3000/api/zones     Zones API
http://localhost:3000/api/pastors   Pastors API
```

---

## Support

**Having issues?**
- Check QUICKSTART.md
- Check SETUP_AND_RUN_GUIDE.ts
- Check README_COMPLETE.md
- Check LOGIN_TO_DASHBOARD_FLOW.md
- Review this checklist
- Check Supabase documentation

**Questions about:**
- Database: See sql/schema.sql
- APIs: See app/api/ folder
- Components: See components/ folder
- Deployment: See README_COMPLETE.md section 14

---

**✅ Congratulations! Heartfelt Ministry Management System is Ready to Use!**
