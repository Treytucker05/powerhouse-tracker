-- Add missing columns that the updated Program.jsx and Macrocycle.jsx expect
-- Run this in your Supabase SQL Editor

-- Add training_days_per_week column to programs table if it doesn't exist
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS training_days_per_week INTEGER DEFAULT 4;

-- Add missing columns to program_blocks table if they don't exist
ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS block_type TEXT;

ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS focus TEXT;

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_programs_goal_type ON programs(goal_type);
CREATE INDEX IF NOT EXISTS idx_program_blocks_type ON program_blocks(block_type);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'programs' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'program_blocks' 
ORDER BY ordinal_position;
