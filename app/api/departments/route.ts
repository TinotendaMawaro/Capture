/**
 * API Route: Departments - GET, POST, PUT, DELETE
 * Protected by JWT authentication with activity logging
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateNewDepartmentFullCode } from '@/lib/idGeneratorDb'
import { requireAuth, logApiActivity } from '@/lib/apiHelpers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const zoneId = searchParams.get('zone_id')
    const search = searchParams.get('search')

    let query = supabase
      .from('departments')
      .select(`
        id,
        zone_id,
        dep_code,
        full_code,
        name,
        description,
        hod_id,
        created_at,
        zones (id, name, full_code, regions (id, name))
      `)

    if (zoneId) {
      query = query.eq('zone_id', zoneId)
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,full_code.ilike.%${search}%`
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
    console.error('Error fetching departments:', message)
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
    const {
      zone_id,
      department_number,
      name,
      description,
      hod_id
    } = body

    if (!zone_id || !department_number || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get zone details
    const { data: zone, error: zoneError } = await supabase
      .from('zones')
      .select('full_code')
      .eq('id', zone_id)
      .single()

    if (zoneError) throw zoneError

    // Generate full code
    const fullCode = await generateNewDepartmentFullCode(zone.full_code)

    // Create department
    const { data, error } = await supabase
      .from('departments')
      .insert([
        {
          zone_id,
          dep_code: String(department_number).padStart(2, '0'),
          full_code: fullCode,
          name,
          description,
          hod_id: hod_id || null
        }
      ])
      .select()

    if (error) throw error

    // Log activity
    await logApiActivity(
      'create',
      'department',
      data[0].id,
      auth.user?.id,
      null,
      data[0],
      request
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Department created successfully',
        data: data?.[0]
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error creating department:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      )
    }

    // Get old values for logging
    const { data: oldData } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('departments')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    // Log activity
    await logApiActivity(
      'update',
      'department',
      id,
      auth.user?.id,
      oldData,
      data?.[0],
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Department updated successfully',
      data: data?.[0]
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error updating department:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      )
    }

    const { data: existingDept } = await supabase
      .from('departments')
      .select('id, name, full_code')
      .eq('id', id)
      .single()

    if (!existingDept) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log activity
    await logApiActivity(
      'delete',
      'department',
      id,
      auth.user?.id,
      existingDept,
      null,
      request
    )

    return NextResponse.json({
      success: true,
      message: `Department ${existingDept.full_code} deleted successfully`
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error deleting department:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
