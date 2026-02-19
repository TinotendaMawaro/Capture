'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for deacons
const initialDeacons = [
  { id: 1, code: 'R01001D01', name: 'Deacon Paul Mhandu', zone: 'Harare Central', phone: '+263 77 111 2222', position: 'Head Deacon', status: 'active', joinedDate: '2020-05-10' },
  { id: 2, code: 'R01001D02', name: 'Deacon Ruth Jera', zone: 'Harare Central', phone: '+263 77 222 3333', position: 'Treasurer', status: 'active', joinedDate: '2020-08-15' },
  { id: 3, code: 'R01002D01', name: 'Deacon Sarah Mpofu', zone: 'Harare East', phone: '+263 77 333 4444', position: 'Head Deacon', status: 'active', joinedDate: '2021-01-20' },
  { id: 4, code: 'R01002D02', name: 'Deacon Michael Ncube', zone: 'Harare East', phone: '+263 77 444 5555', position: 'Secretary', status: 'active', joinedDate: '2021-03-25' },
  { id: 5, code: 'R01003D01', name: 'Deacon Peter Jera', zone: 'Harare West', phone: '+263 77 555 6666', position: 'Head Deacon', status: 'active', joinedDate: '2021-06-10' },
  { id: 6, code: 'R02001D01', name: 'Deacon John Dube', zone: 'Bulawayo Central', phone: '+263 77 666 7777', position: 'Head Deacon', status: 'active', joinedDate: '2021-09-15' },
  { id: 7, code: 'R02002D01', name: 'Deacon Mary Ndlovu', zone: 'Bulawayo North', phone: '+263 77 777 8888', position: 'Head Deacon', status: 'transferred', joinedDate: '2022-01-10' },
  { id: 8, code: 'R03001D01', name: 'Deacon Joseph Moyo', zone: 'Mutare Central', phone: '+263 77 888 9999', position: 'Head Deacon', status: 'active', joinedDate: '2022-04-20' },
]

export default function DeaconsPage() {
  const [deacons, setDeacons] = useState(initialDeacons)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDeacon, setNewDeacon] = useState({ name: '', phone: '', zone: '', position: '' })

  const filteredDeacons = deacons.filter(deacon => {
    const matchesSearch = deacon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          deacon.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = zoneFilter === 'all' || deacon.zone === zoneFilter
    const matchesStatus = statusFilter === 'all' || deacon.status === statusFilter
    return matchesSearch && matchesZone && matchesStatus
  })

  const handleAddDeacon = () => {
    if (newDeacon.name && newDeacon.phone && newDeacon.zone) {
      const newId = Math.max(...deacons.map(d => d.id)) + 1
      const code = `R01${String(newId).padStart(3, '0')}D${String(deacons.length + 1).padStart(2, '0')}`
      setDeacons([...deacons, {
        id: newId,
        code,
        name: newDeacon.name,
        zone: newDeacon.zone,
        phone: newDeacon.phone,
        position: newDeacon.position || 'Member',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0]
      }])
      setNewDeacon({ name: '', phone: '', zone: '', position: '' })
      setShowAddModal(false)
    }
  }

  const zones = ['Harare Central', 'Harare East', 'Harare West', 'Bulawayo Central', 'Bulawayo North', 'Mutare Central', 'Gweru Central']

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🤝 Deacons</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ Register Deacon
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
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Deacons Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Zone</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeacons.map((deacon) => (
                <tr key={deacon.id}>
                  <td>
                    <strong>{deacon.code}</strong>
                  </td>
                  <td>{deacon.name}</td>
                  <td>{deacon.zone}</td>
                  <td>{deacon.phone}</td>
                  <td>{deacon.position}</td>
                  <td>
                    <span className={`status-badge ${deacon.status}`}>
                      {deacon.status === 'active' ? '🟢 Active' : 
                       deacon.status === 'transferred' ? '🔄 Transferred' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td>{deacon.joinedDate}</td>
                  <td className="actions">
                    <button className="btn btn-sm btn-outline">View</button>
                    <Link href={`/dashboard/transfers?person=${deacon.code}`} className="btn btn-sm btn-outline">
                      Transfer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Deacon Modal */}
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
                  placeholder="e.g., Deacon Paul Mhandu"
                  value={newDeacon.name}
                  onChange={(e) => setNewDeacon({ ...newDeacon, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., +263 77 111 2222"
                  value={newDeacon.phone}
                  onChange={(e) => setNewDeacon({ ...newDeacon, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Zone</label>
                <select
                  className="form-select"
                  value={newDeacon.zone}
                  onChange={(e) => setNewDeacon({ ...newDeacon, zone: e.target.value })}
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <select
                  className="form-select"
                  value={newDeacon.position}
                  onChange={(e) => setNewDeacon({ ...newDeacon, position: e.target.value })}
                >
                  <option value="">Select Position</option>
                  <option value="Head Deacon">Head Deacon</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Member">Member</option>
                </select>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddDeacon}>
                Register Deacon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
