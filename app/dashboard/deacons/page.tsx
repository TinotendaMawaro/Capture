'use client'

/**
 * Deacons Management Page
 * Lists all deacons with CRUD operations
 * Connected to Supabase API
 */

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface Deacon {
  id: string
  zone_id: string
  full_code: string
  name: string
  contact?: string
  email?: string
  date_of_birth?: string
  gender?: string
  qr_code_url?: string
  is_active: boolean
  created_at: string
}

interface Zone {
  id: string
  name: string
  full_code: string
}

export default function DeaconsPage() {
  const [deacons, setDeacons] = useState<Deacon[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDeacon, setNewDeacon] = useState({
    name: '',
    contact: '',
    email: '',
    gender: 'Male',
    zone_id: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [deaconsRes, zonesRes] = await Promise.all([
        fetch('/api/deacons'),
        fetch('/api/zones')
      ])

      const deaconsData = await deaconsRes.json()
      const zonesData = await zonesRes.json()

      if (deaconsData.success) {
        setDeacons(deaconsData.data || [])
      }

      if (zonesData.success) {
        setZones(zonesData.data || [])
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load deacons data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDeacon = async () => {
    if (!newDeacon.name || !newDeacon.zone_id) {
      alert('Please fill in required fields')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/deacons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeacon)
      })

      const result = await response.json()

      if (result.success) {
        alert(`Deacon created successfully! Full Code: ${result.data.full_code}`)
        setNewDeacon({
          name: '',
          contact: '',
          email: '',
          gender: 'Male',
          zone_id: ''
        })
        setShowAddModal(false)
        loadData()
      } else {
        alert(result.error || 'Failed to create deacon')
      }
    } catch (err) {
      console.error('Error creating deacon:', err)
      alert('Failed to create deacon')
    } finally {
      setSubmitting(false)
    }
  }

  // ========================================================================
  // Optimized lookup map (no more find() in render loops)
  // ========================================================================
  const zoneMap = useMemo(() => {
    const map: Record<string, Zone> = {}
    zones.forEach(z => { map[z.id] = z })
    return map
  }, [zones])

  // ========================================================================
  // Filtered deacons with optimized search (case-insensitive)
  // ========================================================================
  const filteredDeacons = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return deacons.filter(deacon => {
      const matchesSearch = 
        deacon.name.toLowerCase().includes(s) || 
        deacon.full_code.toLowerCase().includes(s) ||
        (deacon.contact || '').toLowerCase().includes(s)
      
      const matchesZone = zoneFilter === 'all' || deacon.zone_id === zoneFilter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && deacon.is_active) ||
        (statusFilter === 'inactive' && !deacon.is_active)
      
      return matchesSearch && matchesZone && matchesStatus
    })
  }, [deacons, searchTerm, zoneFilter, statusFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading deacons...</div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🙏 Deacons</h1>
        <div className="page-header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            ➕ Register Deacon
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, code, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-select"
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
        >
          <option value="all">All Zones</option>
          {zones.map(z => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>
        <select 
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Code</th>
                <th>Name</th>
                <th>Zone</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeacons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No deacons found. Register your first deacon to get started.
                  </td>
                </tr>
              ) : (
                filteredDeacons.map((deacon) => (
                  <tr key={deacon.id}>
                    <td>
                      <strong>{deacon.full_code}</strong>
                    </td>
                    <td>{deacon.name}</td>
                    <td>{zoneMap[deacon.zone_id]?.name || '-'}</td>
                    <td>{deacon.contact || '-'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{deacon.email || '-'}</td>
                    <td>
                      <span className={`status-badge ${deacon.is_active ? 'active' : 'inactive'}`}>
                        {deacon.is_active ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </td>
                    <td>{new Date(deacon.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Link href={`/dashboard/deacons/${deacon.full_code}`} className="btn btn-sm btn-outline">
                        View
                      </Link>
                      <Link href={`/dashboard/transfers?person=${deacon.full_code}`} className="btn btn-sm btn-outline">
                        Transfer
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredDeacons.length} of {deacons.length} deacons
      </div>

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
              <h3 className="card-title">Register New Deacon</h3>
              <button className="btn btn-icon btn-outline" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Deacon John Moyo"
                  value={newDeacon.name}
                  onChange={(e) => setNewDeacon({ ...newDeacon, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., +263 77 123 4567"
                  value={newDeacon.contact}
                  onChange={(e) => setNewDeacon({ ...newDeacon, contact: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g., john.moyo@him.org"
                  value={newDeacon.email}
                  onChange={(e) => setNewDeacon({ ...newDeacon, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={newDeacon.gender}
                  onChange={(e) => setNewDeacon({ ...newDeacon, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Zone *</label>
                <select
                  className="form-select"
                  value={newDeacon.zone_id}
                  onChange={(e) => setNewDeacon({ ...newDeacon, zone_id: e.target.value })}
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} ({z.full_code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)} disabled={submitting}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddDeacon} disabled={submitting}>
                {submitting ? 'Registering...' : 'Register Deacon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
