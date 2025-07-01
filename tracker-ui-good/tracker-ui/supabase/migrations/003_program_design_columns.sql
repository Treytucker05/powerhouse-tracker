-- Add missing columns for Program Design flow integration
-- These columns are needed for the Program.jsx and Macrocycle.jsx integration

-- Add missing column to programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS training_days_per_week INTEGER DEFAULT 4;

-- Add missing columns to program_blocks table  
ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS block_type TEXT;

ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS focus TEXT;

-- Add missing columns to support Program.jsx functionality
ALTER TABLE program_blocks
ADD COLUMN IF NOT EXISTS training_days_per_week INTEGER DEFAULT 4;

-- Update existing records to have sensible defaults
UPDATE programs 
SET training_days_per_week = 4 
WHERE training_days_per_week IS NULL;

UPDATE program_blocks 
SET block_type = 'accumulation'
WHERE block_type IS NULL;

UPDATE program_blocks 
SET focus = 'hypertrophy'
WHERE focus IS NULL;

UPDATE program_blocks
SET training_days_per_week = 4
WHERE training_days_per_week IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN programs.training_days_per_week IS 'Number of training days per week for this program';
COMMENT ON COLUMN program_blocks.block_type IS 'Type of training block (accumulation, realization, peaking, deload, maintenance)';
COMMENT ON COLUMN program_blocks.focus IS 'Primary focus of the block (hypertrophy, strength, peak, recovery, reset)';
COMMENT ON COLUMN program_blocks.training_days_per_week IS 'Training days per week for this specific block';
