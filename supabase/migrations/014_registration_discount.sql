-- ============================================================
-- 369 Estudio de Baile – Promo pack discount tracking
-- ============================================================

-- Marks whether this registration was created as part of a discounted
-- multi-class promo pack (6 for $18 / 4 for $12), vs. a single class at
-- normal price.
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS discount_applied BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS promo_pack SMALLINT;
