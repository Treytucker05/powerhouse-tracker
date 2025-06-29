# Supabase Import Loop Fix - Complete

## Problem Solved
Fixed the circular Supabase export loop that was causing build failures and import issues throughout the codebase.

## Changes Made

### 1. Updated Main Supabase Client (`src/lib/supabaseClient.ts`)
- Changed from named export to default export only
- Made `supabase` client a local constant instead of exported constant
- Created extended client with helper functions as properties:
  ```typescript
  const extendedSupabase = Object.assign(supabase, {
    getCurrentUserId,
    getCurrentUserProfile,
    isAuthenticated,
    signOut,
    tables,
    rpc,
  });
  export default extendedSupabase;
  ```

### 2. Removed Problematic Re-export Files
- Deleted `src/lib/supabaseClient.js` (circular re-export)
- Deleted `src/lib/api/supabaseClient.js` (circular re-export)  
- Deleted `src/lib/devSeed.js` (self-referencing re-export)

### 3. Updated All Import Statements
Changed from named imports to default imports in all files:

**Before:**
```javascript
import { supabase } from '../lib/supabaseClient';
import { supabase, getCurrentUserId } from '../lib/api/supabaseClient';
```

**After:**
```javascript
import supabase from '../lib/supabaseClient';
```

### 4. Updated Function Calls
Changed helper function calls to use properties of the supabase client:

**Before:**
```javascript
const userId = await getCurrentUserId();
```

**After:**
```javascript
const userId = await supabase.getCurrentUserId();
```

### 5. Files Updated
- `src/hooks/useActiveSession.js`
- `src/hooks/useLogSet.js`
- `src/hooks/useQuickActions.js`
- `src/hooks/useWeeklyVolume.js`
- `src/hooks/useRecentWorkouts.js`
- `src/hooks/useWeekStatus.js`
- `src/hooks/useVolumeData.ts`
- `src/hooks/useWorkoutSessions.js`
- `src/hooks/useExercises.js`
- `src/lib/useWeeklyVolume.js`
- `src/lib/useAdaptiveRIR.js`
- `src/lib/useActiveSession.js`
- `src/lib/devSeed.ts`
- `src/pages/Logger.jsx`
- `src/pages/AuthPage.jsx`
- `src/layout/AppShell.jsx`
- `src/context/authHelpers.js`
- `src/lib/test-supabaseClient.ts`

## Result
- ✅ Build now succeeds without circular import errors
- ✅ All imports resolve to a single default export
- ✅ Helper functions available as properties of the main client
- ✅ TypeScript types preserved and working correctly
- ✅ No more confusion about which import path to use

## Usage Pattern
Now there's only one way to import and use the Supabase client:

```typescript
import supabase from '../lib/supabaseClient';

// Use the client directly
const { data, error } = await supabase.from('table').select('*');

// Use helper functions
const userId = await supabase.getCurrentUserId();
const isAuth = await supabase.isAuthenticated();

// Use typed table helpers
const exercises = await supabase.tables.exercises().select('*');

// Use RPC functions
const result = await supabase.rpc.calculateVolumeMetrics(params);
```

This creates a clean, consistent API with no circular dependencies.
