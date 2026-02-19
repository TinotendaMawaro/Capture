'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for zones
const initialZones = [
  { id: 1, code: 'R01001', name: 'Harare Central', region: 'Harare Region', pastor: 'Pastor John Moyo', members: 250, status: 'active' },
  { id: 2, code: 'R01002', name: 'Harare East', region: 'Harare Region', pastor: 'Pastor Mary Ncube', members: 180, status: 'active' },
  { id: 3, code: 'R01003', name: 'Harare West', region: 'Harare Region', pastor: 'Pastor Peter Dube', members: 165, status: 'active' },
  { id: 4, code: 'R02001', name: 'Bulawayo Central', region: 'Bulawayo Region', pastor: 'Pastor Samuel Ndlovu', members: 220, status: 'active' },
  { id: 5, code: 'R02002', name: 'Bulawayo North', region: 'Bulawayo Region', pastor: 'Pastor David Moyo', members: 145, status: 'pending' },
  { id: 6, code: 'R03001', name: 'Mutare Central', region: 'Mutare Region', pastor: 'Pastor Joseph Magaya', members: 120, status: 'active' },
  { id: 7, code: 'R04001', name: 'Gweru Central', region: 'Gweru Region', pastor: 'Pastor Brighton Chiromo', members: 95, status: 'active' },
  { id: 8, code: 'R05001', name: 'Masvingo Central', region: 'Masvingo Region', pastor: 'Pastor Michael Zhou', members: 88, status: 'inactive' },
]

export default function ZonesPage() {
  const [zones, setZones] = useState(initialZones)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newZone, setNewZone] = useState({ name: '', code: '', region: '' })

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          zone.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          zone.pastor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === 'all' || zone.region === regionFilter
    const matchesStatus = statusFilter === 'all' || zone.status === statusFilter
    return matchesSearch && matchesRegion && matchesStatus
  })

  const handleAddZone = () => {
    if (newZone.name && newZone.code && newZone.region) {
      const newId = Math.max(...zones.map(z => z.id)) + 1
      setZones([...zones, {
        id: newId,
        code: newZone.code,
        name: newZone.name,
        region: newZone.region,
        pastor: 'Not Assigned',
        members: 0,
        status: 'pending'
      }])
      setNewZone({ name: '', code: '', region: '' })
      setShowAddModal(false)
    }
  }

  const regions = ['Harare Region', 'Bulawayo Region', 'Mutare Region', 'Gweru Region', 'Masvingo Region']

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>⛪ Zones</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ Add Zone
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, code, or pastor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-select"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="all">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select 
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
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
                <th>Pastor</th>
                <th>Members</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredZones.map((zone) => (
                <tr key={zone.id}>
                  <td>
                    <strong>{zone.code}</strong>
                  </td>
                  <td>{zone.name}</td>
                  <td>{zone.region}</td>
                  <td>{zone.pastor}</td>
                  <td>{zone.members}</td>
                  <td>
                    <span className={`status-badge ${zone.status}`}>
                      {zone.status === 'active' ? '🟢 Active' : 
                       zone.status === 'pending' ? '🟡 Pending' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link href={`/dashboard/zones/${zone.code}`} className="btn btn-sm btn-outline">
                      View
                    </Link>
                    <button className="btn btn-sm btn-outline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
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
                <label className="form-label">Zone Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., R06001"
                  value={newZone.code}
                  onChange={(e) => setNewZone({ ...newZone, code: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Zone Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Chitungwiza Central"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Region</label>
                <select
                  className="form-select"
                  value={newZone.region}
                  onChange={(e) => setNewZone({ ...newZone, region: e.target.value })}
                >
                  <option value="">Select Region</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddZone}>
                Add Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
