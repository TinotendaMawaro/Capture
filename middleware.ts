import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip auth check for API routes, static files, etc.
  if (
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('.') ||
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/'
  ) {
    return res
  }

  // Only protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // Try to get session - but don't redirect aggressively
    // Let the client-side AuthCheck handle the redirect
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, the client-side AuthCheck will handle redirect
    // We allow the request to continue so the page can load and do the check
    if (!session) {
      console.log('No session found in middleware, allowing client-side check')
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
