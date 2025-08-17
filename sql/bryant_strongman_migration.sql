-- Bryant Periodization Strongman Support Migration
-- Add strongman_metrics JSONB column to programs table for storing strongman configurations

-- ===========================================
-- 1. ADD STRONGMAN_METRICS COLUMN
-- ===========================================

-- Add JSONB column for strongman event configurations
ALTER TABLE programs 
ADD COLUMN strongman_metrics JSONB DEFAULT '{}'::JSONB;

-- ===========================================
-- 2. ADD STRONGMAN CONFIGURATION CONSTRAINTS
-- ===========================================

-- Ensure strongman_metrics has valid structure when populated
ALTER TABLE programs 
ADD CONSTRAINT check_strongman_metrics_structure 
CHECK (
    strongman_metrics IS NULL OR 
    (
        strongman_metrics ? 'distance' AND 
        (strongman_metrics->>'distance')::integer BETWEEN 0 AND 500 AND
        strongman_metrics ? 'rest' AND
        (strongman_metrics->>'rest')::integer BETWEEN 30 AND 300 AND
        strongman_metrics ? 'timeBased' AND
        strongman_metrics->>'timeBased' IN ('true', 'false')
    )
);

-- ===========================================  
-- 3. CREATE STRONGMAN-SPECIFIC INDEXES
-- ===========================================

-- Index for querying Bryant-compliant strongman programs
CREATE INDEX IF NOT EXISTS idx_programs_bryant_strongman 
ON programs USING GIN (strongman_metrics) 
WHERE strongman_metrics->>'bryantCompliant' = 'true';

-- Index for time-based vs distance-based queries
CREATE INDEX IF NOT EXISTS idx_programs_strongman_type 
ON programs ((strongman_metrics->>'timeBased')::boolean) 
WHERE strongman_metrics IS NOT NULL AND strongman_metrics != '{}'::JSONB;

-- Index for tactical application filtering
CREATE INDEX IF NOT EXISTS idx_programs_tactical_strongman 
ON programs USING GIN (strongman_metrics) 
WHERE strongman_metrics->>'tacticalApplication' = 'true';

-- ===========================================
-- 4. UPDATE EXISTING PROGRAMS WITH DEFAULT STRONGMAN DATA
-- ===========================================

-- Set default strongman configuration for existing programs
UPDATE programs 
SET strongman_metrics = '{
    "distance": 150,
    "duration": 30,
    "rest": 90,
    "timeBased": true,
    "bryantCompliant": false,
    "enabled": false,
    "tacticalApplication": false
}'::JSONB
WHERE strongman_metrics = '{}'::JSONB OR strongman_metrics IS NULL;

-- ===========================================
-- 5. CREATE STRONGMAN PROGRAMS VIEW
-- ===========================================

-- Create view for strongman-enabled programs
CREATE OR REPLACE VIEW strongman_programs AS 
SELECT 
    program_id,
    program_name,
    user_id,
    strongman_metrics->>'distance' as distance_ft,
    strongman_metrics->>'duration' as duration_seconds,
    strongman_metrics->>'rest' as rest_seconds,
    strongman_metrics->>'timeBased' as is_time_based,
    strongman_metrics->>'bryantCompliant' as is_bryant_compliant,
    strongman_metrics->>'enabled' as strongman_enabled,
    strongman_metrics->>'tacticalApplication' as is_tactical,
    CASE 
        WHEN strongman_metrics->>'bryantCompliant' = 'true' AND strongman_metrics->>'tacticalApplication' = 'true' THEN '⚔️ Bryant Tactical'
        WHEN strongman_metrics->>'bryantCompliant' = 'true' THEN '🏋️ Bryant Strongman'
        WHEN strongman_metrics->>'enabled' = 'true' THEN '💪 Strongman Events'
        ELSE '📋 Standard Training'
    END as training_method,
    CASE 
        WHEN strongman_metrics->>'timeBased' = 'true' THEN 
            CONCAT(strongman_metrics->>'duration', 's events')
        ELSE 
            CONCAT(strongman_metrics->>'distance', 'ft events')
    END as event_format,
    created_at,
    updated_at
FROM programs 
WHERE strongman_metrics IS NOT NULL;

-- ===========================================
-- 6. HYBRID PHASE INTEGRATION VIEW
-- ===========================================

-- Create view for hybrid phase recommendations (weeks 1-4 strongman, 5-8 tempo)
CREATE OR REPLACE VIEW hybrid_phase_programs AS 
SELECT 
    sp.*,
    CASE 
        WHEN EXTRACT(week from CURRENT_DATE - created_at) < 5 THEN 'Strongman Phase (60%)'
        WHEN EXTRACT(week from CURRENT_DATE - created_at) BETWEEN 5 AND 8 THEN 'Tempo Phase (40%)'
        ELSE 'Test Week'
    END as current_phase,
    CASE 
        WHEN EXTRACT(week from CURRENT_DATE - created_at) < 5 THEN 
            '🏋️ Focus on strongman events, power output, and explosive strength'
        WHEN EXTRACT(week from CURRENT_DATE - created_at) BETWEEN 5 AND 8 THEN 
            '⏱️ Focus on tempo work, time under tension, and metabolic conditioning'
        ELSE 
            '🧪 Testing and assessment week'
    END as phase_description
FROM strongman_programs sp
WHERE is_bryant_compliant = 'true';

-- ===========================================
-- 7. SAMPLE DATA INSERTION
-- ===========================================

-- Insert sample Bryant strongman program
INSERT INTO programs (
    program_name, 
    user_id, 
    program_type,
    strongman_metrics
) VALUES (
    'Bryant Tactical Strongman Program',
    'sample-user-id',
    'tactical',
    '{
        "distance": 150,
        "duration": 30,
        "rest": 90,
        "timeBased": false,
        "bryantCompliant": true,
        "enabled": true,
        "tacticalApplication": true,
        "loadFactor": 1.3,
        "volumeFormula": "estimated_reps * load_factor * events",
        "notes": "Bryant Periodization strongman method for tactical conditioning"
    }'::JSONB
);

-- Insert hybrid strongman/tempo program
INSERT INTO programs (
    program_name, 
    user_id, 
    program_type,
    strongman_metrics,
    cluster_data
) VALUES (
    'Bryant Hybrid 8-Week Cycle',
    'sample-user-id',
    'hybrid',
    '{
        "distance": 100,
        "duration": 45,
        "rest": 120,
        "timeBased": false,
        "bryantCompliant": true,
        "enabled": true,
        "tacticalApplication": true,
        "phaseWeeks": "1-4"
    }'::JSONB,
    '{
        "intraRest": 15,
        "clustersPerSet": 3,
        "bryantCompliant": true,
        "enabled": true,
        "phaseWeeks": "5-8"
    }'::JSONB
);

-- ===========================================
-- 8. QUERY EXAMPLES FOR STRONGMAN PROGRAMS
-- ===========================================

-- Find all Bryant-compliant strongman programs
SELECT 
    program_name,
    training_method,
    event_format,
    distance_ft,
    rest_seconds
FROM strongman_programs 
WHERE is_bryant_compliant = 'true';

-- Get strongman configuration for specific program
SELECT 
    program_name,
    strongman_metrics,
    jsonb_pretty(strongman_metrics) as formatted_config
FROM programs 
WHERE program_id = 'specific-program-id'
    AND strongman_metrics->>'enabled' = 'true';

-- Find tactical strongman programs with conversion logic
SELECT 
    program_name,
    strongman_metrics->>'distance' as distance,
    ROUND((strongman_metrics->>'distance')::integer / 5) as estimated_reps,
    ROUND(((strongman_metrics->>'distance')::integer / 5) * (strongman_metrics->>'loadFactor')::numeric) as rep_equivalent
FROM programs 
WHERE strongman_metrics->>'tacticalApplication' = 'true'
    AND strongman_metrics->>'bryantCompliant' = 'true';

-- Hybrid phase recommendations (weeks 1-4 strongman, 5-8 tempo)
SELECT 
    program_name,
    current_phase,
    phase_description,
    event_format
FROM hybrid_phase_programs 
WHERE is_bryant_compliant = 'true'
ORDER BY created_at DESC;

-- Statistics on strongman program usage
SELECT 
    training_method,
    COUNT(*) as program_count,
    AVG((strongman_metrics->>'distance')::integer) as avg_distance_ft,
    AVG((strongman_metrics->>'rest')::integer) as avg_rest_seconds,
    COUNT(*) FILTER (WHERE strongman_metrics->>'tacticalApplication' = 'true') as tactical_count
FROM strongman_programs 
GROUP BY training_method
ORDER BY program_count DESC;

-- ===========================================
-- 9. CONFLICT RESOLUTION QUERIES
-- ===========================================

-- Resolve conflicts between rep-based and strongman training
WITH rep_conversion AS (
    SELECT 
        program_id,
        program_name,
        strongman_metrics->>'distance' as distance,
        CASE 
            WHEN (strongman_metrics->>'distance')::integer > 0 THEN
                ROUND((strongman_metrics->>'distance')::integer / 5)
            ELSE 
                ROUND((strongman_metrics->>'duration')::integer / 2)
        END as rep_equivalent
    FROM programs 
    WHERE strongman_metrics->>'enabled' = 'true'
)
SELECT 
    program_name,
    distance || 'ft strongman' as original_format,
    rep_equivalent || ' rep equivalent' as converted_format,
    CASE 
        WHEN rep_equivalent BETWEEN 20 AND 40 THEN 'Tactical Range'
        WHEN rep_equivalent BETWEEN 10 AND 30 THEN 'Power Range'  
        WHEN rep_equivalent BETWEEN 30 AND 60 THEN 'Endurance Range'
        ELSE 'Custom Range'
    END as training_zone
FROM rep_conversion
ORDER BY rep_equivalent;

-- ===========================================
-- 10. PERFORMANCE OPTIMIZATION
-- ===========================================

-- Analyze query performance for strongman data
EXPLAIN (ANALYZE, BUFFERS) 
SELECT program_name, strongman_metrics 
FROM programs 
WHERE strongman_metrics->>'bryantCompliant' = 'true'
    AND strongman_metrics->>'tacticalApplication' = 'true'
    AND (strongman_metrics->>'distance')::integer = 150;

-- ===========================================
-- 11. ROLLBACK SCRIPT (if needed)
-- ===========================================

-- Uncomment to rollback changes:
-- DROP VIEW IF EXISTS hybrid_phase_programs;
-- DROP VIEW IF EXISTS strongman_programs;
-- DROP INDEX IF EXISTS idx_programs_bryant_strongman;
-- DROP INDEX IF EXISTS idx_programs_strongman_type;
-- DROP INDEX IF EXISTS idx_programs_tactical_strongman;
-- ALTER TABLE programs DROP CONSTRAINT IF EXISTS check_strongman_metrics_structure;
-- ALTER TABLE programs DROP COLUMN IF EXISTS strongman_metrics;

COMMENT ON COLUMN programs.strongman_metrics IS 'JSONB storage for Bryant Periodization strongman event configurations including distance, duration, rest, timeBased flag, and tacticalApplication support';
