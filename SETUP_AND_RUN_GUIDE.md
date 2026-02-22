/**
 * HEARTFELT INTERNATIONAL MINISTRIES
 * Complete Setup & Run Guide (Login → Dashboard)
 * 
 * This guide walks you through the entire setup process
 */

// ============================================================================
// STEP 1: PREREQUISITES
// ============================================================================

// Required:
// - Node.js 18+ (download from https://nodejs.org/)
// - npm or yarn
// - Supabase account (https://supabase.com/) - FREE
// - Git (for version control)

// ============================================================================
// STEP 2: SUPABASE SETUP
// ============================================================================

/*
1. Go to https://supabase.com and sign up (free)
2. Create a new project:
   - Click "New Project"
   - Enter Project Name: "heartfelt_ministry"
   - Set Password for postgres user (save this!)
   - Select your region
   - Click "Create new project"

3. Wait for project to initialize (2-3 minutes)

4. Get your Supabase credentials:
   - Go to Settings → API
   - Copy "Project URL" 
   - Copy "anon public" key
   - Keep the "service_role" key safe for admin tasks

5. Create the database schema:
   - Go to the SQL Editor
   - Create a new query
   - Copy ALL content from: sql/schema.sql
   - Paste into SQL Editor
   - Click "Run" button
   - Wait for success message

6. Create storage bucket for QR codes:
   - Go to Storage
   - Click "Create new bucket"
   - Name: "qr_codes"
   - Uncheck "Private bucket" (make it public)
   - Click "Create bucket"
   - Go to Policies
   - Allow SELECT for all users

7. Create authentication users:
   - Go to Authentication → Users
   - Click "Invite user"
   - Email: admin@heartfelt.zw
   - Password: (set a strong password)
   - Click "Send invite" or "Create user"
   - Repeat for test users if needed
*/

// ============================================================================
// STEP 3: PROJECT SETUP
// ============================================================================

// A. Clone or open project in VS Code
// cd c:\Users\tmawa\Documents\GitHub\Capture

// B. Install dependencies
npm install

// C. Install additional packages needed:
npm install qrcode react-leaflet leaflet lucide-react

// D. Create .env.local file in project root
// Copy this and update with YOUR Supabase credentials:

/*
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000

// Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
*/

// ============================================================================
// STEP 4: UPDATE EXISTING CONFIGURATION FILES
// ============================================================================

// Make sure these files exist and are configured:

// 1. Check lib/supabaseClient.ts:
//    - Ensure it imports from environment variables
//    - It should initialize supabase with your credentials

// 2. Check middleware.ts:
//    - Should protect dashboard routes
//    - Should allow login page public access

// 3. Check next.config.js:
//    - Should be configured for Next.js 14

// ============================================================================
// STEP 5: IMPORT SAMPLE DATA (Optional but Recommended)
// ============================================================================

// Option A: Using SQL (Fastest)
// 1. Go to Supabase SQL Editor
// 2. Create new query
// 3. Copy ALL content from: sql/sample-inserts.sql
// 4. Click "Run"
// 5. You now have test data!

// Option B: Using Migration Script (For your own CSV data)
// 1. Place your CSV files in: data/ folder
// 2. Files should be named: regions.csv, zones.csv, pastors.csv, deacons.csv
// 3. Run: npm run migrate
//    (if this command doesn't exist, run: ts-node scripts/migrate-data.ts)

// ============================================================================
// STEP 6: START DEVELOPMENT SERVER
// ============================================================================

npm run dev

// The app will start on http://localhost:3000
// You should see: "ready - started server on 0.0.0.0:3000, url: http://localhost:3000"

// ============================================================================
// STEP 7: LOGIN TO DASHBOARD
// ============================================================================

/*
1. Open browser: http://localhost:3000
2. You should see the login page (/app/login)
3. Enter credentials:
   - Email: admin@heartfelt.zw (or the email you created in Supabase)
   - Password: (the password you set)
4. Click "Login"

Expected behavior:
   - If successful: Redirected to /app/dashboard
   - If failed: See error message on login page

If login fails:
   - Check browser console (F12 → Console tab)
   - Check terminal where npm run dev is running
   - Verify .env.local file has correct Supabase credentials
   - Verify user exists in Supabase Authentication
*/

// ============================================================================
// STEP 8: EXPLORE DASHBOARD
// ============================================================================

/*
After successful login, you'll see the dashboard at /app/dashboard

Available features:

1. Dashboard Overview:
   - KPIs showing total regions, zones, pastors, deacons, members
   - Statistics and averages
   - Click menu items to navigate

2. Access other sections:
   - Regions → View and manage all regions
   - Zones → View zones (with live map)
   - Pastors → View/add pastors
   - Deacons → View/add deacons  
   - Departments → Manage departments with HODs
   - Members → View church members
   - Activity Log → See all changes
   - Settings → User preferences

3. Create new entries:
   - Click "Add Region" / "Add Zone" / "Add Pastor" buttons
   - Forms will auto-generate IDs
   - QR codes generated automatically
*/

// ============================================================================
// STEP 9: COMMON OPERATIONS
// ============================================================================

// Creating a Zone:
// 1. Dashboard → Zones → "Add Zone" button
// 2. Enter:
//    - Region: (select from dropdown)
//    - Zone Number: 001, 002, etc
//    - Name: Zone name
//    - City: City name
//    - Latitude/Longitude: Click map or enter coordinates
//    - Contact info optional
// 3. Click "Create Zone"
// 4. Full code like "RZW01001" is auto-generated

// Creating a Pastor:
// 1. Dashboard → Pastors → "Add Pastor" button
// 2. Enter:
//    - Zone: (select zone)
//    - Name: Pastor name
//    - Contact: Phone number
//    - Email: Pastor email
//    - Gender: Select from dropdown
// 3. Click "Create Pastor"
// 4. Full code like "RZW01001P01" auto-generated
// 5. QR code generated and available to download/print

// Viewing Activity Log:
// 1. Dashboard → Activity Log
// 2. Search by user, action, date range
// 3. See all changes made to the system

// ============================================================================
// STEP 10: TROUBLESHOOTING
// ============================================================================

/*
Login issues:
- Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
  → Solution: Check .env.local file exists in root directory

- Error: "Invalid credentials"
  → Solution: Verify user exists in Supabase → Authentication → Users

- Error: "Network error when fetching..."
  → Solution: Check if .env.local has correct Supabase URL

Dashboard not loading after login:
- Check browser console for errors (F12 → Console)
- Check terminal running "npm run dev" for errors
- Try hard refresh (Ctrl+Shift+R)

API errors when creating zones/pastors:
- Ensure all required fields are filled
- Check Supabase Storage "qr_codes" bucket exists and is public
- Verify RLS policies are correct in Supabase

QR code not generating:
- Check if "qrcode" package is installed
- Verify Supabase Storage bucket "qr_codes" exists
- Check browser console for specific errors
*/

// ============================================================================
// STEP 11: DEVELOPMENT TIPS
// ============================================================================

/*
Hot Reload:
- Any file changes automatically refresh the browser
- No need to restart dev server (usually)

View Database in Real-time:
- Open Supabase Dashboard
- Click "Table Editor"
- Select any table (zones, pastors, etc)
- You'll see live data as you add through the app

API Testing:
- Use VS Code extension "REST Client"
- Or use Postman (https://postman.com)
- Test API routes: /api/zones, /api/pastors, etc

Debug mode:
- Add console.log() in your React components
- Open Dev Tools (F12) → Console tab
- You'll see all your logs

Authentication debugging:
- Check lib/supabaseClient.ts initialization
- Verify middleware.ts is protecting routes correctly
- Test by logging out and logging back in
*/

// ============================================================================
// STEP 12: RUNNING SPECIFIC COMMANDS
// ============================================================================

// Development server (with hot reload):
npm run dev

// Build for production:
npm run build

// Start production server:
npm start

// Run TypeScript type check:
npx tsc --noEmit

// Run linter:
npm run lint

// Run migration script:
ts-node scripts/migrate-data.ts

// ============================================================================
// STEP 13: PRODUCTION DEPLOYMENT
// ============================================================================

/*
When ready to go live:

1. Build the project:
   npm run build

2. Check for errors:
   npm run lint
   npx tsc --noEmit

3. Deploy to Vercel (easiest for Next.js):
   - Go to vercel.com
   - Connect your GitHub repo
   - Set environment variables (.env.local)
   - Click "Deploy"
   - Done! Your app is live

4. Alternative: Deploy to other platforms:
   - Netlify
   - Railway
   - Heroku
   - AWS Amplify
   - DigitalOcean App Platform

5. Set up HTTPS/SSL (most platforms do this automatically)

6. Configure email notifications (optional)

7. Set daily backups in Supabase (Settings → Backups)
*/

// ============================================================================
// CONGRATULATIONS!
// ============================================================================

/*
You now have a fully functional Ministry Management System with:

✅ User authentication (login/logout)
✅ Role-based access control (admin, pastor, deacon, member)
✅ Complete CRUD operations for all entities
✅ Automatic ID generation with structured codes
✅ QR code generation and storage
✅ Live map visualization
✅ Activity logging and audit trail
✅ Data export (CSV)
✅ Transfer tracking for pastors/HODs
✅ Dashboard with KPIs and statistics
✅ Responsive design for mobile and desktop

Next steps:
1. Customize branding (colors, logos)
2. Train staff on how to use the system
3. Import your actual ministry data
4. Set up daily backups
5. Consider email notifications for important events
6. Gather feedback and iterate
*/

export {}
