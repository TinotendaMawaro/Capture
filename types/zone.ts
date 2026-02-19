/**
 * Heartfelt International Ministries - Zone Type
 * 
 * Zone IDs follow the format: R + RegionCode(2) + ZoneCode(3)
 * Example: R01001 (Region 1, Zone 1)
 */

export interface Zone {
  id: string
  him_id: string // Structured ID: R01001
  name: string
  region_id: string
  code: number   // Numeric code: 001, 002, 003, etc.
  created_at: string
  updated_at: string
}

export interface ZoneInput {
  name: string
  region_id: string
  code: number
}
