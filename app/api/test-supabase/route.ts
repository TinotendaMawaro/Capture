import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test connection by trying to get the Supabase URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Try to fetch from Supabase health endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey || '',
        'Authorization': `Bearer ${supabaseKey}`
      }
    })

    if (response.ok) {
      return NextResponse.json({ 
        status: 'connected', 
        message: 'Supabase is connected and responding',
        projectUrl: supabaseUrl
      })
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: `Supabase responded with status: ${response.status}`,
        projectUrl: supabaseUrl
      }, { status: response.status })
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Failed to connect to Supabase',
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    }, { status: 500 })
  }
}
