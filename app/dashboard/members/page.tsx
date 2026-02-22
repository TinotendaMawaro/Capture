'use client'

/**
 * Church Members Page
 * Uses MembersManagement component for CRUD operations
 */

import MembersManagement from '@/components/dashboard/MembersManagement'

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">👥 Church Members</h1>
        <p className="text-gray-600 mt-2">Manage church members and their details</p>
      </div>

      <MembersManagement />
    </div>
  )
}
