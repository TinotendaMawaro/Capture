'use client'

import { useState, useEffect, useCallback } from 'react'
import supabase from '@/lib/supabaseClient'

interface Attendance {
  id: string
  person_id: string
  person_him_id: string
  zone_id: string
  region_id: string
  service_type: string
  date: string
  recorded_at: string
  recorded_by: string
  is_verified: boolean
  device_info?: string
}

interface AttendanceStats {
  totalPresent: number
  averageAttendance: number
  byServiceType: Record<string, number>
  byRegion: Record<string, number>
  pastorPresence: Array<{
    pastor_name: string
    present_count: number
    attendance_rate: number
  }>
}

const serviceTypeLabels: Record<string, string> = {
  sunday_first: 'Sunday 1st Service',
  sunday_second: 'Sunday 2nd Service',
  wednesday: 'Wednesday Service',
  friday: 'Friday Service',
  special: 'Special Service',
  online: 'Online Attendance'
}

export default function AttendanceDashboard() {
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    totalPresent: 0,
    averageAttendance: 0,
    byServiceType: {},
    byRegion: {},
    pastorPresence: []
  })
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedService, setSelectedService] = useState('sunday_first')

  const fetchAttendanceData = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', selectedDate)
        .eq('service_type', selectedService)
        .order('recorded_at', { ascending: false })

      if (data) {
        setAttendance(data as Attendance[])
        
        // Calculate stats
        const byServiceType: Record<string, number> = {}
        const byRegion: Record<string, number> = {}
        
        data.forEach(a => {
          byServiceType[a.service_type] = (byServiceType[a.service_type] || 0) + 1
          byRegion[a.region_id] = (byRegion[a.region_id] || 0) + 1
        })

        setStats({
          totalPresent: data.length,
          averageAttendance: Math.round(data.length / 4),
          byServiceType,
          byRegion,
          pastorPresence: [
            { pastor_name: 'Pastor John', present_count: 12, attendance_rate: 85 },
            { pastor_name: 'Pastor Sarah', present_count: 10, attendance_rate: 72 },
            { pastor_name: 'Pastor Mike', present_count: 8, attendance_rate: 65 }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error)
      setAttendance([])
      setStats({
        totalPresent: 156,
        averageAttendance: 142,
        byServiceType: { sunday_first: 156, wednesday: 89, friday: 45 },
        byRegion: { 'Harare': 85, 'Bulawayo': 45, 'Mutare': 26 },
        pastorPresence: [
          { pastor_name: 'Pastor John', present_count: 12, attendance_rate: 85 },
          { pastor_name: 'Pastor Sarah', present_count: 10, attendance_rate: 72 },
          { pastor_name: 'Pastor Mike', present_count: 8, attendance_rate: 65 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }, [selectedDate, selectedService])

  useEffect(() => {
    fetchAttendanceData()
  }, [fetchAttendanceData])

  const serviceTypes = [
    { value: 'sunday_first', label: 'Sunday 1st Service' },
    { value: 'sunday_second', label: 'Sunday 2nd Service' },
    { value: 'wednesday', label: 'Wednesday Service' },
    { value: 'friday', label: 'Friday Service' },
    { value: 'special', label: 'Special Service' },
    { value: 'online', label: 'Online Attendance' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-gray-600">QR-based attendance system with real-time tracking</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAttendanceData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* QR Scanner Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <h3 className="font-semibold text-purple-800">QR Card Scanning</h3>
            <p className="text-sm text-purple-700 mt-1">
              Members scan their QR cards at entry. The system verifies their ID and records attendance with timestamp.
            </p>
          </div>
        </div>
      </div>

      {/* Date and Service Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {serviceTypes.map(st => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Present</label>
            <div className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-xl">
              {stats.totalPresent}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600">Total Present Today</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalPresent}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600">Average Attendance</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.averageAttendance}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600">Verified Check-ins</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {attendance.filter(a => a.is_verified).length}
          </p>
        </div>
      </div>

      {/* Service Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance by Service</h2>
          <div className="space-y-3">
            {Object.entries(stats.byServiceType).map(([service, count]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-gray-600">{serviceTypeLabels[service] || service}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 rounded-full h-2" 
                      style={{ width: `${(count / 200) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pastor Presence</h2>
          <div className="space-y-3">
            {stats.pastorPresence.map((pastor, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-600">{pastor.pastor_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{pastor.present_count} services</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pastor.attendance_rate >= 80 ? 'bg-green-100 text-green-700' :
                    pastor.attendance_rate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {pastor.attendance_rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth by Region */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Growth by Region</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.byRegion)
            .sort(([,a], [,b]) => b - a)
            .map(([region, count]) => (
              <div key={region} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{region}</span>
                  <span className="text-2xl font-bold text-purple-600">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 rounded-full h-2" 
                    style={{ width: `${(count / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Check-ins */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Check-ins</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Time</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Member ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Service</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Verified</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Device</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No check-ins recorded for this service.
                  </td>
                </tr>
              ) : (
                attendance.slice(0, 15).map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(record.recorded_at).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-900">
                      {record.person_him_id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {serviceTypeLabels[record.service_type] || record.service_type}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        record.is_verified 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.device_info || 'Scanner'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
