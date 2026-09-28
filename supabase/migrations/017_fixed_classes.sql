-- ============================================================
-- 369 Estudio de Baile – Clases fijas (recurring monthly-cycle classes)
--
-- Adds a new 'fijas' class_type: a class with a recurring weekly schedule
-- (weekday + time) instead of a single scheduled_date. Students buy a
-- monthly cycle of 4 sessions (the first 4 occurrences of that weekday in
-- the month). Existing 'masterclass' rows are archived — masterclasses are
-- discontinued and are not converted to anything.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Reconcile the class_type CHECK constraint.
--
-- Migration 010 declared CHECK (class_type IN ('individual','masterclass',
-- 'proyecto')), but the live database was altered out-of-band and actually
-- holds 'clases'/'masterclass'/'proyectos'. The live constraint's name is
-- unknown, so we discover and drop whatever CHECK constraint currently
-- governs class_type instead of assuming migration 010's shape or name.
-- ------------------------------------------------------------
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.classes'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%class_type%'
  LOOP
    EXECUTE format('ALTER TABLE classes DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- Normalize any surviving migration-010-era values (no-op on the live DB,
-- but keeps a fresh `supabase db reset` replay of 001->016 consistent).
UPDATE classes SET class_type = 'clases'    WHERE class_type = 'individual';
UPDATE classes SET class_type = 'proyectos' WHERE class_type = 'proyecto';

ALTER TABLE classes ALTER COLUMN class_type SET DEFAULT 'clases';
ALTER TABLE classes ADD CONSTRAINT classes_class_type_check
  CHECK (class_type IN ('clases', 'fijas', 'proyectos', 'masterclass'));

COMMENT ON COLUMN classes.class_type IS
  'clases: one-off dated session. fijas: recurring weekly class sold as a monthly 4-session cycle (see weekday). proyectos: choreography project course. masterclass: legacy/discontinued, archived rows only.';

-- ------------------------------------------------------------
-- 2. Recurring weekly schedule for 'fijas' classes.
--
-- weekday uses 0=Sunday..6=Saturday to match JS Date.getUTCDay(), which is
-- how lib/utils/date-format.ts already indexes its DAYS_ES array — so the
-- same array is reusable with no offset math.
-- ------------------------------------------------------------
ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS weekday SMALLINT
    CHECK (weekday IS NULL OR weekday BETWEEN 0 AND 6);

COMMENT ON COLUMN classes.weekday IS
  'For class_type = ''fijas'': day of week of the recurring session. 0=Sunday..6=Saturday, matching JS Date.getUTCDay().';

-- A 'fijas' class has no single scheduled_date.
ALTER TABLE classes ALTER COLUMN scheduled_date DROP NOT NULL;

ALTER TABLE classes ADD CONSTRAINT classes_schedule_shape CHECK (
  (class_type = 'fijas' AND weekday IS NOT NULL AND scheduled_date IS NULL)
  OR
  (class_type <> 'fijas' AND scheduled_date IS NOT NULL)
);

-- ------------------------------------------------------------
-- 3. Monthly cycle tracking on registrations.
--
-- Session dates are intentionally NOT stored — they're derivable from
-- classes.weekday + cycle_month + the "first 4 occurrences" rule, and
-- storing them would create a second source of truth that drifts if the
-- admin edits the weekday later. cycle_first_session IS stored because
-- it's the one thing not derivable (it depends on when the student joined).
-- ------------------------------------------------------------
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS cycle_month         DATE,      -- first day of the month, e.g. 2026-10-01
  ADD COLUMN IF NOT EXISTS cycle_sessions      SMALLINT,  -- 4 = full cycle, 1..3 = prorated join
  ADD COLUMN IF NOT EXISTS cycle_first_session DATE;      -- first session actually included

COMMENT ON COLUMN registrations.cycle_month IS
  'For a fixed-class (fijas) registration: first day of the purchased monthly cycle. NULL for clases/proyectos registrations.';
COMMENT ON COLUMN registrations.cycle_sessions IS
  'Number of sessions covered by this registration''s cycle (4 = full month, less = prorated mid-month join).';
COMMENT ON COLUMN registrations.cycle_first_session IS
  'Date of the first session actually included in this registration''s cycle.';

CREATE INDEX IF NOT EXISTS idx_reg_cycle ON registrations(class_id, cycle_month)
  WHERE cycle_month IS NOT NULL;

-- ------------------------------------------------------------
-- 4. Unique indexes must allow the same student to buy the same fixed
-- class again in a later month. The existing partial unique indexes
-- (migration 003) key on (user_id, class_id) / (class_id, contact_email)
-- alone, which would block a second month's purchase.
--
-- COALESCE is required: Postgres treats NULLs as distinct in unique
-- indexes, so appending cycle_month directly would stop deduplicating
-- clases/proyectos registrations (which always have cycle_month IS NULL).
-- These new indexes are strictly weaker than the old ones, so recreating
-- them can never fail against existing data.
-- ------------------------------------------------------------
DROP INDEX IF EXISTS idx_reg_auth_unique;
CREATE UNIQUE INDEX idx_reg_auth_unique
  ON registrations (user_id, class_id, COALESCE(cycle_month, DATE '1900-01-01'))
  WHERE user_id IS NOT NULL;

DROP INDEX IF EXISTS idx_reg_guest_unique;
CREATE UNIQUE INDEX idx_reg_guest_unique
  ON registrations (class_id, contact_email, COALESCE(cycle_month, DATE '1900-01-01'))
  WHERE user_id IS NULL;

-- ------------------------------------------------------------
-- 5. Per-cycle capacity view.
--
-- current_enrollment for a 'fijas' class cannot be a simple count of all
-- registrations ever made against it (that grows forever and is
-- meaningless for a permanent class) — capacity must be counted per
-- (class, cycle_month). This view exposes only aggregate counts, no PII,
-- so it's safe to grant broadly without new RLS policies.
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW fixed_class_cycle_enrollment AS
SELECT class_id, cycle_month, COUNT(*)::int AS enrolled
FROM registrations
WHERE cycle_month IS NOT NULL AND status IN ('pending', 'confirmed')
GROUP BY class_id, cycle_month;

GRANT SELECT ON fixed_class_cycle_enrollment TO anon, authenticated;

-- ------------------------------------------------------------
-- 6. Archive existing masterclasses. Masterclasses are discontinued and
-- are not converted to 'fijas' or anything else — they are simply hidden
-- from the public site (is_active = false) while remaining auditable in
-- the admin panel. No cancelled_at: cancelling triggers the refund
-- workflow from migration 007, which does not apply here.
-- ------------------------------------------------------------
UPDATE classes SET is_active = false WHERE class_type = 'masterclass';
