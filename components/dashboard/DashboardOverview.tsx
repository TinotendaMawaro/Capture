'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface KPIData {
  regions: number
  zones: number
  pastors: number
  deacons: number
  transfers: number
  departments: number
}

export default function DashboardOverview() {
  const [kpiData, setKpiData] = useState<KPIData>({
    regions: 0,
    zones: 0,
    pastors: 0,
    deacons: 0,
    transfers: 0,
    departments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated data - in production, fetch from API
    const fetchData = async () => {
      try {
        // Simulated API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setKpiData({
          regions: 10,
          zones: 45,
          pastors: 128,
          deacons: 342,
          transfers: 67,
          departments: 8
        })
      } catch (error) {
        console.error('Error fetching KPI data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const kpiCards = [
    { 
      label: 'Regions', 
      value: kpiData.regions, 
      icon: '🌍', 
      className: 'regions',
      href: '/dashboard/regions',
      change: '+2 this month'
    },
    { 
      label: 'Zones', 
      value: kpiData.zones, 
      icon: '⛪', 
      className: 'zones',
      href: '/dashboard/zones',
      change: '+5 this month'
    },
    { 
      label: 'Pastors', 
      value: kpiData.pastors, 
      icon: '👤', 
      className: 'pastors',
      href: '/dashboard/pastors',
      change: '+12 this month'
    },
    { 
      label: 'Deacons', 
      value: kpiData.deacons, 
      icon: '🤝', 
      className: 'deacons',
      href: '/dashboard/deacons',
      change: '+28 this month'
    },
    { 
      label: 'Transfers', 
      value: kpiData.transfers, 
      icon: '🔁', 
      className: 'transfers',
      href: '/dashboard/transfers',
      change: '+15 this month'
    },
    { 
      label: 'Departments', 
      value: kpiData.departments, 
      icon: '🏢', 
      className: 'departments',
      href: '/dashboard/departments',
      change: '+1 this month'
    },
  ]

  const recentActivities = [
    { type: 'transfer', text: 'Deacon John Makaza transferred to Harare Zone', time: '2 hours ago' },
    { type: 'create', text: 'New Pastor registered for Bulawayo Region', time: '5 hours ago' },
    { type: 'update', text: 'Zone information updated for Mutare District', time: '1 day ago' },
    { type: 'transfer', text: 'Deacon Sarah Moyo transferred to Midlands Zone', time: '2 days ago' },
    { type: 'create', text: 'New Region created: Masvingo Province', time: '3 days ago' },
  ]

  if (loading) {
    return (
      <div className="kpi-grid">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="kpi-card"
            style={{ opacity: 0.5 }}
          >
            <div className="kpi-icon" style={{ background: 'var(--color-gray-100)' }}>...</div>
            <div className="kpi-content">
              <div className="kpi-label">Loading...</div>
              <div className="kpi-value">-</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards with enhanced dark mode */}
      <div className="kpi-grid">
        {kpiCards.map((card, index) => (
          <Link 
            key={card.label} 
            href={card.href}
            className={`kpi-card ${card.className}`}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div 
              className="kpi-icon"
              style={{
                transition: 'transform 0.3s ease',
              }}
            >
              {card.icon}
            </div>
            <div className="kpi-content">
              <div className="kpi-label">{card.label}</div>
              <div className="kpi-value">{card.value.toLocaleString()}</div>
              <div className="kpi-change positive">{card.change}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Chart Section */}
        <div className="card" style={{ animation: 'slideIn 0.4s ease-out 0.3s forwards', opacity: 0 }}>
          <div className="card-header">
            <h3 className="card-title">📊 Registration Overview</h3>
            <span style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>Last 6 months</span>
          </div>
          <div className="card-body">
            <div 
              className="chart-container" 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                justifyContent: 'space-around',
                height: '250px',
                padding: '20px 0'
              }}
            >
              {[65, 45, 78, 52, 89, 72].map((height, index) => (
                <div 
                  key={index}
                  style={{
                    width: '40px',
                    height: `${height}%`,
                    background: `linear-gradient(180deg, var(--color-accent) 0%, rgba(214, 158, 46, 0.3) 100%)`,
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    animation: `slideIn 0.5s ease-out ${0.4 + index * 0.1}s forwards`,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scaleY(1.05) translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 -5px 20px rgba(214, 158, 46, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scaleY(1) translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              ))}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              marginTop: '10px',
              color: 'var(--color-gray-500)',
              fontSize: '0.75rem'
            }}>
              <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card" style={{ animation: 'slideInRight 0.4s ease-out 0.5s forwards', opacity: 0 }}>
          <div className="card-header">
            <h3 className="card-title">📜 Recent Activity</h3>
            <span style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>Live updates</span>
          </div>
          <div className="card-body">
            <div className="activity-feed">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="activity-item"
                  style={{
                    animation: `slideInLeft 0.3s ease-out ${0.6 + index * 0.1}s forwards`,
                    opacity: 0,
                  }}
                >
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'transfer' && '🔁'}
                    {activity.type === 'create' && '✅'}
                    {activity.type === 'update' && '✏️'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">{activity.text}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
