import type { Metadata } from 'next'
import './globals.css'
import SupabaseProvider from '@/components/providers/SupabaseProvider'

export const metadata: Metadata = {
  title: 'Church Management System',
  description: 'Church management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
