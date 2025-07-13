import { adaptiveRIRRecommendations } from './js/algorithms/intelligence.js';

const testState = {
  volumeLandmarks: {
    chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
    back: { mv: 6, mev: 8, mav: 14, mrv: 18 }
  },
  intelligence: {
    isInitialized: true
  },
  getWeeklySets: () => 12 // Mock function
};

console.log("Testing RIR recommendations...");
const result = adaptiveRIRRecommendations(testState);
console.log("Success:", result.success);
console.log("Recommendations keys:", Object.keys(result.recommendations));
console.log("Recommendations:", result.recommendations);
console.log("MuscleSpecific keys:", Object.keys(result.muscleSpecific));
console.log("Full result:", JSON.stringify(result, null, 2));
