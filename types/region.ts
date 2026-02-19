/**
 * Heartfelt International Ministries - Region Type
 * 
 * Region IDs are part of the structured ID system: R + RegionCode(2)
 * Example: R01 (Region 1 - Harare)
 */

export interface Region {
  id: string
  him_id: string // Structured ID: R01
  name: string
  code: number   // Numeric code: 01, 02, 03, etc.
  created_at: string
  updated_at: string
}

export interface RegionInput {
  name: string
  code: number
}
