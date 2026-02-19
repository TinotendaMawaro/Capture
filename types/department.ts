/**
 * Heartfelt International Ministries - Department Type
 * 
 * Department IDs follow the format: R + RegionCode(2) + ZoneCode(3) + DEP + NN
 * Example: R01001DEP01 (Department 1 in Region 1 Zone 1)
 */

export interface Department {
  id: string
  him_id: string // Structured ID: R01001DEP01
  name: string
  zone_id: string
  region_id: string
  description?: string
  created_at: string
  updated_at: string
}

export interface DepartmentInput {
  name: string
  zone_id: string
  region_id: string
  description?: string
}

/**
 * Common department types in church organizations
 */
export const DEPARTMENT_TYPES = [
  'Worship',
  'Media',
  'Ushering',
  'Prayer',
  'Children',
  'Youth',
  'Women',
  'Men',
  'Care',
  'Education',
  'Finance',
  'Missions',
  'Sports',
  'Arts',
  'Security',
  'Health',
  'Other'
] as const

export type DepartmentType = typeof DEPARTMENT_TYPES[number]
