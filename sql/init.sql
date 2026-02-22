-- ============================================================================
-- HEARTFELT INTERNATIONAL MINISTRIES
-- SQL Init - Safe Auto-Generation Functions
-- National Scale Ready: R + region(2) + zone(2) + role + number
-- ============================================================================

-- ============================================================================
-- FULL_CODE GENERATION FUNCTION (National Scale)
-- ============================================================================
-- Usage: 
--   SELECT generate_full_code('P', 'R0101') -> R0101P1
--   SELECT generate_full_code('D', 'R0101') -> R0101D1
--   SELECT generate_full_code('D', 'R0203') -> R0203D1
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_full_code(
  p_entity_type TEXT,
  p_zone_code TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_count INTEGER;
  v_full_code TEXT;
BEGIN
  -- Validate entity type
  IF p_entity_type NOT IN ('P', 'D') THEN
    RAISE EXCEPTION 'Invalid entity type: %. Use P for pastor, D for deacon', p_entity_type;
  END IF;

  -- For Pastors (P) - uses pastor_code column
  IF p_entity_type = 'P' THEN
    SELECT COALESCE(MAX(CAST(substring(pastor_code FROM 'P([0-9]+)$') AS INTEGER)), 0) + 1
    INTO v_count
    FROM pastors
    WHERE pastor_code LIKE p_zone_code || 'P%';
    
    v_full_code := p_zone_code || 'P' || v_count;
  END IF;

  -- For Deacons (D) - uses full_code column
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

-- ============================================================================
-- TEST THE FUNCTION
-- ============================================================================
-- SELECT generate_full_code('P', 'R0101'); -- Should return R0101P1 (first pastor)
-- SELECT generate_full_code('D', 'R0101'); -- Should return R0101D1 (first deacon)
-- SELECT generate_full_code('P', 'R0101'); -- Should return R0101P2 (second pastor)

-- ============================================================================
-- ZONE CODE GENERATION (National Scale: R + region(2) + zone(2))
-- ============================================================================
-- Example: R0101 (Region 01, Zone 01)
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_zone_code(
  p_region_code TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_count INTEGER;
  v_zone_code TEXT;
BEGIN
  -- Get next zone number for this region
  SELECT COALESCE(MAX(CAST(substring(full_code FROM 4 FOR 2) AS INTEGER)), 0) + 1
  INTO v_count
  FROM zones
  WHERE full_code LIKE 'R' || p_region_code || '%';
  
  -- Format: R + region_code(2) + zone_number(2)
  v_zone_code := 'R' || p_region_code || LPAD(v_count::TEXT, 2, '0');
  
  RETURN v_zone_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REGION CODE GENERATION
-- ============================================================================

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

-- ============================================================================
-- END OF SQL INIT
-- ============================================================================
