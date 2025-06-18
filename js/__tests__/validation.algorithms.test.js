import { validateLoad, validateSets, validateMesocycleLength } from "../algorithms/validation.js";

describe("validateLoad", () => {
  test("good hypertrophy load", () => {
    const res = validateLoad(70, "hypertrophy");
    expect(res.isValid).toBe(true);
    expect(res.isOptimal).toBe(true);
  });

  test("load too heavy", () => {
    const res = validateLoad(110, "strength");
    expect(res.isValid).toBe(false);
  });
});

describe("validateSets", () => {
  const landmarks = { MV: 4, MEV: 6, MAV: 16, MRV: 20 };

  test("optimal zone", () => {
    const res = validateSets(10, landmarks);
    expect(res.zone).toBe("optimal");
    expect(res.isValid).toBe(true);
  });

  test("above MRV invalid", () => {
    const res = validateSets(25, landmarks);
    expect(res.isValid).toBe(false);
  });
});

describe("validateMesocycleLength", () => {
  test("optimal hypertrophy length", () => {
    const res = validateMesocycleLength(4, "hypertrophy");
    expect(res.isOptimal).toBe(true);
  });

  test("too short", () => {
    const res = validateMesocycleLength(1, "power");
    expect(res.isValid).toBe(true);
    expect(res.warning).toMatch(/Short mesocycle/);
  });
});
