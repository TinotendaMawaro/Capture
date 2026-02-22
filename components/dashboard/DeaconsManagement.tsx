'use client'

/**
 * Deacons Management Component
 * Displays list of deacons with CRUD operations and QR code generation
 */

import React, { useEffect, useState } from 'react'
import { QRCodeCard } from '../qr/QRCodeCard'

interface Deacon {
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
  qr_code_url?: string
  is_active: boolean
  created_at: string
}

interface Zone {
  id: string
  name: string
  full_code: string
}

export const DeaconsManagement = () => {
  const [deacons, setDeacons] = useState<Deacon[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedDeacon, setSelectedDeacon] = useState<Deacon | null>(null)
  const [filterZone, setFilterZone] = useState('')
  const [formData, setFormData] = useState({
    zone_id: '',
    name: '',
    contact: '',
    email: '',
    date_of_birth: '',
    gender: 'Male'
  })

  useEffect(() => {
    loadDeacons()
    loadZones()
  }, [])

  const loadDeacons = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/deacons')
      const data = await response.json()

      if (data.success) {
        setDeacons(data.data || [])
      } else {
        setError(data.error || 'Failed to load deacons')
      }
    } catch (err) {
      setError('Error loading deacons')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.zone_id || !formData.name) {
      setError('Zone and Name are required')
      return
    }

    try {
      const response = await fetch('/api/deacons', {
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
          gender: 'Male'
        })
        setShowForm(false)
        await loadDeacons()
      } else {
        setError(data.error || 'Failed to create deacon')
      }
    } catch (err) {
      setError('Error creating deacon')
      console.error(err)
    }
  }

  const filteredDeacons = filterZone
    ? deacons.filter(d => d.zone_id === filterZone)
    : deacons

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">🙏 Deacons Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? '✕ Cancel' : '+ Add Deacon'}
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
      </div>

      {/* Add Deacon Form */}
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
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Deacon
          </button>
        </form>
      )}

      {/* Deacons Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading deacons...</div>
      ) : filteredDeacons.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No deacons found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Zone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDeacons.map((deacon) => (
                <tr key={deacon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{deacon.full_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{deacon.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{deacon.zone_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{deacon.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{deacon.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      deacon.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deacon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedDeacon(deacon)
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
      {showQRModal && selectedDeacon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">QR Code - {selectedDeacon.full_code}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {selectedDeacon.qr_code_url && (
                <QRCodeCard
                  fullCode={selectedDeacon.full_code}
                  name={selectedDeacon.name}
                  zone={selectedDeacon.zone_name || ''}
                  region={selectedDeacon.region_name || ''}
                  contact={selectedDeacon.contact}
                  qrCodeUrl={selectedDeacon.qr_code_url}
                  entityType="Deacon"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeaconsManagement
