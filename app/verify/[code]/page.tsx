'use client'

/**
 * Profile Verification Page
 * Displays entity profile by full_code (accessed via QR code scan)
 * URL: /verify/[code]
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QRCodeCard from '@/components/qr/QRCodeCard'

interface ProfileData {
  entity_type: string
  id: string
  full_code: string
  name: string
  contact?: string
  email?: string
  date_of_birth?: string
  gender?: string
  membership_date?: string
  qr_code_url?: string
  is_active: boolean
  created_at: string
  zone?: {
    id: string
    name: string
    full_code: string
  }
  region?: {
    id: string
    name: string
    region_code: string
  }
  department?: {
    id: string
    name: string
    full_code: string
  }
}

export default function VerifyPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (code) {
      loadProfile()
    }
  }, [code])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/profile/${code}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load profile')
      }

      setProfile(result.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pastor: 'Pastor',
      deacon: 'Deacon',
      member: 'Church Member',
      hod: 'Head of Department'
    }
    return labels[type] || type
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-red-100 text-red-800 border-red-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="p-4 bg-gray-100 rounded-lg mb-6">
            <p className="text-sm text-gray-500">Search Code:</p>
            <p className="text-lg font-mono font-bold text-gray-800">{code}</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Ministry Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            🙏 Heartfelt International Ministries 🙏
          </h1>
          <p className="text-gray-600 mt-2">Profile Verification Card</p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <span className={`px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor(profile.is_active)}`}>
            {profile.is_active ? '✓ Active Member' : '✕ Inactive'}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              👤 Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="text-lg font-semibold text-blue-700">
                  {getEntityTypeLabel(profile.entity_type)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Full Code</p>
                <p className="text-lg font-mono font-bold text-gray-900">{profile.full_code}</p>
              </div>

              {profile.gender && (
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-900">{profile.gender}</p>
                </div>
              )}

              {profile.date_of_birth && (
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
                </div>
              )}

              {profile.membership_date && (
                <div>
                  <p className="text-sm text-gray-500">Membership Date</p>
                  <p className="text-gray-900">{new Date(profile.membership_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Location Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              📍 Contact & Location
            </h2>

            <div className="space-y-4">
              {profile.contact && (
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-900 font-medium">{profile.contact}</p>
                </div>
              )}

              {profile.email && (
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Zone</p>
                <p className="text-gray-900 font-medium">{profile.zone?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{profile.zone?.full_code}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Region</p>
                <p className="text-gray-900 font-medium">{profile.region?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{profile.region?.region_code}</p>
              </div>

              {profile.department && (
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-gray-900 font-medium">{profile.department.name}</p>
                  <p className="text-sm text-gray-500">{profile.department.full_code}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Registered Date</p>
                <p className="text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        {profile.qr_code_url && (
          <div className="mt-6">
            <QRCodeCard
              fullCode={profile.full_code}
              name={profile.name}
              zone={profile.zone?.name || 'N/A'}
              region={profile.region?.name || 'N/A'}
              contact={profile.contact}
              qrCodeUrl={profile.qr_code_url}
              entityType={getEntityTypeLabel(profile.entity_type)}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Heartfelt International Ministries</p>
          <p>All rights reserved | Verified via QR Code</p>
        </div>
      </div>
    </div>
  )
}
