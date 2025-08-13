-- PHA Health Screening Integration for Bryant Periodization
-- Add PHA health screening columns to assessments table

-- Add pha_health_screen JSONB column to store screening data
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS pha_health_screen JSONB DEFAULT '{
  "highBP": false,
  "cardiacHistory": false,
  "fitness": "moderate",
  "lastScreened": null
}'::jsonb;

-- Add pha_eligible BOOLEAN GENERATED column based on screening data
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS pha_eligible BOOLEAN GENERATED ALWAYS AS (
  CASE 
    WHEN (pha_health_screen->>'highBP')::boolean = true THEN false
    WHEN (pha_health_screen->>'cardiacHistory')::boolean = true THEN false
    WHEN pha_health_screen->>'fitness' = 'poor' THEN false
    ELSE true
  END
) STORED;

-- Add index for PHA eligibility queries
CREATE INDEX IF NOT EXISTS idx_assessments_pha_eligible ON assessments(pha_eligible);

-- Add constraint to ensure valid fitness levels
ALTER TABLE assessments 
ADD CONSTRAINT IF NOT EXISTS check_pha_fitness_level 
CHECK (pha_health_screen->>'fitness' IN ('poor', 'moderate', 'good'));

-- Create view for PHA screening summary
CREATE OR REPLACE VIEW pha_screening_summary AS
SELECT 
  id as assessment_id,
  user_id,
  pha_health_screen->>'highBP' as has_high_bp,
  pha_health_screen->>'cardiacHistory' as has_cardiac_history,
  pha_health_screen->>'fitness' as fitness_level,
  pha_eligible,
  CASE 
    WHEN pha_eligible = false AND (pha_health_screen->>'highBP')::boolean = true 
      THEN 'High Blood Pressure Contraindication'
    WHEN pha_eligible = false AND (pha_health_screen->>'cardiacHistory')::boolean = true 
      THEN 'Cardiac History Contraindication'
    WHEN pha_eligible = false AND pha_health_screen->>'fitness' = 'poor' 
      THEN 'Poor Fitness Contraindication'
    ELSE 'Eligible for PHA Circuits'
  END as screening_status,
  created_at as assessment_date
FROM assessments 
WHERE pha_health_screen IS NOT NULL;

-- Grant permissions
GRANT SELECT ON pha_screening_summary TO authenticated;

-- Add RLS policy for PHA screening data
DROP POLICY IF EXISTS "Users can manage their own PHA screening" ON assessments;
CREATE POLICY "Users can manage their own PHA screening" ON assessments
  FOR ALL USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON COLUMN assessments.pha_health_screen IS 'Bryant Periodization PHA health screening data including BP status, cardiac history, and fitness level';
COMMENT ON COLUMN assessments.pha_eligible IS 'Generated boolean indicating eligibility for PHA circuit training based on screening criteria';
COMMENT ON VIEW pha_screening_summary IS 'Summary view of PHA screening results for dashboard display';

-- Example queries for testing:

-- Check PHA eligibility for a user
-- SELECT user_id, pha_eligible, screening_status 
-- FROM pha_screening_summary 
-- WHERE user_id = auth.uid();

-- Update PHA screening data
-- UPDATE assessments 
-- SET pha_health_screen = jsonb_build_object(
--   'highBP', false,
--   'cardiacHistory', false, 
--   'fitness', 'good',
--   'lastScreened', now()
-- )
-- WHERE user_id = auth.uid();

-- Find all users eligible for PHA training
-- SELECT user_id, fitness_level, assessment_date
-- FROM pha_screening_summary 
-- WHERE pha_eligible = true
-- ORDER BY assessment_date DESC;
