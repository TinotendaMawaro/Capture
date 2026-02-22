'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/authHelpers'

interface HeaderProps {
  title?: string
}

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [notificationCount] = useState(5)

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <header className="top-header">
      <div className="top-header-left">
        <h2 className="page-title">{title}</h2>
      </div>

      <div className="top-header-center">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by ID, Name, Zone, Pastor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="top-header-right">
        {/* Notifications */}
        <button className="header-icon-btn" title="Notifications">
          🔔
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>

        {/* User Profile */}
        <div className="dropdown">
          <div 
            className="user-profile"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="user-avatar">PA</div>
            <div className="user-info">
              <div className="user-name">Pastor Admin</div>
              <div className="user-role">Super Admin</div>
            </div>
            <span style={{ marginLeft: '8px', color: 'var(--color-gray-400)' }}>▼</span>
          </div>
          
          <div className={`dropdown-menu ${showProfileDropdown ? 'show' : ''}`}>
            <Link href="/dashboard/profile" className="dropdown-item">
              👤 My Profile
            </Link>
            <Link href="/dashboard/settings" className="dropdown-item">
              ⚙️ Change Password
            </Link>
            <div className="dropdown-divider"></div>
            <button 
              className="dropdown-item" 
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
