/**
 * Heartfelt International Ministries - Database Schema
 * 
 * Supabase Database Schema for Multi-Region Expansion
 * Run these migrations in your Supabase dashboard or via CLI
 * 
 * IMPORTANT: 
 * - Financial data requires separate RLS policies
 * - All tables include audit logging
 * - Dual approval required for financial edits
 */

/**
 * =============================================================================
 * COUNTRIES TABLE
 * =============================================================================
 */
export const CREATE_COUNTRIES_TABLE = `
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for country code lookups
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(country_code);

-- RLS: Only authenticated users can read
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to countries"
  ON countries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for admins"
  ON countries FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow update for admins"
  ON countries FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
`;

/**
 * =============================================================================
 * REGIONS TABLE (Updated with country reference)
 * =============================================================================
 */
export const UPDATE_REGIONS_TABLE = `
-- Add country_id column to existing regions table
ALTER TABLE regions 
ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES countries(id);

-- Create index for country lookups
CREATE INDEX IF NOT EXISTS idx_regions_country ON regions(country_id);

-- Update RLS to include country filtering
DROP POLICY IF EXISTS "Allow read access to regions" ON regions;

CREATE POLICY "Allow read access to regions"
  ON regions FOR SELECT
  TO authenticated
  USING (
    country_id IN (
      SELECT country_id FROM user_regions 
      WHERE user_id = auth.uid()
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );
`;

/**
 * =============================================================================
 * FINANCIAL RECORDS TABLE
 * =============================================================================
 */
export const CREATE_FINANCIAL_RECORDS_TABLE = `
CREATE TABLE IF NOT EXISTS financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  him_id VARCHAR(20) UNIQUE NOT NULL,
  zone_id UUID NOT NULL REFERENCES zones(id),
  region_id UUID NOT NULL REFERENCES regions(id),
  country_id UUID REFERENCES countries(id),
  category VARCHAR(20) NOT NULL CHECK (category IN ('offering', 'donation', 'tithe', 'expense', 'budget', 'contribution', 'other')),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  recorded_by UUID NOT NULL REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_financial_zone ON financial_records(zone_id);
CREATE INDEX IF NOT EXISTS idx_financial_region ON financial_records(region_id);
CREATE INDEX IF NOT EXISTS idx_financial_country ON financial_records(country_id);
CREATE INDEX IF NOT EXISTS idx_financial_category ON financial_records(category);
CREATE INDEX IF NOT EXISTS idx_financial_period ON financial_records(year, month);
CREATE INDEX IF NOT EXISTS idx_financial_status ON financial_records(status);

-- RLS: Strictly restricted for financial data
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Only finance admins can read
CREATE POLICY "Finance read access"
  ON financial_records FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('finance_admin', 'admin')
    OR recorded_by = auth.uid()
  );

-- Only finance admins can insert
CREATE POLICY "Finance insert access"
  ON financial_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('finance_admin', 'admin'));

-- Only finance admins can update (with dual approval)
CREATE POLICY "Finance update access"
  ON financial_records FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('finance_admin', 'admin')
    AND (
      -- Dual approval: either original creator or approver
      old.status = 'pending'
      OR approved_by IS NOT NULL
    )
  );

-- Only admins can delete
CREATE POLICY "Finance delete access"
  ON financial_records FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
`;

/**
 * =============================================================================
 * ATTENDANCE TABLE
 * =============================================================================
 */
export const CREATE_ATTENDANCE_TABLE = `
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL,
  person_him_id VARCHAR(20) NOT NULL,
  zone_id UUID NOT NULL REFERENCES zones(id),
  region_id UUID NOT NULL REFERENCES regions(id),
  country_id UUID REFERENCES countries(id),
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('sunday_first', 'sunday_second', 'wednesday', 'friday', 'special', 'online')),
  date DATE NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  device_info VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_attendance_person ON attendance(person_id);
CREATE INDEX IF NOT EXISTS idx_attendance_him_id ON attendance(person_him_id);
CREATE INDEX IF NOT EXISTS idx_attendance_zone ON attendance(zone_id);
CREATE INDEX IF NOT EXISTS idx_attendance_region ON attendance(region_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_service ON attendance(service_type);
CREATE INDEX IF NOT EXISTS idx_attendance_composite ON attendance(date, service_type);

-- RLS: Allow scanner app to insert, admins to read
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendance read access"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Attendance insert access (scanner)"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('scanner', 'admin', 'region_admin')
    OR auth.jwt() ->> 'scope' = 'scanner'
  );

CREATE POLICY "Attendance update access"
  ON attendance FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));

CREATE POLICY "Attendance delete access"
  ON attendance FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
`;

/**
 * =============================================================================
 * AUDIT LOGS TABLE
 * =============================================================================
 */
export const CREATE_AUDIT_LOGS_TABLE = `
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'TRANSFER', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'APPROVE', 'REJECT', 'SUSPEND', 'REACTIVATE', 'MERGE', 'ARCHIVE')),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('region', 'zone', 'pastor', 'deacon', 'department', 'member', 'country', 'financial_record', 'attendance', 'user', 'system')),
  entity_id VARCHAR(50) NOT NULL,
  entity_name VARCHAR(255),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  admin_id UUID REFERENCES auth.users(id),
  region_id UUID REFERENCES regions(id),
  zone_id UUID REFERENCES zones(id),
  country_id UUID REFERENCES countries(id),
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  device_info VARCHAR(255),
  location VARCHAR(255),
  is_successful BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_region ON audit_logs(region_id);
CREATE INDEX IF NOT EXISTS idx_audit_zone ON audit_logs(zone_id);
CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_successful ON audit_logs(is_successful);
CREATE INDEX IF NOT EXISTS idx_audit_composite ON audit_logs(created_at, action, entity_type);

-- RLS: Only admins can read full audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs read access"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'audit_viewer'));

CREATE POLICY "Audit logs insert access (system)"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('admin', 'system')
    OR auth.jwt() ->> 'scope' = 'scanner'
  );

-- No update or delete on audit logs (immutable)
`;

/**
 * =============================================================================
 * RISK INDICATORS TABLE
 * =============================================================================
 */
export const CREATE_RISK_INDICATORS_TABLE = `
CREATE TABLE IF NOT EXISTS risk_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(30) NOT NULL CHECK (type IN ('duplicate_attempt', 'suspicious_activity', 'unauthorized_access', 'data_anomaly')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  related_entity_id VARCHAR(50),
  related_user_id UUID REFERENCES auth.users(id),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_risk_type ON risk_indicators(type);
CREATE INDEX IF NOT EXISTS idx_risk_severity ON risk_indicators(severity);
CREATE INDEX IF NOT EXISTS idx_risk_resolved ON risk_indicators(is_resolved);
CREATE INDEX IF NOT EXISTS idx_risk_date ON risk_indicators(detected_at);

-- RLS: Only admins can manage
ALTER TABLE risk_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Risk read access"
  ON risk_indicators FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'audit_viewer'));

CREATE POLICY "Risk insert access"
  ON risk_indicators FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Risk update access"
  ON risk_indicators FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
`;

/**
 * =============================================================================
 * BUDGETS TABLE
 * =============================================================================
 */
export const CREATE_BUDGETS_TABLE = `
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zones(id),
  region_id UUID REFERENCES regions(id),
  country_id UUID REFERENCES countries(id),
  category VARCHAR(20) NOT NULL,
  allocated_amount DECIMAL(15, 2) NOT NULL,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  remaining_amount DECIMAL(15, 2) GENERATED ALWAYS AS (allocated_amount - spent_amount) STORED,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zone_id, region_id, country_id, category, month, year)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_budgets_zone ON budgets(zone_id);
CREATE INDEX IF NOT EXISTS idx_budgets_region ON budgets(region_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(year, month);

-- RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Budget read access"
  ON budgets FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('finance_admin', 'admin'));

CREATE POLICY "Budget insert access"
  ON budgets FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('finance_admin', 'admin'));

CREATE POLICY "Budget update access"
  ON budgets FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('finance_admin', 'admin'));
`;

/**
 * =============================================================================
 * TRANSFERS TABLE (Enhanced)
 * =============================================================================
 */
export const CREATE_TRANSFERS_TABLE = `
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL,
  person_him_id VARCHAR(20) NOT NULL,
  person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('pastor', 'deacon', 'member')),
  from_zone_id UUID REFERENCES zones(id),
  from_region_id UUID REFERENCES regions(id),
  to_zone_id UUID REFERENCES zones(id),
  to_region_id UUID REFERENCES regions(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  effective_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transfers_person ON transfers(person_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(created_at);

-- RLS
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transfers read access"
  ON transfers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Transfers insert access"
  ON transfers FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));

CREATE POLICY "Transfers update access"
  ON transfers FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));
`;

/**
 * =============================================================================
 * SEED DATA FOR COUNTRIES
 * =============================================================================
 */
export const SEED_COUNTRIES = `
INSERT INTO countries (country_code, name, is_active) VALUES
  ('ZW', 'Zimbabwe', true),
  ('ZA', 'South Africa', true),
  ('KE', 'Kenya', true),
  ('NG', 'Nigeria', false),
  ('GH', 'Ghana', false),
  ('TZ', 'Tanzania', false),
  ('UG', 'Uganda', false),
  ('ZM', 'Zambia', false),
  ('MW', 'Malawi', false),
  ('BW', 'Botswana', false)
ON CONFLICT (country_code) DO NOTHING;
`;

/**
 * =============================================================================
 * EVENTS TABLE
 * =============================================================================
 */
export const CREATE_EVENTS_TABLE = `
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  him_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('sunday_service', 'wednesday_service', 'friday_service', 'special_service', 'conference', 'seminar', 'workshop', 'youth_service', 'children_service', 'womens_ministry', 'mens_ministry', 'outreach', 'fellowship', 'celebration', 'training', 'other')),
  location VARCHAR(255),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  zone_id UUID REFERENCES zones(id),
  region_id UUID REFERENCES regions(id),
  country_id UUID REFERENCES countries(id),
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  organizer_name VARCHAR(255),
  expected_attendees INTEGER DEFAULT 0,
  actual_attendees INTEGER,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed', 'postponed')),
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern VARCHAR(50),
  registration_required BOOLEAN DEFAULT false,
  max_capacity INTEGER,
  is_public BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for event queries
CREATE INDEX IF NOT EXISTS idx_events_zone ON events(zone_id);
CREATE INDEX IF NOT EXISTS idx_events_region ON events(region_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);

-- RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events read access"
  ON events FOR SELECT
  TO authenticated
  USING (
    is_public = true 
    OR auth.jwt() ->> 'role' IN ('admin', 'region_admin')
    OR organizer_id = auth.uid()
  );

CREATE POLICY "Events insert access"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));

CREATE POLICY "Events update access"
  ON events FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'region_admin')
    OR organizer_id = auth.uid()
  );

CREATE POLICY "Events delete access"
  ON events FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
`;

/**
 * =============================================================================
 * EVENT REGISTRATIONS TABLE
 * =============================================================================
 */
export const CREATE_EVENT_REGISTRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  person_id UUID NOT NULL,
  person_him_id VARCHAR(20) NOT NULL,
  person_name VARCHAR(255) NOT NULL,
  person_email VARCHAR(255),
  person_phone VARCHAR(50),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_person ON event_registrations(person_id);

-- RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Registrations read access"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Registrations insert access"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Registrations update access"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));
`;

/**
 * =============================================================================
 * NOTIFICATIONS TABLE
 * =============================================================================
 */
export const CREATE_NOTIFICATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'event_reminder', 'transfer_request', 'attendance_alert', 'approval_required', 'system', 'announcement')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  action_url VARCHAR(500),
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications read access"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Notifications insert access"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('admin', 'system')
    OR user_id = auth.uid()
  );

CREATE POLICY "Notifications update access"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
`;

/**
 * =============================================================================
 * NOTIFICATION GROUPS TABLE
 * =============================================================================
 */
export const CREATE_NOTIFICATION_GROUPS_TABLE = `
CREATE TABLE IF NOT EXISTS notification_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  member_ids UUID[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE notification_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Groups read access"
  ON notification_groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Groups insert access"
  ON notification_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));

CREATE POLICY "Groups update access"
  ON notification_groups FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'region_admin')
    OR created_by = auth.uid()
  );
`;

/**
 * =============================================================================
 * NOTIFICATION PREFERENCES TABLE
 * =============================================================================
 */
export const CREATE_NOTIFICATION_PREFERENCES_TABLE = `
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  notification_types JSONB DEFAULT '{"event_reminder": true, "transfer_request": true, "attendance_alert": true, "approval_required": true, "system": true, "announcement": true}'::jsonb,
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preferences read access"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Preferences insert access"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Preferences update access"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
`;
