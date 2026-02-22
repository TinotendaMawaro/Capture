'use client'

/**
 * Zone Detail Page
 * Displays detailed view of a specific zone
 * Path: /dashboard/zones/[code]
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Zone {
  id: string
  region_id: string
  zone_code: string
  full_code: string
  name: string
  address?: string
  city?: string
  latitude?: number
  longitude?: number
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  created_at: string
  regions?: {
    id: string
    name: string
    region_code: string
    country?: string
  }
}

interface Pastor {
  id: string
  him_id: string
  name: string
  phone?: string
  email?: string
  role?: string
}

interface Deacon {
  id: string
  him_id: string
  name: string
  phone?: string
  email?: string
}

export default function ZoneDetailPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [zone, setZone] = useState<Zone | null>(null)
  const [pastors, setPastors] = useState<Pastor[]>([])
  const [deacons, setDeacons] = useState<Deacon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'pastors' | 'deacons'>('details')

  useEffect(() => {
    if (code) {
      loadZoneData()
    }
  }, [code])

  const loadZoneData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch zone details by full_code
      const zoneRes = await fetch(`/api/zones?search=${code}`)
      const zoneData = await zoneRes.json()

      if (!zoneData.success || !zoneData.data || zoneData.data.length === 0) {
        setError('Zone not found')
        return
      }

      // Find the exact zone by full_code
      const zoneInfo = zoneData.data.find((z: Zone) => z.full_code === code)
      if (!zoneInfo) {
        setError('Zone not found')
        return
      }

      setZone(zoneInfo)

      // Fetch pastors for this zone
      const pastorsRes = await fetch('/api/pastors')
      const pastorsData = await pastorsRes.json()
      if (pastorsData.success) {
        const allPastors = pastorsData.data as Array<{ id: string; zone_id: string; him_id: string; name: string; phone?: string; email?: string; role?: string }>
        const filteredPastors = allPastors.filter((p) => 
          p.zone_id === zoneInfo.id
        )
        setPastors(filteredPastors)
      }

      // Fetch deacons for this zone
      const deaconsRes = await fetch('/api/deacons')
      const deaconsData = await deaconsRes.json()
      if (deaconsData.success) {
        const allDeacons = deaconsData.data as Array<{ id: string; zone_id: string; him_id: string; name: string; phone?: string; email?: string }>
        const filteredDeacons = allDeacons.filter((d) => 
          d.zone_id === zoneInfo.id
        )
        setDeacons(filteredDeacons)
      }

    } catch (err) {
      console.error('Error loading zone data:', err)
      setError('Failed to load zone data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!zone) return
    
    if (!confirm('Are you sure you want to delete this zone? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/zones?id=${zone.id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Zone deleted successfully!')
        router.push('/dashboard/zones')
      } else {
        alert(result.error || 'Failed to delete zone')
      }
    } catch (err) {
      console.error('Error deleting zone:', err)
      alert('Failed to delete zone')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading zone details...</div>
      </div>
    )
  }

  if (error || !zone) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Link href="/dashboard/zones" className="text-primary hover:underline">
            ← Back to Zones
          </Link>
        </div>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error || 'Zone not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/zones" className="text-primary hover:underline">
          ← Back to Zones
        </Link>
      </div>

      {/* Zone Info Card */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <h1 className="card-title">⛪ {zone.name}</h1>
            <p className="text-sm text-gray-500">Zone Code: {zone.full_code}</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/dashboard/zones/${code}/edit`} 
              className="btn btn-outline"
            >
              ✏️ Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-outline text-red-600">
              🗑️ Delete
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p className="font-medium">
                <Link 
                  href={`/dashboard/regions/${zone.regions?.region_code}`}
                  className="text-primary hover:underline"
                >
                  {zone.regions?.name || 'Unknown'}
                </Link>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-medium">{zone.city || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pastors</p>
              <p className="font-medium">{pastors.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Deacons</p>
              <p className="font-medium">{deacons.length}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium mb-2">Contact Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contact Person</p>
                <p>{zone.contact_person || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{zone.contact_email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{zone.contact_phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          {zone.address && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Address</p>
              <p>{zone.address}</p>
            </div>
          )}

          {/* Coordinates */}
          {zone.latitude && zone.longitude && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Coordinates</p>
              <p>{zone.latitude}, {zone.longitude}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-4">
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`tab ${activeTab === 'pastors' ? 'active' : ''}`}
          onClick={() => setActiveTab('pastors')}
        >
          Pastors ({pastors.length})
        </button>
        <button 
          className={`tab ${activeTab === 'deacons' ? 'active' : ''}`}
          onClick={() => setActiveTab('deacons')}
        >
          Deacons ({deacons.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {activeTab === 'pastors' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pastor Code</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No pastors found for this zone.
                    </td>
                  </tr>
                ) : (
                  pastors.map((pastor) => (
                    <tr key={pastor.id}>
                      <td><strong>{pastor.him_id}</strong></td>
                      <td>{pastor.name}</td>
                      <td>{pastor.role || '-'}</td>
                      <td>{pastor.email || '-'}</td>
                      <td>{pastor.phone || '-'}</td>
                      <td>
                        <Link 
                          href={`/dashboard/pastors/${pastor.him_id}`}
                          className="btn btn-sm btn-outline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'deacons' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Deacon Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deacons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No deacons found for this zone.
                    </td>
                  </tr>
                ) : (
                  deacons.map((deacon) => (
                    <tr key={deacon.id}>
                      <td><strong>{deacon.him_id}</strong></td>
                      <td>{deacon.name}</td>
                      <td>{deacon.email || '-'}</td>
                      <td>{deacon.phone || '-'}</td>
                      <td>
                        <Link 
                          href={`/dashboard/deacons/${deacon.him_id}`}
                          className="btn btn-sm btn-outline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'details' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Zone Information</h3>
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td className="text-gray-500">Zone Code</td>
                        <td><strong>{zone.full_code}</strong></td>
                      </tr>
                      <tr>
                        <td className="text-gray-500">Zone Name</td>
                        <td>{zone.name}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500">Region</td>
                        <td>
                          <Link 
                            href={`/dashboard/regions/${zone.regions?.region_code}`}
                            className="text-primary hover:underline"
                          >
                            {zone.regions?.name}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-500">City</td>
                        <td>{zone.city || '-'}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-500">Address</td>
                        <td>{zone.address || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Statistics</h3>
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td className="text-gray-500">Total Pastors</td>
                        <td><strong>{pastors.length}</strong></td>
                      </tr>
                      <tr>
                        <td className="text-gray-500">Total Deacons</td>
                        <td><strong>{deacons.length}</strong></td>
                      </tr>
                      <tr>
                        <td className="text-gray-500">Created At</td>
                        <td>{new Date(zone.created_at).toLocaleDateString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
