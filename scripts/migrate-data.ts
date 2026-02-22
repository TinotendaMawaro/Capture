/**
 * Data Migration Script - CSV Import Assistant
 * Helps import regions, zones, pastors, deacons from CSV/Excel files
 * 
 * Usage:
 * 1. Export your Excel spreadsheet to CSV format
 * 2. Place the CSV file in the project root or public folder
 * 3. Update the CSV_FILE_PATH below
 * 4. Run: ts-node scripts/migrate-data.ts
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface RegionRecord {
  region_code: string
  name: string
  country: string
  description?: string
}

interface ZoneRecord {
  region_code: string
  zone_code: string
  name: string
  address?: string
  city?: string
  latitude?: string
  longitude?: string
  contact_person?: string
  contact_email?: string
  contact_phone?: string
}

interface PastorRecord {
  full_code?: string
  zone_code: string
  name: string
  contact?: string
  email?: string
  date_of_birth?: string
  gender?: string
}

interface DeaconRecord {
  full_code?: string
  zone_code: string
  name: string
  contact?: string
  email?: string
  date_of_birth?: string
  gender?: string
}

/**
 * Load and parse CSV file
 */
function loadCSV(filepath: string): any[] {
  try {
    const fileContent = fs.readFileSync(filepath, 'utf-8')
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
    return records
  } catch (error) {
    console.error(`Error reading CSV file: ${filepath}`, error)
    return []
  }
}

/**
 * Import regions from CSV
 */
async function importRegions(filePath: string): Promise<void> {
  console.log('🌍 Starting region import...')

  const records = loadCSV(filePath) as RegionRecord[]
  if (records.length === 0) {
    console.log('No records found')
    return
  }

  const regionInserts = records.map(r => ({
    region_code: r.region_code.toUpperCase(),
    name: r.name,
    country: r.country,
    description: r.description || null
  }))

  try {
    const { data, error } = await supabase
      .from('regions')
      .upsert(regionInserts, { onConflict: 'region_code' })

    if (error) throw error

    console.log(`✅ Successfully imported ${regionInserts.length} regions`)
  } catch (error) {
    console.error('❌ Error importing regions:', error)
  }
}

/**
 * Import zones from CSV
 */
async function importZones(filePath: string): Promise<void> {
  console.log('📍 Starting zone import...')

  const records = loadCSV(filePath) as ZoneRecord[]
  if (records.length === 0) {
    console.log('No records found')
    return
  }

  // First, fetch all regions
  const { data: regions, error: regionsError } = await supabase
    .from('regions')
    .select('id, region_code')

  if (regionsError) throw regionsError

  const regionMap = new Map(regions?.map(r => [r.region_code.toUpperCase(), r.id]))

  try {
    for (const record of records) {
      const regionCode = record.region_code.toUpperCase()
      const regionId = regionMap.get(regionCode)

      if (!regionId) {
        console.warn(`⚠️ Region not found: ${regionCode}`)
        continue
      }

      const fullCode = `R${regionCode}${String(record.zone_code).padStart(3, '0')}`

      const { error } = await supabase
        .from('zones')
        .upsert(
          {
            region_id: regionId,
            zone_code: String(record.zone_code).padStart(3, '0'),
            full_code: fullCode,
            name: record.name,
            address: record.address || null,
            city: record.city || null,
            latitude: record.latitude ? parseFloat(record.latitude) : null,
            longitude: record.longitude ? parseFloat(record.longitude) : null,
            contact_person: record.contact_person || null,
            contact_email: record.contact_email || null,
            contact_phone: record.contact_phone || null
          },
          { onConflict: 'full_code' }
        )

      if (error) {
        console.warn(`⚠️ Error importing zone ${fullCode}:`, error.message)
      }
    }

    console.log(`✅ Successfully imported ${records.length} zones`)
  } catch (error) {
    console.error('❌ Error importing zones:', error)
  }
}

/**
 * Import pastors from CSV
 */
async function importPastors(filePath: string): Promise<void> {
  console.log('👨‍💼 Starting pastor import...')

  const records = loadCSV(filePath) as PastorRecord[]
  if (records.length === 0) {
    console.log('No records found')
    return
  }

  // Fetch zones
  const { data: zones, error: zonesError } = await supabase
    .from('zones')
    .select('id, full_code')

  if (zonesError) throw zonesError

  const zoneMap = new Map(zones?.map(z => [z.full_code, z.id]))

  try {
    for (const record of records) {
      const zoneId = zoneMap.get(record.zone_code)

      if (!zoneId) {
        console.warn(`⚠️ Zone not found: ${record.zone_code}`)
        continue
      }

      const fullCode = record.full_code ||
        `${record.zone_code}P${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}`

      const { error } = await supabase
        .from('pastors')
        .upsert(
          {
            zone_id: zoneId,
            full_code: fullCode,
            name: record.name,
            contact: record.contact || null,
            email: record.email || null,
            date_of_birth: record.date_of_birth || null,
            gender: record.gender || 'Male'
          },
          { onConflict: 'full_code' }
        )

      if (error) {
        console.warn(`⚠️ Error importing pastor ${fullCode}:`, error.message)
      }
    }

    console.log(`✅ Successfully imported ${records.length} pastors`)
  } catch (error) {
    console.error('❌ Error importing pastors:', error)
  }
}

/**
 * Import deacons from CSV
 */
async function importDeacons(filePath: string): Promise<void> {
  console.log('🙏 Starting deacon import...')

  const records = loadCSV(filePath) as DeaconRecord[]
  if (records.length === 0) {
    console.log('No records found')
    return
  }

  // Fetch zones
  const { data: zones, error: zonesError } = await supabase
    .from('zones')
    .select('id, full_code')

  if (zonesError) throw zonesError

  const zoneMap = new Map(zones?.map(z => [z.full_code, z.id]))

  try {
    for (const record of records) {
      const zoneId = zoneMap.get(record.zone_code)

      if (!zoneId) {
        console.warn(`⚠️ Zone not found: ${record.zone_code}`)
        continue
      }

      const fullCode = record.full_code ||
        `${record.zone_code}D${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}`

      const { error } = await supabase
        .from('deacons')
        .upsert(
          {
            zone_id: zoneId,
            full_code: fullCode,
            name: record.name,
            contact: record.contact || null,
            email: record.email || null,
            date_of_birth: record.date_of_birth || null,
            gender: record.gender || 'Male'
          },
          { onConflict: 'full_code' }
        )

      if (error) {
        console.warn(`⚠️ Error importing deacon ${fullCode}:`, error.message)
      }
    }

    console.log(`✅ Successfully imported ${records.length} deacons`)
  } catch (error) {
    console.error('❌ Error importing deacons:', error)
  }
}

/**
 * Main migration orchestration
 */
async function runMigration(): Promise<void> {
  console.log('🚀 Starting data migration...\n')

  // Update these paths with your CSV file locations
  const csvFiles = {
    regions: 'data/regions.csv',
    zones: 'data/zones.csv',
    pastors: 'data/pastors.csv',
    deacons: 'data/deacons.csv'
  }

  // Import in order (regions must come first)
  if (fs.existsSync(csvFiles.regions)) {
    await importRegions(csvFiles.regions)
  }

  if (fs.existsSync(csvFiles.zones)) {
    await importZones(csvFiles.zones)
  }

  if (fs.existsSync(csvFiles.pastors)) {
    await importPastors(csvFiles.pastors)
  }

  if (fs.existsSync(csvFiles.deacons)) {
    await importDeacons(csvFiles.deacons)
  }

  console.log('\n✅ Migration completed!')
}

// Run if this is the main module
if (require.main === module) {
  runMigration().catch(error => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
}

export {
  importRegions,
  importZones,
  importPastors,
  importDeacons,
  runMigration
}
