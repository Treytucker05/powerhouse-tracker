// Minimal test to isolate adaptiveRIRRecommendations issue
// Mock localStorage for Node.js
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

console.log('=== TESTING adaptiveRIRRecommendations DIRECTLY ===');

// Import after mocking localStorage
import('./js/algorithms/intelligence.js').then(intelligence => {
  const { adaptiveRIRRecommendations } = intelligence;
  
  console.log('Function loaded successfully');
  
  const testState = {
    intelligence: {
      isInitialized: true,
      performanceMetrics: {}
    },
    volumeLandmarks: {
      chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
      back: { mv: 6, mev: 8, mav: 14, mrv: 18 }
    },
    getWeeklySets: (muscle) => {
      const volumes = { chest: 12, back: 10 };
      return volumes[muscle] || 0;
    }
  };

  console.log('Input state structure:');
  console.log('- intelligence:', !!testState.intelligence);
  console.log('- volumeLandmarks:', !!testState.volumeLandmarks);
  console.log('- landmark keys:', Object.keys(testState.volumeLandmarks));
  console.log('- getWeeklySets function:', typeof testState.getWeeklySets);

  console.log('\n=== CALLING FUNCTION ===');
  const result = adaptiveRIRRecommendations(testState);

  console.log('\n=== RESULTS ===');
  console.log('Success:', result.success);
  console.log('Recommendations keys:', Object.keys(result.recommendations || {}));
  console.log('Recommendations length:', Object.keys(result.recommendations || {}).length);
  console.log('Warnings:', result.warnings);
  
  if (Object.keys(result.recommendations || {}).length === 0) {
    console.log('\n=== DEBUG INFO ===');
    console.log('Full result:', JSON.stringify(result, null, 2));
  } else {
    console.log('\n✅ SUCCESS - Function returned populated recommendations!');
  }
}).catch(error => {
  console.error('Failed to load function:', error);
});
