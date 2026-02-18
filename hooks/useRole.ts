'use client'

import { useState, useEffect } from 'react'
import { checkUserRole, UserRole } from '@/lib/roleGuard'
import { useAuth } from './useAuth'

interface UseRoleReturn {
  role: UserRole | null
  loading: boolean
  isAdmin: boolean
  isRegionPastor: boolean
  isZonePastor: boolean
  isDeacon: boolean
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
    isAdmin: role === 'admin',
    isRegionPastor: role === 'region_pastor',
    isZonePastor: role === 'zone_pastor',
    isDeacon: role === 'deacon',
  }
}

