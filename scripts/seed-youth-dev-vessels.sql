-- Idempotent: safe to run multiple times on production
-- Adds the 4 youth development class vessels and links them to the kids-development-program trip

DO $$
DECLARE
  v_trip_id    int;
  v_littles    int;
  v_opti       int;
  v_420        int;
  v_saisa      int;
BEGIN
  -- Resolve trip id by slug (safe on any environment)
  SELECT id INTO v_trip_id FROM sh_trips WHERE slug = 'kids-development-program';
  IF v_trip_id IS NULL THEN
    RAISE NOTICE 'kids-development-program trip not found — skipping vessel seed';
    RETURN;
  END IF;

  -- Upsert vessels by name so re-runs are safe
  INSERT INTO sh_vessels (name, description, capacity, price_cents, price_display, image_url, active, sort_order)
  VALUES ('Sailing Littles', 'Optimist intro sailing · Ages 6–9', 8, 9500, '$95 / session', NULL, true, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_littles FROM sh_vessels WHERE name = 'Sailing Littles';

  INSERT INTO sh_vessels (name, description, capacity, price_cents, price_display, image_url, active, sort_order)
  VALUES ('Opti Green Fleet', 'Competitive Optimist racing · Ages 9–13', 8, 20000, '$200 / session', NULL, true, 2)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_opti FROM sh_vessels WHERE name = 'Opti Green Fleet';

  INSERT INTO sh_vessels (name, description, capacity, price_cents, price_display, image_url, active, sort_order)
  VALUES ('420 Teens', 'High-performance dinghy · Teamwork & tactics · Ages 12–18', 8, 29500, '$295 / session', NULL, true, 3)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_420 FROM sh_vessels WHERE name = '420 Teens';

  INSERT INTO sh_vessels (name, description, capacity, price_cents, price_display, image_url, active, sort_order)
  VALUES ('SAISA High School', 'Interscholastic competitive sailing · Grades 8–12 · Payment plans available', 8, 69500, '$695 / session', NULL, true, 4)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_saisa FROM sh_vessels WHERE name = 'SAISA High School';

  -- Link vessels to trip (skip if already linked)
  INSERT INTO sh_trip_vessels (trip_id, vessel_id, active)
    SELECT v_trip_id, v_littles, true WHERE NOT EXISTS (
      SELECT 1 FROM sh_trip_vessels WHERE trip_id = v_trip_id AND vessel_id = v_littles);

  INSERT INTO sh_trip_vessels (trip_id, vessel_id, active)
    SELECT v_trip_id, v_opti, true WHERE NOT EXISTS (
      SELECT 1 FROM sh_trip_vessels WHERE trip_id = v_trip_id AND vessel_id = v_opti);

  INSERT INTO sh_trip_vessels (trip_id, vessel_id, active)
    SELECT v_trip_id, v_420, true WHERE NOT EXISTS (
      SELECT 1 FROM sh_trip_vessels WHERE trip_id = v_trip_id AND vessel_id = v_420);

  INSERT INTO sh_trip_vessels (trip_id, vessel_id, active)
    SELECT v_trip_id, v_saisa, true WHERE NOT EXISTS (
      SELECT 1 FROM sh_trip_vessels WHERE trip_id = v_trip_id AND vessel_id = v_saisa);

  RAISE NOTICE 'Youth dev vessels seeded: trip_id=%, vessels=[%, %, %, %]',
    v_trip_id, v_littles, v_opti, v_420, v_saisa;
END;
$$;
