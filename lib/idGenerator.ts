/**
 * Heartfelt International Ministries - ID Generator
 * 
 * Updated ID Structure Format (Multi-Region Model):
 * - Country: R + CountryCode(2) = RZW
 * - Region: R + CountryCode(2) + RegionCode(2) = RZW01
 * - Zone: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) = RZW01001
 * - Pastor: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + P + NN = RZW01001P01
 * - Deacon: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + D + NN = RZW01001D01
 * - Department: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + DEP + NN = RZW01001DEP01
 * - Financial Record: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + FIN + NNN = RZW01001FIN001
 * - Attendance: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + ATT + NNN = RZW01001ATT001
 * 
 * Rules:
 * - Country Code = 2 letters (ISO 3166-1 alpha-2)
 * - Region = 2 digits (padded with leading zeros)
 * - Zone = 3 digits (padded with leading zeros)
 * - Person counter resets per zone
 * - No manual typing — auto-generated only
 */

const MINISTRY_PREFIX = 'R'

/**
 * Supported country codes
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
 * Generate Zone ID (with country and region)
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3)
 * Example: RZW01001 (Zimbabwe Region 1 Zone 1)
 */
export function generateZoneId(countryCode: CountryCode, regionCode: number, zoneCode: number): string {
  const region = padNumber(regionCode, 2)
  const zone = padNumber(zoneCode, 3)
  return `${MINISTRY_PREFIX}${countryCode}${region}${zone}`
}

/**
 * Generate Pastor ID
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + P + NN
 * Example: RZW01001P01 (Zimbabwe Region 1 Zone 1 Pastor 1)
 */
export function generatePastorId(countryCode: CountryCode, regionCode: number, zoneCode: number, pastorNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const pastor = padNumber(pastorNumber, 2)
  return `${zoneId}P${pastor}`
}

/**
 * Generate Deacon ID
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + D + NN
 * Example: RZW01001D01 (Zimbabwe Region 1 Zone 1 Deacon 1)
 */
export function generateDeaconId(countryCode: CountryCode, regionCode: number, zoneCode: number, deaconNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const deacon = padNumber(deaconNumber, 2)
  return `${zoneId}D${deacon}`
}

/**
 * Generate Department ID
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + DEP + NN
 * Example: RZW01001DEP01 (Zimbabwe Region 1 Zone 1 Department 1)
 */
export function generateDepartmentId(countryCode: CountryCode, regionCode: number, zoneCode: number, departmentNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const department = padNumber(departmentNumber, 2)
  return `${zoneId}DEP${department}`
}

/**
 * Generate Financial Record ID
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + FIN + NNN
 * Example: RZW01001FIN001 (Zimbabwe Region 1 Zone 1 Financial Record 1)
 */
export function generateFinancialRecordId(countryCode: CountryCode, regionCode: number, zoneCode: number, recordNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const record = padNumber(recordNumber, 3)
  return `${zoneId}FIN${record}`
}

/**
 * Generate Attendance ID
 * Format: R + CountryCode(2) + RegionCode(2) + ZoneCode(3) + ATT + NNN
 * Example: RZW01001ATT001 (Zimbabwe Region 1 Zone 1 Attendance  function generateAttendanceId1)
 */
export function generateAttendanceId(countryCode: CountryCode, regionCode: number, zoneCode: number, attendanceNumber: number): string {
  const zoneId = generateZoneId(countryCode, regionCode, zoneCode)
  const record = padNumber(attendanceNumber, 3)
  return `${zoneId}ATT${record}`
}

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
} | null {
  // New format: R{CountryCode}{RegionCode}{ZoneCode}(EntityType)(EntityNumber)
  const newMatch = id.match(/^R([A-Z]{2})(\d{2})(\d{3})(?:P|D|DEP|FIN|ATT)(\d{2,3})$/)
  if (newMatch) {
    return {
      prefix: 'R',
      countryCode: newMatch[1],
      regionCode: newMatch[2],
      zoneCode: newMatch[3],
      entityType: newMatch[4],
      entityNumber: newMatch[5]
    }
  }
  
  // Legacy format: R{RegionCode}{ZoneCode}(EntityType)(EntityNumber)
  const legacyMatch = id.match(/^R(\d{2})(\d{3})(?:P|D|DEP)?(\d{2})?$/)
  if (legacyMatch) {
    return {
      prefix: 'R',
      regionCode: legacyMatch[1],
      zoneCode: legacyMatch[2],
      entityType: id.includes('P') ? 'P' : id.includes('D') ? 'D' : id.includes('DEP') ? 'DEP' : undefined,
      entityNumber: legacyMatch[3]
    }
  }
  
  return null
}

/**
 * Validate an ID format (supports both new and legacy)
 */
export function isValidId(id: string): boolean {
  // New multi-region format
  const newPattern = /^R[A-Z]{2}\d{5}(?:P|D|DEP|FIN|ATT)\d{2,3}$/
  // Legacy format
  const legacyPattern = /^R\d{5}(?:P|D|DEP)?\d{2}$/
  return newPattern.test(id) || legacyPattern.test(id)
}

/**
 * Extract country code from an ID (if present)
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
    'FIN': 'financial_record',
    'ATT': 'attendance'
  }
  
  return entityTypes[parsed.entityType] || null
}

// Legacy functions for backward compatibility (deprecated)
// These assume Zimbabwe (ZW) as default country
export function generateZoneIdLegacy(regionCode: number, zoneCode: number): string {
  return generateZoneId('ZW', regionCode, zoneCode)
}

export function generatePastorIdLegacy(regionCode: number, zoneCode: number, pastorNumber: number): string {
  return generatePastorId('ZW', regionCode, zoneCode, pastorNumber)
}

export function generateDeaconIdLegacy(regionCode: number, zoneCode: number, deaconNumber: number): string {
  return generateDeaconId('ZW', regionCode, zoneCode, deaconNumber)
}

export function generateDepartmentIdLegacy(regionCode: number, zoneCode: number, departmentNumber: number): string {
  return generateDepartmentId('ZW', regionCode, zoneCode, departmentNumber)
}

export function generateRegionIdLegacy(regionCode: number): string {
  return generateRegionId('ZW', regionCode)
}

// Legacy generateId for backward compatibility
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `${prefix}_${timestamp}_${randomPart}`
}
