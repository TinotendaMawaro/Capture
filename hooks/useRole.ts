'use client'

import { useState, useEffect } from 'react'
import { checkUserRole, UserRole, isAdminRole, isPastoralRole } from '@/lib/roleGuard'
import { useAuth } from './useAuth'

interface UseRoleReturn {
  role: UserRole | null
  loading: boolean
  isSuperAdmin: boolean
  isRegionalAdmin: boolean
  isZoneAdmin: boolean
  isDepartmentAdmin: boolean
  isAdmin: boolean
  isRegionPastor: boolean
  isZonePastor: boolean
  isDeacon: boolean
  isViewer: boolean
}

export function useRole(): UseRoleReturn {
  const { user } = useAuth()
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      const userRole = await checkUserRole(user.id)
      setRole(userRole)
      setLoading(false)
    }

    fetchRole()
  }, [user])

  return {
    role,
    loading,
    isSuperAdmin: role === 'super_admin',
    isRegionalAdmin: role === 'regional_admin',
    isZoneAdmin: role === 'zone_admin',
    isDepartmentAdmin: role === 'department_admin',
    isAdmin: isAdminRole(role || 'viewer'),
    isRegionPastor: role === 'region_pastor',
    isZonePastor: role === 'zone_pastor',
    isDeacon: role === 'deacon',
    isViewer: role === 'viewer',
  }
}
