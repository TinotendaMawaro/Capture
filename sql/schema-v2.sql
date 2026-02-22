-- ============================================================================
-- HEARTFELT INTERNATIONAL MINISTRIES
-- National-Scale Code Structure (Version 2)
-- 
-- Format: R + region_code(2) + zone_code(2) + role_letter + sequence_number
-- Examples:
--   Zone: R0101 (Region 01, Zone 01)
--   Pastor: R0101P1, R0101P2
--   Deacon: R0101D1, R0203D4
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. REGIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regions_code ON regions(region_code);
CREATE INDEX idx_regions_country ON regions(country);

-- ============================================================================
-- 2. ZONES TABLE (V2 Format: R + region(2) + zone(2) = 4 digits)
-- ============================================================================
CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id UUID NOT NULL REFERENCES regions(id) ON DELETE RESTRICT,
  zone_code TEXT NOT NULL,
  full_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_coordinates CHECK (
    (latitude IS NULL AND longitude IS NULL) OR
    (latitude IS NOT NULL AND longitude IS NOT NULL AND
     latitude >= -90 AND latitude <= 90 AND
     longitude >= -180 AND longitude <= 180)
  )
);

CREATE INDEX idx_zones_region_id ON zones(region_id);
CREATE INDEX idx_zones_full_code ON zones(full_code);
CREATE INDEX idx_zones_coordinates ON zones(latitude, longitude);

-- ============================================================================
-- 3. DEPARTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
  dep_code TEXT NOT NULL,
  full_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  hod_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_dep_per_zone UNIQUE (zone_id, dep_code)
);

CREATE INDEX idx_departments_zone_id ON departments(zone_id);
CREATE INDEX idx_departments_full_code ON departments(full_code);
CREATE INDEX idx_departments_hod_id ON departments(hod_id);

-- ============================================================================
-- 4. PASTORS TABLE (V2 Format: R + region(2) + zone(2) + P + number)
-- ============================================================================
CREATE TABLE IF NOT EXISTS pastors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
  full_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  qr_code_url TEXT,
  transfer_history JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pastors_zone_id ON pastors(zone_id);
CREATE INDEX idx_pastors_full_code ON pastors(full_code);
CREATE INDEX idx_pastors_email ON pastors(email);
CREATE INDEX idx_pastors_active ON pastors(is_active);

-- ============================================================================
-- 5. DEACONS TABLE (V2 Format: R + region(2) + zone(2) + D + number)
-- ============================================================================
CREATE TABLE IF NOT EXISTS deacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
  full_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  qr_code_url TEXT,
  transfer_history JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deacons_zone_id ON deacons(zone_id);
CREATE INDEX idx_deacons_full_code ON deacons(full_code);
CREATE INDEX idx_deacons_email ON deacons(email);
CREATE INDEX idx_deacons_active ON deacons(is_active);

-- ============================================================================
-- 6. CHURCH_MEMBERS TABLE (V2 Format: R + region(2) + zone(2) + M + number)
-- ============================================================================
CREATE TABLE IF NOT EXISTS church_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
  full_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  membership_date DATE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_church_members_zone_id ON church_members(zone_id);
CREATE INDEX idx_church_members_full_code ON church_members(full_code);
CREATE INDEX idx_church_members_email ON church_members(email);
CREATE INDEX idx_church_members_department_id ON church_members(department_id);
CREATE INDEX idx_church_members_active ON church_members(is_active);

-- ============================================================================
-- 7. USERS TABLE (Authentication & Authorization)
-- ============================================================================
CREATE TYPE user_role AS ENUM ('admin', 'pastor', 'deacon', 'hod', 'member');

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  first_name TEXT,
  last_name TEXT,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  related_entity_id UUID,
  related_entity_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_zone_id ON users(zone_id);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================================================
-- 8. ACTIVITY_LOG TABLE (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);

-- ============================================================================
-- 9. TRANSFERS LOG TABLE (Track pastors/HODs movements)
-- ============================================================================
CREATE TYPE transfer_type AS ENUM ('pastor', 'hod', 'deacon');

CREATE TABLE IF NOT EXISTS transfers_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transfer_type transfer_type NOT NULL,
  person_id UUID NOT NULL,
  person_name TEXT NOT NULL,
  from_zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  to_zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  from_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  to_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  transfer_date DATE NOT NULL,
  reason TEXT,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transfers_person_id ON transfers_log(person_id);
CREATE INDEX idx_transfers_from_zone ON transfers_log(from_zone_id);
CREATE INDEX idx_transfers_to_zone ON transfers_log(to_zone_id);
CREATE INDEX idx_transfers_date ON transfers_log(transfer_date);

-- ============================================================================
-- 10. QR_CODES TABLE (Store QR code metadata)
-- ============================================================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  full_code TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  qr_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_entity_qr UNIQUE (entity_type, entity_id)
);

CREATE INDEX idx_qr_codes_entity ON qr_codes(entity_type, entity_id);
CREATE INDEX idx_qr_codes_full_code ON qr_codes(full_code);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastors ENABLE ROW LEVEL SECURITY;
ALTER TABLE deacons ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- REGIONS RLS: Admins see all, others see their region zones
CREATE POLICY regions_admin_all ON regions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY regions_user_select ON regions FOR SELECT
  USING (true);

-- ZONES RLS: Admins see all, others see their zone
CREATE POLICY zones_admin_all ON zones FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY zones_user_select ON zones FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    id = (SELECT zone_id FROM users WHERE id = auth.uid())
  );

-- PASTORS RLS
CREATE POLICY pastors_admin_all ON pastors FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY pastors_user_select ON pastors FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    zone_id = (SELECT zone_id FROM users WHERE id = auth.uid()) OR
    id = (SELECT related_entity_id FROM users WHERE id = auth.uid() AND related_entity_type = 'pastor')
  );

-- DEACONS RLS
CREATE POLICY deacons_admin_all ON deacons FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY deacons_user_select ON deacons FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    zone_id = (SELECT zone_id FROM users WHERE id = auth.uid()) OR
    id = (SELECT related_entity_id FROM users WHERE id = auth.uid() AND related_entity_type = 'deacon')
  );

-- CHURCH_MEMBERS RLS
CREATE POLICY members_admin_all ON church_members FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY members_user_select ON church_members FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    zone_id = (SELECT zone_id FROM users WHERE id = auth.uid()) OR
    id = (SELECT related_entity_id FROM users WHERE id = auth.uid() AND related_entity_type = 'member')
  );

-- DEPARTMENTS RLS
CREATE POLICY departments_admin_all ON departments FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY departments_user_select ON departments FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    zone_id = (SELECT zone_id FROM users WHERE id = auth.uid())
  );

-- USERS RLS: Users see own profile, admins see all
CREATE POLICY users_own_profile ON users FOR SELECT
  USING (
    auth.uid() = id OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY users_admin_all ON users FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ACTIVITY LOG RLS: Admins see all, users see their own
CREATE POLICY activity_log_admin ON activity_log FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY activity_log_own ON activity_log FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_log (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_old_values, p_new_values)
  RETURNING id INTO v_log_id;
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- NATIONAL-SCALE ID GENERATION FUNCTIONS (V2)
-- ============================================================================
-- Format: R + region_code(2) + zone_code(2) + role_letter + sequence_number
-- Examples: R0101P1, R0101D1, R0203D4

-- Function to generate unique zone ID (V2)
-- Format: R + region_code(2) + zone_code(2) - e.g., R0101, R0102
-- Uses row-level locking to ensure uniqueness
CREATE OR REPLACE FUNCTION generate_zone_id_v2(p_region_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_region RECORD;
  v_zone_count INTEGER;
  v_zone_number TEXT;
  v_full_code TEXT;
BEGIN
  -- Get region info
  SELECT region_code INTO v_region
  FROM regions
  WHERE id = p_region_id;

  IF v_region IS NULL THEN
    RAISE EXCEPTION 'Region not found: %', p_region_id;
  END IF;

  -- Lock and count existing zones in this region to get next number
  LOCK TABLE zones IN ACCESS EXCLUSIVE MODE;
  
  SELECT COALESCE(MAX(zone_code::INTEGER), 0) + 1 INTO v_zone_count
  FROM zones
  WHERE region_id = p_region_id;

  -- Format: R + region_code (without R prefix) + padded zone number (2 digits)
  v_zone_number := LPAD(v_zone_count::TEXT, 2, '0');
  v_full_code := 'R' || SUBSTRING(v_region.region_code FROM 2 FOR 2) || v_zone_number;

  RETURN v_full_code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique pastor ID (V2)
-- Format: R + region_code(2) + zone_code(2) + P + sequential_number - e.g., R0101P1
-- Uses row-level locking to ensure uniqueness
CREATE OR REPLACE FUNCTION generate_pastor_id_v2(p_zone_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_zone RECORD;
  v_region RECORD;
  v_pastor_count INTEGER;
  v_pastor_number TEXT;
  v_full_code TEXT;
BEGIN
  -- Get zone and region info
  SELECT z.full_code, z.region_id, r.region_code INTO v_zone, v_region
  FROM zones z
  JOIN regions r ON z.region_id = r.id
  WHERE z.id = p_zone_id;

  IF v_zone IS NULL THEN
    RAISE EXCEPTION 'Zone not found: %', p_zone_id;
  END IF;

  -- Lock and count existing pastors in this zone to get next number
  LOCK TABLE pastors IN ACCESS EXCLUSIVE MODE;
  
  -- Get max pastor number for this zone
  SELECT COALESCE(MAX(
    CASE 
      WHEN full_code ~ 'P([0-9]+)$' THEN SUBSTRING(full_code FROM 'P([0-9]+)$')::INTEGER
      ELSE 0
    END
  ), 0) + 1 INTO v_pastor_count
  FROM pastors
  WHERE zone_id = p_zone_id;

  -- Format: zone_full_code + P + number (no padding, so P1, P2, etc.)
  v_pastor_number := v_pastor_count::TEXT;
  v_full_code := v_zone.full_code || 'P' || v_pastor_number;

  RETURN v_full_code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique deacon ID (V2)
-- Format: R + region_code(2) + zone_code(2) + D + sequential_number - e.g., R0101D1
-- Uses row-level locking to ensure uniqueness
CREATE OR REPLACE FUNCTION generate_deacon_id_v2(p_zone_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_zone RECORD;
  v_deacon_count INTEGER;
  v_deacon_number TEXT;
  v_full_code TEXT;
BEGIN
  -- Get zone info
  SELECT full_code INTO v_zone
  FROM zones
  WHERE id = p_zone_id;

  IF v_zone IS NULL THEN
    RAISE EXCEPTION 'Zone not found: %', p_zone_id;
  END IF;

  -- Lock and count existing deacons in this zone to get next number
  LOCK TABLE deacons IN ACCESS EXCLUSIVE MODE;
  
  -- Get max deacon number for this zone
  SELECT COALESCE(MAX(
    CASE 
      WHEN full_code ~ 'D([0-9]+)$' THEN SUBSTRING(full_code FROM 'D([0-9]+)$')::INTEGER
      ELSE 0
    END
  ), 0) + 1 INTO v_deacon_count
  FROM deacons
  WHERE zone_id = p_zone_id;

  -- Format: zone_full_code + D + number (no padding, so D1, D2, etc.)
  v_deacon_number := v_deacon_count::TEXT;
  v_full_code := v_zone.full_code || 'D' || v_deacon_number;

  RETURN v_full_code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique department ID (V2)
-- Format: R + region_code(2) + zone_code(2) + DEP + sequential_number
-- Uses row-level locking to ensure uniqueness
CREATE OR REPLACE FUNCTION generate_department_id_v2(p_zone_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_zone RECORD;
  v_dep_count INTEGER;
  v_dep_number TEXT;
  v_full_code TEXT;
BEGIN
  -- Get zone info
  SELECT full_code INTO v_zone
  FROM zones
  WHERE id = p_zone_id;

  IF v_zone IS NULL THEN
    RAISE EXCEPTION 'Zone not found: %', p_zone_id;
  END IF;

  -- Lock and count existing departments in this zone to get next number
  LOCK TABLE departments IN ACCESS EXCLUSIVE MODE;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN full_code ~ 'DEP([0-9]+)$' THEN SUBSTRING(full_code FROM 'DEP([0-9]+)$')::INTEGER
      ELSE 0
    END
  ), 0) + 1 INTO v_dep_count
  FROM departments
  WHERE zone_id = p_zone_id;

  -- Format: zone_full_code + DEP + padded number (2 digits)
  v_dep_number := LPAD(v_dep_count::TEXT, 2, '0');
  v_full_code := v_zone.full_code || 'DEP' || v_dep_number;

  RETURN v_full_code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique member ID (V2)
-- Format: R + region_code(2) + zone_code(2) + M + sequential_number
-- Uses row-level locking to ensure uniqueness
CREATE OR REPLACE FUNCTION generate_member_id_v2(p_zone_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_zone RECORD;
  v_member_count INTEGER;
  v_member_number TEXT;
  v_full_code TEXT;
BEGIN
  -- Get zone info
  SELECT full_code INTO v_zone
  FROM zones
  WHERE id = p_zone_id;

  IF v_zone IS NULL THEN
    RAISE EXCEPTION 'Zone not found: %', p_zone_id;
  END IF;

  -- Lock and count existing members in this zone to get next number
_members IN ACCESS EX  LOCK TABLE churchCLUSIVE MODE;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN full_code ~ 'M([0-9]+)$' THEN SUBSTRING(full_code FROM 'M([0-9]+)$')::INTEGER
      ELSE 0
    END
  ), 0) + 1 INTO v_member_count
  FROM church_members
  WHERE zone_id = p_zone_id;

  -- Format: zone_full_code + M + padded number (3 digits for members)
  v_member_number := LPAD(v_member_count::TEXT, 3, '0');
  v_full_code := v_zone.full_code || 'M' || v_member_number;

  RETURN v_full_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- UNIFIED CODE GENERATION FUNCTION
-- ============================================================================
-- Usage: SELECT * FROM generate_entity_code('pastor', 'zone-uuid')
--        SELECT * FROM generate_entity_code('deacon', 'zone-uuid')
CREATE OR REPLACE FUNCTION generate_entity_code(
  p_entity_type TEXT,
  p_zone_id UUID
)
RETURNS TABLE(full_code TEXT) AS $$
DECLARE
  v_full_code TEXT;
BEGIN
  CASE p_entity_type
    WHEN 'pastor' THEN
      v_full_code := generate_pastor_id_v2(p_zone_id);
    WHEN 'deacon' THEN
      v_full_code := generate_deacon_id_v2(p_zone_id);
    WHEN 'department' THEN
      v_full_code := generate_department_id_v2(p_zone_id);
    WHEN 'member' THEN
      v_full_code := generate_member_id_v2(p_zone_id);
    ELSE
      RAISE EXCEPTION 'Invalid entity type: %', p_entity_type;
  END CASE;

  RETURN QUERY SELECT v_full_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- HELPER FUNCTION: Get next ID number without creating entity
-- ============================================================================
CREATE OR REPLACE FUNCTION get_next_id_number_v2(
  p_entity_type TEXT,
  p_zone_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  CASE p_entity_type
    WHEN 'pastor' THEN
      SELECT COALESCE(MAX(
        CASE 
          WHEN full_code ~ 'P([0-9]+)$' THEN SUBSTRING(full_code FROM 'P([0-9]+)$')::INTEGER
          ELSE 0
        END
      ), 0) + 1 INTO v_count
      FROM pastors
      WHERE zone_id = p_zone_id;
      
    WHEN 'deacon' THEN
      SELECT COALESCE(MAX(
        CASE 
          WHEN full_code ~ 'D([0-9]+)$' THEN SUBSTRING(full_code FROM 'D([0-9]+)$')::INTEGER
          ELSE 0
        END
      ), 0) + 1 INTO v_count
      FROM deacons
      WHERE zone_id = p_zone_id;
      
    WHEN 'department' THEN
      SELECT COALESCE(MAX(
        CASE 
          WHEN full_code ~ 'DEP([0-9]+)$' THEN SUBSTRING(full_code FROM 'DEP([0-9]+)$')::INTEGER
          ELSE 0
        END
      ), 0) + 1 INTO v_count
      FROM departments
      WHERE zone_id = p_zone_id;
      
    WHEN 'member' THEN
      SELECT COALESCE(MAX(
        CASE 
          WHEN full_code ~ 'M([0-9]+)$' THEN SUBSTRING(full_code FROM 'M([0-9]+)$')::INTEGER
          ELSE 0
        END
      ), 0) + 1 INTO v_count
      FROM church_members
      WHERE zone_id = p_zone_id;
      
    ELSE
      RAISE EXCEPTION 'Invalid entity type: %', p_entity_type;
  END CASE;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VALIDATION FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION is_valid_id_format_v2(p_full_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Zone format: R\d{4}
  IF p_full_code ~ '^R\d{4}$' THEN
    RETURN TRUE;
  END IF;
  
  -- Pastor format: R\d{4}P\d+
  IF p_full_code ~ '^R\d{4}P\d+$' THEN
    RETURN TRUE;
  END IF;
  
  -- Deacon format: R\d{4}D\d+
  IF p_full_code ~ '^R\d{4}D\d+$' THEN
    RETURN TRUE;
  END IF;
  
  -- Department format: R\d{4}DEP\d{2}
  IF p_full_code ~ '^R\d{4}DEP\d{2}$' THEN
    RETURN TRUE;
  END IF;
  
  -- Member format: R\d{4}M\d{3}
  IF p_full_code ~ '^R\d{4}M\d{3}$' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
