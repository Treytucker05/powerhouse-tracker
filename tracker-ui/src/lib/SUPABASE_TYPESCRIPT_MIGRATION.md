# Supabase TypeScript Client - Migration Guide

## Overview

The Supabase client has been converted from JavaScript to TypeScript with comprehensive type definitions that match the new database schema. This provides full type safety, better IDE support, and improved developer experience.

## Key Changes

### 1. **Full TypeScript Support**
- Complete type definitions for all database tables
- Type-safe query builders and RPC functions
- Proper error handling with typed responses
- IDE autocomplete and IntelliSense support

### 2. **Database Schema Types**
All database tables are fully typed:

```typescript
interface DatabaseWorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  session_type: SessionType;
  start_time: string;
  end_time?: string;
  notes?: string;
  fatigue_rating?: number; // 1-10
  created_at: string;
}
```

### 3. **Enhanced Helper Functions**
- `getCurrentUserId()` - Get authenticated user ID
- `getCurrentUserProfile()` - Get user profile with preferences
- `isAuthenticated()` - Check authentication status
- `signOut()` - Sign out with proper error handling

### 4. **Type-Safe Table Access**
```typescript
// Old way
const { data } = await supabase.from('workout_sessions').select('*');

// New type-safe way
const { data } = await tables.workoutSessions().select('*');
// data is fully typed as DatabaseWorkoutSession[]
```

### 5. **RPC Function Types**
```typescript
// Type-safe RPC calls
const volumeData = await rpc.calculateVolumeMetrics({
  user_id: 'user-123',
  start_date: '2025-01-01',
  end_date: '2025-01-31',
  muscle_groups: ['chest', 'back']
});
```

## Migration from JavaScript

### Import Changes
```typescript
// Old JavaScript import
import { supabase } from '../lib/supabaseClient';

// New TypeScript import (same, but with types)
import { supabase, tables, rpc } from '../lib/supabaseClient';
```

### Type Definitions Available
```typescript
import type { 
  DatabaseWorkoutSession,
  DatabaseWorkoutSet,
  DatabaseExercise,
  Profile,
  SessionType,
  MuscleGroup,
  Database
} from '../lib/supabaseClient';
```

## Usage Examples

### 1. **Basic Table Operations**
```typescript
// Create a workout session
const newSession: Database['public']['Tables']['workout_sessions']['Insert'] = {
  user_id: 'user-123',
  session_type: 'push',
  start_time: new Date().toISOString(),
  fatigue_rating: 7
};

const { data, error } = await tables.workoutSessions()
  .insert(newSession)
  .select()
  .single();
```

### 2. **Complex Queries with Relationships**
```typescript
// Get workout sessions with sets and exercises
const { data: sessions } = await tables.workoutSessions()
  .select(`
    *,
    workout_sets (
      *,
      exercises (
        name,
        muscle_groups
      )
    )
  `)
  .eq('user_id', userId)
  .gte('start_time', startDate)
  .lte('start_time', endDate);
```

### 3. **RPC Functions**
```typescript
// Calculate volume metrics
const volumeMetrics = await rpc.calculateVolumeMetrics({
  user_id: userId,
  start_date: '2025-01-01',
  end_date: '2025-01-31',
  muscle_groups: ['chest', 'back', 'shoulders']
});

if (volumeMetrics.data) {
  volumeMetrics.data.forEach(metric => {
    console.log(`${metric.muscle_group}: ${metric.total_sets} sets`);
  });
}
```

### 4. **Authentication Helper**
```typescript
// Check if user is authenticated
if (await isAuthenticated()) {
  const profile = await getCurrentUserProfile();
  if (profile) {
    console.log(`Welcome ${profile.name}`);
  }
}
```

## Environment Variables

The client requires these environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Error Handling

The TypeScript client provides better error handling:

```typescript
try {
  const { data, error } = await tables.workoutSessions()
    .insert(sessionData)
    .select()
    .single();
    
  if (error) {
    console.error('Database error:', error.message);
    return;
  }
  
  // data is fully typed here
  console.log('Created session:', data.id);
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## Backward Compatibility

All existing JavaScript imports continue to work:

```javascript
// This still works
import { supabase } from '../lib/supabaseClient';
```

The JavaScript files now re-export from the TypeScript version, so you get the benefits of the new implementation while maintaining compatibility.

## Database Schema Types

The following interfaces are available:

### Core Tables
- `Profile` - User profiles and preferences
- `DatabaseExercise` - Exercise library
- `DatabaseProgram` - Training programs
- `DatabaseWorkoutSession` - Workout sessions
- `DatabaseWorkoutSet` - Individual sets
- `DatabaseVolumeLandmark` - Volume targets per muscle
- `DatabaseBodyMetric` - Body composition data
- `DatabaseActivityData` - Daily activity tracking

### Utility Types
- `SessionType` - Training session types
- `MuscleGroup` - Muscle group definitions
- `Database` - Complete schema definition

## Benefits

1. **Type Safety** - Catch errors at compile time
2. **Better IDE Support** - Autocomplete and IntelliSense
3. **Documentation** - Types serve as documentation
4. **Refactoring Safety** - Confident code changes
5. **Performance** - Better query optimization hints

## Next Steps

1. Update imports to use the new helper functions
2. Add type annotations to your data handling code
3. Use the `tables` and `rpc` helpers for type safety
4. Consider migrating JavaScript files to TypeScript gradually
