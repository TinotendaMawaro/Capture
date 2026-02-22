/**
 * Zones Management Component
 * CRUD operations for zones with map integration
 */

'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface Region {
  id: string
  name: string
  region_code: string
}

interface Zone {
  id: string
  full_code: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  contact_person: string
  contact_email: string
  contact_phone: string
  regions: { id: string; name: string; region_code: string }
}

interface FormData {
  zone_number: number
  region_id: string
  name: string
  address: string
  city: string
  latitude: string
  longitude: string
  contact_person: string
  contact_email: string
  contact_phone: string
}

export const ZonesManagement = () => {
  const [zones, setZones] = useState<Zone[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')

  const [formData, setFormData] = useState<FormData>({
    zone_number: 1,
    region_id: '',
    name: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    contact_person: '',
    contact_email: '',
    contact_phone: ''
  })

  const loadZones = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        selectedRegion ? `/api/zones?region_id=${selectedRegion}` : '/api/zones'
      )
      const data = await response.json()
      setZones(data.data || [])
    } catch (err) {
      setError('Failed to load zones')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedRegion])

  const loadRegions = useCallback(async () => {
    try {
      const response = await fetch('/api/regions')
      const data = await response.json()
      setRegions(data.data || [])
      if (data.data?.length > 0 && !formData.region_id) {
        setFormData(prev => ({ ...prev, region_id: data.data[0].id }))
      }
    } catch (err) {
      console.error('Failed to load regions:', err)
    }
  }, [formData.region_id])

  useEffect(() => {
    loadZones()
    loadRegions()
  }, [loadZones, loadRegions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create zone')

      await loadZones()
      setOpenForm(false)
      setFormData({
        zone_number: 1,
        region_id: regions[0]?.id || '',
        name: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
        contact_person: '',
        contact_email: '',
        contact_phone: ''
      })
    } catch (err) {
      setError('Failed to create zone')
      console.error(err)
    }
  }

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.full_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Zones Management</h2>
        <button
          onClick={() => setOpenForm(!openForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {openForm ? 'Cancel' : 'Add Zone'}
        </button>
      </div>

      {/* Create Form */}
      {openForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region *
                </label>
                <select
                  value={formData.region_id}
                  onChange={e =>
                    setFormData({ ...formData, region_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zone Number *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.zone_number}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      zone_number: parseInt(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zone Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={e =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={e =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={formData.latitude}
                  onChange={e =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={formData.longitude}
                  onChange={e =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={e =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Zone
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search zones..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedRegion}
          onChange={e => {
            setSelectedRegion(e.target.value)
            if (e.target.value) {
              fetch(`/api/zones?region_id=${e.target.value}`)
                .then(r => r.json())
                .then(d => setZones(d.data || []))
            } else {
              loadZones()
            }
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Regions</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading zones...</div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  City
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredZones.map(zone => (
                <tr key={zone.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {zone.full_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{zone.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {zone.regions?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {zone.city}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {zone.contact_phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ZonesManagement
