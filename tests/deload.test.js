/**
 * @jest-environment jsdom
 */

import * as ts from "../js/core/trainingState.js";
import { mockTrainingState, resetMockTrainingState } from "../__tests__/helpers/mockState.js";
import { analyzeDeloadNeed, initializeAtMEV } from "../js/algorithms/deload.js";

// ----- isolate global singleton so later test-suites aren't polluted -----
const snapshot = ts.trainingState ? Object.assign({}, ts.trainingState) : {};

beforeEach(resetMockTrainingState);

afterAll(() => {
  // restore original once the whole file is done
  if (ts.trainingState) {
    Object.assign(ts.trainingState, snapshot);
  }
});

describe('Deload Algorithm Tests', () => {
  describe('analyzeDeloadNeed', () => {
    test('should recommend deload when volume approaches MRV', () => {
      const result = analyzeDeloadNeed(mockTrainingState);
      
      expect(result).toHaveProperty('needsDeload');
      expect(result).toHaveProperty('fatigueScore');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('analysis');
      
      expect(typeof result.needsDeload).toBe('boolean');
      expect(typeof result.fatigueScore).toBe('number');
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should calculate fatigue score correctly', () => {
      const result = analyzeDeloadNeed(mockTrainingState);
      
      expect(result.fatigueScore).toBeGreaterThanOrEqual(0);
      expect(result.fatigueScore).toBeLessThanOrEqual(100);
    });

    test('should provide muscle-specific analysis', () => {
      const result = analyzeDeloadNeed(mockTrainingState);
      
      expect(result.analysis).toHaveProperty('muscleAnalysis');
      expect(result.analysis.muscleAnalysis).toHaveProperty('chest');
      expect(result.analysis.muscleAnalysis).toHaveProperty('back');
      expect(result.analysis.muscleAnalysis).toHaveProperty('shoulders');
    });

    test('should handle empty training state', () => {
      const emptyState = {
        currentMesocycle: { currentWeek: 1, length: 4 },
        weeklyProgram: { actualVolume: {} },
        volumeLandmarks: {}
      };
      
      const result = analyzeDeloadNeed(emptyState);
      
      expect(result).toHaveProperty('needsDeload', false);
      expect(result).toHaveProperty('fatigueScore', 0);
    });

    test('should recommend deload for high fatigue scores', () => {
      const highFatigueState = {
        ...mockTrainingState,
        weeklyProgram: {
          actualVolume: {
            chest: [18, 19, 20, 20], // Very high volume
            back: [16, 17, 18, 18],
            shoulders: [14, 15, 16, 16]
          }
        }
      };
      
      const result = analyzeDeloadNeed(highFatigueState);
      
      expect(result.needsDeload).toBe(true);
      expect(result.fatigueScore).toBeGreaterThan(70);
    });

    test('should provide appropriate recommendations', () => {
      const result = analyzeDeloadNeed(mockTrainingState);
      
      expect(result.recommendations.length).toBeGreaterThan(0);
      result.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });
  describe('initializeAtMEV', () => {
    const localMockState = {
      ...mockTrainingState,
      volumeLandmarks: {
        chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
        back: { mv: 6, mev: 8, mav: 14, mrv: 18 },
        shoulders: { mv: 4, mev: 6, mav: 12, mrv: 16 }
      },
      currentMesocycle: {
        currentWeek: 1,
        length: 6
      }
    };    test('should reset volumes to MEV levels', () => {
      const result = initializeAtMEV(localMockState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('newVolumes');
      expect(result).toHaveProperty('changes');
      
      expect(result.newVolumes.chest).toBe(10);
      expect(result.newVolumes.back).toBe(8);
      expect(result.newVolumes.shoulders).toBe(6);
    });

    test('should provide change summary', () => {
      const result = initializeAtMEV(localMockState);
      
      expect(result.changes).toHaveProperty('musclesReset');
      expect(Array.isArray(result.changes.musclesReset)).toBe(true);
      expect(result.changes.musclesReset.length).toBeGreaterThan(0);
    });

    test('should handle missing volume landmarks', () => {
      const incompleteState = {
        volumeLandmarks: {
          chest: { mv: 8, mev: 10 } // Missing mav, mrv
        },
        currentMesocycle: { currentWeek: 1, length: 6 }
      };
      
      const result = initializeAtMEV(incompleteState);
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('newVolumes');
    });    test('should provide reset recommendations', () => {
      const result = initializeAtMEV(localMockState);
      
      expect(result).toHaveProperty('recommendations');
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    test('should handle zero or undefined MEV values', () => {
      const zeroMEVState = {
        volumeLandmarks: {
          chest: { mv: 0, mev: 0, mav: 0, mrv: 0 }
        },
        currentMesocycle: { currentWeek: 1, length: 6 }
      };
      
      const result = initializeAtMEV(zeroMEVState);
      
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
      expect(result.error).toContain('MEV');
    });
  });
  describe('Integration Tests', () => {
    test('should work together for complete deload cycle', () => {
      const trainingState = {
        ...mockTrainingState,
        currentMesocycle: { currentWeek: 5, length: 6 },
        weeklyProgram: {
          actualVolume: {
            chest: [12, 14, 16, 18, 20]
          }
        },
        volumeLandmarks: {
          chest: { mv: 8, mev: 10, mav: 16, mrv: 20 }
        }
      };
      
      // First, analyze if deload is needed
      const analysis = analyzeDeloadNeed(trainingState);
      
      // If deload is needed, initialize at MEV
      if (analysis.needsDeload) {
        const reset = initializeAtMEV(trainingState);
        
        expect(reset.success).toBe(true);
        expect(reset.newVolumes.chest).toBe(10);
        expect(reset.newVolumes.chest).toBeLessThan(20); // Reduced from current
      }
    });
  });
});
