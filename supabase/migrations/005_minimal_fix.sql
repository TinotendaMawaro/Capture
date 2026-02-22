-- Minimal migration - only add columns if tables exist

-- REGIONS
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'regions') THEN
    ALTER TABLE regions ADD COLUMN IF NOT EXISTS country TEXT;
  END IF;
END $$;

-- ZONES
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'zones') THEN
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS zone_code TEXT;
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS city TEXT;
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 8);
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS longitude NUMERIC(11, 8);
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS contact_person TEXT;
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS contact_email TEXT;
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS contact_phone TEXT;
  END IF;
END $$;

-- DEPARTMENTS
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'departments') THEN
    ALTER TABLE departments ADD COLUMN IF NOT EXISTS dep_code TEXT;
    ALTER TABLE departments ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE departments ADD COLUMN IF NOT EXISTS hod_id UUID;
  END IF;
END $$;

-- PASTORS
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pastors') THEN
    ALTER TABLE pastors ADD COLUMN IF NOT EXISTS date_of_birth DATE;
    ALTER TABLE pastors ADD COLUMN IF NOT EXISTS gender TEXT;
    ALTER TABLE pastors ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
    ALTER TABLE pastors ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- DEACONS
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deacons') THEN
    ALTER TABLE deacons ADD COLUMN IF NOT EXISTS date_of_birth DATE;
    ALTER TABLE deacons ADD COLUMN IF NOT EXISTS gender TEXT;
    ALTER TABLE deacons ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
    ALTER TABLE deacons ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Grant permissions to service role
GRANT ALL ON regions TO service_role;
GRANT ALL ON zones TO service_role;
GRANT ALL ON departments TO service_role;
GRANT ALL ON pastors TO service_role;
GRANT ALL ON deacons TO service_role;
