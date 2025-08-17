-- Update program_blocks table to support new Macrocycle design
-- Add missing columns and update constraints

-- First, add the new columns
ALTER TABLE public.program_blocks 
ADD COLUMN IF NOT EXISTS block_type TEXT,
ADD COLUMN IF NOT EXISTS training_days_per_week INTEGER DEFAULT NULL;

-- Update the focus constraint to include the new RP phase types
ALTER TABLE public.program_blocks 
DROP CONSTRAINT IF EXISTS program_blocks_focus_check;

ALTER TABLE public.program_blocks 
ADD CONSTRAINT program_blocks_block_type_check 
CHECK (block_type IN ('accumulation', 'realization', 'peaking', 'maintenance', 'deload'));

-- Also update the programs table to support powerbuilding goal
ALTER TABLE public.programs 
DROP CONSTRAINT IF EXISTS programs_goal_type_check;

ALTER TABLE public.programs 
ADD CONSTRAINT programs_goal_type_check 
CHECK (goal_type IN ('strength', 'hypertrophy', 'endurance', 'powerbuilding'));

-- Add training_days_per_week to programs table if not exists
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS training_days_per_week INTEGER DEFAULT 3;
