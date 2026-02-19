'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { 
      section: 'Main',
      items: [
        { href: '/dashboard', label: '🏠 Dashboard', icon: '🏠' },
      ]
    },
    { 
      section: 'Organization',
      items: [
        { href: '/dashboard/regions', label: '🌍 Regions', icon: '🌍' },
        { href: '/dashboard/zones', label: '⛪ Zones', icon: '⛪' },
        { href: '/dashboard/pastors', label: '👤 Pastors', icon: '👤' },
        { href: '/dashboard/deacons', label: '🤝 Deacons', icon: '🤝' },
        { href: '/dashboard/departments', label: '🏢 Departments', icon: '🏢' },
      ]
    },
    { 
      section: 'Operations',
      items: [
        { href: '/dashboard/transfers', label: '🔁 Transfers', icon: '🔁' },
        { href: '/dashboard/id-cards', label: '🪪 ID Cards', icon: '🪪' },
        { href: '/dashboard/map', label: '🗺 Live Map', icon: '🗺' },
      ]
    },
    { 
      section: 'Insights',
      items: [
        { href: '/dashboard/reports', label: '📊 Reports & Analytics', icon: '📊' },
      ]
    },
    { 
      section: 'System',
      items: [
        { href: '/dashboard/settings', label: '⚙ System Settings', icon: '⚙' },
        { href: '/dashboard/users', label: '🔐 User Management', icon: '🔐' },
        { href: '/dashboard/audit', label: '📜 Audit Logs', icon: '📜' },
      ]
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">✝</div>
          <div className="sidebar-logo-text">
            <h1>H.I.M</h1>
            <p>National Registration System</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((section) => (
          <div key={section.section} className="sidebar-nav-section">
            <div className="sidebar-nav-title">{section.section}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">H.I.M v2.0 • Multi-Region Ready</p>
      </div>
    </aside>
  )
}
