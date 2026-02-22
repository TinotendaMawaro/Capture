'use client'

/**
 * Regions Management Component
 * Displays list of regions with CRUD operations
 */

import React, { useEffect, useState } from 'react'

interface Region {
  id: string
  region_code: string
  name: string
  country: string
  description?: string
  zone_count?: number
  pastor_count?: number
  created_at: string
}

export const RegionsManagement = () => {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    region_code: '',
    name: '',
    country: '',
    description: ''
  })

  useEffect(() => {
    loadRegions()
  }, [])

  const loadRegions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/regions')
      const data = await response.json()

      if (data.success) {
        setRegions(data.data || [])
      } else {
        setError(data.error || 'Failed to load regions')
      }
    } catch (err) {
      setError('Error loading regions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.region_code || !formData.name || !formData.country) {
      setError('All fields are required')
      return
    }

    try {
      const response = await fetch('/api/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setFormData({ region_code: '', name: '', country: '', description: '' })
        setShowForm(false)
        await loadRegions()
      } else {
        setError(data.error || 'Failed to create region')
      }
    } catch (err) {
      setError('Error creating region')
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">📍 Regions Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? '✕ Cancel' : '+ Add Region'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Region Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border border-gray-300 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Region Code (e.g., ZW01)"
              value={formData.region_code}
              onChange={(e) => setFormData({ ...formData, region_code: e.target.value.toUpperCase() })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Region Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Region
          </button>
        </form>
      )}

      {/* Regions Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading regions...</div>
      ) : regions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No regions found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Country</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Zones</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pastors</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {regions.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{region.region_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{region.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{region.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{region.zone_count || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{region.pastor_count || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(region.created_at).toLocaleDateString()}
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

export default RegionsManagement
