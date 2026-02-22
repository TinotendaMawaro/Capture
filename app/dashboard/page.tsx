'use client'

/**
 * Dashboard Home Page
 * Shows key statistics and navigation to other sections
 */

import DashboardOverview from '@/components/dashboard/DashboardOverview'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Heartfelt Ministry Management System</p>
      </div>

      <DashboardOverview />
    </div>
  )
}
