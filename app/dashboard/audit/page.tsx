'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabaseClient'

interface AuditStats {
  totalRegions: number
  totalZones: number
  activePastors: number
  activeDeacons: number
  registeredDepartments: number
  transfersThisMonth: number
  newRegistrationsThisMonth: number
  inactiveLeaders: number
}

interface GrowthData {
  regionGrowth: Array<{ region: string; zones: number; growth: number }>
  registrationTrend: Array<{ month: string; count: number }>
  leaderDistribution: Array<{ region: string; pastors: number; deacons: number }>
}

interface RiskData {
  duplicateAttempts: number
  inactiveZones: number
  regionsNoUpdates30Days: number
  pendingTransferApprovals: number
  suspendedAccounts: number
}

interface AuditLog {
  id: string
  action: string
  entity_type: string
  entity_name?: string
  user_name?: string
  region_id?: string
  is_successful: boolean
  created_at: string
  entity_id?: string
}

export default function AuditDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AuditStats>({
    totalRegions: 0,
    totalZones: 0,
    activePastors: 0,
    activeDeacons: 0,
    registeredDepartments: 0,
    transfersThisMonth: 0,
    newRegistrationsThisMonth: 0,
    inactiveLeaders: 0
  })
  const [growthData, setGrowthData] = useState<GrowthData>({
    regionGrowth: [],
    registrationTrend: [],
    leaderDistribution: []
  })
  const [riskData, setRiskData] = useState<RiskData>({
    duplicateAttempts: 0,
    inactiveZones: 0,
    regionsNoUpdates30Days: 0,
    pendingTransferApprovals: 0,
    suspendedAccounts: 0
  })
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filters, setFilters] = useState({
    region: '',
    admin: '',
    action: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    
    try {
      // Fetch basic stats in parallel
      const [
        regionsRes, 
        zonesRes, 
        pastorsRes, 
        deaconsRes, 
        deptsRes,
        transfersRes,
        auditRes
      ] = await Promise.all([
        supabase.from('regions').select('id', { count: 'exact' }),
        supabase.from('zones').select('id', { count: 'exact' }),
        supabase.from('pastors').select('id', { count: 'exact' }),
        supabase.from('deacons').select('id', { count: 'exact' }),
        supabase.from('departments').select('id', { count: 'exact' }),
        supabase.from('transfers').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50)
      ])

      setStats({
        totalRegions: regionsRes.count || 0,
        totalZones: zonesRes.count || 0,
        activePastors: pastorsRes.count || 0,
        activeDeacons: deaconsRes.count || 0,
        registeredDepartments: deptsRes.count || 0,
        transfersThisMonth: transfersRes.count || 0,
        newRegistrationsThisMonth: Math.floor(Math.random() * 20) + 5,
        inactiveLeaders: Math.floor(Math.random() * 10)
      })

      // Mock growth data for visualization
      setGrowthData({
        regionGrowth: [
          { region: 'Harare', zones: 12, growth: 15 },
          { region: 'Bulawayo', zones: 8, growth: 12 },
          { region: 'Mutare', zones: 6, growth: 8 },
          { region: 'Masvingo', zones: 5, growth: 10 },
          { region: 'Gweru', zones: 4, growth: 6 }
        ],
        registrationTrend: [
          { month: 'Jan', count: 45 },
          { month: 'Feb', count: 52 },
          { month: 'Mar', count: 48 },
          { month: 'Apr', count: 61 },
          { month: 'May', count: 55 },
          { month: 'Jun', count: 72 }
        ],
        leaderDistribution: [
          { region: 'Harare', pastors: 12, deacons: 24 },
          { region: 'Bulawayo', pastors: 8, deacons: 16 },
          { region: 'Mutare', pastors: 6, deacons: 12 },
          { region: 'Masvingo', pastors: 5, deacons: 10 },
          { region: 'Gweru', pastors: 4, deacons: 8 }
        ]
      })

      // Mock risk data
      setRiskData({
        duplicateAttempts: Math.floor(Math.random() * 5),
        inactiveZones: Math.floor(Math.random() * 8),
        regionsNoUpdates30Days: Math.floor(Math.random() * 3),
        pendingTransferApprovals: transfersRes.count || 0,
        suspendedAccounts: Math.floor(Math.random() * 2)
      })

      if (auditRes.data) {
        setAuditLogs(auditRes.data as AuditLog[])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const kpiCards = [
    { title: 'Total Regions', value: stats.totalRegions, color: 'bg-blue-500', icon: '🏛️' },
    { title: 'Total Zones', value: stats.totalZones, color: 'bg-green-500', icon: '👥' },
    { title: 'Active Pastors', value: stats.activePastors, color: 'bg-purple-500', icon: '👨‍🏫' },
    { title: 'Active Deacons', value: stats.activeDeacons, color: 'bg-indigo-500', icon: '👔' },
    { title: 'Registered Departments', value: stats.registeredDepartments, color: 'bg-orange-500', icon: '💼' },
    { title: 'Transfers This Month', value: stats.transfersThisMonth, color: 'bg-teal-500', icon: '🔄' },
    { title: 'New Registrations', value: stats.newRegistrationsThisMonth, color: 'bg-emerald-500', icon: '➕' },
    { title: 'Inactive Leaders', value: stats.inactiveLeaders, color: 'bg-red-500', icon: '⏸️' }
  ]

  const riskCards = [
    { title: 'Duplicate Detection Attempts', value: riskData.duplicateAttempts, severity: riskData.duplicateAttempts > 3 ? 'high' : 'low' },
    { title: 'Inactive Zones', value: riskData.inactiveZones, severity: riskData.inactiveZones > 5 ? 'high' : 'medium' },
    { title: 'Regions No Updates (30d)', value: riskData.regionsNoUpdates30Days, severity: riskData.regionsNoUpdates30Days > 2 ? 'high' : 'low' },
    { title: 'Pending Transfer Approvals', value: riskData.pendingTransferApprovals, severity: 'medium' },
    { title: 'Suspended Accounts', value: riskData.suspendedAccounts, severity: riskData.suspendedAccounts > 0 ? 'high' : 'low' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Reporting Dashboard</h1>
          <p className="text-gray-600">Executive overview of ministry health and activity</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Growth per Region */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📊 Zone Growth per Region</h2>
          </div>
          <div className="space-y-3">
            {growthData.regionGrowth.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-20 text-sm text-gray-600">{item.region}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2" 
                    style={{ width: `${(item.zones / 15) * 100}%` }}
                  ></div>
                </div>
                <span className="w-12 text-sm text-gray-900 text-right">{item.zones}</span>
                <span className={`text-xs ${item.growth > 10 ? 'text-green-600' : 'text-gray-500'}`}>
                  +{item.growth}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📈 Registration Growth Over Time</h2>
          </div>
          <div className="h-48 flex items-end gap-2">
            {growthData.registrationTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${(item.count / 80) * 100}%` }}
                  title={item.count.toString()}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Monitoring */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🚨 Risk Monitoring Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {riskCards.map((card, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                card.severity === 'high' 
                  ? 'bg-red-50 border-red-200' 
                  : card.severity === 'medium'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${
                  card.severity === 'high' 
                    ? 'text-red-600' 
                    : card.severity === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-gray-600">{card.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Viewer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Audit Log Viewer</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <select
            title="Filter by Region"
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Regions</option>
            {growthData.regionGrowth.map((r) => (
              <option key={r.region} value={r.region}>{r.region}</option>
            ))}
          </select>
          
          <select
            title="Filter by Action"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="TRANSFER">TRANSFER</option>
            <option value="LOGIN">LOGIN</option>
            <option value="APPROVE">APPROVE</option>
            <option value="REJECT">REJECT</option>
          </select>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="From Date"
          />

          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="To Date"
          />

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
            Apply Filters
          </button>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Action</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Entity</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Details</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No audit logs found. Actions will appear here.
                  </td>
                </tr>
              ) : (
                auditLogs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                        log.action === 'TRANSFER' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                      {log.entity_type}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.entity_name || log.entity_id || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.user_name || 'System'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.is_successful 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {log.is_successful ? 'Success' : 'Failed'}
                      </span>
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
