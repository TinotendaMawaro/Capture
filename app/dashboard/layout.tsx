import type { Metadata } from 'next'
import '../globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import AuthCheck from './AuthCheck'

export const metadata: Metadata = {
  title: 'Dashboard - H.I.M National Registration System',
  description: 'Heartfelt International Ministries National Registration Admin Dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthCheck>
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <Header title="Dashboard" />
              <div className="page-content">
                {children}
              </div>
            </div>
          </div>
        </AuthCheck>
      </body>
    </html>
  )
}
