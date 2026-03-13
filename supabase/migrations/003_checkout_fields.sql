-- ============================================================
-- 369 Estudio de Baile – Checkout / guest-registration fields
-- ============================================================

-- Allow guest checkout: user_id becomes nullable
ALTER TABLE registrations ALTER COLUMN user_id DROP NOT NULL;

-- Drop the old unique constraint that assumed user_id is always set
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_user_id_class_id_key;

-- Checkout / payment fields (must exist before the indexes below)
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS payment_method TEXT
    CHECK (payment_method IN ('paypal', 'binance', 'bs', 'efectivo')),
  ADD COLUMN IF NOT EXISTS transaction_id  TEXT,
  ADD COLUMN IF NOT EXISTS contact_name     TEXT,
  ADD COLUMN IF NOT EXISTS contact_lastname TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone    TEXT,
  ADD COLUMN IF NOT EXISTS contact_email    TEXT;

-- Unique constraint for authenticated users (same class, same user)
CREATE UNIQUE INDEX IF NOT EXISTS idx_reg_auth_unique
  ON registrations (user_id, class_id)
  WHERE user_id IS NOT NULL;

-- Unique constraint for guests (same class, same email)
CREATE UNIQUE INDEX IF NOT EXISTS idx_reg_guest_unique
  ON registrations (class_id, contact_email)
  WHERE user_id IS NULL;

-- RLS: guests (anon role) can insert a registration without a user_id
CREATE POLICY "registrations: guest insert" ON registrations
  FOR INSERT WITH CHECK (user_id IS NULL);

-- RLS: guests can read their own pending registration by email
CREATE POLICY "registrations: guest read own" ON registrations
  FOR SELECT USING (user_id IS NULL AND contact_email IS NOT NULL);
