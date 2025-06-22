import trainingState from "../core/trainingState.js";
import {
  isHighFatigue,
  calculateOptimalFrequency,
} from "../algorithms/fatigue.js";

describe("isHighFatigue", () => {
  test("detects low stimulus to fatigue ratio", () => {
    const state = { repStrengthDrop: () => false };
    const feedback = {
      soreness: 2,
      jointAche: 2,
      perfChange: 0,
      pump: 1,
      disruption: 0,
    };
    expect(isHighFatigue("Chest", feedback, state)).toBe(true);
  });

  test("detects strength drop despite high SFR", () => {
    const state = { repStrengthDrop: () => true };
    const feedback = {
      soreness: 0,
      jointAche: 0,
      perfChange: 0,
      pump: 3,
      disruption: 3,
      lastLoad: 90,
    };
    expect(isHighFatigue("Chest", feedback, state)).toBe(true);
  });

  test("returns false when stimulus outweighs fatigue", () => {
    const state = { repStrengthDrop: () => false };
    const feedback = {
      soreness: 0,
      jointAche: 0,
      perfChange: 1,
      pump: 3,
      disruption: 3,
    };
    expect(isHighFatigue("Chest", feedback, state)).toBe(false);
  });
});

describe("calculateOptimalFrequency", () => {
  let originalSets;

  beforeAll(() => {
    originalSets = { ...trainingState.currentWeekSets };
  });

  afterEach(() => {
    trainingState.currentWeekSets = { ...originalSets };
  });

  test("computes frequency from current volume", () => {
    trainingState.currentWeekSets.Chest = 12;
    const result = calculateOptimalFrequency("Chest", { availableDays: 5 });
    expect(result.recommendedFrequency).toBe(2);
    expect(result.setsPerSession).toBe(6);
  });

  test("handles high volume and recovery capacity", () => {
    trainingState.currentWeekSets.Chest = 20;
    const result = calculateOptimalFrequency("Chest", {
      availableDays: 6,
      recoveryCapacity: "high",
    });
    expect(result.recommendedFrequency).toBe(4);
    expect(result.setsPerSession).toBe(5);
  });

  test("throws for missing landmarks", () => {
    expect(() => calculateOptimalFrequency("Unknown")).toThrow(
      "Missing volume landmarks",
    );
  });
});
