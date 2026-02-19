'use client'

import { useState } from 'react'

// Mock user data
const initialUsers = [
  { id: 1, name: 'Pastor Admin', email: 'admin@him.org', role: 'Super Admin', region: 'All Regions', status: 'active', lastLogin: '2024-01-20 10:30' },
  { id: 2, name: 'Regional Pastor John', email: 'john@him.org', role: 'Regional Admin', region: 'Harare Region', status: 'active', lastLogin: '2024-01-19 14:20' },
  { id: 3, name: 'Regional Pastor Mary', email: 'mary@him.org', role: 'Regional Admin', region: 'Bulawayo Region', status: 'active', lastLogin: '2024-01-18 09:15' },
  { id: 4, name: 'Zone Pastor Peter', email: 'peter@him.org', role: 'Zone Admin', region: 'Harare East', status: 'active', lastLogin: '2024-01-20 08:45' },
  { id: 5, name: 'Accountant Samuel', email: 'samuel@him.org', role: 'Viewer', region: 'All Regions', status: 'active', lastLogin: '2024-01-17 16:30' },
  { id: 6, name: 'Secretary Ruth', email: 'ruth@him.org', role: 'Viewer', region: 'Harare Region', status: 'inactive', lastLogin: '2023-12-10 11:00' },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', region: '' })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const newId = Math.max(...users.map(u => u.id)) + 1
      setUsers([...users, {
        id: newId,
        ...newUser,
        region: newUser.region || 'All Regions',
        status: 'active',
        lastLogin: 'Never'
      }])
      setNewUser({ name: '', email: '', role: '', region: '' })
      setShowAddModal(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return { bg: 'rgba(214, 158, 46, 0.1)', color: '#b7791f' }
      case 'Regional Admin': return { bg: 'rgba(49, 130, 206, 0.1)', color: '#2b6cb0' }
      case 'Zone Admin': return { bg: 'rgba(56, 161, 105, 0.1)', color: '#276749' }
      case 'Viewer': return { bg: 'rgba(160, 174, 192, 0.1)', color: '#4a5568' }
      default: return { bg: 'rgba(160, 174, 192, 0.1)', color: '#4a5568' }
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🔐 User Management</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Regional Admin">Regional Admin</option>
          <option value="Zone Admin">Zone Admin</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Region</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleStyle = getRoleBadgeColor(user.role)
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: roleStyle.bg,
                        color: roleStyle.color
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.region}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{user.lastLogin}</td>
                    <td className="actions">
                      <button className="btn btn-sm btn-outline">Edit</button>
                      <button className="btn btn-sm btn-outline" style={{ color: user.status === 'active' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                        {user.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
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
              <h3 className="card-title">Add New User</h3>
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
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g., john@him.org"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Regional Admin">Regional Admin</option>
                  <option value="Zone Admin">Zone Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Region Access</label>
                <select
                  className="form-select"
                  value={newUser.region}
                  onChange={(e) => setNewUser({ ...newUser, region: e.target.value })}
                >
                  <option value="">Select Region</option>
                  <option value="All Regions">All Regions</option>
                  <option value="Harare Region">Harare Region</option>
                  <option value="Bulawayo Region">Bulawayo Region</option>
                  <option value="Mutare Region">Mutare Region</option>
                </select>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
