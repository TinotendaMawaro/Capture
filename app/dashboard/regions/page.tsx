'use client'

/**
 * Regions Management Page
 * Lists all regions with CRUD operations
 * Connected to Supabase API
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Region {
  id: string
  region_code: string
  name: string
  country: string
  description?: string
  created_at: string
}

interface RegionStats {
  zonesCount: number
  pastorsCount: number
  deaconsCount: number
}

export default function RegionsPage() {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionStats, setRegionStats] = useState<Record<string, RegionStats>>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRegion, setNewRegion] = useState({
    name: '',
    region_code: '',
    country: 'Zimbabwe',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/regions')
      const result = await response.json()

      if (result.success) {
        setRegions(result.data || [])
        
        // Load stats for each region
        if (result.data && result.data.length > 0) {
          const stats: Record<string, RegionStats> = {}
          for (const region of result.data) {
            const zonesRes = await fetch(`/api/zones?region_id=${region.id}`)
            const zonesData = await zonesRes.json()
            
            const pastorsRes = await fetch('/api/pastors')
            const pastorsData = await pastorsRes.json()
            
            const deaconsRes = await fetch('/api/deacons')
            const deaconsData = await deaconsRes.json()
            
            stats[region.id] = {
              zonesCount: zonesData.count || 0,
              pastorsCount: pastorsData.count || 0,
              deaconsCount: deaconsData.count || 0
            }
          }
          setRegionStats(stats)
        }
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load regions data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRegion = async () => {
    if (!newRegion.name || !newRegion.region_code) {
      alert('Please fill in required fields')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRegion)
      })

      const result = await response.json()

      if (result.success) {
        alert('Region created successfully!')
        setNewRegion({
          name: '',
          region_code: '',
          country: 'Zimbabwe',
          description: ''
        })
        setShowAddModal(false)
        loadData()
      } else {
        alert(result.error || 'Failed to create region')
      }
    } catch (err) {
      console.error('Error creating region:', err)
      alert('Failed to create region')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredRegions = regions.filter(region => {
    const matchesSearch = 
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      region.region_code.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading regions...</div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🌍 Regions</h1>
        <div className="page-header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add Region
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Regions Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Region Code</th>
                <th>Region Name</th>
                <th>Country</th>
                <th>Zones</th>
                <th>Pastors</th>
                <th>Deacons</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No regions found. Add your first region to get started.
                  </td>
                </tr>
              ) : (
                filteredRegions.map((region) => (
                  <tr key={region.id}>
                    <td>
                      <strong>{region.region_code}</strong>
                    </td>
                    <td>{region.name}</td>
                    <td>{region.country}</td>
                    <td>
                      <Link 
                        href={`/dashboard/zones?region=${region.id}`}
                        style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                      >
                        {regionStats[region.id]?.zonesCount || 0}
                      </Link>
                    </td>
                    <td>
                      <Link 
                        href={`/dashboard/pastors?region=${region.id}`}
                        style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                      >
                        {regionStats[region.id]?.pastorsCount || 0}
                      </Link>
                    </td>
                    <td>{regionStats[region.id]?.deaconsCount || 0}</td>
                    <td>{new Date(region.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Link 
                        href={`/dashboard/regions/${region.region_code}`} 
                        className="btn btn-sm btn-outline"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/dashboard/map?region=${region.region_code}`}
                        className="btn btn-sm btn-outline"
                      >
                        Map
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredRegions.length} of {regions.length} regions
      </div>

      {/* Add Region Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
            <div className="card-header">
              <h3 className="card-title">Add New Region</h3>
              <button 
                className="btn btn-icon btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Region Code *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., ZW11"
                  value={newRegion.region_code}
                  onChange={(e) => setNewRegion({ ...newRegion, region_code: e.target.value.toUpperCase() })}
                  maxLength={4}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Region Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Kwekwe Region"
                  value={newRegion.name}
                  onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Zimbabwe"
                  value={newRegion.country}
                  onChange={(e) => setNewRegion({ ...newRegion, country: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Brief description of the region"
                  value={newRegion.description}
                  onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAddRegion}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Add Region'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
