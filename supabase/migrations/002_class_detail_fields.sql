-- ============================================================
-- 369 Estudio de Baile – Class detail fields
-- ============================================================

ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS image_url            TEXT,
  ADD COLUMN IF NOT EXISTS video_url            TEXT,
  ADD COLUMN IF NOT EXISTS instructor_bio       TEXT,
  ADD COLUMN IF NOT EXISTS instructor_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS dance_style          TEXT,
  ADD COLUMN IF NOT EXISTS difficulty_level     TEXT
    CHECK (difficulty_level IN ('principiante', 'intermedio', 'avanzado')),
  ADD COLUMN IF NOT EXISTS song_title           TEXT,
  ADD COLUMN IF NOT EXISTS song_artist          TEXT,
  ADD COLUMN IF NOT EXISTS song_spotify_url     TEXT;
