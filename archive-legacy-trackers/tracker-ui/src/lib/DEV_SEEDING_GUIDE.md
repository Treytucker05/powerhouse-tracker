# Dev Seeding Utilities - Usage Guide

## Overview

The `src/lib/devSeed.ts` file provides comprehensive seeding utilities for the PowerHouse Tracker dashboard. It creates realistic training data that matches the new database schema.

## Available Functions

### Core Seeding Functions

- **`seedExercises()`** - Seeds sample exercises into the database
- **`seedVolumeLandmarks(userId, experienceLevel)`** - Seeds volume landmarks (MV, MEV, MAV, MRV) for muscle groups
- **`seedWorkoutData(userId, config)`** - Seeds realistic workout sessions and sets
- **`seedBodyMetrics(userId, weeksBack)`** - Seeds body composition data over time
- **`seedActivityData(userId, daysBack)`** - Seeds daily activity data (steps, calories, etc.)

### Convenience Functions

- **`seedDemo(userId?, config?)`** - Complete seeding with all data types
- **`seedQuick(userId?)`** - Minimal seeding for quick testing (2 weeks of data)
- **`clearSeedData(userId?)`** - Removes all seeded data for a user

## Usage Examples

### Basic Usage (Auto-detects current user)
```typescript
import { seedDemo, seedQuick } from '../lib/devSeed';

// Full demo data (8 weeks, 4 sessions/week, realistic progression)
await seedDemo();

// Quick test data (2 weeks, 3 sessions/week, minimal)
await seedQuick();
```

### Custom Configuration
```typescript
import { seedDemo, seedWorkoutData } from '../lib/devSeed';

// Custom demo configuration
await seedDemo(undefined, {
  weeksBack: 12,           // 12 weeks of data
  sessionsPerWeek: 5,      // 5 sessions per week
  setsPerSession: 25,      // 25 sets per session
  generateBodyMetrics: true,
  generateActivityData: true
});

// Just workout data for specific user
await seedWorkoutData('user-id-123', {
  weeksBack: 6,
  sessionsPerWeek: 4,
  setsPerSession: 20
});
```

### Volume Landmarks by Experience Level
```typescript
import { seedVolumeLandmarks } from '../lib/devSeed';

// Beginner volume targets
await seedVolumeLandmarks('user-id', 'beginner');

// Intermediate volume targets (default)
await seedVolumeLandmarks('user-id', 'intermediate');

// Advanced volume targets
await seedVolumeLandmarks('user-id', 'advanced');
```

## Generated Data Features

### Realistic Progression
- Progressive overload over weeks (2.5% weight increase per week)
- RIR progression from 3-4 early in mesocycle to 0-1 at peak
- Session types: Push, Pull, Legs, Upper Body
- Exercise selection based on muscle groups and session type

### Volume Landmarks
- Evidence-based volume recommendations by experience level
- Maintenance Volume (MV), Minimum Effective Volume (MEV)
- Maximum Adaptive Volume (MAV), Maximum Recoverable Volume (MRV)

### Body Composition Tracking
- Gradual weight and body fat changes over time
- Body measurements (chest, waist, thigh, arm)
- Realistic variation and progression

### Activity Data
- Daily steps (8,000-15,000 range)
- Calories burned (2,200-3,200 range)
- Active minutes (60-120 range)

## Integration with Dashboard

The seeding functions are automatically called in development mode:

```jsx
// In src/pages/Home.jsx
useEffect(() => {
  if (import.meta.env.DEV) {
    seedDemo(); // Auto-seeds on page load in dev
  }
}, []);
```

## Safety Features

- **Development Only**: Seeding is disabled in production
- **User Authentication**: Automatically uses authenticated user if no userId provided
- **Error Handling**: Comprehensive error catching and logging
- **Data Cleanup**: `clearSeedData()` removes all seeded data safely

## Database Schema Compatibility

The seeding functions are designed to work with the new Supabase schema:

- `exercises` table - Exercise definitions with muscle groups
- `workout_sessions` table - Training sessions with metadata
- `workout_sets` table - Individual sets with RIR, weight, reps
- `volume_landmarks` table - User-specific volume targets
- `body_metrics` table - Body composition tracking
- `activity_data` table - Daily activity metrics

## Testing

Use the test utilities in `src/lib/test-devSeed.ts`:

```typescript
// In browser console or test environment
await testSeeding();     // Tests basic functions
await testFullDemo();    // Tests complete demo seeding
```

## Troubleshooting

- Ensure Supabase client is properly configured
- Check authentication state before seeding
- Verify database permissions and RLS policies
- Use browser dev tools to monitor seeding progress
