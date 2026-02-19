'use client'

import { useState, useEffect } from 'react'
import { Notification, NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_STYLES, NotificationType } from '@/types/notification'
import { supabase } from '@/lib/supabaseClient'

interface NotificationBellProps {
  userId?: string
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    
    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev])
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function fetchNotifications() {
    try {
      if (!userId) {
        // Mock data for demo
        setNotifications([
          {
            id: '1',
            user_id: 'demo',
            title: 'New Transfer Request',
            message: 'Pastor John has requested a transfer to Zone A',
            type: 'transfer_request',
            priority: 'high',
            is_read: false,
            created_at: new Date().toISOString(),
            action_url: '/dashboard/transfers'
          },
          {
            id: '2',
            user_id: 'demo',
            title: 'Event Reminder',
            message: 'Sunday Service starts in 2 hours',
            type: 'event_reminder',
            priority: 'medium',
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            user_id: 'demo',
            title: 'System Update',
            message: 'New attendance features have been added',
            type: 'system',
            priority: 'low',
            is_read: true,
            read_at: new Date().toISOString(),
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ])
        setUnreadCount(2)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      
      setNotifications(data || [])
      setUnreadCount((data || []).filter(n => !n.is_read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async function markAllAsRead() {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
      
      if (!userId) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })))
        setUnreadCount(0)
        return
      }

      for (const id of unreadIds) {
        await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', id)
      }
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getTimeAgo = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        NOTIFICATION_TYPE_STYLES[notification.type]
                      }`}>
                        {NOTIFICATION_TYPE_LABELS[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.is_read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getTimeAgo(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t">
              <a
                href="/dashboard/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-700"
              >
                View all notifications
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
