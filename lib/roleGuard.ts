/**
 * Heartfelt International Ministries - Role-Based Access Control (RBAC)
 * 
 * Role Hierarchy (from highest to lowest):
 * 1. Super Admin (National Level) - Only 2 allowed
 * 2. Regional Admin
 * 3. Zone Admin
 * 4. Department Admin
 * 5. Pastor (Regional/Zone)
 * 6. Deacon
 * 7. Viewer (Read Only)
 */

import { supabase } from './supabaseClient'

/**
 * All available roles in the system
 */
export type UserRole = 
  | 'super_admin'      // National Level - Only 2 allowed
  | 'regional_admin'   // Regional Level
  | 'zone_admin'        // Zone Level
  | 'department_admin'  // Department Level
  | 'region_pastor'     // Regional Pastor
  | 'zone_pastor'       // Zone Pastor
  | 'deacon'            // Deacon
  | 'viewer'            // Read Only

/**
 * Role hierarchy levels for access control
 * Higher number = more access
 */
export const roleHierarchy: Record<UserRole, number> = {
  super_admin: 10,
  regional_admin: 8,
  zone_admin: 6,
  department_admin: 4,
  region_pastor: 5,
  zone_pastor: 3,
  deacon: 2,
  viewer: 1,
}

/**
 * Check if a role is an admin role
 */
export function isAdminRole(role: UserRole): boolean {
  return ['super_admin', 'regional_admin', 'zone_admin', 'department_admin'].includes(role)
}

/**
 * Check if a role is a pastoral role
 */
export function isPastoralRole(role: UserRole): boolean {
  return ['region_pastor', 'zone_pastor'].includes(role)
}

/**
 * Check user role from database
 */
export async function checkUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.role as UserRole
}

/**
 * Check if user has the required role or higher
 * Uses role hierarchy to determine access
 */
export function hasRole(requiredRole: UserRole, userRole: UserRole | null): boolean {
  if (!userRole) return false
  
  const userLevel = roleHierarchy[userRole]
  const requiredLevel = roleHierarchy[requiredRole]
  
  return userLevel >= requiredLevel
}

/**
 * Check if user has exactly the specified role
 */
export function hasExactRole(requiredRole: UserRole, userRole: UserRole | null): boolean {
  return userRole === requiredRole
}

/**
 * Require a specific role for access
 */
export async function requireRole(userId: string, requiredRole: UserRole): Promise<boolean> {
  const userRole = await checkUserRole(userId)
  return hasRole(requiredRole, userRole)
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    super_admin: 'Super Admin (National)',
    regional_admin: 'Regional Admin',
    zone_admin: 'Zone Admin',
    department_admin: 'Department Admin',
    region_pastor: 'Regional Pastor',
    zone_pastor: 'Zone Pastor',
    deacon: 'Deacon',
    viewer: 'Viewer'
  }
  return displayNames[role]
}

/**
 * Get permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    super_admin: [
      'manage_all_regions',
      'manage_all_zones',
      'manage_all_departments',
      'manage_users',
      'view_reports',
      'manage_transfers',
      'approve_transfers'
    ],
    regional_admin: [
      'manage_region',
      'manage_zones_in_region',
      'manage_departments_in_region',
      'view_reports',
      'manage_transfers'
    ],
    zone_admin: [
      'manage_zone',
      'manage_departments_in_zone',
      'view_reports',
      'manage_transfers'
    ],
    department_admin: [
      'manage_department',
      'view_reports'
    ],
    region_pastor: [
      'view_region',
      'view_zones',
      'view_reports'
    ],
    zone_pastor: [
      'view_zone',
      'view_reports'
    ],
    deacon: [
      'view_zone'
    ],
    viewer: [
      'view_read_only'
    ]
  }
  return permissions[role]
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}
