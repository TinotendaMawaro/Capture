/**
 * Heartfelt International Ministries - ID Generator
 * 
 * Supports TWO code formats:
 * 
 * 1. SIMPLIFIED FORMAT (New - Recommended):
 *    - Region: 01, 02, ..., 23 (without country prefix)
 *    - Zone: R + region_code(2) + zone_code(3) = R0101, R0102, etc.
 *    - Pastor: R0101P01, R0102P01, etc.
 *    - Deacon: R0101D01, R0102D01, etc.
 *    - Department: R0101DEP01, R0102DEP01, etc.
 *    - Member: R0101M001, R0102M001, etc.
 * 
 * 2. LEGACY FORMAT (Old - with country prefix):
 *    - Region: RZW01, RZW02, etc.
 *    - Zone: RZW01001, RZW01002, etc.
 *    - Pastor: RZW01001P01, etc.
 * 
 * Rules:
 * - Region = 2 digits (padded with leading zeros)
 * - Zone = 3 digits (padded with leading zeros)
 * - Person counter resets per zone
 * - No manual typing — auto-generated only
 */

const MINISTRY_PREFIX = 'R'

/**
 * Supported country codes (for legacy format)
 */
export const COUNTRY_CODES = {
  ZW: 'Zimbabwe',
  ZA: 'South Africa',
  KE: 'Kenya',
  NG: 'Nigeria',
  GH: 'Ghana',
  TZ: 'Tanzania',
  UG: 'Uganda',
  ZM: 'Zambia',
  MW: 'Malawi',
  BW: 'Botswana'
} as const

export type CountryCode = keyof typeof COUNTRY_CODES

/**
 * Pad a number with leading zeros to the specified length
 */
function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, '0')
}

// ============================================================================
// SIMPLIFIED FORMAT GENERATORS (New Format - Recommended)
// ============================================================================

/**
 * Generate Zone ID (Simplified Format)
 * Format: R + region_code(2) + zone_code(3)
 * Example: R0101, R0102, R0201
 */
export function generateSimplifiedZoneId(regionCode: number, zoneCode: number): string {
  const region = padNumber(regionCode, 2)
  const zone = padNumber(zoneCode, 3)
  return `${MINISTRY_PREFIX}${region}${zone}`
}

/**
 * Generate Pastor ID (Simplified Format)
 * Format: R + region_code(2) + zone_code(3) + P + number(2)
 * Example: R0101P01, R0102P01
 */
export function generateSimplifiedPastorId(regionCode: number, zoneCode: number, pastorNumber: number): string {
  const zoneId = generateSimplifiedZoneId(regionCode, zoneCode)
  const pastor = padNumber(pastorNumber, 2)
  return `${zoneId}P${pastor}`
}

/**
 * Generate Deacon ID (Simplified Format)
 * Format: R + region_code(2) + zone_code(3) + D + number(2)
 * Example: R0101D01, R0102D01
 */
export function generateSimplifiedDeaconId(regionCode: number, zoneCode: number, deaconNumber: number): string {
  const zoneId = generateSimplifiedZoneId(regionCode, zoneCode)
  const deacon = padNumber(deaconNumber, 2)
  return `${zoneId}D${deacon}`
}

/**
 * Generate Department ID (Simplified Format)
 * Format: R + region_code(2) + zone_code(3) + DEP + number(2)
 * Example: R0101DEP01, R0102DEP01
 */
export function generateSimplifiedDepartmentId(regionCode: number, zoneCode: number, departmentNumber: number): string {
  const zoneId = generateSimplifiedZoneId(regionCode, zoneCode)
  const department = padNumber(departmentNumber, 2)
  return `${zoneId}DEP${department}`
}

/**
 * Generate Member ID (Simplified Format)
 * Format: R + region_code(2) + zone_code(3) + M + number(3)
 * Example: R0101M001, R0102M001
 */
export function generateSimplifiedMemberId(regionCode: number, zoneCode: number, memberNumber: number): string {
  const zoneId = generateSimplifiedZoneId(regionCode, zoneCode)
  const member = padNumber(memberNumber, 3)
  return `${zoneId}M${member}`
}

// ============================================================================
// LEGACY FORMAT GENERATORS (Old Format - Deprecated but supported)
// ============================================================================

/**
 * Generate Country ID
 * Format: R + CountryCode(2 letters)
 * Example: RZW (Zimbabwe)
 */
export function generateCountryId(countryCode: CountryCode): string {
  return `${MINISTRY_PREFIX}${countryCode}`
}

/**
 * Generate Region ID (with country)
 * Format: R + CountryCode(2) + RegionCode(2 digits)
 * Example: RZW01 (Zimbabwe Region 1)
 */
export function generateRegionId(countryCode: CountryCode, regionCode: number): string {
  const region = padNumber(regionCode, 2)
  return `${MINISTRY_PREFIX}${countryCode}${region}`
}

/**
 * Generate Zone ID (with country and region) - Legacy
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3)
 * Example: RZW01001 (Zimbabwe Region 1 Zone 1)
 */
export function generateZoneId(countryCode: CountryCode, regionCode: number, zoneCode: number): string {
  const region = padNumber(regionCode, 2)
  const zone = padNumber(zoneCode, 3)
  return `${MINISTRY_PREFIX}${countryCode}${region}${zone}`
}

/**
 * Generate Pastor ID - Legacy
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + P + NN
 * Example: RZW01001P01 (Zimbabwe Region 1 Zone 1 Pastor 1)
 */
export function generatePastorId(countryCode: CountryCode, regionCode: number, zoneCode: number, pastorNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const pastor = padNumber(pastorNumber, 2)
  return `${zoneId}P${pastor}`
}

/**
 * Generate Deacon ID - Legacy
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + D + NN
 * Example: RZW01001D01 (Zimbabwe Region 1 Zone 1 Deacon 1)
 */
export function generateDeaconId(countryCode: CountryCode, regionCode: number, zoneCode: number, deaconNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const deacon = padNumber(deaconNumber, 2)
  return `${zoneId}D${deacon}`
}

/**
 * Generate Department ID - Legacy
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + DEP + NN
 * Example: RZW01001DEP01 (Zimbabwe Region 1 Zone 1 Department 1)
 */
export function generateDepartmentId(countryCode: CountryCode, regionCode: number, zoneCode: number, departmentNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const department = padNumber(departmentNumber, 2)
  return `${zoneId}DEP${department}`
}

/**
 * Generate Member ID - Legacy
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + M + NNN
 * Example: RZW01001M001 (Zimbabwe Region 1 Zone 1 Member 1)
 */
export function generateMemberId(countryCode: CountryCode, regionCode: number, zoneCode: number, memberNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const member = padNumber(memberNumber, 3)
  return `${zoneId}M${member}`
}

/**
 * Generate Financial Record ID - Legacy
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + FIN + NNN
 * Example: RZW01001FIN001 (Zimbabwe Region 1 Zone 1 Financial Record 1)
 */
export function generateFinancialRecordId(countryCode: CountryCode, regionCode: number, zoneCode: number, recordNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const record = padNumber(recordNumber, 3)
  return `${zoneId}FIN${record}`
}

/**
 * Generate Attendance ID - Legacy
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + ATT + NNN
 * Example: RZW01001ATT001 (Zimbabwe Region 1 Zone 1 Attendance 1)
 */
export function generateAttendanceId(countryCode: CountryCode, regionCode: number, zoneCode: number, attendanceNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const record = padNumber(attendanceNumber, 3)
  return `${zoneId}ATT${record}`
}

// ============================================================================
// PARSING AND VALIDATION (Supports both formats)
// ============================================================================

/**
 * Parse an ID to extract its components
 */
export function parseId(id: string): {
  prefix: string
  countryCode?: string
  regionCode?: string
  zoneCode?: string
  entityType?: string
  entityNumber?: string
  format: 'simplified' | 'legacy' | 'unknown'
} | null {
  // Simplified format: R{RegionCode(2)}{ZoneCode(3)}{EntityType}{Number}
  // Example: R0101P01, R0101D01, R0101DEP01, R0101M001
  const simplifiedMatch = id.match(/^R(\d{2})(\d{3})(?:P|D|DEP|M)(\d{2,3})$/)
  if (simplifiedMatch) {
    return {
      prefix: 'R',
      regionCode: simplifiedMatch[1],
      zoneCode: simplifiedMatch[2],
      entityType: simplifiedMatch[3],
      entityNumber: simplifiedMatch[4],
      format: 'simplified'
    }
  }
  
  // Simplified zone format: R{RegionCode(2)}{ZoneCode(3)}
  const simplifiedZoneMatch = id.match(/^R(\d{2})(\d{3})$/)
  if (simplifiedZoneMatch) {
    return {
      prefix: 'R',
      regionCode: simplifiedZoneMatch[1],
      zoneCode: simplifiedZoneMatch[2],
      format: 'simplified'
    }
  }
  
  // Legacy format: R{CountryCode(2)}{RegionCode(2)}{ZoneCode(3)}(EntityType)(EntityNumber)
  // Example: RZW01001P01
  const legacyMatch = id.match(/^R([A-Z]{2})(\d{2})(\d{3})(?:P|D|DEP|M|FIN|ATT)(\d{2,3})$/)
  if (legacyMatch) {
    return {
      prefix: 'R',
      countryCode: legacyMatch[1],
      regionCode: legacyMatch[2],
      zoneCode: legacyMatch[3],
      entityType: legacyMatch[4],
      entityNumber: legacyMatch[5],
      format: 'legacy'
    }
  }
  
  // Legacy zone format: R{CountryCode(2)}{RegionCode(2)}{ZoneCode(3)}
  const legacyZoneMatch = id.match(/^R([A-Z]{2})(\d{2})(\d{3})$/)
  if (legacyZoneMatch) {
    return {
      prefix: 'R',
      countryCode: legacyZoneMatch[1],
      regionCode: legacyZoneMatch[2],
      zoneCode: legacyZoneMatch[3],
      format: 'legacy'
    }
  }
  
  return null
}

/**
 * Validate an ID format (supports both simplified and legacy)
 */
export function isValidId(id: string): boolean {
  // Simplified format patterns
  const simplifiedZone = /^R\d{5}$/
  const simplifiedEntity = /^R\d{5}(?:P|D|DEP|M)\d{2,3}$/
  
  // Legacy format patterns
  const legacyZone = /^R[A-Z]{2}\d{5}$/
  const legacyEntity = /^R[A-Z]{2}\d{5}(?:P|D|DEP|M|FIN|ATT)\d{2,3}$/
  
  return simplifiedZone.test(id) || simplifiedEntity.test(id) || 
         legacyZone.test(id) || legacyEntity.test(id)
}

/**
 * Check if ID uses simplified format
 */
export function isSimplifiedFormat(id: string): boolean {
  return /^R\d{4,5}(?:P|D|DEP|M)\d{2,3}$/.test(id) || /^R\d{5}$/.test(id)
}

/**
 * Extract country code from an ID (if present - legacy format)
 */
export function getCountryCodeFromId(id: string): string | null {
  const parsed = parseId(id)
  return parsed?.countryCode || null
}

/**
 * Determine entity type from ID
 */
export function getEntityTypeFromId(id: string): string | null {
  const parsed = parseId(id)
  if (!parsed?.entityType) return null
  
  const entityTypes: Record<string, string> = {
    'P': 'pastor',
    'D': 'deacon',
    'DEP': 'department',
    'M': 'member',
    'FIN': 'financial_record',
    'ATT': 'attendance'
  }
  
  return entityTypes[parsed.entityType] || null
}

/**
 * Extract zone code from any entity ID
 */
export function extractZoneCode(fullCode: string): string | null {
  // Simplified format: R0101P01 -> extract R0101
  const simplifiedMatch = fullCode.match(/^R(\d{5})/)
  if (simplifiedMatch) {
    return 'R' + simplifiedMatch[1]
  }
  
  // Legacy format: RZW01001P01 -> extract RZW01001
  const legacyMatch = fullCode.match(/^R([A-Z]{2}\d{5})/)
  if (legacyMatch) {
    return legacyMatch[1]
  }
  
  return null
}

// ============================================================================
// LEGACY ALIASES (for backward compatibility)
// ============================================================================

export function generateZoneIdLegacy(regionCode: number, zoneCode: number): string {
  return generateSimplifiedZoneId(regionCode, zoneCode)
}

export function generatePastorIdLegacy(regionCode: number, zoneCode: number, pastorNumber: number): string {
  return generateSimplifiedPastorId(regionCode, zoneCode, pastorNumber)
}

export function generateDeaconIdLegacy(regionCode: number, zoneCode: number, deaconNumber: number): string {
  return generateSimplifiedDeaconId(regionCode, zoneCode, deaconNumber)
}

export function generateDepartmentIdLegacy(regionCode: number, zoneCode: number, departmentNumber: number): string {
  return generateSimplifiedDepartmentId(regionCode, zoneCode, departmentNumber)
}

export function generateMemberIdLegacy(regionCode: number, zoneCode: number, memberNumber: number): string {
  return generateSimplifiedMemberId(regionCode, zoneCode, memberNumber)
}

export function generateRegionIdLegacy(regionCode: number): string {
  return padNumber(regionCode, 2)
}

// Legacy generateId for backward compatibility
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `${prefix}_${timestamp}_${randomPart}`
}
