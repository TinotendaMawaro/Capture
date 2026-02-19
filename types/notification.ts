/**
 * Notification Types for Church Management System
 */

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  is_read: boolean
  read_at?: string
  action_url?: string
  entity_type?: string
  entity_id?: string
  created_at: string
  expires_at?: string
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'event_reminder'
  | 'transfer_request'
  | 'attendance_alert'
  | 'approval_required'
  | 'system'
  | 'announcement'

export type NotificationPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent'

export interface NotificationPreferences {
  user_id: string
  email_enabled: boolean
  push_enabled: boolean
  in_app_enabled: boolean
  notification_types: {
    event_reminder: boolean
    transfer_request: boolean
    attendance_alert: boolean
    approval_required: boolean
    system: boolean
    announcement: boolean
  }
  quiet_hours_enabled: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
}

export interface NotificationGroup {
  id: string
  name: string
  description: string
  member_ids: string[]
  created_by: string
  created_at: string
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  event_reminder: 'Event Reminder',
  transfer_request: 'Transfer Request',
  attendance_alert: 'Attendance Alert',
  approval_required: 'Approval Required',
  system: 'System',
  announcement: 'Announcement'
}

export const NOTIFICATION_PRIORITY_LABELS: Record<NotificationPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
}

export const NOTIFICATION_TYPE_STYLES: Record<NotificationType, string> = {
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  event_reminder: 'bg-purple-100 text-purple-800',
  transfer_request: 'bg-indigo-100 text-indigo-800',
  attendance_alert: 'bg-orange-100 text-orange-800',
  approval_required: 'bg-teal-100 text-teal-800',
  system: 'bg-gray-100 text-gray-800',
  announcement: 'bg-pink-100 text-pink-800'
}
