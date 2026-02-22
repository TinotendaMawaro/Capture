/**
 * API Helper Functions
 * - JWT Authentication verification
 * - Activity logging helper
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

// Define types for auth
interface AuthUser {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

interface AuthSession {
  access_token: string
  refresh_token?: string
  expires_in?: number
  expires_at?: number
}

interface AuthResult {
  session: AuthSession | null
  user: AuthUser | null
}

// Get Supabase service role client for admin operations
function getServiceClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Verify JWT token from Authorization header
 * Returns the user session if valid, null otherwise
 */
export async function verifyAuth(req: NextRequest): Promise<AuthResult | null> {
  try {
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      console.error('Auth verification failed:', error)
      return null
    }

    // Get the session
    const { data: { session } } = await supabase.auth.getSession()
    
    return { session, user }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error verifying auth:', message)
    return null
  }
}

/**
 * Check if user has required role
 */
export async function verifyRole(req: NextRequest, allowedRoles: string[]): Promise<{
  authorized: boolean
  user?: AuthUser
  error?: string
}> {
  const auth = await verifyAuth(req)
  
  if (!auth) {
    return { authorized: false, error: 'Unauthorized - Invalid or missing token' }
  }

  // For now, we'll check the user metadata or custom claims
  // In a real app, you'd check the role from the users table
  const userRole = auth.user?.user_metadata?.role as string || 'member'
  
  if (!allowedRoles.includes(userRole) && !allowedRoles.includes('admin')) {
    return { authorized: false, error: 'Forbidden - Insufficient permissions' }
  }

  return { authorized: true, user: auth.user ?? undefined }
}

/**
 * Log activity to the activity_log table
 */
export async function logApiActivity(
  action: 'create' | 'update' | 'delete',
  entityType: string,
  entityId: string,
  userId: string | null | undefined,
  oldValues?: Record<string, unknown> | null,
  newValues?: Record<string, unknown> | null,
  req?: NextRequest
): Promise<void> {
  try {
    const serviceClient = getServiceClient()
    
    await serviceClient.from('activity_log').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues || null,
      new_values: newValues || null,
      ip_address: req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || null,
      user_agent: req?.headers.get('user-agent') || null
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Failed to log activity:', message)
    // Don't throw - activity logging should not break the main operation
  }
}

/**
 * Require authentication for API routes
 * Returns 401 if not authenticated
 */
export async function requireAuth(req: NextRequest): Promise<{
  success: boolean
  user?: AuthUser
  response?: NextResponse
}> {
  const auth = await verifyAuth(req)
  
  if (!auth) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }
  }
  
  return { success: true, user: auth.user ?? undefined }
}

/**
 * Require specific roles for API routes
 * Returns 403 if role not allowed
 */
export async function requireRole(
  req: NextRequest,
  allowedRoles: string[]
): Promise<{
  success: boolean
  user?: AuthUser
  response?: NextResponse
}> {
  const roleCheck = await verifyRole(req, allowedRoles)
  
  if (!roleCheck.authorized) {
    return {
      success: false,
      response: NextResponse.json(
        { error: roleCheck.error },
        { status: 403 }
      )
    }
  }
  
  return { success: true, user: roleCheck.user }
}

/**
 * Parse JSON body safely
 */
export async function parseBody<T>(req: NextRequest): Promise<{
  success: boolean
  data?: T
  error?: NextResponse
}> {
  try {
    const body = await req.json()
    return { success: true, data: body }
  } catch {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'
}
