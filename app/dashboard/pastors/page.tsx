'use client'

/**
 * Pastors Management Page
 * Lists all pastors with CRUD operations and QR code generation
 * Connected to Supabase API
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Pastor {
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

export default function PastorsPage() {
  const [pastors, setPastors] = useState<Pastor[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState<Pastor | null>(null)
  const [newPastor, setNewPastor] = useState({
    name: '',
    contact: '',
    email: '',
    gender: 'Male',
    zone_id: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [pastorsRes, zonesRes] = await Promise.all([
        fetch('/api/pastors'),
        fetch('/api/zones')
      ])

      const pastorsData = await pastorsRes.json()
      const zonesData = await zonesRes.json()

      if (pastorsData.success) {
        setPastors(pastorsData.data || [])
      }

      if (zonesData.success) {
        setZones(zonesData.data || [])
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load pastors data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddPastor = async () => {
    if (!newPastor.name || !newPastor.zone_id) {
      alert('Please fill in required fields')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/pastors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPastor)
      })

      const result = await response.json()

      if (result.success) {
        alert(`Pastor created successfully! Full Code: ${result.data.full_code}`)
        setNewPastor({
          name: '',
          contact: '',
          email: '',
          gender: 'Male',
          zone_id: ''
        })
        setShowAddModal(false)
        loadData()
      } else {
        alert(result.error || 'Failed to create pastor')
      }
    } catch (err) {
      console.error('Error creating pastor:', err)
      alert('Failed to create pastor')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPastors = pastors.filter(pastor => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      (pastor.name && pastor.name.toLowerCase().includes(searchLower)) || 
      (pastor.full_code && pastor.full_code.toLowerCase().includes(searchLower)) ||
      (pastor.contact && pastor.contact.toLowerCase().includes(searchLower))
    
    const matchesZone = zoneFilter === 'all' || pastor.zone_id === zoneFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && pastor.is_active) ||
      (statusFilter === 'inactive' && !pastor.is_active)
    
    return matchesSearch && matchesZone && matchesStatus
  })

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId)
    return zone?.name || 'Unknown'
  }

  const handleViewQR = (pastor: Pastor) => {
    setShowQRModal(pastor)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading pastors...</div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>👤 Pastors</h1>
        <div className="page-header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            ➕ Register Pastor
          </button>
        </div>
      </div>

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
              {filteredPastors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No pastors found. Register your first pastor to get started.
                  </td>
                </tr>
              ) : (
                filteredPastors.map((pastor) => (
                  <tr key={pastor.id}>
                    <td>
                      <strong>{pastor.full_code}</strong>
                    </td>
                    <td>{pastor.name}</td>
                    <td>{getZoneName(pastor.zone_id)}</td>
                    <td>{pastor.contact || '-'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{pastor.email || '-'}</td>
                    <td>
                      <span className={`status-badge ${pastor.is_active ? 'active' : 'inactive'}`}>
                        {pastor.is_active ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </td>
                    <td>{new Date(pastor.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Link href={`/dashboard/pastors/${pastor.full_code}`} className="btn btn-sm btn-outline">
                        View
                      </Link>
                      {pastor.qr_code_url && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleViewQR(pastor)}>
                          QR
                        </button>
                      )}
                      <Link href={`/dashboard/transfers?person=${pastor.full_code}`} className="btn btn-sm btn-outline">
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
        Showing {filteredPastors.length} of {pastors.length} pastors
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
              <h3 className="card-title">Register New Pastor</h3>
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
                  placeholder="e.g., Pastor John Moyo"
                  value={newPastor.name}
                  onChange={(e) => setNewPastor({ ...newPastor, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., +263 77 123 4567"
                  value={newPastor.contact}
                  onChange={(e) => setNewPastor({ ...newPastor, contact: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g., john.moyo@him.org"
                  value={newPastor.email}
                  onChange={(e) => setNewPastor({ ...newPastor, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={newPastor.gender}
                  onChange={(e) => setNewPastor({ ...newPastor, gender: e.target.value })}
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
                  value={newPastor.zone_id}
                  onChange={(e) => setNewPastor({ ...newPastor, zone_id: e.target.value })}
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
              <button className="btn btn-primary" onClick={handleAddPastor} disabled={submitting}>
                {submitting ? 'Registering...' : 'Register Pastor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showQRModal && (
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">QR Code</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowQRModal(null)}>
                ✕
              </button>
            </div>
            {showQRModal.qr_code_url ? (
              <div className="text-center">
                <div className="mx-auto mb-4 w-48 h-48 relative">
                  <Image 
                    src={showQRModal.qr_code_url} 
                    alt={`QR Code for ${showQRModal.full_code}`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p className="font-mono font-bold text-lg">{showQRModal.full_code}</p>
                <p className="text-gray-600">{showQRModal.name}</p>
              </div>
            ) : (
              <p className="text-center text-gray-500">No QR code available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
