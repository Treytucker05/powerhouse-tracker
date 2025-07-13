-- Enhanced Program Storage Columns
-- Add missing columns needed for improved program saving functionality

-- Add model column to store training model (Block, Linear, Conjugate, etc.)
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS model TEXT;

-- Add block_sequence column to store the sequence of training blocks
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS block_sequence JSONB DEFAULT '[]';

-- Add phases column to store detailed phase information
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS phases JSONB DEFAULT '[]';

-- Add weekly_outline column to store weekly breakdown
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS weekly_outline JSONB DEFAULT '[]';

-- Add parameters column to store program parameters
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS parameters JSONB DEFAULT '{}';

-- Add description column for program descriptions
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add program type column (macro, meso, micro)
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS program_type TEXT DEFAULT 'macro';

-- Update goal_type constraint to include more options
ALTER TABLE public.programs 
DROP CONSTRAINT IF EXISTS programs_goal_type_check;

ALTER TABLE public.programs 
ADD CONSTRAINT programs_goal_type_check 
CHECK (goal_type IN ('strength', 'hypertrophy', 'endurance', 'powerbuilding', 'hybrid', 'power_sport'));

-- Add constraint for program_type
ALTER TABLE public.programs 
ADD CONSTRAINT programs_program_type_check 
CHECK (program_type IN ('macro', 'meso', 'micro'));

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_programs_user_id ON public.programs(user_id);

-- Create index on created_at for recent program queries
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON public.programs(created_at DESC);

-- Create index on is_active for filtering active programs
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON public.programs(is_active);
