'use client'

/**
 * Zones Management Page
 * Lists all zones with CRUD operations
 * Connected to Supabase API
 */

import { useState, useEffect } from 'react'
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

interface Region {
  id: string
  name: string
  region_code: string
}

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newZone, setNewZone] = useState({
    name: '',
    region_id: '',
    city: '',
    contact_person: '',
    contact_phone: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [zonesRes, regionsRes] = await Promise.all([
        fetch('/api/zones'),
        fetch('/api/regions')
      ])

      const zonesData = await zonesRes.json()
      const regionsData = await regionsRes.json()

      if (zonesData.success) {
        setZones(zonesData.data || [])
      }

      if (regionsData.success) {
        setRegions(regionsData.data || [])
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load zones data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddZone = async () => {
    if (!newZone.name || !newZone.region_id) {
      alert('Please fill in required fields')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone)
      })

      const result = await response.json()

      if (result.success) {
        alert('Zone created successfully!')
        setNewZone({
          name: '',
          region_id: '',
          city: '',
          contact_person: '',
          contact_phone: ''
        })
        setShowAddModal(false)
        loadData()
      } else {
        alert(result.error || 'Failed to create zone')
      }
    } catch (err) {
      console.error('Error creating zone:', err)
      alert('Failed to create zone')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredZones = zones.filter(zone => {
    const matchesSearch = 
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      zone.full_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zone.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = regionFilter === 'all' || zone.region_id === regionFilter
    
    return matchesSearch && matchesRegion
  })

  const getRegionName = (regionId: string) => {
    const region = regions.find(r => r.id === regionId)
    return region?.name || 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading zones...</div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>⛪ Zones</h1>
        <div className="page-header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add Zone
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
          placeholder="Search by name, code, or contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-select"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="all">All Regions</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Zones Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone Code</th>
                <th>Zone Name</th>
                <th>Region</th>
                <th>City</th>
                <th>Contact Person</th>
                <th>Contact Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredZones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No zones found. Add your first zone to get started.
                  </td>
                </tr>
              ) : (
                filteredZones.map((zone) => (
                  <tr key={zone.id}>
                    <td>
                      <strong>{zone.full_code}</strong>
                    </td>
                    <td>{zone.name}</td>
                    <td>{getRegionName(zone.region_id)}</td>
                    <td>{zone.city || '-'}</td>
                    <td>{zone.contact_person || '-'}</td>
                    <td>{zone.contact_phone || '-'}</td>
                    <td className="actions">
                      <Link 
                        href={`/dashboard/zones/${zone.full_code}`} 
                        className="btn btn-sm btn-outline"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/dashboard/map?zone=${zone.full_code}`}
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
        Showing {filteredZones.length} of {zones.length} zones
      </div>

      {/* Add Zone Modal */}
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
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <div className="card-header">
              <h3 className="card-title">Add New Zone</h3>
              <button 
                className="btn btn-icon btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Zone Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Chitungwiza Central"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Region *</label>
                <select
                  className="form-select"
                  value={newZone.region_id}
                  onChange={(e) => setNewZone({ ...newZone, region_id: e.target.value })}
                >
                  <option value="">Select Region</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Chitungwiza"
                  value={newZone.city}
                  onChange={(e) => setNewZone({ ...newZone, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Name of contact person"
                  value={newZone.contact_person}
                  onChange={(e) => setNewZone({ ...newZone, contact_person: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., +263 77 123 4567"
                  value={newZone.contact_phone}
                  onChange={(e) => setNewZone({ ...newZone, contact_phone: e.target.value })}
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
                onClick={handleAddZone}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Add Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
