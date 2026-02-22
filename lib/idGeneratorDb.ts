/**
 * ID Generator Database Functions
 * Fetches next sequential numbers from Supabase for entities
 * Ensures uniqueness and consistency in ID generation
 * 
 * Supports both JavaScript-based generation and SQL function-based generation
 * National Scale Format: R + region(2) + zone(2) + role + number
 * Example: R0101P1 (Pastor), R0101D1 (Deacon), R0203D4 (Deacon)
 */

import { supabase } from './supabaseClient'
import {
  generateZoneId,
  CountryCode
} from './idGenerator'

// ============================================================================
// NATIONAL SCALE SQL FUNCTIONS (New Format: R + region(2) + zone(2) + role + number)
// ============================================================================

/**
 * Generate full_code using SQL function (National Scale)
 * Format: R0101P1, R0101D1, R0203D4
 * 
 * @param entityType - 'P' for pastor, 'D' for deacon
 * @param zoneCode - The zone code (e.g., 'R0101')
 * @returns Full code like 'R0101P1'
 */
export async function generateFullCodeSql(
  entityType: 'P' | 'D',
  zoneCode: string
): Promise<string> {
  const { data, error } = await supabase.rpc('generate_full_code', {
    p_entity_type: entityType,
    p_zone_code: zoneCode
  })

  if (error) {
    console.error('SQL generate_full_code error:', error)
    throw new Error(`Failed to generate full code: ${error.message}`)
  }

  return data as string
}

/**
 * Generate zone code using SQL function (National Scale)
 * Format: R0101, R0102, R0203
 * 
 * @param regionCode - The region code (e.g., '01', '02')
 * @returns Zone code like 'R0101'
 */
export async function generateZoneCodeSql(regionCode: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_zone_code', {
    p_region_code: regionCode
  })

  if (error) {
    console.error('SQL generate_zone_code error:', error)
    throw new Error(`Failed to generate zone code: ${error.message}`)
  }

  return data as string
}

/**
 * Generate region code using SQL function
 * Format: 01, 02, 03...
 * 
 * @returns Region code like '01'
 */
export async function generateRegionCodeSql(): Promise<string> {
  const { data, error } = await supabase.rpc('generate_region_code')

  if (error) {
    console.error('SQL generate_region_code error:', error)
    throw new Error(`Failed to generate region code: ${error.message}`)
  }

  return data as string
}

/**
 * Get next pastor number for a zone (without creating)
 */
export async function getNextPastorNumberSql(zoneCode: string): Promise<number> {
  const { data, error } = await supabase
    .from('pastors')
    .select('full_code')
    .ilike('full_code', `${zoneCode}P%`)
    .order('full_code', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error getting next pastor number:', error)
    return 1
  }

  if (!data || data.length === 0) return 1

  const match = data[0].full_code?.match(/P(\d+)$/)
  return match ? parseInt(match[1], 10) + 1 : 1
}

/**
 * Get next deacon number for a zone (without creating)
 */
export async function getNextDeaconNumberSql(zoneCode: string): Promise<number> {
  const { data, error } = await supabase
    .from('deacons')
    .select('full_code')
    .ilike('full_code', `${zoneCode}D%`)
    .order('full_code', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error getting next deacon number:', error)
    return 1
  }

  if (!data || data.length === 0) return 1

  const match = data[0].full_code?.match(/D(\d+)$/)
  return match ? parseInt(match[1], 10) + 1 : 1
}

// ============================================================================
// SQL Function-based ID Generation (Server-side with row locking)
// ============================================================================

/**
 * Generate zone ID using SQL function
 */
export async function generateZoneIdSql(regionId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_zone_id', {
    p_region_id: regionId
  })

  if (error) {
    console.error('SQL generate_zone_id error:', error)
    throw new Error(`Failed to generate zone ID: ${error.message}`)
  }

  return data as string
}

/**
 * Generate pastor ID using SQL function
 */
export async function generatePastorIdSql(zoneId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_pastor_id', {
    p_zone_id: zoneId
  })

  if (error) {
    console.error('SQL generate_pastor_id error:', error)
    throw new Error(`Failed to generate pastor ID: ${error.message}`)
  }

  return data as string
}

/**
 * Generate deacon ID using SQL function
 */
export async function generateDeaconIdSql(zoneId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_deacon_id', {
    p_zone_id: zoneId
  })

  if (error) {
    console.error('SQL generate_deacon_id error:', error)
    throw new Error(`Failed to generate deacon ID: ${error.message}`)
  }

  return data as string
}

/**
 * Generate department ID using SQL function
 */
export async function generateDepartmentIdSql(zoneId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_department_id', {
    p_zone_id: zoneId
  })

  if (error) {
    console.error('SQL generate_department_id error:', error)
    throw new Error(`Failed to generate department ID: ${error.message}`)
  }

  return data as string
}

/**
 * Generate member ID using SQL function
 */
export async function generateMemberIdSql(zoneId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_member_id', {
    p_zone_id: zoneId
  })

  if (error) {
    console.error('SQL generate_member_id error:', error)
    throw new Error(`Failed to generate member ID: ${error.message}`)
  }

  return data as string
}

/**
 * Get next ID number using SQL function
 */
export async function getNextIdNumberSql(
  entityType: 'pastor' | 'deacon' | 'department' | 'member',
  zoneId: string
): Promise<number> {
  const { data, error } = await supabase.rpc('get_next_id_number', {
    p_entity_type: entityType,
    p_zone_id: zoneId
  })

  if (error) {
    console.error('SQL get_next_id_number error:', error)
    throw new Error(`Failed to get next ID number: ${error.message}`)
  }

  return data as number
}

/**
 * Validate ID format using SQL function
 */
export async function validateIdFormatSql(fullCode: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_valid_id_format', {
    p_full_code: fullCode
  })

  if (error) {
    console.error('SQL is_valid_id_format error:', error)
    return false
  }

  return data as boolean
}

// ============================================================================
// JavaScript-based ID Generation (Fallback)
// ============================================================================

/**
 * Get next zone number for a region
 */
export async function getNextZoneNumber(
  regionCode: number,
  countryCode: CountryCode = 'ZW'
): Promise<number> {
  const { data, error } = await supabase
    .from('zones')
    .select('zone_code')
    .ilike('full_code', `R${countryCode}${String(regionCode).padStart(2, '0')}%`)
    .order('zone_code', { ascending: false })
    .limit(1)

  if (error) throw new Error(`Failed to get next zone number: ${error.message}`)

  if (!data || data.length === 0) return 1

  const lastZoneCode = parseInt(data[0].zone_code || '0', 10)
  return lastZoneCode + 1
}

/**
 * Get next pastor number for a zone
 */
export async function getNextPastorNumber(
  zoneId: string,
  fullCodePrefix: string
): Promise<number> {
  const { data, error } = await supabase
    .from('pastors')
    .select('full_code')
    .ilike('full_code', `${fullCodePrefix}P%`)
    .order('full_code', { ascending: false })
    .limit(1)

  if (error) throw new Error(`Failed to get next pastor number: ${error.message}`)

  if (!data || data.length === 0) return 1

  const lastFullCode = data[0].full_code
  const match = lastFullCode?.match(/P(\d+)$/)
  const lastNumber = match ? parseInt(match[1], 10) : 0
  return lastNumber + 1
}

/**
 * Get next deacon number for a zone
 */
export async function getNextDeaconNumber(
  zoneId: string,
  fullCodePrefix: string
): Promise<number> {
  const { data, error } = await supabase
    .from('deacons')
    .select('full_code')
    .ilike('full_code', `${fullCodePrefix}D%`)
    .order('full_code', { ascending: false })
    .limit(1)

  if (error) throw new Error(`Failed to get next deacon number: ${error.message}`)

  if (!data || data.length === 0) return 1

  const lastFullCode = data[0].full_code
  const match = lastFullCode?.match(/D(\d+)$/)
  const lastNumber = match ? parseInt(match[1], 10) : 0
  return lastNumber + 1
}

/**
 * Get next department number for a zone
 */
export async function getNextDepartmentNumber(
  zoneId: string,
  fullCodePrefix: string
): Promise<number> {
  const { data, error } = await supabase
    .from('departments')
    .select('full_code')
    .ilike('full_code', `${fullCodePrefix}DEP%`)
    .order('full_code', { ascending: false })
    .limit(1)

  if (error) throw new Error(`Failed to get next department number: ${error.message}`)

  if (!data || data.length === 0) return 1

  const lastFullCode = data[0].full_code
  const match = lastFullCode?.match(/DEP(\d+)$/)
  const lastNumber = match ? parseInt(match[1], 10) : 0
  return lastNumber + 1
}

/**
 * Get next church member number for a zone
 */
export async function getNextMemberNumber(
  zoneId: string,
  fullCodePrefix: string
): Promise<number> {
  const { data, error } = await supabase
    .from('church_members')
    .select('full_code')
    .ilike('full_code', `${fullCodePrefix}M%`)
    .order('full_code', { ascending: false })
    .limit(1)

  if (error) throw new Error(`Failed to get next member number: ${error.message}`)

  if (!data || data.length === 0) return 1

  const lastFullCode = data[0].full_code
  const match = lastFullCode?.match(/M(\d+)$/)
  const lastNumber = match ? parseInt(match[1], 10) : 0
  return lastNumber + 1
}

/**
 * Generate full code for a new zone
 */
export async function generateNewZoneFullCode(
  regionCode: number,
  countryCode: CountryCode = 'ZW'
): Promise<string> {
  const zoneNumber = await getNextZoneNumber(regionCode, countryCode)
  return generateZoneId(countryCode, regionCode, zoneNumber)
}

/**
 * Generate full code for a new pastor
 */
export async function generateNewPastorFullCode(
  zoneFullCode: string
): Promise<string> {
  const pastorNumber = await getNextPastorNumber('', zoneFullCode)
  return `${zoneFullCode}P${String(pastorNumber).padStart(2, '0')}`
}

/**
 * Generate full code for a new deacon
 */
export async function generateNewDeaconFullCode(
  zoneFullCode: string
): Promise<string> {
  const deaconNumber = await getNextDeaconNumber('', zoneFullCode)
  return `${zoneFullCode}D${String(deaconNumber).padStart(2, '0')}`
}

/**
 * Generate full code for a new department
 */
export async function generateNewDepartmentFullCode(
  zoneFullCode: string
): Promise<string> {
  const depNumber = await getNextDepartmentNumber('', zoneFullCode)
  return `${zoneFullCode}DEP${String(depNumber).padStart(2, '0')}`
}

/**
 * Generate full code for a new church member
 */
export async function generateNewMemberFullCode(
  zoneFullCode: string
): Promise<string> {
  const memberNumber = await getNextMemberNumber('', zoneFullCode)
  return `${zoneFullCode}M${String(memberNumber).padStart(3, '0')}`
}

// ============================================================================
// Unified ID Generation API
// ============================================================================

export type EntityType = 'zone' | 'pastor' | 'deacon' | 'department' | 'member'

/**
 * Generate ID using SQL functions (preferred) or fallback to JavaScript
 */
export async function generateId(
  entityType: EntityType,
  parentId: string,
  options?: {
    regionCode?: number
    countryCode?: CountryCode
    useSqlFunction?: boolean
  }
): Promise<string> {
  const useSql = options?.useSqlFunction ?? true

  if (useSql) {
    try {
      switch (entityType) {
        case 'zone':
          return await generateZoneIdSql(parentId)
        case 'pastor':
          return await generatePastorIdSql(parentId)
        case 'deacon':
          return await generateDeaconIdSql(parentId)
        case 'department':
          return await generateDepartmentIdSql(parentId)
        case 'member':
          return await generateMemberIdSql(parentId)
      }
    } catch (error) {
      console.warn('SQL ID generation failed, falling back to JavaScript:', error)
    }
  }

  switch (entityType) {
    case 'zone': {
      const regionCode = options?.regionCode ?? 1
      const countryCode = options?.countryCode ?? 'ZW'
      return await generateNewZoneFullCode(regionCode, countryCode)
    }
    case 'pastor':
      return await generateNewPastorFullCode(parentId)
    case 'deacon':
      return await generateNewDeaconFullCode(parentId)
    case 'department':
      return await generateNewDepartmentFullCode(parentId)
    case 'member':
      return await generateNewMemberFullCode(parentId)
  }
}

/**
 * Check if a full code already exists in the database
 */
export async function codeExists(fullCode: string): Promise<boolean> {
  const tables = ['zones', 'pastors', 'deacons', 'departments', 'church_members']

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq('full_code', fullCode)
      .limit(1)

    if (!error && (data?.length || 0) > 0) {
      return true
    }
  }

  return false
}

/**
 * Validate ID format (JavaScript-based)
 */
export function isValidIdFormat(fullCode: string): boolean {
  // Zone format: R\d{5}
  if (/^R\d{5}$/.test(fullCode)) return true
  // Pastor format: R\d{5}P\d{2}
  if (/^R\d{5}P\d{2}$/.test(fullCode)) return true
  // Deacon format: R\d{5}D\d{2}
  if (/^R\d{5}D\d{2}$/.test(fullCode)) return true
  // Department format: R\d{5}DEP\d{2}
  if (/^R\d{5}DEP\d{2}$/.test(fullCode)) return true
  // Member format: R\d{5}M\d{3}
  if (/^R\d{5}M\d{3}$/.test(fullCode)) return true

  // National Scale formats (shorter):
  // Zone: R\d{4}
  if (/^R\d{4}$/.test(fullCode)) return true
  // Pastor: R\d{4}P\d+
  if (/^R\d{4}P\d+$/.test(fullCode)) return true
  // Deacon: R\d{4}D\d+
  if (/^R\d{4}D\d+$/.test(fullCode)) return true

  return false
}

/**
 * Get entity type from ID
 */
export function getEntityTypeFromId(fullCode: string): EntityType | null {
  if (/^R\d{5}$/.test(fullCode)) return 'zone'
  if (/^R\d{4}$/.test(fullCode)) return 'zone'
  if (/^R\d{5}P\d{2}$/.test(fullCode)) return 'pastor'
  if (/^R\d{4}P\d+$/.test(fullCode)) return 'pastor'
  if (/^R\d{5}D\d{2}$/.test(fullCode)) return 'deacon'
  if (/^R\d{4}D\d+$/.test(fullCode)) return 'deacon'
  if (/^R\d{5}DEP\d{2}$/.test(fullCode)) return 'department'
  if (/^R\d{5}M\d{3}$/.test(fullCode)) return 'member'
  return null
}

/**
 * Extract zone code from any entity ID
 */
export function extractZoneCode(fullCode: string): string | null {
  // National Scale: R0101P1 -> extract R0101
  let match = fullCode.match(/^R(\d{4})/)
  if (match) return 'R' + match[1]
  
  // Legacy: R01001P01 -> extract R01001
  match = fullCode.match(/^R(\d{5})/)
  if (match) return match[1]
  
  return null
}
