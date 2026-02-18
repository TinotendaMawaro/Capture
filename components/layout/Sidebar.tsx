'use client'

import Link from 'next/link'

export default function Sidebar() {
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/regions', label: 'Regions' },
    { href: '/dashboard/zones', label: 'Zones' },
    { href: '/dashboard/pastors', label: 'Pastors' },
    { href: '/dashboard/deacons', label: 'Deacons' },
    { href: '/dashboard/departments', label: 'Departments' },
    { href: '/dashboard/transfers', label: 'Transfers' },
    { href: '/dashboard/map', label: 'Map' },
    { href: '/dashboard/reports', label: 'Reports' },
  ]

  return (
    <aside>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

