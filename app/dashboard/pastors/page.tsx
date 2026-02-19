'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for pastors
const initialPastors = [
  { id: 1, code: 'R01001P01', name: 'Pastor John Moyo', zone: 'Harare Central', phone: '+263 77 123 4567', email: 'john.moyo@him.org', status: 'active', joinedDate: '2020-01-15' },
  { id: 2, code: 'R01002P01', name: 'Pastor Mary Ncube', zone: 'Harare East', phone: '+263 77 234 5678', email: 'mary.ncube@him.org', status: 'active', joinedDate: '2020-03-20' },
  { id: 3, code: 'R01003P01', name: 'Pastor Peter Dube', zone: 'Harare West', phone: '+263 77 345 6789', email: 'peter.dube@him.org', status: 'active', joinedDate: '2020-06-10' },
  { id: 4, code: 'R02001P01', name: 'Pastor Samuel Ndlovu', zone: 'Bulawayo Central', phone: '+263 77 456 7890', email: 'samuel.ndlovu@him.org', status: 'active', joinedDate: '2021-02-05' },
  { id: 5, code: 'R02002P01', name: 'Pastor David Moyo', zone: 'Bulawayo North', phone: '+263 77 567 8901', email: 'david.moyo@him.org', status: 'transferred', joinedDate: '2021-05-15' },
  { id: 6, code: 'R03001P01', name: 'Pastor Joseph Magaya', zone: 'Mutare Central', phone: '+263 77 678 9012', email: 'joseph.magaya@him.org', status: 'active', joinedDate: '2021-08-20' },
  { id: 7, code: 'R04001P01', name: 'Pastor Brighton Chiromo', zone: 'Gweru Central', phone: '+263 77 789 0123', email: 'brighton.chiromo@him.org', status: 'active', joinedDate: '2022-01-10' },
  { id: 8, code: 'R01001P02', name: 'Pastor Ruth Mutendi', zone: 'Harare Central', phone: '+263 77 890 1234', email: 'ruth.mutendi@him.org', status: 'retired', joinedDate: '2019-06-01' },
]

export default function PastorsPage() {
  const [pastors, setPastors] = useState(initialPastors)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPastor, setNewPastor] = useState({ name: '', phone: '', email: '', zone: '' })

  const filteredPastors = pastors.filter(pastor => {
    const matchesSearch = pastor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pastor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pastor.phone.includes(searchTerm)
    const matchesZone = zoneFilter === 'all' || pastor.zone === zoneFilter
    const matchesStatus = statusFilter === 'all' || pastor.status === statusFilter
    return matchesSearch && matchesZone && matchesStatus
  })

  const handleAddPastor = () => {
    if (newPastor.name && newPastor.phone && newPastor.zone) {
      const newId = Math.max(...pastors.map(p => p.id)) + 1
      const code = `R01${String(newId).padStart(3, '0')}P${String(pastors.length + 1).padStart(2, '0')}`
      setPastors([...pastors, {
        id: newId,
        code,
        name: newPastor.name,
        zone: newPastor.zone,
        phone: newPastor.phone,
        email: newPastor.email || `${newPastor.name.toLowerCase().replace(' ', '.')}@him.org`,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0]
      }])
      setNewPastor({ name: '', phone: '', email: '', zone: '' })
      setShowAddModal(false)
    }
  }

  const zones = ['Harare Central', 'Harare East', 'Harare West', 'Bulawayo Central', 'Bulawayo North', 'Mutare Central', 'Gweru Central']

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>👤 Pastors</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ Register Pastor
          </button>
        </div>
      </div>

      {/* Filters */}
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
          {zones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <select 
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="transferred">Transferred</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      {/* Pastors Table */}
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
              {filteredPastors.map((pastor) => (
                <tr key={pastor.id}>
                  <td>
                    <strong>{pastor.code}</strong>
                  </td>
                  <td>{pastor.name}</td>
                  <td>{pastor.zone}</td>
                  <td>{pastor.phone}</td>
                  <td style={{ fontSize: '0.8rem' }}>{pastor.email}</td>
                  <td>
                    <span className={`status-badge ${pastor.status}`}>
                      {pastor.status === 'active' ? '🟢 Active' : 
                       pastor.status === 'transferred' ? '🔄 Transferred' : 
                       pastor.status === 'retired' ? '⚫ Retired' : '🟡 Pending'}
                    </span>
                  </td>
                  <td>{pastor.joinedDate}</td>
                  <td className="actions">
                    <Link href={`/dashboard/pastors/${pastor.code}`} className="btn btn-sm btn-outline">
                      View
                    </Link>
                    <Link href={`/dashboard/transfers?person=${pastor.code}`} className="btn btn-sm btn-outline">
                      Transfer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Pastor Modal */}
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
              <button 
                className="btn btn-icon btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Pastor John Moyo"
                  value={newPastor.name}
                  onChange={(e) => setNewPastor({ ...newPastor, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., +263 77 123 4567"
                  value={newPastor.phone}
                  onChange={(e) => setNewPastor({ ...newPastor, phone: e.target.value })}
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
                <label className="form-label">Zone</label>
                <select
                  className="form-select"
                  value={newPastor.zone}
                  onChange={(e) => setNewPastor({ ...newPastor, zone: e.target.value })}
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddPastor}>
                Register Pastor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
