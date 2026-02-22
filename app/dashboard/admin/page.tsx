'use client'

/**
 * Admin Dashboard - Comprehensive Ministry Management
 * Production-ready with Region/Zone selection and Create modals
 * National Scale: R + region(2) + zone(2) + role + number
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(
  () => import('@/components/map/MapComponent'),
  { ssr: false, loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div> }
)

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface DashboardStats {
  totalRegions: number
  totalZones: number
  totalPastors: number
  totalDeacons: number
  totalDepartments: number
  totalMembers: number
}

interface Region {
  id: string
  region_code: string
  name: string
  country: string
}

interface Zone {
  id: string
  region_id: string
  full_code: string
  name: string
  city?: string
  latitude?: number
  longitude?: number
  contact_person?: string
  contact_phone?: string
}

interface Pastor {
  id: string
  full_code: string
  name: string
  zone_id: string
  contact?: string
  email?: string
  gender?: string
  is_active: boolean
  qr_code_url?: string
}

interface Deacon {
  id: string
  full_code: string
  name: string
  zone_id: string
  contact?: string
  email?: string
  gender?: string
  is_active: boolean
  qr_code_url?: string
}

interface Department {
  id: string
  full_code: string
  name: string
  description?: string
  zone_id: string
  hod_id?: string
}

interface ChurchMember {
  id: string
  full_code: string
  name: string
  zone_id: string
  contact?: string
  email?: string
  is_active: boolean
  qr_code_url?: string
}

interface ActivityLog {
  id: string
  action: string
  entity_type: string
  entity_name?: string
  user_name?: string
  is_successful: boolean
  created_at: string
}

interface MapZone {
  id: string
  name: string
  latitude: number
  longitude: number
  full_code: string
  region?: string
}

// Type for people (used in renderPeople)
interface Person {
  id: string
  full_code: string
  name: string
  zone_id: string
  contact?: string
  email?: string
  gender?: string
  is_active: boolean
  qr_code_url?: string
}

// ============================================================================
// Main Component
// ============================================================================

type ViewType = 'overview' | 'regions' | 'zones' | 'departments' | 'pastors' | 'deacons' | 'members' | 'map' | 'audit'

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [stats, setStats] = useState<DashboardStats>({
    totalRegions: 0,
    totalZones: 0,
    totalPastors: 0,
    totalDeacons: 0,
    totalDepartments: 0,
    totalMembers: 0
  })
  
  // Data states
  const [regions, setRegions] = useState<Region[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [pastors, setPastors] = useState<Pastor[]>([])
  const [deacons, setDeacons] = useState<Deacon[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [members, setMembers] = useState<ChurchMember[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  
  // UI states
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showQRModal, setShowQRModal] = useState<{full_code: string; name: string; qr_code_url?: string} | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('all')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<'pastor' | 'deacon' | null>(null)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  
  // Form states
  const [selectedZoneId, setSelectedZoneId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    gender: 'Male'
  })

  // ========================================================================
  // Lookup maps
  // ========================================================================
  const zoneMap = useMemo(() => {
    const map: Record<string, Zone> = {}
    zones.forEach(z => { map[z.id] = z })
    return map
  }, [zones])

  const regionMap = useMemo(() => {
    const map: Record<string, Region> = {}
    regions.forEach(r => { map[r.id] = r })
    return map
  }, [regions])

  const zoneToRegionMap = useMemo(() => {
    const map: Record<string, string> = {}
    zones.forEach(z => { map[z.id] = z.region_id })
    return map
  }, [zones])

  // Filter zones by selected region
  const filteredZonesByRegion = useMemo(() => {
    if (selectedRegion === 'all') return zones
    return zones.filter(z => z.region_id === selectedRegion)
  }, [zones, selectedRegion])

  const mapZones = useMemo((): MapZone[] => 
    zones
      .filter(z => z.latitude !== null && z.latitude !== undefined && z.longitude !== null && z.longitude !== undefined)
      .map(z => ({
        id: z.id,
        name: z.name,
        latitude: Number(z.latitude),
        longitude: Number(z.longitude),
        full_code: z.full_code,
        region: regionMap[z.region_id]?.name
      })),
    [zones, regionMap]
  )

  // ========================================================================
  // Filtered data
  // ========================================================================
  const filteredZones = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return zones.filter(z => 
      (selectedRegion === 'all' || z.region_id === selectedRegion) &&
      (s === '' || z.name.toLowerCase().includes(s) || z.full_code.toLowerCase().includes(s))
    )
  }, [zones, selectedRegion, searchTerm])

  const filteredDepartments = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return departments.filter(d => 
      s === '' || d.name.toLowerCase().includes(s) || d.full_code.toLowerCase().includes(s)
    )
  }, [departments, searchTerm])

  const filteredPastors = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return pastors.filter(p => 
      (s === '' || p.name.toLowerCase().includes(s) || p.full_code.toLowerCase().includes(s)) &&
      (selectedRegion === 'all' || zoneToRegionMap[p.zone_id] === selectedRegion)
    )
  }, [pastors, searchTerm, selectedRegion, zoneToRegionMap])

  const filteredDeacons = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return deacons.filter(d => 
      (s === '' || d.name.toLowerCase().includes(s) || d.full_code.toLowerCase().includes(s)) &&
      (selectedRegion === 'all' || zoneToRegionMap[d.zone_id] === selectedRegion)
    )
  }, [deacons, searchTerm, selectedRegion, zoneToRegionMap])

  const filteredMembers = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return members.filter(m => 
      (s === '' || m.name.toLowerCase().includes(s) || m.full_code.toLowerCase().includes(s)) &&
      (selectedRegion === 'all' || zoneToRegionMap[m.zone_id] === selectedRegion)
    )
  }, [members, searchTerm, selectedRegion, zoneToRegionMap])

  const filteredLogs = useMemo(() => {
    const s = searchTerm.toLowerCase()
    return activityLogs.filter(log =>
      s === '' ||
      log.entity_name?.toLowerCase().includes(s) ||
      log.entity_type.toLowerCase().includes(s) ||
      log.action.toLowerCase().includes(s)
    )
  }, [activityLogs, searchTerm])

  // ============================================================================
  // Data Loading
  // ============================================================================

  const loadAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [regionsRes, zonesRes, pastorsRes, deaconsRes, deptsRes, membersRes, logsRes] = await Promise.all([
        fetch('/api/regions'),
        fetch('/api/zones'),
        fetch('/api/pastors'),
        fetch('/api/deacons'),
        fetch('/api/departments'),
        fetch('/api/members'),
        fetch('/api/activity-log?limit=100')
      ])

      const [regionsData, zonesData, pastorsData, deaconsData, deptsData, membersData, logsData] = await Promise.all([
        regionsRes.json(),
        zonesRes.json(),
        pastorsRes.json(),
        deaconsRes.json(),
        deptsRes.json(),
        membersRes.json(),
        logsRes.json()
      ])

      setRegions(regionsData.data || [])
      setZones(zonesData.data || [])
      setPastors(pastorsData.data || [])
      setDeacons(deaconsData.data || [])
      setDepartments(deptsData.data || [])
      setMembers(membersData.data || [])
      setActivityLogs(logsData.data || [])

      setStats({
        totalRegions: regionsData.count || 0,
        totalZones: zonesData.count || 0,
        totalPastors: pastorsData.count || 0,
        totalDeacons: deaconsData.count || 0,
        totalDepartments: deptsData.count || 0,
        totalMembers: membersData.count || 0
      })
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // ============================================================================
  // Form Handlers
  // ============================================================================

  const openCreateModal = (type: 'pastor' | 'deacon') => {
    setShowCreateModal(type)
    setFormData({ name: '', contact: '', email: '', gender: 'Male' })
    setSelectedZoneId('')
    setFormError('')
    setFormSuccess('')
  }

  const closeModal = () => {
    setShowCreateModal(null)
    setFormData({ name: '', contact: '', email: '', gender: 'Male' })
    setSelectedZoneId('')
    setFormError('')
    setFormSuccess('')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    
    if (!selectedZoneId) {
      setFormError('Please select a zone')
      return
    }
    
    if (!formData.name.trim()) {
      setFormError('Please enter a name')
      return
    }

    setCreating(true)

    try {
      const endpoint = showCreateModal === 'pastor' ? '/api/pastors' : '/api/deacons'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_id: selectedZoneId,
          name: formData.name.trim(),
          contact: formData.contact.trim(),
          email: formData.email.trim(),
          gender: formData.gender
        })
      })

      const result = await res.json()

      if (result.success) {
        setFormSuccess(`${showCreateModal === 'pastor' ? 'Pastor' : 'Deacon'} created: ${result.data.full_code}`)
        loadAllData()
        setTimeout(() => {
          closeModal()
        }, 2000)
      } else {
        setFormError(result.error || 'Failed to create')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setFormError(errorMessage)
    } finally {
      setCreating(false)
    }
  }

  // ============================================================================
  // Render Functions
  // ============================================================================

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">HIM Admin</h1>
        <p className="text-gray-400 text-sm">Ministry Management</p>
      </div>
      
      <nav className="space-y-2">
        {[
          { id: 'overview', icon: '📊', label: 'Dashboard' },
          { id: 'regions', icon: '🗺️', label: 'Regions' },
          { id: 'zones', icon: '📍', label: 'Zones' },
          { id: 'departments', icon: '🏢', label: 'Departments' },
          { id: 'pastors', icon: '👨‍💼', label: 'Pastors' },
          { id: 'deacons', icon: '🙏', label: 'Deacons' },
          { id: 'members', icon: '👥', label: 'Members' },
          { id: 'map', icon: '🗺', label: 'Live Map' },
          { id: 'audit', icon: '📋', label: 'Activity Logs' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as ViewType)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              currentView === item.id 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )

  const renderKPICards = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {[
        { title: 'Regions', value: stats.totalRegions, color: 'bg-blue-600', icon: '🗺️' },
        { title: 'Zones', value: stats.totalZones, color: 'bg-green-600', icon: '📍' },
        { title: 'Pastors', value: stats.totalPastors, color: 'bg-purple-600', icon: '👨‍💼' },
        { title: 'Deacons', value: stats.totalDeacons, color: 'bg-orange-600', icon: '🙏' },
        { title: 'Departments', value: stats.totalDepartments, color: 'bg-pink-600', icon: '🏢' },
        { title: 'Members', value: stats.totalMembers, color: 'bg-indigo-600', icon: '👥' },
      ].map((stat, idx) => (
        <div key={idx} className={`${stat.color} text-white rounded-lg p-4 shadow-lg`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</p>
            </div>
            <span className="text-2xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {renderKPICards()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📋 Recent Activity</h3>
          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <span className={`px-2 py-1 rounded text-xs ${
                  log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                  log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {log.action}
                </span>
                <span className="text-sm text-gray-600 flex-1">
                  {log.entity_type}: {log.entity_name || 'N/A'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(log.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {activityLogs.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Zones per Region</h3>
          <div className="space-y-3">
            {regions.slice(0, 5).map((region) => {
              const regionZones = zones.filter(z => z.region_id === region.id)
              return (
                <div key={region.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-sm text-gray-600">{regionZones.length} zones</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  const renderRegions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🗺️ Regions Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Region
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-right">Zones</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => {
              const regionZones = zones.filter(z => z.region_id === region.id)
              return (
                <tr key={region.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{region.region_code}</td>
                  <td className="px-4 py-3">{region.name}</td>
                  <td className="px-4 py-3">{region.country}</td>
                  <td className="px-4 py-3 text-right font-semibold">{regionZones.length}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderZones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📍 Zones Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Zone
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search zones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Regions</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Region</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-center">Map</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((zone) => {
              const region = regionMap[zone.region_id]
              return (
                <tr key={zone.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{zone.full_code}</td>
                  <td className="px-4 py-3">{zone.name}</td>
                  <td className="px-4 py-3">{region?.name || '-'}</td>
                  <td className="px-4 py-3">{zone.city || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    {zone.latitude && zone.longitude && <span className="text-green-600">✓</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🏢 Departments Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Department
        </button>
      </div>

      <input
        type="text"
        placeholder="Search departments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Zone</th>
              <th className="px-4 py-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => {
              const zone = zoneMap[dept.zone_id]
              return (
                <tr key={dept.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{dept.full_code}</td>
                  <td className="px-4 py-3">{dept.name}</td>
                  <td className="px-4 py-3">{zone?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{dept.description || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderPeople = (people: Person[], type: 'pastors' | 'deacons') => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {type === 'pastors' ? '👨‍💼' : '🙏'} {type.charAt(0).toUpperCase() + type.slice(1)} Management
        </h2>
        <button 
          onClick={() => openCreateModal(type === 'pastors' ? 'pastor' : 'deacon')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add {type === 'pastors' ? 'Pastor' : 'Deacon'}
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Regions</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Zone</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">QR</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const personZone = zoneMap[person.zone_id]
              return (
                <tr key={person.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{person.full_code}</td>
                  <td className="px-4 py-3">{person.name}</td>
                  <td className="px-4 py-3">{personZone?.name || '-'}</td>
                  <td className="px-4 py-3">{person.contact || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      person.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {person.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {person.qr_code_url && (
                      <button 
                        onClick={() => setShowQRModal(person)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        📱
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">👥 Members Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Member
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Regions</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Zone</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">QR</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => {
              const memberZone = zoneMap[member.zone_id]
              return (
                <tr key={member.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{member.full_code}</td>
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{memberZone?.name || '-'}</td>
                  <td className="px-4 py-3">{member.contact || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      member.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {member.qr_code_url && (
                      <button 
                        onClick={() => setShowQRModal(member)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        📱
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderMap = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🗺️ Live Map - All Zones</h2>
      <div className="bg-white rounded-lg shadow p-4" style={{ height: '600px' }}>
        <MapComponent 
          zones={mapZones}
          onZoneClick={(zone) => console.log('Zone clicked:', zone)}
        />
      </div>
    </div>
  )

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📋 Activity Logs</h2>
      
      <input
        type="text"
        placeholder="Search logs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Entity</th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize">{log.entity_type}</td>
                <td className="px-4 py-3 text-gray-600">{log.entity_name || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.is_successful ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {log.is_successful ? '✓' : '✕'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ============================================================================
  // Create Modal
  // ============================================================================

  const renderCreateModal = () => {
    if (!showCreateModal) return null

    const isPastor = showCreateModal === 'pastor'
    const title = isPastor ? 'Create New Pastor' : 'Create New Deacon'

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button 
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            {/* Region Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value)
                  setSelectedZoneId('')
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Select Region --</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.region_code})</option>
                ))}
              </select>
            </div>

            {/* Zone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Zone
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                disabled={!selectedRegion || filteredZonesByRegion.length === 0}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              >
                <option value="">-- Select Zone --</option>
                {filteredZonesByRegion.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.full_code})
                  </option>
                ))}
              </select>
              {selectedRegion && filteredZonesByRegion.length === 0 && (
                <p className="text-sm text-orange-600 mt-1">No zones in this region</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="e.g., +263 771 234 567"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Error/Success Messages */}
            {formError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                ✅ {formSuccess}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : `Create ${isPastor ? 'Pastor' : 'Deacon'}`}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ============================================================================
  // Main Render
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      {renderSidebar()}
      
      <div className="flex-1 p-8 bg-gray-50 min-h-screen overflow-auto">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'regions' && renderRegions()}
        {currentView === 'zones' && renderZones()}
        {currentView === 'departments' && renderDepartments()}
        {currentView === 'pastors' && renderPeople(filteredPastors as Person[], 'pastors')}
        {currentView === 'deacons' && renderPeople(filteredDeacons as Person[], 'deacons')}
        {currentView === 'members' && renderMembers()}
        {currentView === 'map' && renderMap()}
        {currentView === 'audit' && renderAuditLogs()}
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">QR Code</h3>
              <button 
                onClick={() => setShowQRModal(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="text-center">
              {showQRModal.qr_code_url ? (
                <>
                  <div className="w-48 h-48 mx-auto mb-4 relative">
                    <Image 
                      src={showQRModal.qr_code_url} 
                      alt="QR Code"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <p className="font-mono font-bold text-lg">{showQRModal.full_code}</p>
                  <p className="text-gray-600">{showQRModal.name}</p>
                </>
              ) : (
                <p className="text-gray-500">No QR code available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {renderCreateModal()}
    </div>
  )
}
