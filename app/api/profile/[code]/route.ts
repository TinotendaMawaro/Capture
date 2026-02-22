/**
 * API Route: Profile Lookup by Full Code
 * GET - Retrieve entity profile via full_code (for QR code scanning)
 * Optional authentication for additional security
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Define proper type for nested relations
interface ZoneWithRegion {
  id: string
  name: string
  full_code: string
  regions: {
    id: string
    name: string
    region_code: string
  } | null
}

/**
 * Lookup entity by full_code across all entity types
 * Returns pastor, deacon, or member profile
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    // Optional authentication - can be required for sensitive operations
    // For QR code scanning, we might want to allow public access
    // Uncomment the following lines to require authentication:
    // const auth = await verifyAuth(request)
    // if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const fullCode = params.code

    if (!fullCode) {
      return NextResponse.json(
        { error: 'Full code is required' },
        { status: 400 }
      )
    }

    // Try to find in pastors table
    const { data: pastor, error: pastorError } = await supabase
      .from('pastors')
      .select(`
        id,
        full_code,
        name,
        contact,
        email,
        date_of_birth,
        gender,
        qr_code_url,
        is_active,
        created_at,
        zone_id,
        zones (
          id,
          name,
          full_code,
          regions (id, name, region_code)
        )
      `)
      .eq('full_code', fullCode)
      .single()

    if (!pastorError && pastor) {
      const pastorZone = pastor.zones as unknown as ZoneWithRegion | null
      return NextResponse.json({
        success: true,
        data: {
          entity_type: 'pastor',
          id: pastor.id,
          full_code: pastor.full_code,
          name: pastor.name,
          contact: pastor.contact,
          email: pastor.email,
          date_of_birth: pastor.date_of_birth,
          gender: pastor.gender,
          qr_code_url: pastor.qr_code_url,
          is_active: pastor.is_active,
          created_at: pastor.created_at,
          zone: pastorZone,
          region: pastorZone?.regions
        }
      })
    }

    // Try to find in deacons table
    const { data: deacon, error: deaconError } = await supabase
      .from('deacons')
      .select(`
        id,
        full_code,
        name,
        contact,
        email,
        date_of_birth,
        gender,
        qr_code_url,
        is_active,
        created_at,
        zone_id,
        zones (
          id,
          name,
          full_code,
          regions (id, name, region_code)
        )
      `)
      .eq('full_code', fullCode)
      .single()

    if (!deaconError && deacon) {
      const deaconZone = deacon.zones as unknown as ZoneWithRegion | null
      return NextResponse.json({
        success: true,
        data: {
          entity_type: 'deacon',
          id: deacon.id,
          full_code: deacon.full_code,
          name: deacon.name,
          contact: deacon.contact,
          email: deacon.email,
          date_of_birth: deacon.date_of_birth,
          gender: deacon.gender,
          qr_code_url: deacon.qr_code_url,
          is_active: deacon.is_active,
          created_at: deacon.created_at,
          zone: deaconZone,
          region: deaconZone?.regions
        }
      })
    }

    // Try to find in church_members table
    const memberQuery = await supabase
      .from('church_members')
      .select(`
        id,
        full_code,
        name,
        contact,
        email,
        date_of_birth,
        gender,
        membership_date,
        qr_code_url,
        is_active,
        created_at,
        zone_id,
        department_id,
        zones (
          id,
          name,
          full_code,
          regions (id, name, region_code)
        ),
        departments (
          id,
          name,
          full_code
        )
      `)
      .eq('full_code', fullCode)
      .single()

    const member = memberQuery.data
    const memberError = memberQuery.error

    if (!memberError && member) {
      const memberZone = member.zones as unknown as ZoneWithRegion | null
      return NextResponse.json({
        success: true,
        data: {
          entity_type: 'member',
          id: member.id,
          full_code: member.full_code,
          name: member.name,
          contact: member.contact,
          email: member.email,
          date_of_birth: member.date_of_birth,
          gender: member.gender,
          membership_date: member.membership_date,
          qr_code_url: member.qr_code_url,
          is_active: member.is_active,
          created_at: member.created_at,
          zone: memberZone,
          region: memberZone?.regions,
          department: member.departments
        }
      })
    }

    // Entity not found
    return NextResponse.json(
      { error: 'Entity not found with this code', code: fullCode },
      { status: 404 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error looking up profile:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
