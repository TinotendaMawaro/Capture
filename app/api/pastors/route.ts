/**
 * API Route: Pastors - GET, POST, PUT, DELETE
 * Production-ready with Service Role for admin operations
 * National Scale: R + region(2) + zone(2) + P + number
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
      .from('pastors')
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
    console.error('Error fetching pastors:', message)
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
    const { zone_id, full_name, contact, email, date_of_birth, gender } = body

    if (!zone_id || !full_name) {
      return NextResponse.json(
        { error: 'Missing required fields: zone_id, full_name' },
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

    // Generate full_code using DB function (National Scale: R0101P1)
    const { data: codeData, error: codeError } = await supabaseAdmin
      .rpc('generate_full_code', {
        p_entity_type: 'P',
        p_zone_code: zone.full_code
      })

    if (codeError) {
      console.error('Code generation error:', codeError)
      return NextResponse.json(
        { error: 'Failed to generate code: ' + codeError.message },
        { status: 500 }
      )
    }

    const pastor_code = codeData

    // Create pastor record using admin client (bypasses RLS)
    const { data: pastor, error: createError } = await supabaseAdmin
      .from('pastors')
      .insert([{ zone_id, pastor_code, full_name, contact, email, date_of_birth, gender: gender || 'Male' }])
      .select()

    if (createError) {
      console.error('Create error:', createError)
      return NextResponse.json(
        { error: 'Failed to create pastor: ' + createError.message },
        { status: 500 }
      )
    }

    const pastorRecord = pastor?.[0]
    if (!pastorRecord) throw new Error('Failed to create pastor record')

    // Log activity
    await logApiActivity('create', 'pastor', pastorRecord.id, auth.user?.id, null, pastorRecord, request)

    return NextResponse.json(
      { success: true, message: 'Pastor created successfully', data: pastorRecord },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error creating pastor:', message)
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
      return NextResponse.json({ error: 'Pastor ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('pastors')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    await logApiActivity('update', 'pastor', id, auth.user?.id, null, data?.[0], request)

    return NextResponse.json({
      success: true,
      message: 'Pastor updated successfully',
      data: data?.[0]
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error updating pastor:', message)
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
      return NextResponse.json({ error: 'Pastor ID is required' }, { status: 400 })
    }

    const { data: existingPastor } = await supabaseAdmin
      .from('pastors')
      .select('id, name, full_code')
      .eq('id', id)
      .single()

    if (!existingPastor) {
      return NextResponse.json({ error: 'Pastor not found' }, { status: 404 })
    }

    // Check if pastor is HOD of any department
    const { data: departmentHod } = await supabaseAdmin
      .from('departments')
      .select('id, name')
      .eq('hod_id', id)
      .limit(1)

    if (departmentHod && departmentHod.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete pastor - currently HOD of department: ${departmentHod[0].name}` },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('pastors').delete().eq('id', id)

    if (error) throw error

    await logApiActivity('delete', 'pastor', id, auth.user?.id, existingPastor, null, request)

    return NextResponse.json({
      success: true,
      message: `Pastor ${existingPastor.full_code} deleted successfully`
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error deleting pastor:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
