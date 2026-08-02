-- ============================================================
-- 369 Estudio de Baile – Admin-managed promo packs
-- ============================================================

CREATE TABLE promo_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  size SMALLINT NOT NULL CHECK (size > 0),
  label TEXT NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'none'
    CHECK (discount_type IN ('none', 'percent', 'free_classes', 'fixed_price')),
  discount_value NUMERIC,
  note TEXT,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with the packs in place at the time of this migration:
-- 6 clases -> paga 5, la #6 sale gratis; 4 clases -> 40% de descuento; 1 clase -> precio normal.
INSERT INTO promo_packs (size, label, discount_type, discount_value, sort_order) VALUES
  (6, '6 clases', 'free_classes', 1, 0),
  (4, '4 clases', 'percent', 40, 1),
  (1, '1 clase', 'none', NULL, 2);

ALTER TABLE promo_packs ENABLE ROW LEVEL SECURITY;

-- The checkout flow is public/guest — anyone needs to read active packs.
CREATE POLICY "promo_packs: public read" ON promo_packs
  FOR SELECT USING (true);

CREATE POLICY "promo_packs: admin insert" ON promo_packs
  FOR INSERT WITH CHECK (public.current_user_role() = 'admin');

CREATE POLICY "promo_packs: admin update" ON promo_packs
  FOR UPDATE USING (public.current_user_role() = 'admin');

CREATE POLICY "promo_packs: admin delete" ON promo_packs
  FOR DELETE USING (public.current_user_role() = 'admin');
