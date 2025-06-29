// Test file to verify TypeScript Supabase client functionality
// Run this in development to test the new typed client

import { 
  supabase, 
  tables, 
  rpc, 
  getCurrentUserId, 
  getCurrentUserProfile,
  isAuthenticated 
} from './supabaseClient';
import type { 
  DatabaseExercise, 
  DatabaseWorkoutSession, 
  SessionType 
} from './supabaseClient';

/**
 * Test basic client functionality
 */
export const testSupabaseClient = async () => {
  console.log('🧪 Testing TypeScript Supabase client...');
  
  try {
    // Test authentication helpers
    console.log('Testing authentication...');
    const isAuth = await isAuthenticated();
    console.log('✅ Authentication check:', isAuth);
    
    if (isAuth) {
      const userId = await getCurrentUserId();
      console.log('✅ Current user ID:', userId);
      
      const profile = await getCurrentUserProfile();
      console.log('✅ User profile:', profile?.name || 'No profile');
    }
    
    // Test table access (read-only operations for safety)
    console.log('Testing table access...');
    
    // Test exercises table
    const { data: exercises, error: exercisesError } = await tables.exercises()
      .select('*')
      .limit(5);
    
    if (exercisesError) {
      console.warn('⚠️ Exercises query error:', exercisesError.message);
    } else {
      console.log(`✅ Exercises query: ${exercises?.length || 0} results`);
    }
    
    // Test workout sessions for current user (if authenticated)
    if (isAuth) {
      const userId = await getCurrentUserId();
      if (userId) {
        const { data: sessions, error: sessionsError } = await tables.workoutSessions()
          .select('*')
          .eq('user_id', userId)
          .limit(5);
        
        if (sessionsError) {
          console.warn('⚠️ Sessions query error:', sessionsError.message);
        } else {
          console.log(`✅ User sessions query: ${sessions?.length || 0} results`);
        }
      }
    }
    
    console.log('🎉 Supabase client test completed!');
    
  } catch (error) {
    console.error('❌ Supabase client test failed:', error);
  }
};

/**
 * Test type safety with sample data structures
 */
export const testTypeSafety = () => {
  console.log('🧪 Testing TypeScript type safety...');
  
  // Test exercise type
  const sampleExercise: Omit<DatabaseExercise, 'id' | 'created_at'> = {
    name: 'Bench Press',
    muscle_groups: ['chest', 'triceps', 'shoulders'],
    equipment: 'Barbell',
    instructions: 'Press the barbell from chest to full extension'
  };
  
  // Test session type
  const sampleSession: Omit<DatabaseWorkoutSession, 'id' | 'created_at'> = {
    user_id: 'test-user-id',
    session_type: 'push' as SessionType,
    start_time: new Date().toISOString(),
    fatigue_rating: 7
  };
  
  console.log('✅ Type safety test - Exercise:', sampleExercise.name);
  console.log('✅ Type safety test - Session:', sampleSession.session_type);
  console.log('🎉 Type safety test completed!');
};

/**
 * Test RPC function types (if functions exist)
 */
export const testRPCFunctions = async () => {
  console.log('🧪 Testing RPC function types...');
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('⚠️ Skipping RPC tests - not authenticated');
      return;
    }
    
    // Test volume metrics RPC (if it exists)
    try {
      const volumeResult = await rpc.calculateVolumeMetrics({
        user_id: userId,
        start_date: '2025-01-01',
        end_date: '2025-01-31',
        muscle_groups: ['chest', 'back']
      });
      
      if (volumeResult.error) {
        console.log('⚠️ Volume RPC not yet implemented:', volumeResult.error.message);
      } else {
        console.log('✅ Volume RPC test successful');
      }
    } catch (error) {
      console.log('⚠️ Volume RPC not available yet');
    }
    
    console.log('✅ RPC function types test completed');
    
  } catch (error) {
    console.error('❌ RPC test failed:', error);
  }
};

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testSupabaseClient = testSupabaseClient;
  (window as any).testTypeSafety = testTypeSafety;
  (window as any).testRPCFunctions = testRPCFunctions;
}
