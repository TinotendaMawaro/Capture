/**
 * Heartfelt International Ministries - Comprehensive Database Schema
 * 
 * This file contains all the SQL migrations needed for the complete system.
 * Run these in your Supabase SQL Editor.
 * 
 * Tables:
 * 1. countries - Multi-country support
 * 2. regions - Administrative regions (enhanced)
 * 3. financial_records - Financial tracking
 * 4. events - Church events
 * 5. event_registrations - Event attendance
 * 6. notifications - User notifications
 * 7. notification_groups - Group notifications
 * 8. notification_preferences - User preferences
 * 9. attendance - Service attendance
 * 10. budgets - Budget tracking
 * 11. audit_logs - Audit trail
 * 12. risk_indicators - Security monitoring
 * 13. transfers - Transfer requests
 */

// ============================================================================
// COMPLETE SQL SCHEMA - RUN IN SUPABASE SQL EDITOR
// ============================================================================

export const COMPLETE_SCHEMA_SQL = `

-- ============================================================================
-- HEARTFELT INTERNATIONAL MINISTRIES - COMPLETE DATABASE SCHEMA
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. COUNTRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(country_code);

-- RLS for countries
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to countries" ON countries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert for admins" ON countries FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow update for admins" ON countries FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 2. ENHANCE REGIONS TABLE
-- ============================================================================
ALTER TABLE regions ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES countries(id);
CREATE INDEX IF NOT EXISTS idx_regions_country ON regions(country_id);

-- ============================================================================
-- 3. FINANCIAL RECORDS TABLE
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_financial_zone ON financial_records(zone_id);
CREATE INDEX IF NOT EXISTS idx_financial_region ON financial_records(region_id);
CREATE INDEX IF NOT EXISTS idx_financial_category ON financial_records(category);
CREATE INDEX IF NOT EXISTS idx_financial_period ON financial_records(year, month);
CREATE INDEX IF NOT EXISTS idx_financial_status ON financial_records(status);

ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Finance read access" ON financial_records FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' IN ('finance_admin', 'admin') OR recorded_by = auth.uid());
CREATE POLICY "Finance insert access" ON financial_records FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' IN ('finance_admin', 'admin'));
CREATE POLICY "Finance update access" ON financial_records FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('finance_admin', 'admin'));
CREATE POLICY "Finance delete access" ON financial_records FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 4. ATTENDANCE TABLE
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_attendance_person ON attendance(person_id);
CREATE INDEX IF NOT EXISTS idx_attendance_him_id ON attendance(person_him_id);
CREATE INDEX IF NOT EXISTS idx_attendance_zone ON attendance(zone_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_composite ON attendance(date, service_type);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Attendance read access" ON attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Attendance insert access" ON attendance FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' IN ('scanner', 'admin', 'region_admin') OR auth.jwt() ->> 'scope' = 'scanner');
CREATE POLICY "Attendance update access" ON attendance FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));

-- ============================================================================
-- 5. AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'TRANSFER', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'APPROVE', 'REJECT', 'SUSPEND', 'REACTIVATE')),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('region', 'zone', 'pastor', 'deacon', 'department', 'member', 'country', 'financial_record', 'attendance', 'user', 'system')),
  entity_id VARCHAR(50) NOT NULL,
  entity_name VARCHAR(255),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  region_id UUID REFERENCES regions(id),
  zone_id UUID REFERENCES zones(id),
  country_id UUID REFERENCES countries(id),
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  is_successful BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_logs(created_at);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit logs read access" ON audit_logs FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'audit_viewer'));
CREATE POLICY "Audit logs insert access" ON audit_logs FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'system'));

-- ============================================================================
-- 6. EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  him_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('sunday_service', 'wednesday_service', 'friday_service', 'special_service', 'conference', 'seminar', 'workshop', 'youth_service', 'children_service', 'outreach', 'fellowship', 'celebration', 'training', 'other')),
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
  is_public BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_zone ON events(zone_id);
CREATE INDEX IF NOT EXISTS idx_events_region ON events(region_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events read access" ON events FOR SELECT TO authenticated USING (is_public = true OR auth.jwt() ->> 'role' IN ('admin', 'region_admin') OR organizer_id = auth.uid());
CREATE POLICY "Events insert access" ON events FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));
CREATE POLICY "Events update access" ON events FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'region_admin') OR organizer_id = auth.uid());

-- ============================================================================
-- 7. EVENT REGISTRATIONS TABLE
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_person ON event_registrations(person_id);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Registrations read access" ON event_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Registrations insert access" ON event_registrations FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications read access" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Notifications insert access" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'system') OR user_id = auth.uid());
CREATE POLICY "Notifications update access" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- ============================================================================
-- 9. TRANSFERS TABLE (Enhanced)
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_transfers_person ON transfers(person_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(created_at);

ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transfers read access" ON transfers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Transfers insert access" ON transfers FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));
CREATE POLICY "Transfers update access" ON transfers FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'region_admin'));

-- ============================================================================
-- 10. BUDGETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zones(id),
  region_id UUID REFERENCES regions(id),
  country_id UUID REFERENCES countries(id),
  category VARCHAR(20) NOT NULL,
  allocated_amount DECIMAL(15, 2) NOT NULL,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zone_id, region_id, country_id, category, month, year)
);

CREATE INDEX IF NOT EXISTS idx_budgets_zone ON budgets(zone_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(year, month);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Budget read access" ON budgets FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' IN ('finance_admin', 'admin'));
CREATE POLICY "Budget insert access" ON budgets FOR INSERT TO authenticated WITH CHECK (auth.j 'role' INwt() ->> ('finance_admin', 'admin'));

-- ============================================================================
-- 11. HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
 FUNCTION update_updated_atCREATE OR REPLACE_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on new tables
CREATE TRIGGER countries_update_timestamp BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER financial_records ON financial_records
_update_timestamp BEFORE UPDATE  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER attendance_update_timestamp BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER events_update_timestamp BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER notifications_update_timestamp BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER transfers_update_timestamp BEFORE UPDATE ON transfers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER budgets_update_timestamp BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 12. SEED DATA FOR COUNTRIES
-- ============================================================================
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

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
`;

export default COMPLETE_SCHEMA_SQL;
