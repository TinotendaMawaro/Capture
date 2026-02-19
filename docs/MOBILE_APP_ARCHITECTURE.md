# Heartfelt Church Management - Smart Card Scanning Mobile App

## 📱 Mobile App Architecture

A lightweight mobile application for QR card scanning and attendance tracking.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Scanner   │  │   Profile   │  │  Dashboard  │         │
│  │    Screen   │  │    View     │  │    View     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   State Management    │                      │
│              │   (React Context)     │                      │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Supabase API Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Auth API    │  │  Database    │  │  Realtime    │        │
│  │              │  │    API       │  │    API       │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  attendance  │  │    persons   │  │   zones      │        │
│  │    table     │  │    table     │  │    table     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└──────────────────────────────────────────────────────────────┘
```

---

## 📱 App Features

### 1. Secure Login (Regional Admin)
```typescript
interface LoginCredentials {
  email: string
  password: string
  region_id: string
}

// JWT-based authentication with region scoping
// Role-based access: scanner, admin, region_admin
```

### 2. QR Code Scanner
```typescript
interface QRPayload {
  person_him_id: string    // RZW01001P01
  person_type: 'pastor' | 'deacon' | 'member'
  zone_code: string
  checksum: string         // For verification
}
```

### 3. ID Verification
- Validates ID format against database
- Checks if person exists in zone
- Verifies person is active (not suspended)
- Records verification attempt in audit log

### 4. Mark Attendance
```typescript
interface AttendanceRecord {
  person_id: string
  person_him_id: string
  zone_id: string
  region_id: string
  service_type: ServiceType
  date: string
  recorded_at: string
  is_verified: boolean
  device_info: string
}
```

### 5. View Person Profile
```typescript
interface PersonProfile {
  him_id: string
  name: string
  type: 'pastor' | 'deacon' | 'member'
  zone: string
  region: string
  photo_url?: string
  contact_info: {
    phone: string
    email: string
  }
  attendance_history: AttendanceSummary[]
}
```

---

## 🔄 Offline Mode

### Local Storage Strategy
```typescript
// SQLite local database for offline storage
interface LocalAttendanceRecord {
  id: string              // Local UUID
  person_him_id: string
  zone_id: string
  service_type: string
  date: string
  recorded_at: string
  synced: boolean
  sync_error?: string
}
```

### Offline Sync Logic
```
1. Scan QR Code
2. Store in local SQLite (with synced = false)
3. Display "Saved - Will sync when online"

When Online:
4. Query unsynced records (WHERE synced = false)
5. Batch insert to Supabase
6. Update local records (synced = true)
7. Handle conflicts (duplicate detection)
```

### Duplicate Prevention
```typescript
// Check before sync
const isDuplicate = await checkDuplicateAttendance({
  person_id: record.person_id,
  date: record.date,
  service_type: record.service_type
})

if (isDuplicate) {
  // Mark as duplicate, don't re-insert
  record.sync_error = 'DUPLICATE'
}
```

---

## 🔐 Security Features

### 1. Device Registration
- Each scanner device must be registered
- Device ID stored with attendance records
- Can revoke device access remotely

### 2. Network Security
- All requests over HTTPS
- API key rotation
- Rate limiting per device

### 3. Data Protection
- No sensitive data cached locally
- Automatic session timeout (15 min)
- Biometric authentication option

---

## 📦 Installation & Build

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode (iOS) / Android Studio (Android)

### Installation
```bash
# Clone the repository
git clone https://github.com/heartfelt-church/scanner-app.git

# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Build for Production
```bash
# iOS
cd ios && xcodebuild -workspace ScannerApp.xcworkspace -scheme ScannerApp -configuration Release

# Android
cd android && ./gradlew assembleRelease
```

---

## 🎯 Performance Targets

| Metric | Target |
|--------|--------|
| App Launch | < 2 seconds |
| QR Scan to Verify | < 500ms |
| Offline Sync | < 5 seconds |
| Battery Drain | < 5%/hour |

---

## 🔧 Configuration

### Supabase Config
```typescript
const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  // For offline support
  persistenceEnabled: true,
  syncInterval: 30000, // 30 seconds
}
```

### Scanner Config
```typescript
const scannerConfig = {
  // QR Scanner settings
  scanTimeout: 10000,    // 10 seconds
  vibrationFeedback: true,
  soundFeedback: true,
  
  // Offline settings
  maxOfflineRecords: 500,
  autoSyncEnabled: true,
}
```

---

## 📋 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/persons?him_id=eq.{id}` | GET | Verify person ID |
| `/attendance` | POST | Record attendance |
| `/attendance?date=eq.{date}` | GET | Fetch today's records |
| `/zones?id=eq.{id}` | GET | Get zone details |
| `/regions?id=eq.{id}` | GET | Get region details |

---

## 🐛 Troubleshooting

### Common Issues

1. **Camera Permission Denied**
   - Go to Settings > Apps > Scanner > Permissions
   - Enable Camera

2. **Offline Mode Not Working**
   - Check SQLite plugin installation
   - Verify network permissions

3. **Sync Failures**
   - Check Supabase connection
   - Verify device is registered
   - Check for duplicate records

---

## 📞 Support

For issues or questions:
- Email: support@heartfelt.org
- Slack: #scanner-app-help
