/**
 * Setup SQL Functions for National Scale Code Generation
 * 
 * This script creates the required PostgreSQL functions in Supabase
 * for auto-generating unique codes for zones, pastors, and deacons.
 * 
 * Run with: npx ts-node scripts/setup-sql-functions.ts
 * Or add to package.json: "setup-functions": "ts-node scripts/setup-sql-functions.ts"
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sqlFunctions = `
-- ============================================================================
-- HEARTFELT INTERNATIONAL MINISTRIES
-- SQL Init - Safe Auto-Generation Functions
-- National Scale Ready: R + region(2) + zone(2) + role + number
-- ============================================================================

-- FULL_CODE GENERATION FUNCTION (National Scale)
CREATE OR REPLACE FUNCTION generate_full_code(
  p_entity_type TEXT,
  p_zone_code TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_count INTEGER;
  v_full_code TEXT;
BEGIN
  IF p_entity_type NOT IN ('P', 'D') THEN
    RAISE EXCEPTION 'Invalid entity type: %. Use P for pastor, D for deacon', p_entity_type;
  END IF;

  IF p_entity_type = 'P' THEN
    SELECT COALESCE(MAX(CAST(substring(full_code FROM 'P([0-9]+)$') AS INTEGER)), 0) + 1
    INTO v_count
    FROM pastors
    WHERE full_code LIKE p_zone_code || 'P%';
    
    v_full_code := p_zone_code || 'P' || v_count;
  END IF;

  IF p_entity_type = 'D' THEN
    SELECT COALESCE(MAX(CAST(substring(full_code FROM 'D([0-9]+)$') AS INTEGER)), 0) + 1
    INTO v_count
    FROM deacons
    WHERE full_code LIKE p_zone_code || 'D%';
    
    v_full_code := p_zone_code || 'D' || v_count;
  END IF;

  RETURN v_full_code;
END;
$$ LANGUAGE plpgsql;

-- ZONE CODE GENERATION (National Scale: R + region(2) + zone(2))
CREATE OR REPLACE FUNCTION generate_zone_code(
  p_region_code TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_count INTEGER;
  v_zone_code TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(substring(full_code FROM 4 FOR 2) AS INTEGER)), 0) + 1
  INTO v_count
  FROM zones
  WHERE full_code LIKE 'R' || p_region_code || '%';
  
  v_zone_code := 'R' || p_region_code || LPAD(v_count::TEXT, 2, '0');
  
  RETURN v_zone_code;
END;
$$ LANGUAGE plpgsql;

-- REGION CODE GENERATION
CREATE OR REPLACE FUNCTION generate_region_code()
RETURNS TEXT AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(region_code AS INTEGER)), 0) + 1
  INTO v_count
  FROM regions;
  
  RETURN LPAD(v_count::TEXT, 2, '0');
END;
$$ LANGUAGE plpgsql;
`

async function setupFunctions() {
  console.log('Setting up SQL functions for National Scale Code Generation...')
  console.log('')
  
  try {
    // Execute the SQL using Supabase's rpc to run raw SQL
    // We'll use the SQL directly via the REST API or pg system
    
    console.log('SQL Functions to be created:')
    console.log('1. generate_full_code(p_entity_type, p_zone_code)')
    console.log('   - Generates codes like R0101P1, R0101D1')
    console.log('')
    console.log('2. generate_zone_code(p_region_code)')
    console.log('   - Generates codes like R0101, R0102')
    console.log('')
    console.log('3. generate_region_code()')
    console.log('   - Generates codes like 01, 02')
    console.log('')
    
    // Note: We can't directly execute raw SQL from the client
    // The user needs to run this in Supabase Dashboard SQL Editor
    console.log('='.repeat(60))
    console.log('IMPORTANT: Please run the following SQL in your Supabase')
    console.log('SQL Editor (https://supabase.com/dashboard/sql-editor):')
    console.log('='.repeat(60))
    console.log('')
    console.log(sqlFunctions)
    console.log('')
    console.log('='.repeat(60))
    console.log('')
    console.log('Or alternatively:')
    console.log('1. Go to Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of sql/init.sql')
    console.log('4. Click Run to execute')
    console.log('')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

setupFunctions()
