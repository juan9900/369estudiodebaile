ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS song_youtube_url     TEXT,
  ADD COLUMN IF NOT EXISTS song_apple_music_url TEXT;
