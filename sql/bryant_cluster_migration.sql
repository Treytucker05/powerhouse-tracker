-- Bryant Periodization Cluster Set Support Migration
-- Add cluster_data JSONB column to programs table for storing cluster configurations

-- ===========================================
-- 1. ADD CLUSTER_DATA COLUMN
-- ===========================================

-- Add JSONB column for cluster set configurations
ALTER TABLE programs 
ADD COLUMN cluster_data JSONB DEFAULT '{}'::JSONB;

-- ===========================================
-- 2. ADD CLUSTER CONFIGURATION CONSTRAINTS
-- ===========================================

-- Ensure cluster_data has valid structure when populated
ALTER TABLE programs 
ADD CONSTRAINT check_cluster_data_structure 
CHECK (
    cluster_data IS NULL OR 
    (
        cluster_data ? 'intraRest' AND 
        (cluster_data->>'intraRest')::integer BETWEEN 10 AND 60 AND
        cluster_data ? 'repsRange' AND
        cluster_data ? 'clustersPerSet' AND
        (cluster_data->>'clustersPerSet')::integer BETWEEN 2 AND 5
    )
);

-- ===========================================  
-- 3. CREATE CLUSTER-SPECIFIC INDEXES
-- ===========================================

-- Index for querying Bryant-compliant programs
CREATE INDEX IF NOT EXISTS idx_programs_bryant_cluster 
ON programs USING GIN (cluster_data) 
WHERE cluster_data->>'bryantCompliant' = 'true';

-- Index for intra-rest time queries
CREATE INDEX IF NOT EXISTS idx_programs_cluster_intra_rest 
ON programs ((cluster_data->>'intraRest')::integer) 
WHERE cluster_data IS NOT NULL AND cluster_data != '{}'::JSONB;

-- ===========================================
-- 4. UPDATE EXISTING PROGRAMS WITH DEFAULT CLUSTER DATA
-- ===========================================

-- Set default cluster configuration for existing programs
UPDATE programs 
SET cluster_data = '{
    "intraRest": 15,
    "repsRange": "3-5", 
    "clustersPerSet": 3,
    "bryantCompliant": false,
    "enabled": false
}'::JSONB
WHERE cluster_data = '{}'::JSONB OR cluster_data IS NULL;

-- ===========================================
-- 5. CREATE CLUSTER PROGRAMS VIEW
-- ===========================================

-- Create view for cluster-enabled programs
CREATE OR REPLACE VIEW cluster_programs AS 
SELECT 
    program_id,
    program_name,
    user_id,
    cluster_data->>'intraRest' as intra_rest_seconds,
    cluster_data->>'repsRange' as reps_range,
    cluster_data->>'clustersPerSet' as clusters_per_set,
    cluster_data->>'bryantCompliant' as is_bryant_compliant,
    cluster_data->>'enabled' as cluster_enabled,
    CASE 
        WHEN cluster_data->>'bryantCompliant' = 'true' THEN '🏋️ Bryant Method'
        WHEN cluster_data->>'enabled' = 'true' THEN '⚡ Cluster Sets'
        ELSE '📋 Standard Sets'
    END as training_method,
    created_at,
    updated_at
FROM programs 
WHERE cluster_data IS NOT NULL;

-- ===========================================
-- 6. SAMPLE DATA INSERTION
-- ===========================================

-- Insert sample Bryant cluster program
INSERT INTO programs (
    program_name, 
    user_id, 
    program_type,
    cluster_data
) VALUES (
    'Bryant Hypertrophy Cluster Program',
    'sample-user-id',
    'hypertrophy',
    '{
        "intraRest": 15,
        "repsRange": "3-5",
        "clustersPerSet": 3,
        "totalSets": 4,
        "bryantCompliant": true,
        "enabled": true,
        "effectiveVolumeFormula": "total_reps * (1 - (intraRest / 60))",
        "notes": "Bryant Periodization cluster method for metabolic stress"
    }'::JSONB
);

-- ===========================================
-- 7. QUERY EXAMPLES FOR CLUSTER PROGRAMS
-- ===========================================

-- Find all Bryant-compliant cluster programs
SELECT 
    program_name,
    training_method,
    intra_rest_seconds,
    clusters_per_set,
    reps_range
FROM cluster_programs 
WHERE is_bryant_compliant = 'true';

-- Get cluster configuration for specific program
SELECT 
    program_name,
    cluster_data,
    jsonb_pretty(cluster_data) as formatted_config
FROM programs 
WHERE program_id = 'specific-program-id'
    AND cluster_data->>'enabled' = 'true';

-- Statistics on cluster program usage
SELECT 
    training_method,
    COUNT(*) as program_count,
    AVG((cluster_data->>'intraRest')::integer) as avg_intra_rest,
    MODE() WITHIN GROUP (ORDER BY cluster_data->>'clustersPerSet') as common_cluster_count
FROM cluster_programs 
GROUP BY training_method
ORDER BY program_count DESC;

-- ===========================================
-- 8. PERFORMANCE OPTIMIZATION
-- ===========================================

-- Analyze query performance for cluster data
EXPLAIN (ANALYZE, BUFFERS) 
SELECT program_name, cluster_data 
FROM programs 
WHERE cluster_data->>'bryantCompliant' = 'true'
    AND (cluster_data->>'intraRest')::integer = 15;

-- ===========================================
-- 9. ROLLBACK SCRIPT (if needed)
-- ===========================================

-- Uncomment to rollback changes:
-- DROP VIEW IF EXISTS cluster_programs;
-- DROP INDEX IF EXISTS idx_programs_bryant_cluster;
-- DROP INDEX IF EXISTS idx_programs_cluster_intra_rest;
-- ALTER TABLE programs DROP CONSTRAINT IF EXISTS check_cluster_data_structure;
-- ALTER TABLE programs DROP COLUMN IF EXISTS cluster_data;

COMMENT ON COLUMN programs.cluster_data IS 'JSONB storage for Bryant Periodization cluster set configurations including intraRest, repsRange, clustersPerSet, and bryantCompliant flag';
