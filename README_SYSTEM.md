# Heartfelt International Ministries - Registration & Management System

## 📋 Overview

A complete ministry-wide registration and management system built with Next.js 14+ and Supabase. Manage zones, churches, pastors, deacons, departments, and church members with unique structured IDs, QR code generation, live map visualization, and comprehensive reporting.

## 🎯 Key Features

- **Unique Structured IDs**: Auto-generated codes for all entities (Zones, Pastors, Deacons, Members, Departments)
- **QR Code Generation**: QR cards with ministry branding, downloadable and printable
- **Live Map Visualization**: Interactive map with color-coded regions and zone markers
- **Admin Dashboard**: Complete CRUD operations for all entities
- **Data Transfer Management**: Track and manage transfers of pastors/HODs between zones
- **Activity Logging**: Complete audit trail of all changes
- **Row-Level Security**: Granular access control at database level
- **CSV Import/Export**: Bulk import from Excel/CSV and export for reporting
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 📁 Project Structure

```
.
├── app/
│   ├── api/                         # API routes
│   │   ├── regions/route.ts
│   │   ├── zones/route.ts
│   │   ├── pastors/route.ts
│   │   ├── deacons/route.ts
│   │   ├── departments/route.ts
│   │   ├── members/route.ts
│   │   ├── transfers/route.ts
│   │   ├── activity-log/route.ts
│   │   └── export/route.ts
│   ├── dashboard/                   # Main dashboard pages
│   ├── login/                       # Authentication
│   └── layout.tsx
│
├── components/
│   ├── dashboard/                   # Dashboard management components
│   │   ├── DashboardOverview.tsx
│   │   ├── RegionsManagement.tsx
│   │   ├── ZonesManagement.tsx
│   │   ├── PastorsManagement.tsx
│   │   ├── DeaconsManagement.tsx
│   │   └── MembersManagement.tsx
│   ├── qr/
│   │   └── QRCodeCard.tsx
│   ├── map/
│   │   └── MapComponent.tsx
│   └── layout/                      # Header, Sidebar, Footer
│
├── lib/
│   ├── idGenerator.ts               # ID generation utilities
│   ├── idGeneratorDb.ts            # Database-driven ID generation
│   ├── qrCodeGenerator.ts          # QR code utilities
│   ├── supabaseClient.ts           # Supabase client config
│   └── schema.ts                   # Database types
│
├── sql/
│   ├── schema.sql                  # Complete database schema
│   └── sample-inserts.sql          # Sample data
│
├── scripts/
│   └── migrate-data.ts             # Data migration script
│
├── data/
│   ├── sample-regions.csv
│   ├── sample-zones.csv
│   ├── sample-pastors.csv
│   └── sample-deacons.csv
│
└── types/
    ├── attendance.ts
    ├── pastor.ts
    ├── deacon.ts
    ├── zone.ts
    └── ...
```

## 🗄️ Database Schema

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **regions** | Ministry regions | region_code, name, country |
| **zones** | Geographic zones within regions | full_code, region_id, coordinates |
| **pastors** | Pastor registry | full_code, zone_id, contact, qr_code_url |
| **deacons** | Deacon registry | full_code, zone_id, contact, qr_code_url |
| **church_members** | Church member registry | full_code, zone_id, department_id |
| **departments** | Church departments (Music, Youth, etc) | full_code, zone_id, hod_id |
| **users** | System users & authentication | email, role, zone_id |
| **activity_log** | Audit trail of all changes | user_id, action, entity_type |
| **transfers_log** | Track pastor/HOD transfers | person_id, from_zone, to_zone |
| **qr_codes** | QR code metadata | entity_type, entity_id, qr_code_url |

## 🔑 ID Generation Format

```
Zone:            R{Country}{Region}{Zone}
                 Example: RZW01001

Pastor:          R{Country}{Region}{Zone}P{Number}
                 Example: RZW01001P01

Deacon:          R{Country}{Region}{Zone}D{Number}
                 Example: RZW01001D01

Member:          R{Country}{Region}{Zone}M{Number}
                 Example: RZW01001M001

Department:      R{Country}{Region}{Zone}DEP{Number}
                 Example: RZW01001DEP01
```

- **R** = Ministry Prefix
- **Country** = 2-letter ISO code (ZW, ZA, KE, etc)
- **Region** = 2-digit code (01-99)
- **Zone** = 3-digit code (001-999)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### 1. Setup Supabase

1. Create a [Supabase project](https://supabase.com)
2. Go to SQL Editor and run [sql/schema.sql](sql/schema.sql)
3. Set up storage bucket for QR codes:
   ```sql
   CREATE STORAGE BUCKET qr_codes;
   ```

### 2. Create Storage Bucket

In Supabase Dashboard:
- Go to Storage → Create new bucket
- Name: `qr_codes`
- Make it public

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Mapbox (if using Mapbox instead of Leaflet)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### 5. Install Dependencies for QR Code Generation

```bash
npm install qrcode
npm install --save-dev @types/qrcode
```

### 6. Install Leaflet (for Live Map)

```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### 7. Initialize Database

Run the seed script to populate sample data:

```bash
npm run migrate:sample
```

Or manually run SQL in Supabase:

```sql
-- Copy contents from sql/sample-inserts.sql
-- and paste into Supabase SQL Editor
```

### 8. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000`

## 📊 Data Migration

### Import from CSV

1. Prepare CSV files in the format shown in `data/sample-*.csv`
2. Place files in `data/` folder
3. Run migration:

```bash
npm run migrate
```

The migration script handles:
- Validation of structured codes
- Foreign key relationships
- Duplicate prevention with UPSERT
- Error logging

### CSV File Format

**regions.csv**
```csv
region_code,name,country,description
ZW01,Harare Metropolitan,Zimbabwe,Capital city region
```

**zones.csv**
```csv
region_code,zone_code,name,address,city,latitude,longitude,contact_person,contact_email,contact_phone
ZW01,001,Harare Central Zone,35 Samora Machel Ave,Harare,-17.8252,31.0335,David Mtshali,david@ministry.zw,+263712345678
```

**pastors.csv**
```csv
zone_code,name,contact,email,date_of_birth,gender
RZW01001,Pastor David Mtshali,+263712345678,david@ministry.zw,1965-03-15,Male
```

**deacons.csv**
```csv
zone_code,name,contact,email,date_of_birth,gender
RZW01001,Deacon Timothy Moyo,+263712345688,timothy@ministry.zw,1975-05-25,Male
```

## 🔐 Authentication & Security

### User Roles

- **Admin**: Full system access, can view all entities
- **Pastor**: Can view own zone and members
- **Deacon**: Can view own zone and department
- **HOD**: Can view assigned department
- **Member**: Can view own profile only

### Security Features

- Row-Level Security (RLS) enforced at database level
- Password hashing with bcrypt
- JWT-based authentication
- HTTPS only in production
- Activity logging for audit trail
- Data backup: Daily with 7-day retention

## 📱 API Documentation

### Regions Endpoint

```bash
# List all regions
GET /api/regions

# Create region
POST /api/regions
{
  "region_code": "ZW01",
  "name": "Harare",
  "country": "Zimbabwe"
}
```

### Zones Endpoint

```bash
# List zones
GET /api/zones?region_id={regionId}

# Create zone
POST /api/zones
{
  "region_id": "uuid",
  "zone_number": 1,
  "name": "Zone Name",
  "city": "City",
  "latitude": -17.8252,
  "longitude": 31.0335
}
```

### Pastors Endpoint

```bash
# List pastors
GET /api/pastors?zone_id={zoneId}

# Create pastor (auto-generates QR code)
POST /api/pastors
{
  "zone_id": "uuid",
  "name": "Pastor Name",
  "email": "email@ministry.zw",
  "contact": "+263712345678"
}
```

### Transfers Endpoint

```bash
# List transfer history
GET /api/transfers?person_id={personId}

# Transfer pastoral staff
POST /api/transfers
{
  "transfer_type": "pastor",
  "person_id": "uuid",
  "to_zone_id": "uuid",
  "transfer_date": "2024-01-15",
  "reason": "Reassignment"
}
```

### Export Endpoint

```bash
# Export as CSV
GET /api/export?entity_type=pastors&format=csv

# Export as JSON
GET /api/export?entity_type=zones&format=json
```

## 🗺️ Live Map Features

- **Color-Coded Regions**: Each region has a unique color
- **Interactive Markers**: Click to view zone details
- **Zone Statistics**: Displays pastor and member counts
- **Coordinate Display**: Shows latitude/longitude
- **Region Filtering**: Filter map by selected region
- **Cluster Visualization**: Shows zone coverage areas

## 📄 QR Code Features

- **Embedded Information**: Name, Code, Zone, Region, Contact
- **Secure Links**: QR code links to profile page
- **Export Options**: Download as PNG or PDF
- **Print Ready**: Ministry-branded card format
- **Auto-generated**: Created automatically when entity is added

## 🔍 Dashboard Features

### Overview
- KPI cards for all entity types
- Totals and statistics
- Trends and metrics

### Management Panels
- Full CRUD operations
- Search and filter capabilities
- Batch actions
- Export functionality

### Activity Log
- View all system activities
- Filter by user, action, entity
- Date range selection
- Export audit trail

## 📈 Reporting

### Generated Reports

1. **Regional Summary**: Zone counts, pastor distribution
2. **Member Statistics**: Active/inactive members by zone
3. **Transfer History**: All pastoral movements
4. **Department Report**: Members per department
5. **Activity Audit**: Complete change log

### Export Formats

- CSV (for Excel import)
- JSON (for API integration)
- PDF (printable reports)

## 🛠️ Development

### Run Tests

```bash
npm run test
```

### Build for Production

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint
npm run format
```

## 📦 Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "@supabase/supabase-js": "^2.38.0",
  "qrcode": "^1.5.3",
  "react-leaflet": "^4.2.1",
  "leaflet": "^1.9.4",
  "tailwindcss": "^3.3.0",
  "csv-parse": "^5.4.1"
}
```

## 🔄 Workflow Examples

### Creating a New Zone

1. Go to Dashboard → Zones Management
2. Click "+ Add Zone"
3. Select Region, enter Zone Number and Name
4. Add optional location details (address, coordinates, contact)
5. Submit → System auto-generates full code (e.g., RZW01001)

### Adding a Pastor

1. Go to Dashboard → Pastors Management
2. Click "+ Add Pastor"
3. Select Zone, enter pastor details
4. Submit → System:
   - Generates unique code (e.g., RZW01001P01)
   - Creates QR code with info
   - Uploads to storage

### Transferring a Pastor

1. Go to Dashboard → Transfers
2. Click on pastor's transfer option
3. Select new zone
4. Confirm transfer → Creates log entry
5. Previous zone record archived

### Exporting Data

1. Go to Dashboard → Export
2. Select entity type (Regions, Zones, Pastors, etc)
3. Choose format (CSV or JSON)
4. Download file

## 🐛 Troubleshooting

### QR Code Not Generating

- Check Supabase storage bucket is public
- Verify bucket name is `qr_codes`
- Check API has write permissions

### Map Not Displaying

- Ensure leaflet packages are installed
- Check browser console for errors
- Verify zones have valid coordinates

### Data Not Showing

- Confirm RLS policies are enabled
- Check user's role permissions
- Verify data exists in Supabase

## 📞 Support

For issues, feature requests, or questions:
- Create an issue on GitHub
- Contact: support@heartfelt-ministries.org
- Documentation: https://docs.heartfelt-ministries.org

## 📄 License

© 2024 Heartfelt International Ministries. All rights reserved.

## ✅ Implementation Checklist

- [x] Database schema with RLS
- [x] API routes for CRUD
- [x] ID generation system
- [x] QR code generation
- [x] Dashboard components
- [x] Live map implementation
- [x] Data migration scripts
- [x] Sample data
- [x] Export functionality
- [x] Documentation
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Mobile app
- [ ] Advanced reporting
- [ ] Analytics dashboard

---

**Version**: 1.0.0  
**Last Updated**: February 19, 2024  
**Status**: Production Ready
