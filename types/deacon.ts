/**
 * Heartfelt International Ministries - Deacon Type
 * 
 * Deacon IDs follow the format: R + RegionCode(2) + ZoneCode(3) + D + NN
 * Example: R01001D01 (Deacon 1 in Region 1 Zone 1)
 */

export interface Deacon {
  id: string
  him_id: string // Structured ID: R01001D01
  name: string
  email: string
  phone: string
  zone_id: string
  region_id: string
  created_at: string
  updated_at: string
}

export interface DeaconInput {
  name: string
  email: string
  phone: string
  zone_id: string
  region_id: string
}
