'use client'

import Link from 'next/link'

// Mock data for KPIs
const kpiData = [
  { 
    label: 'Total Regions', 
    value: '10', 
    change: '+2 this month', 
    positive: true,
    icon: '🌍',
    href: '/dashboard/regions',
    class: 'regions'
  },
  { 
    label: 'Total Zones', 
    value: '124', 
    change: '+8 this month', 
    positive: true,
    icon: '⛪',
    href: '/dashboard/zones',
    class: 'zones'
  },
  { 
    label: 'Total Pastors', 
    value: '140', 
    change: '+5 this month', 
    positive: true,
    icon: '👤',
    href: '/dashboard/pastors',
    class: 'pastors'
  },
  { 
    label: 'Total Deacons', 
    value: '560', 
    change: '+12 this month', 
    positive: true,
    icon: '🤝',
    href: '/dashboard/deacons',
    class: 'deacons'
  },
  { 
    label: 'Active Transfers', 
    value: '3', 
    change: '-2 from last week', 
    positive: true,
    icon: '🔁',
    href: '/dashboard/transfers',
    class: 'transfers'
  },
  { 
    label: 'Departments', 
    value: '230', 
    change: '+15 this month', 
    positive: true,
    icon: '🏢',
    href: '/dashboard/departments',
    class: 'departments'
  },
]

// Mock data for activity feed
const activities = [
  {
    id: 1,
    type: 'transfer',
    icon: '🔄',
    text: 'Pastor <strong>R01001P02</strong> transferred to Zone R02003',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'create',
    icon: '➕',
    text: 'New Zone <strong>Chitungwiza Central</strong> created',
    time: '5 hours ago'
  },
  {
    id: 3,
    type: 'update',
    icon: '📝',
    text: 'Department <strong>Music Ministry</strong> updated',
    time: '1 day ago'
  },
  {
    id: 4,
    type: 'create',
    icon: '➕',
    text: 'New Pastor <strong>John Moyo</strong> registered',
    time: '1 day ago'
  },
  {
    id: 5,
    type: 'transfer',
    icon: '🔄',
    text: 'Deacon <strong>D01002D05</strong> transferred to Zone R01002',
    time: '2 days ago'
  },
]

// Mock data for chart
const monthlyData = [
  { month: 'Jan', pastors: 120, zones: 100 },
  { month: 'Feb', pastors: 125, zones: 105 },
  { month: 'Mar', pastors: 128, zones: 110 },
  { month: 'Apr', pastors: 132, zones: 115 },
  { month: 'May', pastors: 135, zones: 118 },
  { month: 'Jun', pastors: 140, zones: 124 },
]

export default function DashboardPage() {
  const maxValue = Math.max(...monthlyData.map(d => d.pastors))

  return (
    <div className="animate-fadeIn">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <Link href={kpi.href} key={index} className={`kpi-card ${kpi.class}`}>
            <div className="kpi-icon">{kpi.icon}</div>
            <div className="kpi-content">
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">{kpi.value}</div>
              <div className={`kpi-change ${kpi.positive ? 'positive' : 'negative'}`}>
                {kpi.positive ? '↑' : '↓'} {kpi.change}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts and Map Section */}
      <div className="dashboard-grid">
        {/* Growth Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📈 Registration Growth</h3>
            <select className="form-select" style={{ width: 'auto' }}>
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="card-body">
            <div className="chart-container">
              {/* Simple bar chart visualization */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '250px', paddingTop: '20px' }}>
                {monthlyData.map((data, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                      {/* Pastors bar */}
                      <div 
                        style={{ 
                          width: '40px', 
                          height: `${(data.pastors / maxValue) * 200}px`, 
                          background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease'
                        }} 
                        title={`Pastors: ${data.pastors}`}
                      />
                      {/* Zones bar */}
                      <div 
                        style={{ 
                          width: '40px', 
                          height: `${(data.zones / maxValue) * 200}px`, 
                          background: 'linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease'
                        }} 
                        title={`Zones: ${data.zones}`}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>{data.month}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>Pastors</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--color-accent)', borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>Zones</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Map Preview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🗺 Live Map Preview</h3>
            <Link href="/dashboard/map" className="btn btn-sm btn-outline">
              View Full Map →
            </Link>
          </div>
          <div className="card-body">
            <div className="mini-map">
              <div className="mini-map-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Zimbabwe Map</p>
                <p style={{ fontSize: '0.75rem' }}>124 Zones • 10 Regions</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
                  <span className="status-badge active">🟢 98 Active</span>
                  <span className="status-badge pending">🟡 18 Needs Update</span>
                  <span className="status-badge inactive">🔴 8 Inactive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🔔 Recent Activity</h3>
          <Link href="/dashboard/audit" className="btn btn-sm btn-outline">
            View All →
          </Link>
        </div>
        <div className="card-body">
          <div className="activity-feed">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <div 
                    className="activity-text"
                    dangerouslySetInnerHTML={{ __html: activity.text }}
                  />
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
