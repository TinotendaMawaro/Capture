# 🙏 Heartfelt International Ministries - Complete System Documentation

## Overview

A complete web-based ministry management system for **Heartfelt International Ministries** built with **Next.js 14**, **React**, **TailwindCSS**, and **Supabase**.

### Key Features

✅ **Authentication** - Secure login/logout with Supabase  
✅ **Region Management** - Organize regions across countries  
✅ **Zone Management** - Create and manage church zones  
✅ **Pastor Management** - Register and track pastors  
✅ **Deacon Management** - Manage deacons with transfer history  
✅ **Member Management** - Church member registration and tracking  
✅ **Department Management** - Organize departments with HOD assignment  
✅ **QR Code Generation** - Auto-generate, download, and print QR codes  
✅ **Live Map** - Interactive map showing all zones with markers  
✅ **Transfer System** - Track pastor/deacon/HOD transfers between zones  
✅ **Activity Logging** - Complete audit trail of all system actions  
✅ **Data Export** - Export to CSV for reporting  
✅ **Dashboard** - KPIs and real-time statistics  

---

## Quick Start

### 1. Prerequisites

- **Node.js 18+** (https://nodejs.org/)
- **Supabase Account** (free at https://supabase.com/)
- **Git** (optional but recommended)

### 2. Project Setup

```bash
# Clone or navigate to project directory
cd c:\Users\tmawa\Documents\GitHub\Capture

# Install dependencies
npm install

# Install additional packages
npm install qrcode react-leaflet leaflet lucide-react csv-parse
```

### 3. Supabase Configuration

**Create Supabase Project:**
1. Go to https://supabase.com
2. Click "New Project"
3. Enter name: `heartfelt_ministry`
4. Set postgres password (save it)
5. Select region
6. Click "Create"

**Create Database Schema:**
1. Go to **SQL Editor**
2. Click **New Query**
3. Copy content from `sql/schema.sql`
4. Paste into editor
5. Click **Run** ✅

**Create Storage Bucket:**
1. Go to **Storage**
2. Click **Create new bucket**
3. Name: `qr_codes`
4. Make it **Public** (uncheck "Private")
5. Click **Create bucket**

**Get Your Credentials:**
1. Go to **Settings → API**
2. Copy **Project URL**
3. Copy **anon public key**

### 4. Environment Setup

Create `.env.local` in project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Load Sample Data

Open Supabase **SQL Editor**, create new query, copy from `sql/sample-inserts.sql`, run it.

### 6. Start Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### 7. Login

**Create a Supabase User First:**
1. Go to Supabase Dashboard
2. **Authentication → Users**
3. Click **Invite user**
4. Email: `admin@heartfelt.zw`
5. Set password or send invite link

**Then login in the app** with those credentials.

---

## Project Structure

```
Capture/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── regions/route.ts      # Region CRUD API
│   │   ├── zones/route.ts        # Zone CRUD API
│   │   ├── pastors/route.ts      # Pastor CRUD API
│   │   ├── deacons/route.ts      # Deacon CRUD API
│   │   ├── members/route.ts      # Member CRUD API
│   │   ├── departments/route.ts  # Department CRUD API
│   │   ├── transfers/route.ts    # Transfer management
│   │   ├── activity-log/route.ts # Audit trail
│   │   └── export/route.ts       # CSV export
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard home
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── dashboard/
│   │   └── DashboardOverview.tsx # KPI dashboard
│   ├── map/
│   │   └── MapComponent.tsx      # Interactive map
│   ├── qr/
│   │   └── QRCodeCard.tsx        # QR code display/download
│   ├── layout/
│   │   ├── Header.tsx            # Header component
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── Footer.tsx            # Footer
│   ├── forms/                    # Form components
│   └── tables/                   # Data table components
│
├── lib/                          # Utility functions
│   ├── supabaseClient.ts         # Supabase initialization
│   ├── idGenerator.ts            # ID generation logic
│   ├── idGeneratorDb.ts          # Database ID helpers
│   ├── qrCodeGenerator.ts        # QR code creation
│   ├── authHelpers.ts            # Auth utilities
│   └── roleGuard.ts              # Permission checks
│
├── sql/                          # Database files
│   ├── schema.sql                # Complete database schema
│   └── sample-inserts.sql        # Test data
│
├── scripts/                      # Helper scripts
│   └── migrate-data.ts           # Data migration tool
│
├── data/                         # Sample CSV files
│   └── sample-regions.csv        # Region data
│
├── public/                       # Static assets
├── middleware.ts                 # Auth middleware
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
├── package.json                  # Dependencies
├── QUICKSTART.md                 # Quick setup guide
├── SETUP_AND_RUN_GUIDE.ts        # Detailed setup guide
└── README.md                     # This file
```

---

## Database Schema

### Key Tables

**regions**
- Stores geographic regions (countries/areas)
- region_code (e.g., "ZW01"), name, country

**zones**
- Church zones within regions
- zone_code, full_code (e.g., "RZW01001"), coordinates (lat/long)

**pastors**
- Pastor records with contact info
- full_code, name, contact, email, QR code URL

**deacons**
- Deacon records
- Similar structure to pastors

**church_members**
- Individual church member records
- Can be assigned to departments

**departments**
- Departments within zones
- Can have a HOD (Head of Department)

**users**
- User accounts for authentication
- Roles: admin, pastor, deacon, hod, member

**activity_log**
- Complete audit trail of all changes
- User, action, timestamp, old/new values

**transfers_log**
- Tracks pastor/deacon transfers between zones
- from_zone, to_zone, transfer_date, reason

**qr_codes**
- Stores QR code metadata
- Links to entity, URL to image

---

## ID Generation Rules

IDs are auto-generated and follow a structured format:

```
Zone:     R + CountryCode(2) + RegionCode(2) + ZoneCode(3)
          Example: RZW01001

Pastor:   ZoneID + P + SequenceNumber(2)
          Example: RZW01001P01

Deacon:   ZoneID + D + SequenceNumber(2)
          Example: RZW01001D01

Member:   ZoneID + M + SequenceNumber(3)
          Example: RZW01001M001

Department: ZoneID + DEP + SequenceNumber(2)
          Example: RZW01001DEP01
```

**Key Rules:**
- Cannot be manually changed
- Unique across entire system
- Automatically assigned on creation
- Based on hierarchy (region → zone → person)

---

## API Endpoints

### Regions
- `GET /api/regions` - List all regions
- `POST /api/regions` - Create region

### Zones
- `GET /api/zones` - List zones (can filter by region)
- `POST /api/zones` - Create zone

### Pastors
- `GET /api/pastors` - List pastors
- `POST /api/pastors` - Create pastor + generate QR code

### Deacons
- `GET /api/deacons` - List deacons
- `POST /api/deacons` - Create deacon + generate QR code

### Members
- `GET /api/members` - List members
- `POST /api/members` - Create member + generate QR code

### Departments
- `GET /api/departments` - List departments
- `POST /api/departments` - Create department

### Transfers
- `GET /api/transfers` - Get transfer history
- `POST /api/transfers` - Create transfer

### Activity Log
- `GET /api/activity-log` - View audit trail (with filtering)
- `POST /api/activity-log` - Log activity

### Export
- `GET /api/export?entity_type=zones&format=csv` - Export data to CSV

All endpoints return JSON and follow REST conventions.

---

## Features Explained

### 1. Authentication & Authorization

**Login Flow:**
1. User enters email/password
2. Supabase validates credentials
3. Session token created
4. Middleware protects dashboard routes
5. User redirected to dashboard

**Roles:**
- **admin** - Full system access
- **pastor** - See own zone data
- **deacon** - See own zone data
- **hod** - See own department
- **member** - See own profile

### 2. QR Code Generation

**Automatic Process:**
1. When creating pastor/deacon/member
2. QR code data created with entity info
3. QR generated as image
4. Uploaded to Supabase Storage
5. URL saved in database

**Download/Print:**
1. Click QR card in UI
2. "Download PNG" button saves image
3. "Print" button opens print preview
4. Card includes name, ID, zone, region, contact

### 3. Live Map

**Features:**
- Interactive map of zones
- Color-coded by region
- Click markers for details
- Shows pastor/member counts
- Filterable by region
- Uses OpenStreetMap tiles

**Requirements:**
- Zones must have latitude/longitude
- Map loads automatically on page

### 4. Data Transfer System

**When transferring pastor/deacon/HOD:**
1. Specify source zone/department
2. Select destination zone
3. Enter transfer date and reason
4. System logs in transfers_log table
5. Person's zone_id updated
6. Transfer history maintained

### 5. Activity Logging

**Tracks:**
- All CRUD operations
- User who made change
- Timestamp
- Old values vs new values
- IP address (if available)

**Use Cases:**
- Compliance/audit trail
- Debug changes
- User activity monitoring

### 6. Data Export

**CSV Export Available For:**
- Regions
- Zones
- Pastors
- Deacons
- Church Members
- Departments

**Export Options:**
- Filter by region/zone
- Download as CSV file
- Timestamped filenames

---

## Common Operations

### Add a Zone

1. Go to Dashboard → Zones
2. Click "Add Zone"
3. Select Region (dropdown)
4. Enter Zone Number (e.g., 001)
5. Enter Name, City, Address
6. Optional: Add coordinates (or click map)
7. Click "Create Zone"
8. ID auto-generated: `RZW01001`

### Add a Pastor

1. Go to Dashboard → Pastors
2. Click "Add Pastor"
3. Select Zone
4. Enter Name, Contact, Email
5. Select Gender
6. Click "Create Pastor"
7. QR code auto-generated!
8. ID: `RZW01001P01`

### Download QR Code

1. Go to Pastors/Deacons list
2. Find person
3. Click to view details
4. See QR Code Card
5. Click "📥 Download PNG"
6. File saved as `{fullcode}_qr.png`

### Print QR Card

1. QR Code Card → Click "🖨️ Print"
2. Print preview opens
3. Styled with ministry branding
4. Shows all details (name, zone, ID, QR code)

### Transfer Pastor

1. Go to Dashboard → Transfers
2. Click "Transfer Pastor"
3. Select pastor
4. Select source zone (auto-filled)
5. Select destination zone
6. Enter transfer date
7. Optional: Add reason
8. Click "Confirm Transfer"
9. Transfer logged + history updated

### Export Data

1. Go to any list (Zones, Pastors, etc)
2. Click "Export" or "Download CSV"
3. Select format (CSV recommended)
4. Optional: Filter by region/zone
5. Click "Download"
6. CSV file downloaded

---

## Troubleshooting

### "Cannot find module" errors

```bash
# Install missing packages
npm install
npm install qrcode react-leaflet leaflet lucide-react
```

### "NEXT_PUBLIC_SUPABASE_URL is not defined"

Check `.env.local` exists in project root with correct values.

### Login fails with "Invalid credentials"

1. Verify user exists in Supabase → Authentication → Users
2. Check email/password are correct
3. May need to set password or verify email

### QR code not showing

1. Check Supabase Storage bucket "qr_codes" exists
2. Ensure bucket is PUBLIC
3. Check browser console (F12 → Console)
4. Verify `qrcode` package installed

### Map not displaying

1. Ensure zones have coordinates
2. Try zooming in/out
3. Check console for errors
4. Verify `react-leaflet` and `leaflet` installed

### API returns 401 Unauthorized

1. Check authentication token is valid
2. Re-login to refresh token
3. Check .env.local has correct keys

### Database migration fails

1. Ensure SQL schema correct
2. Check Supabase database is accessible
3. Look for unique constraint violations
4. Check foreign key references exist

---

## Performance Tips

1. **Pagination** - API supports `limit` and `offset` parameters
2. **Caching** - Browser cache enabled by default
3. **Lazy Loading** - Components load on demand
4. **Indexes** - Database indexed on foreign keys
5. **CDN** - Images served from Supabase CDN

---

## Security Features

✅ **Authentication** - Login required for dashboard  
✅ **Row-Level Security** - Database level access control  
✅ **HTTPS** - Enforced in production  
✅ **Protected Routes** - Middleware guards sensitive pages  
✅ **Audit Trail** - All changes logged  
✅ **Password Hashing** - Supabase handles securely  

### Production Checklist

- [ ] Change all default passwords
- [ ] Set up HTTPS/SSL (Vercel does automatically)
- [ ] Configure email notifications
- [ ] Set up daily backups
- [ ] Enable 2FA for admins
- [ ] Review RLS policies
- [ ] Set rate limiting on APIs
- [ ] Add monitoring/logging

---

## Deployment

### To Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then redeploy
```

### To Other Platforms

- **Netlify** - Connect GitHub repo
- **Railway** - Connect repo, set env vars
- **Heroku** - `git push heroku main`
- **AWS Amplify** - Connect GitHub repo

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint

# Run data migration
npm run migrate
```

---

## Support & Resources

- **Next.js Docs** - https://nextjs.org/docs
- **Supabase Docs** - https://supabase.com/docs
- **React Docs** - https://react.dev
- **TailwindCSS** - https://tailwindcss.com/docs

---

## File Locations Reference

| Feature | File |
|---------|------|
| Login Page | `app/login/page.tsx` |
| Dashboard | `app/dashboard/page.tsx` |
| Region API | `app/api/regions/route.ts` |
| Zone API | `app/api/zones/route.ts` |
| Pastor API | `app/api/pastors/route.ts` |
| QR Generator | `lib/qrCodeGenerator.ts` |
| ID Generator | `lib/idGenerator.ts` |
| DB Schema | `sql/schema.sql` |
| Sample Data | `sql/sample-inserts.sql` |
| Migration Script | `scripts/migrate-data.ts` |

---

## License

Proprietary - Owned by Heartfelt International Ministries

---

## Next Steps

1. ✅ Complete setup above
2. ✅ Load sample data
3. ✅ Explore dashboard
4. ✅ Test creating entries
5. ✅ Download/print QR codes
6. ✅ Test data export
7. 📚 Customize branding
8. 👥 Create real users
9. 📊 Import actual data
10. 🚀 Deploy to production

---

**🎉 You're ready to manage your ministry digitally!**
