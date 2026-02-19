'use client'

import { useState, useEffect } from 'react'
import { Notification, NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_STYLES, NOTIFICATION_PRIORITY_LABELS, NotificationType, NotificationPriority } from '@/types/notification'
import { supabase } from '@/lib/supabaseClient'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      // Mock data for demo
      const mockNotifications: Notification[] = [
        {
          id: '1',
          user_id: 'demo',
          title: 'New Transfer Request',
          message: 'Pastor John has requested a transfer from Zone A to Zone B. Please review and approve.',
          type: 'transfer_request',
          priority: 'high',
          is_read: false,
          created_at: new Date().toISOString(),
          action_url: '/dashboard/transfers'
        },
        {
          id: '2',
          user_id: 'demo',
          title: 'Event Reminder: Sunday Service',
          message: 'Sunday Morning Service starts in 2 hours at Main Sanctuary.',
          type: 'event_reminder',
          priority: 'medium',
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          user_id: 'demo',
          title: 'Low Attendance Alert',
          message: 'Zone B reported only 45 attendees yesterday (normally 80+).',
          type: 'attendance_alert',
          priority: 'high',
          is_read: false,
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: '4',
          user_id: 'demo',
          title: 'Approval Required',
          message: 'New financial record from Zone C requires your approval.',
          type: 'approval_required',
          priority: 'urgent',
          is_read: true,
          read_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '5',
          user_id: 'demo',
          title: 'System Update',
          message: 'New attendance tracking features have been added. Check out the dashboard!',
          type: 'system',
          priority: 'low',
          is_read: true,
          read_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '6',
          user_id: 'demo',
          title: 'Announcement: Annual Conference',
          message: 'The 2026 Annual Conference planning committee has been formed.',
          type: 'announcement',
          priority: 'medium',
          is_read: true,
          read_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 259200000).toISOString()
        }
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async function markAllAsRead() {
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    )
  }

  async function deleteNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.is_read) return false
    if (filter === 'read' && !n.is_read) return false
    if (typeFilter !== 'all' && n.type !== typeFilter) return false
    return true
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const getTimeAgo = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    const colors: Record<NotificationPriority, string> = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    }
    return colors[priority]
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🔔 Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex rounded-lg border overflow-hidden">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            Read
          </button>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="info">Information</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="event_reminder">Event Reminder</option>
          <option value="transfer_request">Transfer Request</option>
          <option value="attendance_alert">Attendance Alert</option>
          <option value="approval_required">Approval Required</option>
          <option value="system">System</option>
          <option value="announcement">Announcement</option>
        </select>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-8">Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                !notification.is_read ? 'border-blue-500' : 'border-gray-200'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${!notification.is_read ? 'text-lg' : ''}`}>
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        NOTIFICATION_TYPE_STYLES[notification.type]
                      }`}>
                        {NOTIFICATION_TYPE_LABELS[notification.type]}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {NOTIFICATION_PRIORITY_LABELS[notification.priority]}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{getTimeAgo(notification.created_at)}</span>
                      {notification.action_url && (
                        <a
                          href={notification.action_url}
                          className="text-blue-600 hover:underline"
                        >
                          View Details →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                      title="Mark as read"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-sm text-gray-500 hover:text-red-600"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{notifications.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Unread</p>
          <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Urgent</p>
          <p className="text-2xl font-bold text-red-600">
            {notifications.filter(n => n.priority === 'urgent' && !n.is_read).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="text-2xl font-bold text-orange-600">
            {notifications.filter(n => n.priority === 'high' && !n.is_read).length}
          </p>
        </div>
      </div>
    </div>
  )
}
