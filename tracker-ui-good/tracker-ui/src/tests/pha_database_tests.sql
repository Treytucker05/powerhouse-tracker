-- PHA Health Screening Database Test Queries
-- Test the GENERATED pha_eligible column and pha_health_screen JSONB storage

-- ===========================================
-- 1. INSERT TEST DATA
-- ===========================================

-- Test Case 1: Contraindicated User (High BP + Poor Fitness)
INSERT INTO assessments (user_id, pha_health_screen) VALUES 
('test-user-1', '{
  "highBP": true,
  "cardiacHistory": false,
  "fitness": "poor",
  "lastScreened": "2025-07-23T10:00:00Z"
}'::jsonb);

-- Test Case 2: Eligible User (No contraindications)
INSERT INTO assessments (user_id, pha_health_screen) VALUES 
('test-user-2', '{
  "highBP": false,
  "cardiacHistory": false,
  "fitness": "good",
  "lastScreened": "2025-07-23T10:00:00Z"
}'::jsonb);

-- Test Case 3: Limited User (Only poor fitness)
INSERT INTO assessments (user_id, pha_health_screen) VALUES 
('test-user-3', '{
  "highBP": false,
  "cardiacHistory": false,
  "fitness": "poor",
  "lastScreened": "2025-07-23T10:00:00Z"
}'::jsonb);

-- Test Case 4: Conditional User (Cardiac history only)
INSERT INTO assessments (user_id, pha_health_screen) VALUES 
('test-user-4', '{
  "highBP": false,
  "cardiacHistory": true,
  "fitness": "moderate",
  "lastScreened": "2025-07-23T10:00:00Z"
}'::jsonb);

-- ===========================================
-- 2. VERIFY GENERATED COLUMN LOGIC
-- ===========================================

-- Query to verify pha_eligible is calculated correctly
SELECT 
    user_id,
    pha_health_screen->>'highBP' as high_bp,
    pha_health_screen->>'cardiacHistory' as cardiac_history,
    pha_health_screen->>'fitness' as fitness_level,
    pha_eligible,
    CASE 
        WHEN pha_eligible = true THEN '✅ Eligible'
        ELSE '❌ Contraindicated'
    END as status
FROM assessments 
WHERE user_id LIKE 'test-user-%'
ORDER BY user_id;

-- Expected Results:
-- test-user-1: false (High BP + Poor Fitness)
-- test-user-2: true  (No contraindications)  
-- test-user-3: false (Poor fitness)
-- test-user-4: false (Cardiac history)

-- ===========================================
-- 3. TEST PHA SCREENING SUMMARY VIEW
-- ===========================================

-- Query the PHA screening summary view
SELECT 
    assessment_id,
    user_id,
    has_high_bp,
    has_cardiac_history,
    fitness_level,
    pha_eligible,
    screening_status,
    assessment_date
FROM pha_screening_summary 
WHERE user_id LIKE 'test-user-%'
ORDER BY user_id;

-- ===========================================
-- 4. TEST CONSTRAINT VALIDATION
-- ===========================================

-- This should SUCCEED (valid fitness level)
UPDATE assessments 
SET pha_health_screen = jsonb_set(pha_health_screen, '{fitness}', '"moderate"')
WHERE user_id = 'test-user-1';

-- This should FAIL (invalid fitness level)
-- UPDATE assessments 
-- SET pha_health_screen = jsonb_set(pha_health_screen, '{fitness}', '"invalid"')
-- WHERE user_id = 'test-user-1';

-- ===========================================
-- 5. TEST PROGRAM FILTERING BASED ON PHA ELIGIBILITY
-- ===========================================

-- Get users eligible for PHA circuits
SELECT 
    user_id,
    fitness_level,
    'Can use PHA circuits with Bryant protocols' as program_recommendation
FROM pha_screening_summary 
WHERE pha_eligible = true;

-- Get users who need alternative conditioning
SELECT 
    user_id,
    screening_status,
    'Use traditional strength training with 2-5min rest' as program_recommendation
FROM pha_screening_summary 
WHERE pha_eligible = false;

-- ===========================================
-- 6. TEST UPDATE SCENARIOS
-- ===========================================

-- Simulate user improving fitness level
UPDATE assessments 
SET pha_health_screen = jsonb_set(
    jsonb_set(pha_health_screen, '{fitness}', '"good"'),
    '{lastScreened}', '"2025-07-23T12:00:00Z"'
)
WHERE user_id = 'test-user-3';

-- Verify pha_eligible updated automatically
SELECT 
    user_id,
    pha_health_screen->>'fitness' as new_fitness,
    pha_eligible,
    'Should be true now' as expected
FROM assessments 
WHERE user_id = 'test-user-3';

-- ===========================================
-- 7. PERFORMANCE TEST QUERIES
-- ===========================================

-- Test index usage for PHA eligibility queries
EXPLAIN (ANALYZE, BUFFERS) 
SELECT user_id, screening_status 
FROM pha_screening_summary 
WHERE pha_eligible = true;

-- Test JSONB query performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT user_id 
FROM assessments 
WHERE pha_health_screen->>'fitness' = 'poor';

-- ===========================================
-- 8. CLEANUP TEST DATA
-- ===========================================

-- Remove test data when done
-- DELETE FROM assessments WHERE user_id LIKE 'test-user-%';

-- ===========================================
-- 9. REAL-WORLD QUERY EXAMPLES
-- ===========================================

-- Query for dashboard: Get user's current PHA status
SELECT 
    pha_eligible,
    screening_status,
    pha_health_screen->>'lastScreened' as last_screened,
    CASE 
        WHEN pha_eligible THEN 'PHA circuits available in program templates'
        ELSE 'PHA circuits excluded, using traditional strength training'
    END as program_impact
FROM pha_screening_summary 
WHERE user_id = 'current-user-id';

-- Query for program generation: Filter available templates
SELECT 
    template_name,
    template_type
FROM program_templates pt
JOIN assessments a ON a.user_id = 'current-user-id'
WHERE 
    (pt.requires_pha_eligibility = false) OR 
    (pt.requires_pha_eligibility = true AND a.pha_eligible = true);

-- Query for analytics: PHA eligibility statistics
SELECT 
    fitness_level,
    COUNT(*) as user_count,
    COUNT(*) FILTER (WHERE pha_eligible = true) as eligible_count,
    ROUND(
        (COUNT(*) FILTER (WHERE pha_eligible = true) * 100.0) / COUNT(*), 
        1
    ) as eligibility_percentage
FROM pha_screening_summary 
GROUP BY fitness_level
ORDER BY fitness_level;
