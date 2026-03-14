-- ============================================================
-- 369 Estudio de Baile – Storage: Media Bucket
-- Run this in the Supabase SQL Editor (once, in order)
-- ============================================================

-- 1. Create public media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Public read: anyone can view images
CREATE POLICY "media: public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- 3. Admin insert
CREATE POLICY "media: admin insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND public.current_user_role() = 'admin'
  );

-- 4. Admin update
CREATE POLICY "media: admin update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'media'
    AND public.current_user_role() = 'admin'
  );

-- 5. Admin delete
CREATE POLICY "media: admin delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'media'
    AND public.current_user_role() = 'admin'
  );
