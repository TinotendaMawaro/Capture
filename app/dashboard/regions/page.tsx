'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for regions
const initialRegions = [
  { id: 1, code: 'R01', name: 'Harare Region', zonesCount: 45, pastorsCount: 52, deaconsCount: 180, status: 'active', createdDate: '2020-01-15' },
  { id: 2, code: 'R02', name: 'Bulawayo Region', zonesCount: 32, pastorsCount: 38, deaconsCount: 145, status: 'active', createdDate: '2020-02-20' },
  { id: 3, code: 'R03', name: 'Mutare Region', zonesCount: 18, pastorsCount: 22, deaconsCount: 86, status: 'active', createdDate: '2021-03-10' },
  { id: 4, code: 'R04', name: 'Gweru Region', zonesCount: 15, pastorsCount: 16, deaconsCount: 72, status: 'active', createdDate: '2021-06-05' },
  { id: 5, code: 'R05', name: 'Masvingo Region', zonesCount: 14, pastorsCount: 12, deaconsCount: 77, status: 'pending', createdDate: '2022-01-20' },
]

export default function RegionsPage() {
  const [regions, setRegions] = useState(initialRegions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRegion, setNewRegion] = useState({ name: '', code: '' })

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          region.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || region.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddRegion = () => {
    if (newRegion.name && newRegion.code) {
      const newId = Math.max(...regions.map(r => r.id)) + 1
      setRegions([...regions, {
        id: newId,
        code: newRegion.code,
        name: newRegion.name,
        zonesCount: 0,
        pastorsCount: 0,
        deaconsCount: 0,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0]
      }])
      setNewRegion({ name: '', code: '' })
      setShowAddModal(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🌍 Regions</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ Add Region
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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

      {/* Regions Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Region Code</th>
                <th>Region Name</th>
                <th>Zones</th>
                <th>Pastors</th>
                <th>Deacons</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions.map((region) => (
                <tr key={region.id}>
                  <td>
                    <strong>{region.code}</strong>
                  </td>
                  <td>{region.name}</td>
                  <td>
                    <Link href={`/dashboard/zones?region=${region.code}`} style={{ color: 'var(--color-primary)' }}>
                      {region.zonesCount}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/dashboard/pastors?region=${region.code}`} style={{ color: 'var(--color-primary)' }}>
                      {region.pastorsCount}
                    </Link>
                  </td>
                  <td>{region.deaconsCount}</td>
                  <td>
                    <span className={`status-badge ${region.status}`}>
                      {region.status === 'active' ? '🟢 Active' : 
                       region.status === 'pending' ? '🟡 Pending' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td>{region.createdDate}</td>
                  <td className="actions">
                    <Link href={`/dashboard/regions/${region.code}`} className="btn btn-sm btn-outline">
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
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
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
                <label className="form-label">Region Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., R06"
                  value={newRegion.code}
                  onChange={(e) => setNewRegion({ ...newRegion, code: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Region Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Kwekwe Region"
                  value={newRegion.name}
                  onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                />
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddRegion}>
                Add Region
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
