-- PowerHouse Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise library
CREATE TABLE public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    muscle_groups TEXT[] NOT NULL,
    equipment TEXT,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training programs
CREATE TABLE public.programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal_type TEXT CHECK (goal_type IN ('strength', 'hypertrophy', 'endurance')),
    duration_weeks INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program blocks (mesocycles)
CREATE TABLE public.program_blocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    block_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    duration_weeks INTEGER NOT NULL,
    focus TEXT CHECK (focus IN ('accumulation', 'intensification', 'realization', 'deload')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program weeks
CREATE TABLE public.program_weeks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    block_id UUID REFERENCES public.program_blocks(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    is_deload BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planned sessions
CREATE TABLE public.planned_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    week_id UUID REFERENCES public.program_weeks(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    session_type TEXT CHECK (session_type IN ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'rest')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planned exercises for sessions
CREATE TABLE public.planned_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.planned_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id),
    target_sets INTEGER NOT NULL,
    target_reps_min INTEGER NOT NULL,
    target_reps_max INTEGER NOT NULL,
    target_rir INTEGER,
    load_percentage DECIMAL(5,2),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actual workout sessions
CREATE TABLE public.workout_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id),
    planned_session_id UUID REFERENCES public.planned_sessions(id),
    session_type TEXT CHECK (session_type IN ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'rest')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    fatigue_rating INTEGER CHECK (fatigue_rating >= 1 AND fatigue_rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual sets performed
CREATE TABLE public.workout_sets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id),
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL(8,2) NOT NULL,
    rir INTEGER,
    rest_time INTEGER, -- seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volume landmarks per user per muscle
CREATE TABLE public.volume_landmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    muscle_group TEXT NOT NULL,
    mv INTEGER DEFAULT 0, -- Maintenance Volume
    mev INTEGER DEFAULT 0, -- Minimum Effective Volume
    mav INTEGER DEFAULT 0, -- Maximum Adaptive Volume
    mrv INTEGER DEFAULT 0, -- Maximum Recoverable Volume
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, muscle_group)
);

-- Body metrics tracking
CREATE TABLE public.body_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    measurements JSONB DEFAULT '{}', -- chest, waist, thigh, arm measurements
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity tracking (steps, etc.)
CREATE TABLE public.activity_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    steps INTEGER DEFAULT 0,
    calories_burned INTEGER,
    active_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_start_time ON public.workout_sessions(start_time);
CREATE INDEX idx_workout_sets_session_id ON public.workout_sets(session_id);
CREATE INDEX idx_workout_sets_exercise_id ON public.workout_sets(exercise_id);
CREATE INDEX idx_workout_sets_completed_at ON public.workout_sets(completed_at);
CREATE INDEX idx_volume_landmarks_user_muscle ON public.volume_landmarks(user_id, muscle_group);
CREATE INDEX idx_body_metrics_user_date ON public.body_metrics(user_id, recorded_at);
CREATE INDEX idx_activity_data_user_date ON public.activity_data(user_id, date);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volume_landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_data ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Programs policies
CREATE POLICY "Users can manage own programs" ON public.programs
    FOR ALL USING (auth.uid() = user_id);

-- Workout sessions policies
CREATE POLICY "Users can manage own sessions" ON public.workout_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Workout sets policies (through session relationship)
CREATE POLICY "Users can manage own sets" ON public.workout_sets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workout_sessions 
            WHERE workout_sessions.id = workout_sets.session_id 
            AND workout_sessions.user_id = auth.uid()
        )
    );

-- Volume landmarks policies
CREATE POLICY "Users can manage own volume landmarks" ON public.volume_landmarks
    FOR ALL USING (auth.uid() = user_id);

-- Body metrics policies
CREATE POLICY "Users can manage own body metrics" ON public.body_metrics
    FOR ALL USING (auth.uid() = user_id);

-- Activity data policies
CREATE POLICY "Users can manage own activity data" ON public.activity_data
    FOR ALL USING (auth.uid() = user_id);

-- Functions for calculated metrics

-- Function to get volume/tonnage data
CREATE OR REPLACE FUNCTION get_volume_tonnage(
    p_user_id UUID,
    p_timeframe TEXT,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    muscle TEXT,
    sets BIGINT,
    reps BIGINT,
    volume BIGINT,
    tonnage DECIMAL,
    volume_load DECIMAL
) AS $$
BEGIN
    -- Set default date range based on timeframe
    IF p_start_date IS NULL THEN
        CASE p_timeframe
            WHEN 'day' THEN p_start_date := CURRENT_DATE;
            WHEN 'week' THEN p_start_date := DATE_TRUNC('week', CURRENT_DATE);
            WHEN 'block' THEN p_start_date := CURRENT_DATE - INTERVAL '4 weeks';
            WHEN 'program' THEN p_start_date := CURRENT_DATE - INTERVAL '12 weeks';
        END CASE;
    END IF;
    
    IF p_end_date IS NULL THEN
        p_end_date := CURRENT_TIMESTAMP;
    END IF;

    RETURN QUERY
    SELECT 
        UNNEST(e.muscle_groups) as muscle,
        COUNT(ws.id) as sets,
        SUM(ws.reps) as reps,
        COUNT(ws.id) as volume, -- Volume = Sets
        SUM(ws.reps * ws.weight) as tonnage,
        SUM(ws.reps * ws.weight) as volume_load
    FROM workout_sets ws
    JOIN workout_sessions sess ON ws.session_id = sess.id
    JOIN exercises e ON ws.exercise_id = e.id
    WHERE sess.user_id = p_user_id
        AND ws.completed_at >= p_start_date
        AND ws.completed_at <= p_end_date
    GROUP BY UNNEST(e.muscle_groups);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate fatigue score
CREATE OR REPLACE FUNCTION calculate_fatigue_score(
    p_user_id UUID,
    p_days_back INTEGER DEFAULT 7
)
RETURNS INTEGER AS $$
DECLARE
    fatigue_score INTEGER := 0;
    volume_ratio DECIMAL;
    recent_volume DECIMAL;
    baseline_volume DECIMAL;
BEGIN
    -- Get recent volume (last p_days_back days)
    SELECT COALESCE(SUM(ws.reps * ws.weight), 0)
    INTO recent_volume
    FROM workout_sets ws
    JOIN workout_sessions sess ON ws.session_id = sess.id
    WHERE sess.user_id = p_user_id
        AND ws.completed_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back;
    
    -- Get baseline volume (previous period of same length)
    SELECT COALESCE(SUM(ws.reps * ws.weight), 0)
    INTO baseline_volume
    FROM workout_sets ws
    JOIN workout_sessions sess ON ws.session_id = sess.id
    WHERE sess.user_id = p_user_id
        AND ws.completed_at >= CURRENT_DATE - INTERVAL '1 day' * (p_days_back * 2)
        AND ws.completed_at < CURRENT_DATE - INTERVAL '1 day' * p_days_back;
    
    -- Calculate ratio and convert to fatigue score (0-100)
    IF baseline_volume > 0 THEN
        volume_ratio := recent_volume / baseline_volume;
        fatigue_score := LEAST(100, GREATEST(0, (volume_ratio - 0.8) * 200));
    END IF;
    
    RETURN fatigue_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;