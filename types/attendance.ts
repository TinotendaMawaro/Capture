/**
 * Heartfelt International Ministries - Attendance Type
 * 
 * Tracks member attendance via QR code scanning
 * Attendance records connect with the person ID system
 */

export type ServiceType = 
  | 'sunday_first'      // Sunday 1st Service
  | 'sunday_second'     // Sunday 2nd Service
  | 'wednesday'        // Midweek Service
  | 'friday'            // Friday Service
  | 'special'           // Special Services
  | 'online'            // Online Attendance

export interface Attendance {
  id: string
  person_id: string  // Reference to pastor, deacon, or member
  person_him_id: string  // Human-readable ID: R01001P01
  zone_id: string
  region_id: string
  country_id?: string
  service_type: ServiceType
  date: string  // YYYY-MM-DD
  recorded_at: string  // Timestamp
  recorded_by: string  // Scanner device/user ID
  is_verified: boolean  // QR verification status
  device_info?: string  // Device that scanned
  notes?: string
  created_at: string
}

export interface AttendanceInput {
  person_id: string
  person_him_id: string
  zone_id: string
  region_id: string
  country_id?: string
  service_type: ServiceType
  date: string
  recorded_by: string
  is_verified?: boolean
  device_info?: string
  notes?: string
}

/**
 * Attendance statistics for dashboard
 */
export interface AttendanceStats {
  totalPresent: number
  averageAttendance: number
  byServiceType: Record<ServiceType, number>
  byRegion: Record<string, number>
  byZone: Record<string, number>
  trend: Array<{
    date: string
    count: number
    service_type: ServiceType
  }>
  pastorPresence: Array<{
    pastor_id: string
    pastor_name: string
    present_count: number
    total_services: number
    attendance_rate: number
  }>
}

/**
 * Service types with display labels
 */
export const SERVICE_TYPES: Record<ServiceType, string> = {
  sunday_first: 'Sunday 1st Service',
  sunday_second: 'Sunday 2nd Service',
  wednesday: 'Wednesday Service',
  friday: 'Friday Service',
  special: 'Special Service',
  online: 'Online Attendance'
}

/**
 * Check-in status for real-time tracking
 */
export interface CheckInStatus {
  person_id: string
  zone_id: string
  service_type: ServiceType
  date: string
  checked_in: boolean
  check_in_time?: string
}
