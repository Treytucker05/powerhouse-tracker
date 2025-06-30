-- Macrocycle Database Migration
-- Run this in your Supabase SQL Editor Dashboard

-- 1. Add missing columns to programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS training_days_per_week INTEGER DEFAULT 4;

-- 2. Add block_type column to program_blocks table  
ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS block_type TEXT;

-- 3. Add focus column to program_blocks table
ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS focus TEXT;

-- 4. Add constraint for valid block types
ALTER TABLE program_blocks 
DROP CONSTRAINT IF EXISTS valid_block_types;

ALTER TABLE program_blocks 
ADD CONSTRAINT valid_block_types CHECK (
  block_type IN ('accumulation', 'realization', 'peaking', 'maintenance', 'deload')
);

-- 5. Add constraint for training days
ALTER TABLE programs 
DROP CONSTRAINT IF EXISTS training_days_valid;

ALTER TABLE programs 
ADD CONSTRAINT training_days_valid CHECK (training_days_per_week >= 3 AND training_days_per_week <= 7);

-- 6. Update goal_type constraint to include powerbuilding
ALTER TABLE programs 
DROP CONSTRAINT IF EXISTS programs_goal_type_check;

ALTER TABLE programs 
ADD CONSTRAINT programs_goal_type_check 
CHECK (goal_type IN ('strength', 'hypertrophy', 'endurance', 'powerbuilding'));

-- Migration complete - Ready for Macrocycle component!
