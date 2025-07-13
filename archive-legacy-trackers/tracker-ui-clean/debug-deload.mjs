import { analyzeDeloadNeed } from './js/algorithms/deload.js';

const result = analyzeDeloadNeed({
  weeklyProgram: {
    actualVolume: {
      chest: [18, 19, 20, 20],
      back: [16, 17, 18, 18], 
      shoulders: [14, 15, 16, 16]
    }
  }
});

console.log('needsDeload:', result.needsDeload);
console.log('fatigueScore:', result.fatigueScore);
console.log('muscleAnalysis:', result.analysis.muscleAnalysis);
console.log('recommendations:', result.recommendations);
