/**
 * Heartfelt International Ministries - Country Type
 * 
 * Country codes follow ISO 3166-1 alpha-2 standard
 * New ID Structure: R + CountryCode(2) + RegionCode(2) + ZoneCode(3)
 * Example: RZW01001 (Zimbabwe, Region 1, Zone 1)
 */

export interface Country {
  id: string
  country_code: string  // ISO 3166-1 alpha-2: ZW, ZA, KE, etc.
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CountryInput {
  country_code: string
  name: string
  is_active?: boolean
}

/**
 * Supported countries for Heartfelt International Ministries
 */
export const SUPPORTED_COUNTRIES = [
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'UG', name: 'Uganda' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'MW', name: 'Malawi' },
  { code: 'BW', name: 'Botswana' }
] as const

export type CountryCode = typeof SUPPORTED_COUNTRIES[number]['code']
