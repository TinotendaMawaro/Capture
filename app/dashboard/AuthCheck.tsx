'use client'

/**
 * Auth Check Component
 * Client component that verifies user authentication
 * Redirects to login if not authenticated
 */

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabase } from '@/components/providers/SupabaseProvider'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect if:
    // 1. Not still loading
    // 2. No user found
    // 3. Haven't already redirected
    // 4. Not already on login page
    if (!loading && !user && !hasRedirected && pathname !== '/login') {
      console.log('AuthCheck: User not authenticated, redirecting to login')
      setHasRedirected(true)
      router.push('/login')
    }
  }, [user, loading, router, pathname, hasRedirected])

  // Show nothing while loading (prevents flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children
  if (!user) {
    return null
  }

  // User is authenticated, show the content
  return <>{children}</>
}
