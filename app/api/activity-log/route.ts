/**
 * API Route: Activity Log - GET (List activity logs) & POST (Log activity)
 * Protected by JWT authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { requireAuth } from '@/lib/apiHelpers'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    const action = searchParams.get('action')
    const entityType = searchParams.get('entity_type')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    let query = supabase
      .from('activity_log')
      .select(`
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        ip_address,
        timestamp,
        users (id, email, first_name, last_name, role)
      `, { count: 'exact' })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (action) {
      query = query.eq('action', action)
    }

    if (entityType) {
      query = query.eq('entity_type', entityType)
    }

    if (startDate) {
      query = query.gte('timestamp', startDate)
    }

    if (endDate) {
      query = query.lte('timestamp', endDate)
    }

    const { data, error, count } = await query
      .order('timestamp', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: count ? Math.ceil(count / limit) : 0
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching activity logs:', message)
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
      user_id,
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      ip_address,
      user_agent
    } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      )
    }

    // Use the authenticated user's ID if not provided
    const finalUserId = user_id || auth.user?.id

    const { data, error } = await supabase
      .from('activity_log')
      .insert([
        {
          user_id: finalUserId,
          action,
          entity_type,
          entity_id,
          old_values,
          new_values,
          ip_address,
          user_agent
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Activity logged successfully',
        data: data?.[0]
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error logging activity:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
