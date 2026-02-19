'use client'

import { useState } from 'react'

// Mock data for departments
const initialDepartments = [
  { id: 1, name: 'Worship & Music', zone: 'Harare Central', leader: 'Pastor John Moyo', members: 45, status: 'active' },
  { id: 2, name: 'Children\'s Ministry', zone: 'Harare Central', leader: 'Sister Mary Ncube', members: 80, status: 'active' },
  { id: 3, name: 'Youth Ministry', zone: 'Harare East', leader: 'Brother David Moyo', members: 60, status: 'active' },
  { id: 4, name: 'Prayer Ministry', zone: 'Harare West', leader: 'Deacon Ruth Jera', members: 25, status: 'active' },
  { id: 5, name: 'Evangelism', zone: 'Bulawayo Central', leader: 'Pastor Samuel Ndlovu', members: 35, status: 'active' },
  { id: 6, name: 'Media & Technology', zone: 'Harare Central', leader: 'Brother Peter Dube', members: 15, status: 'active' },
  { id: 7, name: 'Health & Wellness', zone: 'Mutare Central', leader: 'Sister Grace Magaya', members: 20, status: 'inactive' },
  { id: 8, name: 'Education', zone: 'Gweru Central', leader: 'Pastor Brighton Chiromo', members: 30, status: 'active' },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDepartment, setNewDepartment] = useState({ name: '', zone: '', leader: '', members: 0 })

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.leader.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = zoneFilter === 'all' || dept.zone === zoneFilter
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter
    return matchesSearch && matchesZone && matchesStatus
  })

  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.zone && newDepartment.leader) {
      const newId = Math.max(...departments.map(d => d.id)) + 1
      setDepartments([...departments, {
        id: newId,
        ...newDepartment,
        members: newDepartment.members || 0,
        status: 'active'
      }])
      setNewDepartment({ name: '', zone: '', leader: '', members: 0 })
      setShowAddModal(false)
    }
  }

  const zones = ['Harare Central', 'Harare East', 'Harare West', 'Bulawayo Central', 'Bulawayo North', 'Mutare Central', 'Gweru Central', 'Masvingo Central']

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🏢 Departments</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ Add Department
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or leader..."
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
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Stats */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="kpi-card departments">
          <div className="kpi-icon">🏢</div>
          <div className="kpi-content">
            <div className="kpi-label">Total Departments</div>
            <div className="kpi-value">{departments.length}</div>
          </div>
        </div>
        <div className="kpi-card active">
          <div className="kpi-icon">✅</div>
          <div className="kpi-content">
            <div className="kpi-label">Active</div>
            <div className="kpi-value">{departments.filter(d => d.status === 'active').length}</div>
          </div>
        </div>
        <div className="kpi-card inactive">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <div className="kpi-label">Total Members</div>
            <div className="kpi-value">{departments.reduce((sum, d) => sum + d.members, 0)}</div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Zone</th>
                <th>Leader</th>
                <th>Members</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept.id}>
                  <td>
                    <strong>{dept.name}</strong>
                  </td>
                  <td>{dept.zone}</td>
                  <td>{dept.leader}</td>
                  <td>{dept.members}</td>
                  <td>
                    <span className={`status-badge ${dept.status}`}>
                      {dept.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn btn-sm btn-outline">View</button>
                    <button className="btn btn-sm btn-outline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Department Modal */}
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
              <h3 className="card-title">Add New Department</h3>
              <button 
                className="btn btn-icon btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Worship & Music"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Zone</label>
                <select
                  className="form-select"
                  value={newDepartment.zone}
                  onChange={(e) => setNewDepartment({ ...newDepartment, zone: e.target.value })}
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department Leader</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Pastor John Moyo"
                  value={newDepartment.leader}
                  onChange={(e) => setNewDepartment({ ...newDepartment, leader: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Members</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={newDepartment.members || ''}
                  onChange={(e) => setNewDepartment({ ...newDepartment, members: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddDepartment}>
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
