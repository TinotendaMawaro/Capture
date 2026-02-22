/**
 * API Route: Deacons - GET, POST, PUT, DELETE
 * Production-ready with Service Role for admin operations
 * National Scale: R + region(2) + zone(2) + D + number
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth, logApiActivity } from '@/lib/apiHelpers'

// Service role client for admin operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const zoneId = searchParams.get('zone_id')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('deacons')
      .select('*')

    if (zoneId) {
      query = query.eq('zone_id', zoneId)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,full_code.ilike.%${search}%`)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching deacons:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const { zone_id, name, contact, email, date_of_birth, gender } = body

    if (!zone_id || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: zone_id, name' },
        { status: 400 }
      )
    }

    // Get zone details using admin client
    const { data: zone, error: zoneError } = await supabaseAdmin
      .from('zones')
      .select('full_code, name')
      .eq('id', zone_id)
      .single()

    if (zoneError) {
      console.error('Zone error:', zoneError)
      return NextResponse.json({ error: 'Zone not found' }, { status: 400 })
    }

    // Generate full_code using DB function (National Scale: R0101D1)
    const { data: codeData, error: codeError } = await supabaseAdmin
      .rpc('generate_full_code', {
        p_entity_type: 'D',
        p_zone_code: zone.full_code
      })

    if (codeError) {
      console.error('Code generation error:', codeError)
      return NextResponse.json(
        { error: 'Failed to generate code: ' + codeError.message },
        { status: 500 }
      )
    }

    const full_code = codeData

    // Create deacon record using admin client (bypasses RLS)
    const { data: deacon, error: createError } = await supabaseAdmin
      .from('deacons')
      .insert([{ zone_id, full_code, name, contact, email, date_of_birth, gender: gender || 'Male' }])
      .select()

    if (createError) {
      console.error('Create error:', createError)
      return NextResponse.json(
        { error: 'Failed to create deacon: ' + createError.message },
        { status: 500 }
      )
    }

    const deaconRecord = deacon?.[0]
    if (!deaconRecord) throw new Error('Failed to create deacon record')

    // Log activity
    await logApiActivity('create', 'deacon', deaconRecord.id, auth.user?.id, null, deaconRecord, request)

    return NextResponse.json(
      { success: true, message: 'Deacon created successfully', data: deaconRecord },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error creating deacon:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Deacon ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('deacons')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    await logApiActivity('update', 'deacon', id, auth.user?.id, null, data?.[0], request)

    return NextResponse.json({
      success: true,
      message: 'Deacon updated successfully',
      data: data?.[0]
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error updating deacon:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Deacon ID is required' }, { status: 400 })
    }

    const { data: existingDeacon } = await supabaseAdmin
      .from('deacons')
      .select('id, name, full_code')
      .eq('id', id)
      .single()

    if (!existingDeacon) {
      return NextResponse.json({ error: 'Deacon not found' }, { status: 404 })
    }

    const { error } = await supabaseAdmin.from('deacons').delete().eq('id', id)

    if (error) throw error

    await logApiActivity('delete', 'deacon', id, auth.user?.id, existingDeacon, null, request)

    return NextResponse.json({
      success: true,
      message: `Deacon ${existingDeacon.full_code} deleted successfully`
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error deleting deacon:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
