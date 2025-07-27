-- Bryant Periodization Strongman Volume Calculation Function
-- SQL function for calculating strongman event volumes with time/distance conversions
-- Compatible with Supabase PostgreSQL

-- Create the calculate_strongman_volume function
CREATE OR REPLACE FUNCTION calculate_strongman_volume(
    p_event_type TEXT,
    p_distance NUMERIC DEFAULT NULL,
    p_duration NUMERIC DEFAULT NULL,
    p_events INTEGER DEFAULT 3,
    p_load_factor NUMERIC DEFAULT 1.2,
    p_bodyweight NUMERIC DEFAULT 200,
    p_experience_level TEXT DEFAULT 'intermediate'
)
RETURNS TABLE (
    event_name TEXT,
    estimated_reps NUMERIC,
    volume_equivalent NUMERIC,
    rep_based_fallback NUMERIC,
    time_component NUMERIC,
    distance_component NUMERIC,
    load_adjustment NUMERIC,
    total_volume NUMERIC,
    volume_formula TEXT,
    bryant_compliant BOOLEAN,
    tactical_application BOOLEAN
) 
LANGUAGE plpgsql
AS $$
DECLARE
    base_reps NUMERIC := 0;
    time_reps NUMERIC := 0;
    distance_reps NUMERIC := 0;
    experience_modifier NUMERIC := 1.0;
    event_modifier NUMERIC := 1.0;
    calculated_volume NUMERIC := 0;
    formula_text TEXT := '';
BEGIN
    -- Set experience level modifiers
    CASE p_experience_level
        WHEN 'beginner' THEN experience_modifier := 0.8;
        WHEN 'intermediate' THEN experience_modifier := 1.0;
        WHEN 'advanced' THEN experience_modifier := 1.2;
        ELSE experience_modifier := 1.0;
    END CASE;

    -- Calculate volume based on event type
    CASE p_event_type
        -- Farmers Walk
        WHEN 'farmers_walk' THEN
            event_name := 'Farmers Walk';
            IF p_distance IS NOT NULL THEN
                distance_reps := p_distance / 5.0; -- 5 feet per "rep"
                distance_component := distance_reps;
            END IF;
            IF p_duration IS NOT NULL THEN
                time_reps := p_duration / 2.0; -- 2 seconds per "rep"
                time_component := time_reps;
            END IF;
            event_modifier := 1.3;
            tactical_application := TRUE;
            formula_text := 'distance/5 + duration/2';

        -- Tire Flip
        WHEN 'tire_flip' THEN
            event_name := 'Tire Flip';
            IF p_distance IS NOT NULL THEN
                distance_reps := p_distance / 3.0; -- 3 feet per flip
                distance_component := distance_reps;
            END IF;
            IF p_duration IS NOT NULL THEN
                time_reps := p_duration / 3.0; -- 3 seconds per flip
                time_component := time_reps;
            END IF;
            event_modifier := 1.5;
            tactical_application := TRUE;
            formula_text := 'distance/3 + duration/3';

        -- Atlas Stones
        WHEN 'atlas_stones' THEN
            event_name := 'Atlas Stones';
            IF p_duration IS NOT NULL THEN
                time_reps := p_duration / 4.0; -- 4 seconds per stone
                time_component := time_reps;
            END IF;
            -- Atlas stones are typically not distance-based
            distance_component := 0;
            event_modifier := 1.8;
            tactical_application := FALSE;
            formula_text := 'duration/4 (time-based)';

        -- Yoke Walk
        WHEN 'yoke_walk' THEN
            event_name := 'Yoke Walk';
            IF p_distance IS NOT NULL THEN
                distance_reps := p_distance / 4.0; -- 4 feet per "rep"
                distance_component := distance_reps;
            END IF;
            IF p_duration IS NOT NULL THEN
                time_reps := p_duration / 2.5; -- 2.5 seconds per "rep"
                time_component := time_reps;
            END IF;
            event_modifier := 1.4;
            tactical_application := TRUE;
            formula_text := 'distance/4 + duration/2.5';

        -- Log Press
        WHEN 'log_press' THEN
            event_name := 'Log Press';
            IF p_duration IS NOT NULL THEN
                time_reps := p_duration / 5.0; -- 5 seconds per press
                time_component := time_reps;
            END IF;
            distance_component := 0; -- Not distance-based
            event_modifier := 1.6;
            tactical_application := FALSE;
            formula_text := 'duration/5 (time-based)';

        -- Sled Pull/Push
        WHEN 'sled_pull', 'sled_push' THEN
            event_name := CASE WHEN p_event_type = 'sled_pull' THEN 'Sled Pull' ELSE 'Sled Push' END;
            IF p_distance IS NOT NULL THEN
                distance_reps := p_distance / 6.0; -- 6 feet per "rep"
                distance_component := distance_reps;
            END IF;
            IF p_duration IS NOT NULL THEN
                time_reps := p_duration / 3.0; -- 3 seconds per "rep"
                time_component := time_reps;
            END IF;
            event_modifier := 1.3;
            tactical_application := TRUE;
            formula_text := 'distance/6 + duration/3';

        -- Sandbag Carry
        WHEN 'sandbag_carry' THEN
            event_name := 'Sandbag Carry';
            IF p_distance IS NOT NULL THEN
                distance_reps := p_distance / 4.0; -- 4 feet per "rep"
                distance_component := distance_reps;
            END IF;
            IF p_duration IS NOT NULL THEN
                time_reps := p_duration / 2.0; -- 2 seconds per "rep"
                time_component := time_reps;
            END IF;
            event_modifier := 1.25;
            tactical_application := TRUE;
            formula_text := 'distance/4 + duration/2';

        -- Default case
        ELSE
            event_name := 'Unknown Event';
            distance_reps := COALESCE(p_distance / 5.0, 0);
            time_reps := COALESCE(p_duration / 3.0, 0);
            distance_component := distance_reps;
            time_component := time_reps;
            event_modifier := 1.0;
            tactical_application := FALSE;
            formula_text := 'distance/5 + duration/3 (default)';
    END CASE;

    -- Calculate estimated reps (combination of time and distance components)
    estimated_reps := GREATEST(distance_reps, time_reps);
    IF distance_reps > 0 AND time_reps > 0 THEN
        -- If both distance and time are provided, use hybrid calculation
        estimated_reps := (distance_reps + time_reps) / 2.0;
    END IF;

    -- Apply experience modifier
    estimated_reps := estimated_reps * experience_modifier;

    -- Calculate volume equivalent (estimated reps * load factor * event modifier)
    volume_equivalent := estimated_reps * p_load_factor * event_modifier;

    -- Calculate rep-based fallback (for integration with standard rep schemes)
    -- Convert strongman work to equivalent traditional sets/reps
    rep_based_fallback := CEIL(volume_equivalent / 5.0) * 5; -- Round to nearest 5

    -- Apply load adjustment based on bodyweight for strongman events
    load_adjustment := (p_bodyweight / 200.0) * 0.1 + 0.9; -- Slight adjustment for bodyweight
    
    -- Calculate total volume across all events
    total_volume := volume_equivalent * p_events * load_adjustment;

    -- Update formula text with actual calculation
    formula_text := formula_text || ' * ' || p_load_factor::TEXT || ' * ' || event_modifier::TEXT || ' * ' || p_events::TEXT || ' events';

    -- Always Bryant compliant for strongman events
    bryant_compliant := TRUE;

    RETURN QUERY SELECT 
        event_name,
        ROUND(estimated_reps, 2) as estimated_reps,
        ROUND(volume_equivalent, 2) as volume_equivalent,
        ROUND(rep_based_fallback, 0) as rep_based_fallback,
        ROUND(time_component, 2) as time_component,
        ROUND(distance_component, 2) as distance_component,
        ROUND(load_adjustment, 3) as load_adjustment,
        ROUND(total_volume, 2) as total_volume,
        formula_text as volume_formula,
        bryant_compliant,
        tactical_application;

END;
$$;

-- Create helper function for batch strongman volume calculations
CREATE OR REPLACE FUNCTION calculate_strongman_session_volume(
    p_user_id UUID,
    p_session_events JSONB, -- Array of event objects with type, distance, duration, etc.
    p_experience_level TEXT DEFAULT 'intermediate'
)
RETURNS TABLE (
    session_total_volume NUMERIC,
    event_breakdown JSONB,
    tactical_percentage NUMERIC,
    bryant_compliance BOOLEAN,
    session_summary TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    event_obj JSONB;
    event_result RECORD;
    total_volume NUMERIC := 0;
    tactical_volume NUMERIC := 0;
    event_results JSONB := '[]'::JSONB;
    event_count INTEGER := 0;
    tactical_count INTEGER := 0;
BEGIN
    -- Process each event in the session
    FOR event_obj IN SELECT * FROM jsonb_array_elements(p_session_events)
    LOOP
        -- Calculate volume for this event
        SELECT * INTO event_result FROM calculate_strongman_volume(
            (event_obj->>'event_type')::TEXT,
            (event_obj->>'distance')::NUMERIC,
            (event_obj->>'duration')::NUMERIC,
            COALESCE((event_obj->>'events')::INTEGER, 1),
            COALESCE((event_obj->>'load_factor')::NUMERIC, 1.2),
            COALESCE((event_obj->>'bodyweight')::NUMERIC, 200),
            p_experience_level
        );

        -- Add to totals
        total_volume := total_volume + event_result.total_volume;
        event_count := event_count + 1;
        
        IF event_result.tactical_application THEN
            tactical_volume := tactical_volume + event_result.total_volume;
            tactical_count := tactical_count + 1;
        END IF;

        -- Add to results array
        event_results := event_results || jsonb_build_object(
            'event_type', event_obj->>'event_type',
            'event_name', event_result.event_name,
            'volume', event_result.total_volume,
            'estimated_reps', event_result.estimated_reps,
            'tactical', event_result.tactical_application
        );
    END LOOP;

    -- Calculate tactical percentage
    tactical_percentage := CASE 
        WHEN total_volume > 0 THEN (tactical_volume / total_volume) * 100
        ELSE 0 
    END;

    -- Determine Bryant compliance (all strongman events are Bryant compliant)
    bryant_compliance := TRUE;

    -- Generate session summary
    session_summary := event_count::TEXT || ' strongman events, ' || 
                      ROUND(total_volume, 0)::TEXT || ' total volume, ' ||
                      tactical_count::TEXT || ' tactical events (' || 
                      ROUND(tactical_percentage, 1)::TEXT || '%)';

    RETURN QUERY SELECT 
        ROUND(total_volume, 2) as session_total_volume,
        event_results as event_breakdown,
        ROUND(tactical_percentage, 1) as tactical_percentage,
        bryant_compliance,
        session_summary;
END;
$$;

-- Create function to get strongman volume recommendations
CREATE OR REPLACE FUNCTION get_strongman_volume_recommendations(
    p_experience_level TEXT DEFAULT 'intermediate',
    p_training_goal TEXT DEFAULT 'strength',
    p_available_equipment TEXT[] DEFAULT ARRAY['tire', 'sled', 'sandbag']
)
RETURNS TABLE (
    recommended_events JSONB,
    weekly_volume_target NUMERIC,
    session_frequency INTEGER,
    progression_strategy TEXT,
    equipment_requirements TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    base_volume NUMERIC;
    frequency INTEGER;
    events_json JSONB := '[]'::JSONB;
BEGIN
    -- Set base parameters based on experience level
    CASE p_experience_level
        WHEN 'beginner' THEN 
            base_volume := 150;
            frequency := 1;
        WHEN 'intermediate' THEN 
            base_volume := 300;
            frequency := 2;
        WHEN 'advanced' THEN 
            base_volume := 500;
            frequency := 3;
        ELSE 
            base_volume := 300;
            frequency := 2;
    END CASE;

    -- Adjust for training goal
    CASE p_training_goal
        WHEN 'strength' THEN base_volume := base_volume * 0.8;
        WHEN 'conditioning' THEN base_volume := base_volume * 1.3;
        WHEN 'tactical' THEN base_volume := base_volume * 1.1;
        ELSE base_volume := base_volume; -- hypertrophy default
    END CASE;

    -- Generate recommended events based on available equipment
    IF 'tire' = ANY(p_available_equipment) THEN
        events_json := events_json || jsonb_build_object(
            'event_type', 'tire_flip',
            'recommended_distance', 100,
            'recommended_duration', 45,
            'load_factor', 1.5,
            'priority', 'high'
        );
    END IF;

    IF 'sled' = ANY(p_available_equipment) THEN
        events_json := events_json || jsonb_build_object(
            'event_type', 'sled_push',
            'recommended_distance', 150,
            'recommended_duration', 30,
            'load_factor', 1.3,
            'priority', 'high'
        );
    END IF;

    IF 'sandbag' = ANY(p_available_equipment) THEN
        events_json := events_json || jsonb_build_object(
            'event_type', 'sandbag_carry',
            'recommended_distance', 100,
            'recommended_duration', 30,
            'load_factor', 1.25,
            'priority', 'medium'
        );
    END IF;

    -- Add farmers walk if dumbbells/handles available
    IF 'dumbbells' = ANY(p_available_equipment) OR 'farmers_handles' = ANY(p_available_equipment) THEN
        events_json := events_json || jsonb_build_object(
            'event_type', 'farmers_walk',
            'recommended_distance', 150,
            'recommended_duration', 30,
            'load_factor', 1.3,
            'priority', 'high'
        );
    END IF;

    RETURN QUERY SELECT 
        events_json as recommended_events,
        base_volume as weekly_volume_target,
        frequency as session_frequency,
        CASE p_experience_level
            WHEN 'beginner' THEN 'Start with 1 event per session, focus on technique'
            WHEN 'intermediate' THEN 'Combine 2-3 events per session, progressive overload'
            WHEN 'advanced' THEN 'Complex event combinations, periodized intensity'
            ELSE 'Progressive overload with technique focus'
        END as progression_strategy,
        p_available_equipment as equipment_requirements;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_strongman_events_user_date 
ON workout_sessions(user_id, start_time) 
WHERE session_type = 'strongman';

-- Add comments for documentation
COMMENT ON FUNCTION calculate_strongman_volume IS 'Calculates volume equivalents for Bryant Periodization strongman events with time/distance conversions';
COMMENT ON FUNCTION calculate_strongman_session_volume IS 'Batch calculation of strongman session volume across multiple events';
COMMENT ON FUNCTION get_strongman_volume_recommendations IS 'Provides strongman training recommendations based on experience level and goals';

-- Grant permissions (adjust as needed for your setup)
-- GRANT EXECUTE ON FUNCTION calculate_strongman_volume TO authenticated;
-- GRANT EXECUTE ON FUNCTION calculate_strongman_session_volume TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_strongman_volume_recommendations TO authenticated;
