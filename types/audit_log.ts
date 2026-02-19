/**
 * Heartfelt International Ministries - Audit Log Type
 * 
 * Comprehensive audit logging for security and compliance
 * Tracks all administrative actions in the system
 */

export type AuditAction = 
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'TRANSFER'
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW'
  | 'EXPORT'
  | 'APPROVE'
  | 'REJECT'
  | 'SUSPEND'
  | 'REACTIVATE'
  | 'MERGE'
  | 'ARCHIVE'

export type AuditEntityType = 
  | 'region'
  | 'zone'
  | 'pastor'
  | 'deacon'
  | 'department'
  | 'member'
  | 'country'
  | 'financial_record'
  | 'attendance'
  | 'user'
  | 'system'

export interface AuditLog {
  id: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string  // ID of the affected record
  entity_name?: string  // Human-readable name of affected record
  user_id: string  // Who performed the action
  user_name?: string
  user_email?: string
  admin_id?: string  // Regional admin if different
  region_id?: string
  zone_id?: string
  country_id?: string
  old_value?: Record<string, unknown>  // Previous state (JSON)
  new_value?: Record<string, unknown>  // New state (JSON)
  ip_address?: string
  user_agent?: string
  device_info?: string
  location?: string
  is_successful: boolean
  error_message?: string
  created_at: string
}

export interface AuditLogInput {
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  entity_name?: string
  user_id: string
  user_name?: string
  user_email?: string
  admin_id?: string
  region_id?: string
  zone_id?: string
  country_id?: string
  old_value?: Record<string, unknown>
  new_value?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  device_info?: string
  location?: string
  is_successful?: boolean
  error_message?: string
}

/**
 * Audit log filters for the audit viewer
 */
export interface AuditLogFilters {
  region_id?: string
  admin_id?: string
  action?: AuditAction
  entity_type?: AuditEntityType
  date_from?: string
  date_to?: string
  user_id?: string
  is_successful?: boolean
}

/**
 * Audit summary for executive dashboard
 */
export interface AuditSummary {
  totalActions: number
  createCount: number
  updateCount: number
  deleteCount: number
  transferCount: number
  byAction: Record<AuditAction, number>
  byEntity: Record<AuditEntityType, number>
  byUser: Array<{
    user_id: string
    user_name: string
    action_count: number
  }>
  byRegion: Record<string, number>
  failedAttempts: number
  duplicateDetections: number
}

/**
 * Risk indicators for monitoring
 */
export interface RiskIndicator {
  id: string
  type: 'duplicate_attempt' | 'suspicious_activity' | 'unauthorized_access' | 'data_anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  related_entity_id?: string
  related_user_id?: string
  detected_at: string
  is_resolved: boolean
  resolved_by?: string
  resolved_at?: string
}
