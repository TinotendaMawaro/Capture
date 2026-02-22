/**
 * API Route: Church Members - GET, POST, PUT, DELETE
 * Protected by JWT authentication with activity logging
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateNewMemberFullCode } from '@/lib/idGeneratorDb'
import { generateAndStoreQRCode, createQRCodeData } from '@/lib/qrCodeGenerator'
import { requireAuth, logApiActivity } from '@/lib/apiHelpers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const zoneId = searchParams.get('zone_id')
    const departmentId = searchParams.get('department_id')
    const search = searchParams.get('search')

    let query = supabase
      .from('church_members')
      .select(`
        id,
        zone_id,
        full_code,
        name,
        contact,
        email,
        date_of_birth,
        gender,
        membership_date,
        department_id,
        qr_code_url,
        is_active,
        created_at,
        zones (id, name, full_code, regions (id, name)),
        departments (id, name, full_code)
      `)

    if (zoneId) {
      query = query.eq('zone_id', zoneId)
    }

    if (departmentId) {
      query = query.eq('department_id', departmentId)
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,full_code.ilike.%${search}%,email.ilike.%${search}%`
      )
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching church members:', message)
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
      name,
      contact,
      email,
      date_of_birth,
      gender,
      membership_date,
      department_id
    } = body

    if (!zone_id || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: zone_id, name' },
        { status: 400 }
      )
    }

    // Get zone details
    const { data: zone, error: zoneError } = await supabase
      .from('zones')
      .select('full_code, name, regions (name)')
      .eq('id', zone_id)
      .single()

    if (zoneError) throw zoneError

    // Generate full code
    const fullCode = await generateNewMemberFullCode(zone.full_code)

    // Create member record
    const { data: member, error: createError } = await supabase
      .from('church_members')
      .insert([
        {
          zone_id,
          full_code: fullCode,
          name,
          contact,
          email,
          date_of_birth,
          gender: gender || 'Male',
          membership_date: membership_date || new Date().toISOString().split('T')[0],
          department_id: department_id || null
        }
      ])
      .select()

    if (createError) throw createError

    const memberRecord = member?.[0]
    if (!memberRecord) throw new Error('Failed to create member record')

    // Generate QR code
    try {
      const regionName = (zone.regions as unknown as { name: string }[])?.[0]?.name || 'Unknown Region'
      const qrData = createQRCodeData(
        'member',
        memberRecord.id,
        fullCode,
        name,
        zone.name,
        regionName,
        contact
      )

      const qrCodeUrl = await generateAndStoreQRCode(qrData)

      // Update member with QR code URL
      const { data: updatedMember, error: updateError } = 
        await supabase
          .from('church_members')
          .update({ qr_code_url: qrCodeUrl })
          .eq('id', memberRecord.id)
          .select()

      if (updateError) throw updateError

      // Log activity
      await logApiActivity(
        'create',
        'member',
        memberRecord.id,
        auth.user?.id ?? null,
        null,
        updatedMember?.[0] || memberRecord,
        request
      )

      return NextResponse.json(
        {
          success: true,
          message: 'Church member created successfully',
          data: updatedMember?.[0]
        },
        { status: 201 }
      )
    } catch (qrError: unknown) {
      const qrMessage = qrError instanceof Error ? qrError.message : 'Unknown QR error'
      console.warn('QR code generation failed, but member was created:', qrMessage)
      
      // Log activity (without QR code)
      await logApiActivity(
        'create',
        'member',
        memberRecord.id,
        auth.user?.id ?? null,
        null,
        memberRecord,
        request
      )

      return NextResponse.json(
        {
          success: true,
          message: 'Church member created but QR code generation failed',
          data: memberRecord
        },
        { status: 201 }
      )
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error creating church member:', message)
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
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    // Get old values for logging
    const { data: oldData } = await supabase
      .from('church_members')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('church_members')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    // Log activity
    await logApiActivity(
      'update',
      'member',
      id,
      auth.user?.id ?? null,
      oldData,
      data?.[0],
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: data?.[0]
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error updating member:', message)
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
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    const { data: existingMember } = await supabase
      .from('church_members')
      .select('id, name, full_code')
      .eq('id', id)
      .single()

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('church_members')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log activity
    await logApiActivity(
      'delete',
      'member',
      id,
      auth.user?.id ?? null,
      existingMember,
      null,
      request
    )

    return NextResponse.json({
      success: true,
      message: `Member ${existingMember.full_code} deleted successfully`
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error deleting member:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
