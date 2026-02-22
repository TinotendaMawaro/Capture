/**
 * API Route: Regions - GET, POST, PUT, DELETE
 * Protected by JWT authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { requireAuth, logApiActivity } from '@/lib/apiHelpers'

// GET - List all regions with statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    let query = supabase
      .from('regions')
      .select(`
        id,
        region_code,
        name,
        country,
        description,
        created_at,
        zones (count)
      `)

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,region_code.ilike.%${search}%,country.ilike.%${search}%`
      )
    }

    const { data: regions, error } = await query
      .order('region_code', { ascending: true })

    if (error) throw error

    // Get pastor and department counts
    const enrichedRegions = await Promise.all(
      (regions || []).map(async (region) => {
        const { count: zoneCount } = await supabase
          .from('zones')
          .select('id', { count: 'exact', head: true })
          .eq('region_id', region.id)

        const { data: zoneIds } = await supabase
          .from('zones')
          .select('id')
          .eq('region_id', region.id)

        const zoneIdList = zoneIds?.map((z: { id: string }) => z.id) || []
        
        const { count: pastorCount } = await supabase
          .from('pastors')
          .select('id', { count: 'exact', head: true })
          .in('zone_id', zoneIdList.length > 0 ? zoneIdList : [''])

        return {
          ...region,
          zone_count: zoneCount || 0,
          pastor_count: pastorCount || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: enrichedRegions,
      count: enrichedRegions.length
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching regions:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// POST - Create new region
export async function POST(request: NextRequest) {
  try {
    // Require authentication for create operations
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const { region_code, name, country, description } = body

    if (!region_code || !name || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: region_code, name, country' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('regions')
      .insert([
        {
          region_code: region_code.toUpperCase(),
          name,
          country,
          description
        }
      ])
      .select()

    if (error) throw error

    // Log activity
    await logApiActivity(
      'create',
      'region',
      data[0].id,
      auth.user?.id ?? null,
      null,
      data[0],
      request
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Region created successfully',
        data: data?.[0]
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error creating region:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// PUT - Update existing region
export async function PUT(request: NextRequest) {
  try {
    // Require authentication for update operations
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const { id, region_code, name, country, description } = body

    if (!id || !region_code || !name || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: id, region_code, name, country' },
        { status: 400 }
      )
    }

    // Get old values for logging
    const { data: oldData } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('regions')
      .update({
        region_code: region_code.toUpperCase(),
        name,
        country,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      )
    }

    // Log activity
    await logApiActivity(
      'update',
      'region',
      id,
      auth.user?.id ?? null,
      oldData,
      data[0],
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Region updated successfully',
      data: data[0]
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error updating region:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// DELETE - Delete region
export async function DELETE(request: NextRequest) {
  try {
    // Require authentication for delete operations
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      )
    }

    // Check if region has zones
    const { count: zoneCount } = await supabase
      .from('zones')
      .select('id', { count: 'exact', head: true })
      .eq('region_id', id)

    if (zoneCount && zoneCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete region with existing zones. Please delete zones first.' },
        { status: 400 }
      )
    }

    // Get old values for logging
    const { data: oldData } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log activity
    await logApiActivity(
      'delete',
      'region',
      id,
      auth.user?.id ?? null,
      oldData,
      null,
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Region deleted successfully'
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error deleting region:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
