ALTER TABLE studio_settings
  ADD COLUMN cash_deposit_percentage INTEGER NOT NULL DEFAULT 10
  CHECK (cash_deposit_percentage >= 0 AND cash_deposit_percentage <= 100);
