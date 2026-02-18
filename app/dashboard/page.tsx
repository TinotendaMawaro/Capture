'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check authentication and redirect if needed
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><a href="/dashboard/regions">Regions</a></li>
          <li><a href="/dashboard/zones">Zones</a></li>
          <li><a href="/dashboard/pastors">Pastors</a></li>
          <li><a href="/dashboard/deacons">Deacons</a></li>
          <li><a href="/dashboard/departments">Departments</a></li>
          <li><a href="/dashboard/transfers">Transfers</a></li>
          <li><a href="/dashboard/map">Map</a></li>
          <li><a href="/dashboard/reports">Reports</a></li>
        </ul>
      </nav>
    </div>
  )
}

