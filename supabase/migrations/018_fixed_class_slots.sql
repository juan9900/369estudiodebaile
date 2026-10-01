-- ============================================================
-- 369 Estudio de Baile – Clases fijas multi-día + ciclo rodante
--
-- Replaces the single classes.weekday with a child table of weekly slots
-- (a fixed class can now meet on several days, each with its own time
-- range), and replaces the "monthly calendar + prorate" cycle with a
-- rolling 4-occurrences-per-slot cycle anchored on the student's join date.
-- No prorating anymore: the cycle price is always the flat classes.price.
--
-- Verified before writing this migration: production has exactly one
-- 'fijas' class and zero registrations with cycle_month set, so the
-- backfill/column changes below carry no data-loss risk.
-- ============================================================

-- ------------------------------------------------------------
-- 1. fixed_class_slots: one row per weekday a fixed class meets on.
-- ------------------------------------------------------------
CREATE TABLE fixed_class_slots (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  weekday    SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Sunday..6=Saturday, matches Date.getUTCDay()
  start_time TIME NOT NULL,
  end_time   TIME NOT NULL CHECK (end_time > start_time),
  UNIQUE (class_id, weekday)
);

COMMENT ON TABLE fixed_class_slots IS
  'Weekly meeting times for a class_type = ''fijas'' class. One row per weekday it meets on (e.g. Tue+Thu 6-7pm, Sat 9-10am). classes.weekday/start_time/end_time mirror the earliest slot — see trg_sync_class_primary_slot.';

CREATE INDEX idx_fixed_slots_class ON fixed_class_slots(class_id);

ALTER TABLE fixed_class_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fixed_class_slots: read all" ON fixed_class_slots
  FOR SELECT USING (true);

CREATE POLICY "fixed_class_slots: admin write" ON fixed_class_slots
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ------------------------------------------------------------
-- 2. Keep classes.weekday/start_time/end_time as a derived mirror of the
-- earliest slot (lowest weekday, then lowest start_time). This avoids
-- making start_time/end_time nullable, which dozens of TS call sites read
-- as non-null strings. The only real write target going forward is
-- fixed_class_slots; the trigger reconciles classes after every change.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sync_class_primary_slot() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  target UUID := COALESCE(NEW.class_id, OLD.class_id);
BEGIN
  UPDATE classes c SET
    weekday    = s.weekday,
    start_time = s.start_time,
    end_time   = s.end_time
  FROM (
    SELECT weekday, start_time, end_time FROM fixed_class_slots
    WHERE class_id = target ORDER BY weekday, start_time LIMIT 1
  ) s
  WHERE c.id = target;
  RETURN NULL;
END $$;

CREATE TRIGGER trg_sync_class_primary_slot
AFTER INSERT OR UPDATE OR DELETE ON fixed_class_slots
FOR EACH ROW EXECUTE FUNCTION sync_class_primary_slot();

-- ------------------------------------------------------------
-- 3. Backfill: the one existing 'fijas' class becomes its own single slot.
-- ------------------------------------------------------------
INSERT INTO fixed_class_slots (class_id, weekday, start_time, end_time)
SELECT id, weekday, start_time, end_time FROM classes
WHERE class_type = 'fijas' AND weekday IS NOT NULL
ON CONFLICT (class_id, weekday) DO NOTHING;

-- ------------------------------------------------------------
-- 4. Future start date + scheduled publication for fixed classes.
-- RLS on classes is `USING (true)` for SELECT, so publication is enforced
-- by the app's public queries (same pattern already used for is_active),
-- not by RLS.
-- ------------------------------------------------------------
ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS starts_on    DATE,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

COMMENT ON COLUMN classes.starts_on IS
  'For class_type = ''fijas'': earliest date the class can be taught. No session or cycle is generated before this date. NULL = available immediately.';
COMMENT ON COLUMN classes.published_at IS
  'Timestamp from which the class is visible on the public site. NULL = visible as soon as is_active. The admin panel always sees it regardless.';

-- ------------------------------------------------------------
-- 5. Rolling-cycle columns on registrations, replacing the calendar-month
-- cycle_month/cycle_first_session (no rows use them yet — safe to drop).
-- cycle_sessions is kept: it is now 4 * number of slots instead of always 4.
-- ------------------------------------------------------------
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS cycle_start_date DATE,  -- first session included
  ADD COLUMN IF NOT EXISTS cycle_end_date   DATE;  -- last session included

COMMENT ON COLUMN registrations.cycle_start_date IS
  'For a fixed-class (fijas) registration: date of the first session included in this rolling cycle.';
COMMENT ON COLUMN registrations.cycle_end_date IS
  'For a fixed-class (fijas) registration: date of the last session included in this rolling cycle.';
COMMENT ON COLUMN registrations.cycle_sessions IS
  'Number of sessions covered by this registration''s cycle (SESSIONS_PER_CYCLE * number of weekly slots on the class).';

DROP INDEX IF EXISTS idx_reg_cycle;
DROP VIEW IF EXISTS fixed_class_cycle_enrollment;
ALTER TABLE registrations
  DROP COLUMN IF EXISTS cycle_month,
  DROP COLUMN IF EXISTS cycle_first_session;

-- Unique index must still allow the same student to buy the same fixed
-- class again for a later cycle. COALESCE is required because Postgres
-- treats NULLs as distinct in unique indexes — without it, dated-class
-- registrations (always NULL here) would stop deduplicating.
DROP INDEX IF EXISTS idx_reg_guest_unique;
CREATE UNIQUE INDEX idx_reg_guest_unique
  ON registrations (class_id, contact_email, COALESCE(cycle_start_date, DATE '1900-01-01'));

CREATE INDEX idx_reg_cycle_window ON registrations(class_id, cycle_start_date, cycle_end_date)
  WHERE cycle_start_date IS NOT NULL;

-- ------------------------------------------------------------
-- 6. Per-window capacity view, replacing the calendar-month
-- fixed_class_cycle_enrollment. A view can't be parameterized by date, and
-- a SECURITY DEFINER function reachable by anon is needless attack surface,
-- so the app computes overlap client-side against the exposed windows.
-- No PII is exposed, matching the criteria used by the 017 view — note
-- this intentionally has NO security_invoker, because registrations has no
-- SELECT policy for anon; the view must run as its owner to be readable by
-- anon/authenticated at all, same as the 017 view.
-- ------------------------------------------------------------
CREATE VIEW fixed_class_enrollment_windows AS
SELECT class_id, cycle_start_date, cycle_end_date
FROM registrations
WHERE cycle_start_date IS NOT NULL AND status IN ('pending', 'confirmed');

GRANT SELECT ON fixed_class_enrollment_windows TO anon, authenticated;
