import { calculateTargetRIR, validateEffortLevel } from "../algorithms/effort.js";

describe("calculateTargetRIR", () => {
  test("week 1 of 4-week mesocycle", () => {
    const res = calculateTargetRIR(1, 4, 4.5, 0.5);
    expect(res.targetRIR).toBeCloseTo(4.5, 1);
  });

  test("final week approaches 0.5 RIR", () => {
    const res = calculateTargetRIR(4, 4, 4.5, 0.5);
    expect(res.targetRIR).toBeCloseTo(0.5, 1);
  });
});

describe("validateEffortLevel", () => {
  test("within tolerance", () => {
    const res = validateEffortLevel(3, 3);
    expect(res.isWithinTolerance).toBe(true);
  });

  test("too easy suggests increase", () => {
    const res = validateEffortLevel(5, 3);
    expect(res.recommendation).toMatch(/Increase weight/);
  });

  test("too hard suggests reduce", () => {
    const res = validateEffortLevel(0, 3);
    expect(res.recommendation).toMatch(/Reduce weight/);
  });
});
