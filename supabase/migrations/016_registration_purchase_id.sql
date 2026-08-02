-- ============================================================
-- 369 Estudio de Baile – Group registrations from the same checkout
-- ============================================================

-- Ties together every registration row created by a single checkout
-- (e.g. all classes in a 4/6-class promo pack), so the admin can group
-- them and a single consolidated status-change email can be sent once
-- the whole purchase is resolved. Null for rows created before this
-- migration — they behave as standalone single-class registrations.
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS purchase_id UUID;

CREATE INDEX IF NOT EXISTS idx_reg_purchase ON registrations(purchase_id);
