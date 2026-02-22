-- Fix RLS policies for service role and public read access

-- Grant all permissions to service_role (bypasses RLS)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Make regions publicly readable
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'regions') THEN
    DROP POLICY IF EXISTS regions_user_select ON regions;
    CREATE POLICY regions_public_select ON regions FOR SELECT USING (true);
  END IF;
END $$;

-- Make zones publicly readable
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'zones') THEN
    DROP POLICY IF EXISTS zones_user_select ON zones;
    CREATE POLICY zones_public_select ON zones FOR SELECT USING (true);
  END IF;
END $$;

-- Make pastors publicly readable
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pastors') THEN
    DROP POLICY IF EXISTS pastors_user_select ON pastors;
    CREATE POLICY pastors_public_select ON pastors FOR SELECT USING (true);
  END IF;
END $$;

-- Make deacons publicly readable
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deacons') THEN
    DROP POLICY IF EXISTS deacons_user_select ON deacons;
    CREATE POLICY deacons_public_select ON deacons FOR SELECT USING (true);
  END IF;
END $$;

-- Make departments publicly readable
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'departments') THEN
    DROP POLICY IF EXISTS departments_user_select ON departments;
    CREATE POLICY departments_public_select ON departments FOR SELECT USING (true);
  END IF;
END $$;
