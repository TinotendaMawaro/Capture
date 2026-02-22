-- Simple migration to fix all permissions
-- Run this in Supabase SQL Editor

-- Grant anon and authenticated roles access to all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Disable RLS for development (optional - for production, configure proper policies)
-- ALTER TABLE regions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE zones DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE pastors DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE deacons DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
