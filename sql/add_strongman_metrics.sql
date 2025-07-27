-- Add strongman_metrics JSONB column to programs table
-- This enables storage of Bryant Periodization strongman event configurations

-- Add the JSONB column for strongman configurations
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS strongman_metrics JSONB DEFAULT '{}'::JSONB;

-- Add constraint to ensure valid rest periods (90s or less for Bryant compliance)
ALTER TABLE programs 
ADD CONSTRAINT IF NOT EXISTS check_strongman_rest 
CHECK (
    strongman_metrics IS NULL 
    OR strongman_metrics = '{}'::JSONB 
    OR (strongman_metrics->>'rest')::integer <= 90
);

-- Add constraint to ensure valid distance values
ALTER TABLE programs 
ADD CONSTRAINT IF NOT EXISTS check_strongman_distance 
CHECK (
    strongman_metrics IS NULL 
    OR strongman_metrics = '{}'::JSONB 
    OR (strongman_metrics->>'distance')::integer BETWEEN 25 AND 500
);

-- Add constraint to ensure valid load factors
ALTER TABLE programs 
ADD CONSTRAINT IF NOT EXISTS check_strongman_load_factor 
CHECK (
    strongman_metrics IS NULL 
    OR strongman_metrics = '{}'::JSONB 
    OR (strongman_metrics->>'loadFactor')::numeric BETWEEN 1.0 AND 2.5
);

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_strongman_metrics 
ON programs USING GIN (strongman_metrics);

-- Create partial index for Bryant-compliant strongman programs
CREATE INDEX IF NOT EXISTS idx_bryant_strongman_compliant 
ON programs USING GIN (strongman_metrics) 
WHERE strongman_metrics->>'bryantCompliant' = 'true';

-- Create partial index for tactical strongman applications
CREATE INDEX IF NOT EXISTS idx_tactical_strongman 
ON programs USING GIN (strongman_metrics) 
WHERE strongman_metrics->>'tacticalApplication' = 'true';

-- Sample strongman configuration for testing
-- Example: 150ft farmer's walk, 4 events, 90s rest, tactical application
INSERT INTO programs (
    user_id, 
    name, 
    program_type, 
    strongman_metrics
) VALUES (
    'sample-user-id',
    'Bryant Tactical Strongman Program',
    'tactical',
    '{
        "distance": 150,
        "duration": 30,
        "rest": 90,
        "events": 4,
        "loadFactor": 1.3,
        "timeBased": true,
        "bryantCompliant": true,
        "tacticalApplication": true,
        "hybridPhase": "weeks_1_4",
        "volumeFormula": "estimated_reps * (load / bodyweight_factor) * events",
        "exercises": ["farmers_walk", "tire_flip", "yoke_walk"],
        "created": "'||CURRENT_TIMESTAMP||'"
    }'::JSONB
) ON CONFLICT DO NOTHING;

-- Query examples for strongman programs

-- 1. Find all strongman programs
SELECT 
    program_id,
    name,
    strongman_metrics->>'distance' as distance_ft,
    strongman_metrics->>'events' as num_events,
    strongman_metrics->>'tacticalApplication' as is_tactical
FROM programs 
WHERE strongman_metrics != '{}'::JSONB;

-- 2. Calculate estimated reps for strongman programs (expect 30 for 150ft)
SELECT 
    name,
    strongman_metrics->>'distance' as distance,
    ROUND((strongman_metrics->>'distance')::integer / 5) as estimated_reps_distance,
    ROUND((strongman_metrics->>'duration')::integer / 10) as estimated_reps_duration,
    ROUND(
        ((strongman_metrics->>'distance')::integer / 5) + 
        ((strongman_metrics->>'duration')::integer / 10)
    ) as total_estimated_reps
FROM programs 
WHERE strongman_metrics->>'distance' IS NOT NULL;

-- 3. Find Bryant-compliant tactical strongman programs
SELECT 
    name,
    strongman_metrics
FROM programs 
WHERE strongman_metrics->>'bryantCompliant' = 'true'
    AND strongman_metrics->>'tacticalApplication' = 'true';

-- 4. Validate volume calculations
SELECT 
    name,
    strongman_metrics->>'distance' as distance,
    strongman_metrics->>'loadFactor' as load_factor,
    strongman_metrics->>'events' as events,
    -- Expected volume calculation: estimated_reps * load_factor * events
    ROUND(
        ((strongman_metrics->>'distance')::integer / 5) * 
        (strongman_metrics->>'loadFactor')::numeric * 
        (strongman_metrics->>'events')::integer
    ) as calculated_volume
FROM programs 
WHERE strongman_metrics->>'distance' IS NOT NULL
    AND strongman_metrics->>'loadFactor' IS NOT NULL
    AND strongman_metrics->>'events' IS NOT NULL;

COMMENT ON COLUMN programs.strongman_metrics IS 'JSONB storage for Bryant Periodization strongman event configurations including distance, duration, rest periods, load factors, and tactical applications';
