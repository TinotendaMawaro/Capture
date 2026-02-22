/**
 * API Route: Zones - GET, POST, PUT, DELETE
 * Production-ready with Service Role
 * National Scale: R + region(2) + zone(2)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth, logApiActivity } from '@/lib/apiHelpers'

// Service role client for admin operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - List zones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const regionId = searchParams.get('region_id')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('zones')
      .select(`
        id,
        region_id,
        zone_code,
        full_code,
        name,
        address,
        city,
        latitude,
        longitude,
        contact_person,
        contact_email,
        contact_phone,
        created_at,
        regions (id, name, region_code, country)
      `)

    if (regionId) {
      query = query.eq('region_id', regionId)
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,full_code.ilike.%${search}%,city.ilike.%${search}%`
      )
    }

    const { data, error } = await query
      .order('full_code', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching zones:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// POST - Create zone
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const {
      region_id,
      name,
      address,
      city,
      latitude,
      longitude,
      contact_person,
      contact_email,
      contact_phone
    } = body

    if (!region_id || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: region_id, name' },
        { status: 400 }
      )
    }

    // Get region details
    const { data: region, error: regionError } = await supabaseAdmin
      .from('regions')
      .select('region_code')
      .eq('id', region_id)
      .single()

    if (regionError) {
      console.error('Region error:', regionError)
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 400 }
      )
    }

    // Generate zone code using SQL function (National Scale: R0101)
    const { data: codeData, error: codeError } = await supabaseAdmin
      .rpc('generate_zone_code', {
        p_region_code: region.region_code
      })

    if (codeError) {
      console.error('Code generation error:', codeError)
      return NextResponse.json(
        { error: 'Failed to generate zone code: ' + codeError.message },
        { status: 500 }
      )
    }

    const full_code = codeData

    // Create zone using admin client
    const { data, error } = await supabaseAdmin
      .from('zones')
      .insert([
        {
          region_id,
          zone_code: full_code.substring(4, 6), // Extract 2-digit zone from R0101
          full_code,
          name,
          address,
          city,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          contact_person,
          contact_email,
          contact_phone
        }
      ])
      .select()

    if (error) {
      console.error('Create error:', error)
      return NextResponse.json(
        { error: 'Failed to create zone: ' + error.message },
        { status: 500 }
      )
    }

    // Log activity
    await logApiActivity(
      'create',
      'zone',
      data[0].id,
      auth.user?.id,
      null,
      data[0],
      request
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Zone created successfully',
        data: data?.[0]
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error creating zone:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// PUT - Update zone
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const {
      id,
      name,
      address,
      city,
      latitude,
      longitude,
      contact_person,
      contact_email,
      contact_phone
    } = body

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name' },
        { status: 400 }
      )
    }

    // Get old values for logging
    const { data: oldData } = await supabaseAdmin
      .from('zones')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabaseAdmin
      .from('zones')
      .update({
        name,
        address,
        city,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        contact_person,
        contact_email,
        contact_phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Zone not found' }, { status: 404 })
    }

    // Log activity
    await logApiActivity(
      'update',
      'zone',
      id,
      auth.user?.id,
      oldData,
      data[0],
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Zone updated successfully',
      data: data[0]
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error updating zone:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

// DELETE - Delete zone
export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing required parameter: id' }, { status: 400 })
    }

    const { count: pastorCount } = await supabaseAdmin
      .from('pastors')
      .select('id', { count: 'exact', head: true })
      .eq('zone_id', id)

    if (pastorCount && pastorCount > 0) {
      return NextResponse.json({ error: 'Cannot delete zone with existing pastors' }, { status: 400 })
    }

    const { count: deaconCount } = await supabaseAdmin
      .from('deacons')
      .select('id', { count: 'exact', head: true })
      .eq('zone_id', id)

    if (deaconCount && deaconCount > 0) {
      return NextResponse.json({ error: 'Cannot delete zone with existing deacons' }, { status: 400 })
    }

    const { count: memberCount } = await supabaseAdmin
      .from('church_members')
      .select('id', { count: 'exact', head: true })
      .eq('zone_id', id)

    if (memberCount && memberCount > 0) {
      return NextResponse.json({ error: 'Cannot delete zone with existing members' }, { status: 400 })
    }

    // Get old values for logging
    const { data: oldData } = await supabaseAdmin
      .from('zones')
      .select('*')
      .eq('id', id)
      .single()

    const { error } = await supabaseAdmin.from('zones').delete().eq('id', id)

    if (error) throw error

    // Log activity
    await logApiActivity(
      'delete',
      'zone',
      id,
      auth.user?.id,
      oldData,
      null,
      request
    )

    return NextResponse.json({ success: true, message: 'Zone deleted successfully' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error deleting zone:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
