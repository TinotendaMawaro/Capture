-- ============================================================================
-- Fix generate_full_code function for actual column names
-- National Scale: R + region(2) + zone(2) + role + number
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
