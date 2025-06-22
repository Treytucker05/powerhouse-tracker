import trainingState from "../core/trainingState.js";
import { btnOptimizeFrequency } from "../ui/additionalHandlers.js";
import { calculateOptimalFrequency } from "../calculators/unified.js";

let originalLandmarks;

beforeAll(() => {
  originalLandmarks = JSON.parse(JSON.stringify(trainingState.volumeLandmarks));
});

afterEach(() => {
  trainingState.volumeLandmarks = JSON.parse(JSON.stringify(originalLandmarks));
});

test("optimizeFrequency – no landmarks => handled gracefully", () => {
  trainingState.volumeLandmarks = {};
  expect(() => btnOptimizeFrequency()).not.toThrow();
});

test("calculateOptimalFrequency throws when landmarks missing", () => {
  const original = trainingState.volumeLandmarks.Chest;
  trainingState.volumeLandmarks.Chest = {};
  expect(() => calculateOptimalFrequency("Chest")).toThrow(
    "Missing volume landmarks",
  );
  trainingState.volumeLandmarks.Chest = original;
});
