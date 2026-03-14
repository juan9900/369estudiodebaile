CREATE TABLE studio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opening_time TIME NOT NULL DEFAULT '08:00',
  closing_time TIME NOT NULL DEFAULT '22:00',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO studio_settings (opening_time, closing_time) VALUES ('08:00', '22:00');

ALTER TABLE studio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "studio_settings: authenticated read" ON studio_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "studio_settings: admin update" ON studio_settings
  FOR UPDATE USING (public.current_user_role() = 'admin');
