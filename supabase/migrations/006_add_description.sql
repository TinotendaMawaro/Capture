-- Add description column to regions
ALTER TABLE regions ADD COLUMN IF NOT EXISTS description TEXT;
