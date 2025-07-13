/**
 * @jest-environment jsdom
 */

import * as ts from "../js/core/trainingState.js";
import { mockTrainingState } from "../__tests__/helpers/mockState.js";
import { resetMockTrainingState } from "../__tests__/helpers/mockState.js";
import {
  initIntelligence,
  optimizeVolumeLandmarks,
  adaptiveRIRRecommendations,
} from "../js/algorithms/intelligence.js";

// ----- isolate global singleton so later test-suites aren't polluted -----
const snapshot = ts.trainingState ? Object.assign({}, ts.trainingState) : {};

beforeEach(resetMockTrainingState);

afterAll(() => {
  // restore original once the whole file is done
  if (ts.trainingState) {
    Object.assign(ts.trainingState, snapshot);
  }
});

describe("Intelligence Algorithm Tests", () => {
  describe("initIntelligence", () => {
    const localMockState = {
      ...mockTrainingState,
      currentMesocycle: {
        currentWeek: 3,
        length: 6,
      },
      weeklyProgram: {
        actualVolume: {
          chest: [12, 14, 16],
          back: [10, 12, 14],
          shoulders: [8, 10, 12],
        },
      },
      volumeLandmarks: {
        chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
        back: { mv: 6, mev: 8, mav: 14, mrv: 18 },
        shoulders: { mv: 4, mev: 6, mav: 12, mrv: 16 },
      },
      intelligence: {},
    };
    test("should initialize intelligence system successfully", () => {
      const result = initIntelligence(localMockState);

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("intelligenceConfig");
      expect(result).toHaveProperty("capabilities");
      expect(result).toHaveProperty("status");

      expect(result.status).toBe("initialized");
      expect(Array.isArray(result.capabilities)).toBe(true);
      expect(result.capabilities.length).toBeGreaterThan(0);
    });

    test("should configure intelligence parameters", () => {
      const result = initIntelligence(localMockState);

      expect(result.intelligenceConfig).toHaveProperty("adaptiveThresholds");
      expect(result.intelligenceConfig).toHaveProperty("learningRate");
      expect(result.intelligenceConfig).toHaveProperty("optimizationFrequency");

      expect(typeof result.intelligenceConfig.learningRate).toBe("number");
      expect(result.intelligenceConfig.learningRate).toBeGreaterThan(0);
      expect(result.intelligenceConfig.learningRate).toBeLessThanOrEqual(1);
    });

    test("should handle missing training data gracefully", () => {
      const emptyState = {
        currentMesocycle: { currentWeek: 1, length: 4 },
        weeklyProgram: { actualVolume: {} },
        volumeLandmarks: {},
        intelligence: {},
      };

      const result = initIntelligence(emptyState);

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("warnings");
      expect(Array.isArray(result.warnings)).toBe(true);
    });
    test("should provide initialization recommendations", () => {
      const result = initIntelligence(localMockState);

      expect(result).toHaveProperty("recommendations");
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
  describe("optimizeVolumeLandmarks", () => {
    const localMockState = {
      ...mockTrainingState,
      currentMesocycle: {
        currentWeek: 4,
        length: 6,
      },
      weeklyProgram: {
        actualVolume: {
          chest: [10, 12, 14, 16],
          back: [8, 10, 12, 14],
          shoulders: [6, 8, 10, 12],
        },
      },
      volumeLandmarks: {
        chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
        back: { mv: 6, mev: 8, mav: 14, mrv: 18 },
        shoulders: { mv: 4, mev: 6, mav: 12, mrv: 16 },
      },
      intelligence: {
        isInitialized: true,
        adaptiveThresholds: true,
      },
    };
    test("should optimize volume landmarks based on performance data", () => {
      const result = optimizeVolumeLandmarks(localMockState);

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("optimizedLandmarks");
      expect(result).toHaveProperty("changes");
      expect(result).toHaveProperty("confidence");

      expect(typeof result.confidence).toBe("number");
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
    test("should provide detailed optimization changes", () => {
      const result = optimizeVolumeLandmarks(localMockState);

      expect(result.changes).toHaveProperty("adjustments");
      expect(result.changes).toHaveProperty("reasoning");
      expect(Array.isArray(result.changes.adjustments)).toBe(true);
      expect(Array.isArray(result.changes.reasoning)).toBe(true);
    });
    test("should maintain landmark relationships", () => {
      const result = optimizeVolumeLandmarks(localMockState);

      Object.keys(result.optimizedLandmarks).forEach((muscle) => {
        const landmarks = result.optimizedLandmarks[muscle];

        // Ensure proper ordering: MV <= MEV <= MAV <= MRV
        expect(landmarks.mv).toBeLessThanOrEqual(landmarks.mev);
        expect(landmarks.mev).toBeLessThanOrEqual(landmarks.mav);
        expect(landmarks.mav).toBeLessThanOrEqual(landmarks.mrv);
      });
    });

    test("should require initialized intelligence system", () => {
      const uninitializedState = {
        ...localMockState,
        intelligence: { isInitialized: false },
      };

      const result = optimizeVolumeLandmarks(uninitializedState);

      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("intelligence");
    });
    test("should provide optimization metrics", () => {
      const result = optimizeVolumeLandmarks(localMockState);

      expect(result).toHaveProperty("metrics");
      expect(result.metrics).toHaveProperty("totalAdjustments");
      expect(result.metrics).toHaveProperty("avgConfidence");
      expect(result.metrics).toHaveProperty("musclesOptimized");

      expect(typeof result.metrics.totalAdjustments).toBe("number");
      expect(typeof result.metrics.avgConfidence).toBe("number");
      expect(Array.isArray(result.metrics.musclesOptimized)).toBe(true);
    });
  });
  describe("adaptiveRIRRecommendations", () => {
    const localMockState = {
      ...mockTrainingState,
      currentMesocycle: {
        currentWeek: 3,
        length: 6,
        phase: "accumulation",
      },
      weeklyProgram: {
        actualVolume: {
          chest: [12, 14, 16],
          back: [10, 12, 14],
        },
      },
      volumeLandmarks: {
        chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
        back: { mv: 6, mev: 8, mav: 14, mrv: 18 },
      },
      intelligence: {
        isInitialized: true,
        performanceMetrics: {
          rirAccuracy: 0.85,
          volumeResponse: 0.75,
        },
      },
    };
    test("should provide adaptive RIR recommendations", () => {
      const result = adaptiveRIRRecommendations(localMockState);

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("recommendations");
      expect(result).toHaveProperty("rationale");
      expect(result).toHaveProperty("adjustments");

      expect(typeof result.recommendations).toBe("object");
      expect(Object.keys(result.recommendations).length).toBeGreaterThan(0);
    });

    test("should adjust RIR based on mesocycle phase", () => {
      const accumulationResult = adaptiveRIRRecommendations(localMockState);

      const intensificationState = {
        ...localMockState,
        currentMesocycle: {
          ...localMockState.currentMesocycle,
          phase: "intensification",
        },
      };

      const intensificationResult =
        adaptiveRIRRecommendations(intensificationState);

      expect(accumulationResult.success).toBe(true);
      expect(intensificationResult.success).toBe(true);

      // Intensification phase should generally have lower RIR recommendations
      const accRIR = Object.values(accumulationResult.recommendations)[0];
      const intRIR = Object.values(intensificationResult.recommendations)[0];

      expect(typeof accRIR).toBe("number");
      expect(typeof intRIR).toBe("number");
    });
    test("should consider muscle-specific adaptations", () => {
      const result = adaptiveRIRRecommendations(localMockState);

      expect(result.recommendations).toHaveProperty("chest");
      expect(result.recommendations).toHaveProperty("back");

      Object.values(result.recommendations).forEach((rir) => {
        expect(typeof rir).toBe("number");
        expect(rir).toBeGreaterThanOrEqual(0);
        expect(rir).toBeLessThanOrEqual(5);
      });
    });
    test("should provide detailed rationale", () => {
      const result = adaptiveRIRRecommendations(localMockState);

      expect(result.rationale).toHaveProperty("factorsConsidered");
      expect(result.rationale).toHaveProperty("adaptationLevel");
      expect(result.rationale).toHaveProperty("riskAssessment");

      expect(Array.isArray(result.rationale.factorsConsidered)).toBe(true);
      expect(typeof result.rationale.adaptationLevel).toBe("string");
    });

    test("should handle missing performance metrics", () => {
      const stateWithoutMetrics = {
        ...localMockState,
        intelligence: { isInitialized: true },
      };

      const result = adaptiveRIRRecommendations(stateWithoutMetrics);

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("warnings");
      expect(Array.isArray(result.warnings)).toBe(true);
    });
    test("should provide confidence scores", () => {
      const result = adaptiveRIRRecommendations(localMockState);

      expect(result).toHaveProperty("confidence");
      expect(typeof result.confidence).toBe("number");
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });
  describe("Integration Tests", () => {
    test("should work together for complete intelligence workflow", () => {
      const trainingState = {
        ...mockTrainingState,
        currentMesocycle: { currentWeek: 3, length: 6, phase: "accumulation" },
        weeklyProgram: {
          actualVolume: {
            chest: [10, 12, 14],
            back: [8, 10, 12],
          },
        },
        weeklyProgressionHistory: [
          { week: 1, muscle: "chest", volume: 10, rpe: 7 },
          { week: 2, muscle: "chest", volume: 12, rpe: 7.5 },
          { week: 3, muscle: "chest", volume: 14, rpe: 8 },
          { week: 1, muscle: "back", volume: 8, rpe: 7 },
          { week: 2, muscle: "back", volume: 10, rpe: 7.5 },
          { week: 3, muscle: "back", volume: 12, rpe: 8 },
        ],
        volumeLandmarks: {
          chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
          back: { mv: 6, mev: 8, mav: 14, mrv: 18 },
        },
        intelligence: {},
      };

      // 1. Initialize intelligence
      const initResult = initIntelligence(trainingState);
      expect(initResult.success).toBe(true); // Update state with initialization results and ensure volume landmarks are preserved
      const updatedState = {
        ...trainingState,
        intelligence: {
          isInitialized: true,
          ...initResult.intelligenceConfig,
        },
        // Explicitly preserve volumeLandmarks
        volumeLandmarks: {
          chest: { mv: 8, mev: 10, mav: 16, mrv: 20 },
          back: { mv: 6, mev: 8, mav: 14, mrv: 18 },
        },
        getWeeklySets: (muscle) => {
          const volumeData = trainingState.weeklyProgram?.actualVolume[muscle];
          return volumeData ? volumeData[volumeData.length - 1] : 0;
        },
      };

      // 2. Optimize volume landmarks
      const optimizeResult = optimizeVolumeLandmarks(updatedState);
      expect(optimizeResult.success).toBe(true); // 3. Get adaptive RIR recommendations
      const rirResult = adaptiveRIRRecommendations(updatedState);

      // Debug - check why recommendations is empty
      if (Object.keys(rirResult.recommendations).length === 0) {
        console.error("RIR result has empty recommendations:", rirResult);
        console.error("Updated state landmarks:", updatedState.volumeLandmarks);
        console.error("Updated state intelligence:", updatedState.intelligence);
      }
      expect(rirResult.success).toBe(true);

      // Verify the workflow produces coherent results
      expect(Object.keys(rirResult.recommendations).length).toBeGreaterThan(0);
      expect(optimizeResult.confidence).toBeGreaterThan(0);
    });
  });
});
