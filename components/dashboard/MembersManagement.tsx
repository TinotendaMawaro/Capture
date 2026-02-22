'use client'

/**
 * Church Members Management Component
 * Displays list of church members with CRUD operations
 */

import React, { useEffect, useState } from 'react'
import { QRCodeCard } from '../qr/QRCodeCard'

interface Member {
  id: string
  full_code: string
  zone_id: string
  zone_name?: string
  region_name?: string
  name: string
  contact?: string
  email?: string
  date_of_birth?: string
  gender?: string
  membership_date?: string
  department_id?: string
  department_name?: string
  qr_code_url?: string
  is_active: boolean
  created_at: string
}

interface Zone {
  id: string
  name: string
  full_code: string
}

interface Department {
  id: string
  name: string
  full_code: string
}

export const MembersManagement = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [filterZone, setFilterZone] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [formData, setFormData] = useState({
    zone_id: '',
    name: '',
    contact: '',
    email: '',
    date_of_birth: '',
    gender: 'Male',
    membership_date: new Date().toISOString().split('T')[0],
    department_id: ''
  })

  useEffect(() => {
    loadMembers()
    loadZones()
    loadDepartments()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/members')
      const data = await response.json()

      if (data.success) {
        setMembers(data.data || [])
      } else {
        setError(data.error || 'Failed to load members')
      }
    } catch (err) {
      setError('Error loading members')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadZones = async () => {
    try {
      const response = await fetch('/api/zones')
      const data = await response.json()

      if (data.success) {
        setZones(data.data || [])
      }
    } catch (err) {
      console.error('Error loading zones:', err)
    }
  }

  const loadDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const data = await response.json()

      if (data.success) {
        setDepartments(data.data || [])
      }
    } catch (err) {
      console.error('Error loading departments:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.zone_id || !formData.name) {
      setError('Zone and Name are required')
      return
    }

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setFormData({
          zone_id: '',
          name: '',
          contact: '',
          email: '',
          date_of_birth: '',
          gender: 'Male',
          membership_date: new Date().toISOString().split('T')[0],
          department_id: ''
        })
        setShowForm(false)
        await loadMembers()
      } else {
        setError(data.error || 'Failed to create member')
      }
    } catch (err) {
      setError('Error creating member')
      console.error(err)
    }
  }

  let filteredMembers = members
  if (filterZone) {
    filteredMembers = filteredMembers.filter(m => m.zone_id === filterZone)
  }
  if (filterDepartment) {
    filteredMembers = filteredMembers.filter(m => m.department_id === filterDepartment)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">👥 Members Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? '✕ Cancel' : '+ Add Member'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterZone}
          onChange={(e) => setFilterZone(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Zones</option>
          {zones.map(z => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Add Member Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border border-gray-300 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.zone_id}
              onChange={(e) => setFormData({ ...formData, zone_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Zone</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name} ({z.full_code})</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="tel"
              placeholder="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              value={formData.membership_date}
              onChange={(e) => setFormData({ ...formData, membership_date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department (Optional)</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Member
          </button>
        </form>
      )}

      {/* Members Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No members found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Zone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{member.full_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.zone_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.department_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.contact}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedMember(member)
                        setShowQRModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      📱 QR Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">QR Code - {selectedMember.full_code}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {selectedMember.qr_code_url && (
                <QRCodeCard
                  fullCode={selectedMember.full_code}
                  name={selectedMember.name}
                  zone={selectedMember.zone_name || ''}
                  region={selectedMember.region_name || ''}
                  contact={selectedMember.contact}
                  qrCodeUrl={selectedMember.qr_code_url}
                  entityType="Member"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MembersManagement
