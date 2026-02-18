import { supabase } from './supabaseClient'

export type UserRole = 'admin' | 'region_pastor' | 'zone_pastor' | 'deacon'

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

export function hasRole(requiredRole: UserRole, userRole: UserRole | null): boolean {
  if (!userRole) return false
  
  const roleHierarchy: Record<UserRole, number> = {
    admin: 4,
    region_pastor: 3,
    zone_pastor: 2,
    deacon: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export async function requireRole(userId: string, requiredRole: UserRole): Promise<boolean> {
  const userRole = await checkUserRole(userId)
  return hasRole(requiredRole, userRole)
}

