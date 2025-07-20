-- Enhanced Supabase Database Schema for Bryant Periodization Integration
-- Run these commands in your Supabase SQL editor

-- 1. Add gainer classification to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gainer_classification JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recovery_assessment JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volume_landmarks JSONB;

-- 2. Create assessments table for detailed assessment tracking
CREATE TABLE IF NOT EXISTS assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assessment_type VARCHAR(50) NOT NULL, -- 'initial', 'periodic', 'gainer_type', 'recovery'
    assessment_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create recovery monitoring table
CREATE TABLE IF NOT EXISTS recovery_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    
    -- Fatigue scores (1-10 scale)
    fuel_fatigue INTEGER CHECK (fuel_fatigue >= 1 AND fuel_fatigue <= 10),
    nervous_fatigue INTEGER CHECK (nervous_fatigue >= 1 AND nervous_fatigue <= 10),
    messenger_fatigue INTEGER CHECK (messenger_fatigue >= 1 AND messenger_fatigue <= 10),
    tissue_fatigue INTEGER CHECK (tissue_fatigue >= 1 AND tissue_fatigue <= 10),
    
    -- Calculated scores
    fitness_score NUMERIC(5,2) DEFAULT 0,
    fatigue_score NUMERIC(5,2) DEFAULT 0,
    net_readiness NUMERIC(5,2) DEFAULT 0,
    
    -- Deload tracking
    deload_recommended BOOLEAN DEFAULT FALSE,
    deload_type VARCHAR(50), -- 'scheduled', 'fatigue_triggered', 'manual'
    volume_reduction NUMERIC(3,2), -- 0.5 = 50% reduction
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create volume tracking table
CREATE TABLE IF NOT EXISTS volume_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    muscle_group VARCHAR(50) NOT NULL,
    week_number INTEGER NOT NULL,
    
    -- Volume landmarks
    mev INTEGER NOT NULL, -- Minimum Effective Volume
    mrv INTEGER NOT NULL, -- Maximum Recoverable Volume
    mav INTEGER NOT NULL, -- Maximum Adaptive Volume
    
    -- Current volume
    planned_volume INTEGER NOT NULL,
    actual_volume INTEGER DEFAULT 0,
    
    -- Gainer type modifier applied
    base_volume INTEGER NOT NULL,
    gainer_modifier NUMERIC(3,2) DEFAULT 1.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enhanced programs table
ALTER TABLE programs ADD COLUMN IF NOT EXISTS gainer_type_applied JSONB;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS auto_deload_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS deload_frequency INTEGER DEFAULT 4; -- Every 4 weeks

-- 6. Create program phases table for enhanced periodization
CREATE TABLE IF NOT EXISTS program_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
    phase_name VARCHAR(100) NOT NULL,
    phase_type VARCHAR(50) NOT NULL, -- 'accumulation', 'intensification', 'realization', 'restoration'
    week_start INTEGER NOT NULL,
    week_end INTEGER NOT NULL,
    
    -- Phase characteristics
    volume_emphasis NUMERIC(3,2) DEFAULT 1.0, -- Multiplier for base volume
    intensity_emphasis NUMERIC(3,2) DEFAULT 1.0, -- Multiplier for base intensity
    frequency_recommendation VARCHAR(50),
    
    -- Goals and focus
    primary_goal VARCHAR(100),
    secondary_goals TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recovery_tracking_user_week ON recovery_tracking(user_id, week_number);
CREATE INDEX IF NOT EXISTS idx_volume_tracking_user_muscle ON volume_tracking(user_id, muscle_group);
CREATE INDEX IF NOT EXISTS idx_assessments_user_type ON assessments(user_id, assessment_type);
CREATE INDEX IF NOT EXISTS idx_program_phases_program ON program_phases(program_id);

-- 8. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recovery_tracking_updated_at BEFORE UPDATE ON recovery_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volume_tracking_updated_at BEFORE UPDATE ON volume_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Row Level Security (RLS) policies
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE volume_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_phases ENABLE ROW LEVEL SECURITY;

-- Policies for assessments
CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON assessments FOR UPDATE USING (auth.uid() = user_id);

-- Policies for recovery_tracking
CREATE POLICY "Users can view own recovery data" ON recovery_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own recovery data" ON recovery_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recovery data" ON recovery_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Policies for volume_tracking
CREATE POLICY "Users can view own volume data" ON volume_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own volume data" ON volume_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own volume data" ON volume_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Policies for program_phases
CREATE POLICY "Users can view own program phases" ON program_phases FOR SELECT 
    USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = program_phases.program_id AND programs.user_id = auth.uid()));
CREATE POLICY "Users can create own program phases" ON program_phases FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM programs WHERE programs.id = program_phases.program_id AND programs.user_id = auth.uid()));
CREATE POLICY "Users can update own program phases" ON program_phases FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = program_phases.program_id AND programs.user_id = auth.uid()));

-- 10. Sample data structure comments for reference
-- Example gainer_classification JSONB structure:
/*
{
  "type": "Fast Gainer",
  "reps_at_80_percent": 6,
  "volume_modifier": 0.8,
  "mrv_modifier": 0.85,
  "frequency_recommendation": "moderate",
  "intensity_preference": "high",
  "test_date": "2025-01-20T00:00:00Z",
  "recommendations": [
    "Balance strength and size goals",
    "Moderate volume with high intensity"
  ]
}
*/

-- Example recovery_assessment JSONB structure:
/*
{
  "score": 75,
  "classification": "good",
  "factors": {
    "age": "neutral",
    "experience": "intermediate", 
    "sleep": "good",
    "stress": "manageable",
    "lifestyle": "moderate"
  },
  "recommendations": [
    "Standard training progression appropriate",
    "Maintain current recovery practices"
  ]
}
*/

-- Example volume_landmarks JSONB structure:
/*
{
  "chest": {"MEV": 8, "MRV": 15, "MAV": 18},
  "back": {"MEV": 10, "MRV": 20, "MAV": 24},
  "shoulders": {"MEV": 8, "MRV": 14, "MAV": 17}
}
*/

COMMENT ON TABLE assessments IS 'Comprehensive user assessments including gainer type classification';
COMMENT ON TABLE recovery_tracking IS 'Daily/weekly recovery monitoring with Fitness-Fatigue model';
COMMENT ON TABLE volume_tracking IS 'Individualized volume landmarks and tracking per muscle group';
COMMENT ON TABLE program_phases IS 'Detailed periodization phases within programs';
