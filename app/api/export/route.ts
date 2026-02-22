/**
 * API Route: Export Data - GET (CSV/Excel export of entities)
 * Protected by JWT authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { requireAuth } from '@/lib/apiHelpers'

// Define more flexible interfaces for export data
interface BaseExportData {
  id: string
  [key: string]: unknown
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: BaseExportData[]): string {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      
      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        return '"' + JSON.stringify(value).replace(/"/g, '""') + '"'
      }
      
      // Escape commas and quotes
      if (typeof value === 'string') {
        return '"' + value.replace(/"/g, '""') + '"'
      }
      
      return value ?? ''
    }).join(',')
  })

  return [csvHeaders, ...csvRows].join('\n')
}

export async function GET(request: NextRequest) {
  try {
    // Require authentication for export
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const searchParams = request.nextUrl.searchParams
    const entityType = searchParams.get('entity_type')
    const format = searchParams.get('format') || 'csv'
    const regionId = searchParams.get('region_id')
    const zoneId = searchParams.get('zone_id')

    let data: BaseExportData[] = []
    let filename = ''

    // Export regions
    if (entityType === 'regions') {
      const { data: regions, error } = await supabase
        .from('regions')
        .select('id, region_code, name, country, description, created_at')
        .order('region_code', { ascending: true })

      if (error) throw error
      data = (regions || []) as BaseExportData[]
      filename = 'regions'
    }

    // Export zones
    if (entityType === 'zones') {
      let query = supabase
        .from('zones')
        .select('id, full_code, name, address, city, latitude, longitude, contact_person, contact_email, contact_phone, created_at, regions(name)')

      if (regionId) {
        query = query.eq('region_id', regionId)
      }

      const { data: zones, error } = await query
        .order('full_code', { ascending: true })

      if (error) throw error
      data = (zones || []) as unknown as BaseExportData[]
      filename = 'zones'
    }

    // Export pastors
    if (entityType === 'pastors') {
      let query = supabase
        .from('pastors')
        .select('id, full_code, name, contact, email, date_of_birth, gender, is_active, created_at, zones(name, full_code)')

      if (zoneId) {
        query = query.eq('zone_id', zoneId)
      }

      const { data: pastors, error } = await query
        .order('full_code', { ascending: true })

      if (error) throw error
      data = (pastors || []) as unknown as BaseExportData[]
      filename = 'pastors'
    }

    // Export deacons
    if (entityType === 'deacons') {
      let query = supabase
        .from('deacons')
        .select('id, full_code, name, contact, email, date_of_birth, gender, is_active, created_at, zones(name, full_code)')

      if (zoneId) {
        query = query.eq('zone_id', zoneId)
      }

      const { data: deacons, error } = await query
        .order('full_code', { ascending: true })

      if (error) throw error
      data = (deacons || []) as unknown as BaseExportData[]
      filename = 'deacons'
    }

    // Export members
    if (entityType === 'members') {
      let query = supabase
        .from('church_members')
        .select('id, full_code, name, contact, email, date_of_birth, gender, membership_date, is_active, created_at, zones(name, full_code), departments(name, full_code)')

      if (zoneId) {
        query = query.eq('zone_id', zoneId)
      }

      const { data: members, error } = await query
        .order('full_code', { ascending: true })

      if (error) throw error
      data = (members || []) as unknown as BaseExportData[]
      filename = 'church_members'
    }

    // Export departments
    if (entityType === 'departments') {
      let query = supabase
        .from('departments')
        .select('id, full_code, name, description, hod_id, created_at, zones(name, full_code)')

      if (zoneId) {
        query = query.eq('zone_id', zoneId)
      }

      const { data: departments, error } = await query
        .order('full_code', { ascending: true })

      if (error) throw error
      data = (departments || []) as unknown as BaseExportData[]
      filename = 'departments'
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found for export' },
        { status: 404 }
      )
    }

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data,
        count: data.length
      })
    }

    // CSV export
    const csv = convertToCSV(data)
    const dateStr = new Date().toISOString().split('T')[0]

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="' + filename + '_' + dateStr + '.csv"'
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error exporting data:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
