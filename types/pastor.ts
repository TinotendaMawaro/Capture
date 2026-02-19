/**
 * Heartfelt International Ministries - Pastor Type
 * 
 * Pastor IDs follow the format: R + RegionCode(2) + ZoneCode(3) + P + NN
 * Example: R01001P01 (Pastor 1 in Region 1 Zone 1)
 */

export interface Pastor {
  id: string
  him_id: string // Structured ID: R01001P01
  name: string
  email: string
  phone: string
  zone_id: string
  region_id: string
  role: 'region_pastor' | 'zone_pastor'
  created_at: string
  updated_at: string
}

export interface PastorInput {
  name: string
  email: string
  phone: string
  zone_id: string
  region_id: string
  role: 'region_pastor' | 'zone_pastor'
}
