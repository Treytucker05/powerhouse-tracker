// Test file to verify devSeed functions work correctly
// Run this in the browser console or as a simple test

import { seedExercises, seedQuick, seedDemo } from './devSeed';

/**
 * Test the seeding functions
 */
export const testSeeding = async () => {
  console.log('🧪 Testing dev seeding functions...');
  
  try {
    // Test exercise seeding
    console.log('Testing exercise seeding...');
    const exercises = await seedExercises();
    console.log(`✅ Seeded ${exercises.length} exercises`);
    
    // Test quick seed (minimal data)
    console.log('Testing quick seed...');
    await seedQuick();
    console.log('✅ Quick seed completed');
    
    console.log('🎉 All seeding tests passed!');
  } catch (error) {
    console.error('❌ Seeding test failed:', error);
  }
};

/**
 * Test full demo seeding
 */
export const testFullDemo = async () => {
  console.log('🧪 Testing full demo seeding...');
  
  try {
    await seedDemo();
    console.log('🎉 Full demo seeding completed!');
  } catch (error) {
    console.error('❌ Full demo seeding failed:', error);
  }
};

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testSeeding = testSeeding;
  (window as any).testFullDemo = testFullDemo;
}
