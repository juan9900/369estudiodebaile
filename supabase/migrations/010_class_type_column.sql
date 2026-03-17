-- Migration 010: Add class_type column to classes table
--
-- Introduces a structured classification for classes beyond the old boolean
-- is_masterclass flag. The class_type column distinguishes between:
--   'individual'   - a regular one-off class session
--   'masterclass'  - a special masterclass event
--   'proyecto'     - a project/choreography-based course
--
-- Existing rows default to 'individual'. Future migrations may backfill
-- rows that had is_masterclass = true to 'masterclass' if needed.

ALTER TABLE classes
  ADD COLUMN class_type TEXT NOT NULL DEFAULT 'individual'
  CHECK (class_type IN ('individual', 'masterclass', 'proyecto'));

COMMENT ON COLUMN classes.class_type IS
  'Classifies the type of class: individual (regular session), masterclass (special event), or proyecto (choreography project course).';


-- Drop is_masterclass column
ALTER TABLE classes DROP COLUMN is_masterclass;