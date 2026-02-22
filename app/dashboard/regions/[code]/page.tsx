'use client'

/**
 * Region Detail Page
 * Displays detailed view of a specific region
 * Path: /dashboard/regions/[code]
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Region {
  id: string
  region_code: string
  name: string
  country: string
  description?: string
  created_at: string
}

interface Zone {
  id: string
  zone_code: string
  full_code: string
  name: string
  city?: string
  contact_person?: string
  contact_phone?: string
}

interface Pastor {
  id: string
  him_id: string
  name: string
  phone?: string
  email?: string
  zone_id: string
}

interface Deacon {
  id: string
  him_id: string
  name: string
  phone?: string
  email?: string
  zone_id: string
}

export default function RegionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [region, setRegion] = useState<Region | null>(null)
  const [zones, setZones] = useState<Zone[]>([])
  const [pastors, setPastors] = useState<Pastor[]>([])
  const [deacons, setDeacons] = useState<Deacon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'zones' | 'pastors' | 'deacons'>('zones')

  useEffect(() => {
    if (code) {
      loadRegionData()
    }
  }, [code])

  const loadRegionData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch region details
      const regionRes = await fetch(`/api/regions?code=${code}`)
      const regionData = await regionRes.json()

      if (!regionData.success || !regionData.data || regionData.data.length === 0) {
        setError('Region not found')
        return
      }

      const regionInfo = regionData.data[0]
      setRegion(regionInfo)

      // Fetch zones for this region
      const zonesRes = await fetch(`/api/zones?region_id=${regionInfo.id}`)
      const zonesData = await zonesRes.json()
      if (zonesData.success) {
        setZones(zonesData.data || [])
      }

      // Fetch all pastors and filter by region (via zones)
      const pastorsRes = await fetch('/api/pastors')
      const pastorsData = await pastorsRes.json()
      if (pastorsData.success) {
        // Filter pastors by zones in this region
        const zoneIds = zonesData.data?.map((z: Zone) => z.id) || []
        const allPastors = pastorsData.data as Array<{ id: string; zone_id: string; him_id: string; name: string; phone?: string; email?: string }>
        const filteredPastors = allPastors.filter((p) => 
          zoneIds.includes(p.zone_id)
        )
        setPastors(filteredPastors)
      }

      // Fetch all deacons and filter by region (via zones)
      const deaconsRes = await fetch('/api/deacons')
      const deaconsData = await deaconsRes.json()
      if (deaconsData.success) {
        const zoneIds = zonesData.data?.map((z: Zone) => z.id) || []
        const allDeacons = deaconsData.data as Array<{ id: string; zone_id: string; him_id: string; name: string; phone?: string; email?: string }>
        const filteredDeacons = allDeacons.filter((d) => 
          zoneIds.includes(d.zone_id)
        )
        setDeacons(filteredDeacons)
      }

    } catch (err) {
      console.error('Error loading region data:', err)
      setError('Failed to load region data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!region) return
    
    if (!confirm('Are you sure you want to delete this region? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/regions?id=${region.id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Region deleted successfully!')
        router.push('/dashboard/regions')
      } else {
        alert(result.error || 'Failed to delete region')
      }
    } catch (err) {
      console.error('Error deleting region:', err)
      alert('Failed to delete region')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading region details...</div>
      </div>
    )
  }

  if (error || !region) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Link href="/dashboard/regions" className="text-primary hover:underline">
            ← Back to Regions
          </Link>
        </div>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error || 'Region not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/regions" className="text-primary hover:underline">
          ← Back to Regions
        </Link>
      </div>

      {/* Region Info Card */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <h1 className="card-title">🌍 {region.name}</h1>
            <p className="text-sm text-gray-500">Region Code: {region.region_code}</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/dashboard/regions/${code}/edit`} 
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
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-medium">{region.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Zones</p>
              <p className="font-medium">{zones.length}</p>
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
          {region.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Description</p>
              <p>{region.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-4">
        <button 
          className={`tab ${activeTab === 'zones' ? 'active' : ''}`}
          onClick={() => setActiveTab('zones')}
        >
          Zones ({zones.length})
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
          {activeTab === 'zones' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Zone Code</th>
                  <th>Zone Name</th>
                  <th>City</th>
                  <th>Contact Person</th>
                  <th>Contact Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No zones found for this region.
                    </td>
                  </tr>
                ) : (
                  zones.map((zone) => (
                    <tr key={zone.id}>
                      <td><strong>{zone.full_code}</strong></td>
                      <td>{zone.name}</td>
                      <td>{zone.city || '-'}</td>
                      <td>{zone.contact_person || '-'}</td>
                      <td>{zone.contact_phone || '-'}</td>
                      <td>
                        <Link 
                          href={`/dashboard/zones/${zone.full_code}`}
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

{activeTab === 'pastors' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pastor Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No pastors found for this region.
                    </td>
                  </tr>
                ) : (
                  pastors.map((pastor) => (
                    <tr key={pastor.id}>
                      <td><strong>{pastor.him_id}</strong></td>
                      <td>{pastor.name}</td>
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
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deacons.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No deacons found for this region.
                    </td>
                  </tr>
                ) : (
                  deacons.map((deacon) => (
                    <tr key={deacon.id}>
                      <td><strong>{deacon.him_id}</strong></td>
                      <td>{deacon.name}</td>
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
        </div>
      </div>
    </div>
  )
}
