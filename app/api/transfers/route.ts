/**
 * API Route: Transfers - GET, POST (Transfer pastor/deacon/HOD to new zone/department)
 * Protected by JWT authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { requireAuth, logApiActivity } from '@/lib/apiHelpers'

// Define type for transfer history
interface TransferHistoryEntry {
  from_zone_id: string
  to_zone_id: string
  transfer_date: string
  reason?: string
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const body = await request.json()
    const {
      transfer_type, // 'pastor' | 'deacon' | 'hod'
      person_id,
      from_zone_id,
      to_zone_id,
      from_department_id,
      to_department_id,
      transfer_date,
      reason
    } = body

    if (!transfer_type || !person_id || !to_zone_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate transfer type
    const validTransferTypes = ['pastor', 'deacon', 'hod']
    if (!validTransferTypes.includes(transfer_type)) {
      return NextResponse.json(
        { error: 'Invalid transfer type' },
        { status: 400 }
      )
    }

    const table = transfer_type === 'hod' ? 'deacons' : transfer_type + 's'

    // Get person details
    const { data: person, error: fetchError } = await supabase
      .from(table)
      .select('name, zone_id, transfer_history')
      .eq('id', person_id)
      .single()

    if (fetchError) throw fetchError

    // Store old values for logging
    const oldValues = { ...person }

    // Create transfer log
    const { error: logError } = await supabase
      .from('transfers_log')
      .insert([
        {
          transfer_type,
          person_id,
          person_name: person.name,
          from_zone_id: from_zone_id || person.zone_id,
          to_zone_id,
          from_department_id,
          to_department_id,
          transfer_date: transfer_date || new Date().toISOString().split('T')[0],
          reason,
          approved_by: auth.user?.id
        }
      ])

    if (logError) throw logError

    // Update person's zone - use proper typing for transfer history
    const transferHistory = (person.transfer_history || []) as TransferHistoryEntry[]
    const { error: updateError } = await supabase
      .from(table)
      .update({
        zone_id: to_zone_id,
        transfer_history: [
          ...transferHistory,
          {
            from_zone_id: person.zone_id,
            to_zone_id,
            transfer_date: transfer_date || new Date().toISOString().split('T')[0],
            reason
          }
        ]
      })
      .eq('id', person_id)

    if (updateError) throw updateError

    // Get updated person data
    const { data: updatedPerson } = await supabase
      .from(table)
      .select('*')
      .eq('id', person_id)
      .single()

    // If person is a HOD, update their department assignment
    if (transfer_type === 'hod' && to_department_id) {
      await supabase
        .from('departments')
        .update({ hod_id: person_id })
        .eq('id', to_department_id)
    }

    // Log activity
    await logApiActivity(
      'update',
      'transfer',
      person_id,
      auth.user?.id ?? null,
      oldValues,
      { ...updatedPerson, transfer_reason: reason },
      request
    )

    return NextResponse.json(
      {
        success: true,
        message: `${transfer_type.charAt(0).toUpperCase() + transfer_type.slice(1)} transferred successfully`,
        data: {
          transfer_type,
          person_id,
          from_zone_id: from_zone_id || person.zone_id,
          to_zone_id,
          transfer_date: transfer_date || new Date().toISOString().split('T')[0]
        }
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error processing transfer:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * GET - Get transfer history
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (!auth.success) return auth.response

    const searchParams = request.nextUrl.searchParams
    const personId = searchParams.get('person_id')
    const transferType = searchParams.get('transfer_type')

    let query = supabase
      .from('transfers_log')
      .select(`
        id,
        transfer_type,
        person_id,
        person_name,
        from_zone_id,
        to_zone_id,
        from_department_id,
        to_department_id,
        transfer_date,
        reason,
        created_at,
        from_zones:from_zone_id (id, name, full_code),
        to_zones:to_zone_id (id, name, full_code),
        from_departments:from_department_id (id, name, full_code),
        to_departments:to_department_id (id, name, full_code)
      `)

    if (personId) {
      query = query.eq('person_id', personId)
    }

    if (transferType) {
      query = query.eq('transfer_type', transferType)
    }

    const { data, error } = await query
      .order('transfer_date', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching transfer history:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
