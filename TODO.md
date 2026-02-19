# Heartfelt International Ministries - Implementation TODO

## Phase 1: Database Schema
- [ ] 1.1 Create comprehensive SQL schema (lib/himSchema.ts) with all core tables
- [ ] 1.2 Add RLS policies for all tables
- [ ] 1.3 Add indexes for performance
- [ ] 1.4 Create sample insert scripts

## Phase 2: QR Code & Cards
- [ ] 2.1 Create QR code generation component (components/qr/QRCodeGenerator.tsx)
- [ ] 2.2 Create ID card component (components/cards/IDCard.tsx)
- [ ] 2.3 Add QR scanner page (app/verify/[id]/page.tsx enhancement)

## Phase 3: API Routes
- [ ] 3.1 Create regions API (app/api/regions/route.ts)
- [ ] 3.2 Create zones API (app/api/zones/route.ts)
- [ ] 3.3 Create pastors API (app/api/pastors/route.ts)
- [ ] 3.4 Create deacons API (app/api/deacons/route.ts)
- [ ] 3.5 Create departments API (app/api/departments/route.ts)
- [ ] 3.6 Create church members API (app/api/members/route.ts)
- [ ] 3.7 Create transfers API (app/api/transfers/route.ts)

## Phase 4: Data Migration
- [ ] 4.1 Create migration script (scripts/migrateData.ts)
- [ ] 4.2 Create CSV parser utility
- [ ] 4.3 Add validation functions

## Phase 5: UI Enhancements
- [ ] 5.1 Enhance dashboard KPIs
- [ ] 5.2 Add export functionality (CSV/Excel)
- [ ] 5.3 Enhance map component with filtering
- [ ] 5.4 Add activity log viewer

## Phase 6: User Management
- [ ] 6.1 Create user types
- [ ] 6.2 Add user management page
- [ ] 6.3 Enhance auth helpers
