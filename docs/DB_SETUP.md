# Database Setup Guide

This document contains the SQL scripts and configuration needed to set up the Supabase database for the PowerHouse RP Toolkit.

## Tables

### weekly_volume

The `weekly_volume` table stores weekly training volume data per user.

```sql
-- Create the weekly_volume table
CREATE TABLE public.weekly_volume (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    muscle text NOT NULL,
    volume numeric NOT NULL,
    week integer NOT NULL,
    user_id uuid NOT NULL DEFAULT auth.uid(),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint to auth.users
ALTER TABLE public.weekly_volume 
ADD CONSTRAINT weekly_volume_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_weekly_volume_user_id ON public.weekly_volume(user_id);
CREATE INDEX idx_weekly_volume_week ON public.weekly_volume(week);
CREATE INDEX idx_weekly_volume_muscle ON public.weekly_volume(muscle);

-- Create a composite index for common queries
CREATE INDEX idx_weekly_volume_user_week ON public.weekly_volume(user_id, week);
```

## Row Level Security (RLS)

### weekly_volume RLS Policies

```sql
-- Enable RLS on the weekly_volume table
ALTER TABLE public.weekly_volume ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own weekly volume data
CREATE POLICY "Users can view own weekly volume" 
ON public.weekly_volume 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own weekly volume data
CREATE POLICY "Users can insert own weekly volume" 
ON public.weekly_volume 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own weekly volume data
CREATE POLICY "Users can update own weekly volume" 
ON public.weekly_volume 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own weekly volume data
CREATE POLICY "Users can delete own weekly volume" 
ON public.weekly_volume 
FOR DELETE 
USING (auth.uid() = user_id);
```

## Triggers

### Auto-update timestamps

```sql
-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update the updated_at column
CREATE TRIGGER weekly_volume_updated_at
    BEFORE UPDATE ON public.weekly_volume
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

## Authentication Setup

Make sure to configure Supabase Authentication:

1. Enable the authentication providers you want to use (Email, Google, etc.)
2. Set up your site URL in the Supabase dashboard
3. Configure email templates if using email authentication

## Environment Variables

Add these to your `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Testing RLS Policies

You can test the RLS policies in the Supabase SQL editor:

```sql
-- Test as an authenticated user
SELECT auth.uid(); -- Should return the user's UUID
SELECT * FROM weekly_volume; -- Should only return the user's data

-- Test inserting data
INSERT INTO weekly_volume (muscle, volume, week) 
VALUES ('Chest', 12, 1);
-- Should automatically set user_id to auth.uid()
```

## Migration Notes

If you're upgrading an existing `weekly_volume` table:

```sql
-- Add user_id column to existing table
ALTER TABLE public.weekly_volume 
ADD COLUMN user_id uuid DEFAULT auth.uid();

-- Update existing rows to have the current user's ID (if needed)
-- This would typically be done in a migration script with proper user mapping

-- Make user_id NOT NULL after data migration
ALTER TABLE public.weekly_volume 
ALTER COLUMN user_id SET NOT NULL;

-- Then proceed with the RLS setup above
```
