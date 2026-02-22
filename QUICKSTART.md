# 🙏 Heartfelt International Ministries - Quick Start Guide

## TL;DR - Start in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Supabase account (free at supabase.com)

### Quick Setup

```bash
# 1. Install dependencies
npm install
npm install qrcode react-leaflet leaflet lucide-react

# 2. Create .env.local file with your Supabase credentials
# (See instructions below)

# 3. Start the development server
npm run dev

# 4. Open browser: http://localhost:3000
# 5. Login and access dashboard!
```

---

## Detailed Setup (Step-by-Step)

### Step 1: Set Up Supabase Database

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Name it: `heartfelt_ministry`
   - Set a strong postgres password
   - Wait for initialization (2-3 min)

2. **Create Database Schema**
   - Go to **SQL Editor**
   - Click **New Query**
   - Open `sql/schema.sql` from your project
   - Copy ALL content and paste into the SQL editor
   - Click **Run** button
   - ✅ Tables created!

3. **Create Storage Bucket for QR Codes**
   - Go to **Storage**
   - Click **Create new bucket**
   - Name: `qr_codes`
   - Uncheck "Private bucket" (make it public)
   - Click **Create bucket**

4. **Get Your Credentials**
   - Go to **Settings → API**
   - Copy: **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy: **anon public key** (long string starting with `eyJ...`)

### Step 2: Configure Your Local Project

1. **Create `.env.local` file** in project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. **Install dependencies**:

```bash
npm install
npm install qrcode react-leaflet leaflet lucide-react
```

### Step 3: Load Sample Data (Optional)

**Option A - Using SQL (Recommended)**

- Go to Supabase **SQL Editor**
- Create new query
- Open `sql/sample-inserts.sql` from your project
- Copy ALL content and paste
- Click **Run**
- ✅ Sample data loaded! (10 regions, 5 zones, 3 pastors, etc)

**Option B - Create Manually**

You can skip this and create data manually through the dashboard.

### Step 4: Start Development Server

```bash
npm run dev
```

You'll see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 5: Login to Dashboard

1. **Open browser**: http://localhost:3000
2. **You'll see the login page**
3. **Login with Supabase user**:
   - First, create a user in Supabase:
     - Go to Supabase → **Authentication → Users**
     - Click "Invite user" or "Create user"
     - Email: `admin@heartfelt.zw`
     - Password: (set strong password, or use auto-generated link)
   
   - Then login in the app with those credentials

4. **Expected**: You're redirected to `/dashboard` ✅

---

## 🗂️ Project Structure

```
Capture/
├── app/
│   ├── api/                    # API routes
│   │   ├── regions/           # Region CRUD
│   │   ├── zones/             # Zone CRUD  
│   │   ├── pastors/           # Pastor CRUD
│   │   ├── deacons/           # Deacon CRUD
│   │   ├── members/           # Member CRUD
│   │   ├── departments/       # Department CRUD
│   │   ├── transfers/         # Transfer logic
│   │   ├── activity-log/      # Audit trail
│   │   ├── export/            # CSV export
│   │   └── ...
│   ├── dashboard/             # Admin dashboard pages
│   ├── login/                 # Login page
│   └── page.tsx              # Home page
├── components/
│   ├── dashboard/            # Dashboard components
│   ├── forms/                # Form components
│   ├── map/                  # Map component
│   ├── qr/                   # QR code component
│   └── ...
├── lib/
│   ├── supabaseClient.ts     # Supabase initialization
│   ├── idGenerator.ts        # ID generation logic
│   ├── idGeneratorDb.ts      # Database ID helpers
│   ├── qrCodeGenerator.ts    # QR code generation
│   └── ...
├── sql/
│   ├── schema.sql           # Database schema
│   └── sample-inserts.sql   # Sample data
├── scripts/
│   └── migrate-data.ts      # Data migration tool
└── .env.local               # Your credentials (CREATE THIS!)
```

---

## 📋 What Happens When You Login?

```
1. User enters email/password on /app/login
           ↓
2. Middleware (middleware.ts) checks authentication
           ↓
3. If valid → Redirect to /app/dashboard
           ↓  
4. Dashboard loads:
   - Fetches stats from API routes
   - Displays KPI cards (regions, zones, pastors, etc)
   - Shows live map with zone locations
   - Lists recent activity
           ↓
5. User can:
   - View regions, zones, pastors, deacons
   - Create new entries (auto-generates IDs)
   - Generate/download QR codes
   - View transfer history
   - Export data to CSV
   - See activity logs
```

---

## 🚀 Common Operations

### Add a New Zone
1. Dashboard → Zones (sidebar)
2. Click "Add Zone" (or similar button)
3. Select Region
4. Enter zone name, city, coordinates
5. Click "Create"
6. ID auto-generated (e.g., `RZW01001`)

### Add a Pastor
1. Dashboard → Pastors
2. Click "Add Pastor"
3. Select Zone (from dropdown)
4. Enter name, contact, email
5. Click "Create"
6. ID auto-generated (e.g., `RZW01001P01`)
7. QR code auto-generated!

### View QR Code
1. Go to Pastors/Deacons/Members list
2. Click on an entry
3. You'll see a QR card with:
   - QR code image
   - Download PNG button
   - Print button

### Export Data
1. Dashboard → any list view
2. Look for "Export" or "Download CSV"
3. CSV file downloaded with all data

---

## 🛠️ Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
- **Solution**: 
  1. Create `.env.local` file in root
  2. Add your Supabase credentials
  3. Restart `npm run dev`

### "Invalid credentials" at login
- **Solution**:
  1. Go to Supabase → Authentication → Users
  2. Verify the user exists
  3. Check email/password are correct
  4. Check browser console (F12) for errors

### "Cannot GET /api/..."
- **Solution**:
  1. Check terminal for errors while `npm run dev` runs
  2. Verify API route file exists in `app/api/`
  3. Restart dev server

### QR code not showing
- **Solution**:
  1. Check Supabase Storage bucket "qr_codes" exists
  2. Verify bucket is PUBLIC (not private)
  3. Check browser console (F12) for errors

### Map component not displaying
- **Solution**:
  1. Ensure zones have coordinates (latitude, longitude)
  2. Check browser console for errors
  3. Verify react-leaflet is installed: `npm install react-leaflet leaflet`

---

## 📦 Install Missing Packages

If you get "module not found" errors, install missing packages:

```bash
# QR code generation
npm install qrcode

# Map component
npm install react-leaflet leaflet

# Icons
npm install lucide-react

# CSV parsing (for migration)
npm install csv-parse

# Type definitions
npm install --save-dev @types/node
```

---

## 🔐 About Authentication & Security

The system includes:
- ✅ Login/Logout functionality
- ✅ Role-based access (admin, pastor, deacon, etc)
- ✅ Row-level security in database
- ✅ Protected routes (middleware)
- ✅ Activity logging for audit trail

For production, also:
- Set up HTTPS/SSL (Vercel does this automatically)
- Configure email verification
- Set up 2FA (Two-Factor Authentication)
- Regular backups in Supabase

---

## 📊 Database Overview

Key tables:
- **regions** - Geographic regions/areas
- **zones** - Churches/zones within regions
- **pastors** - Pastor records
- **deacons** - Deacon records
- **church_members** - Church member records
- **departments** - Departments within zones
- **users** - User accounts for authentication
- **activity_log** - Audit trail of all actions
- **transfers_log** - History of pastor/deacon transfers
- **qr_codes** - QR code metadata

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. ✅ Create sample data (SQL or manual)
3. ✅ Explore dashboard features
4. ✅ Test creating zones, pastors, members
5. ✅ Download/print QR codes
6. ✅ Export data to CSV
7. 📚 Read API documentation (in individual route files)
8. 🎨 Customize colors/branding
9. 👥 Add more users in Supabase
10. 🚀 Deploy to production (Vercel recommended)

---

## 📚 Additional Resources

- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- React docs: https://react.dev
- TailwindCSS docs: https://tailwindcss.com/docs

---

## ❓ Still Need Help?

Check:
1. Browser console (F12 → Console tab)
2. Terminal output where `npm run dev` runs
3. Supabase dashboard for data verification
4. Network tab (F12 → Network) for failed API calls

---

**🎉 You're ready to go! Happy coding!**
