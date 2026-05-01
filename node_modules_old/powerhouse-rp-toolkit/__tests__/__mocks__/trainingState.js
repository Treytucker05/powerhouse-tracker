import { vi } from "vitest";

// ── baseline mock object ────────────────────────────────────────────
const baseState = {
  currentWorkout: null,
  workoutHistory: [],
  currentWeek: 1,
  currentMesocycle: 1,
  programVersion: "1.0",
  volumeLandmarks: {
    chest: { MEV: 12, MV: 10, MRV: 20, current: 12 },
    back: { MEV: 14, MV: 12, MRV: 24, current: 14 },
  },
};

// ── spy-wrapped helpers expected by algorithms/tests ────────────────
export const getWeeklySets = vi.fn(
  (muscle) => baseState.volumeLandmarks[muscle]?.current ?? 0,
);

export const setWeeklySets = vi.fn((muscle, sets) => {
  baseState.volumeLandmarks[muscle] ??= {};
  baseState.volumeLandmarks[muscle].current = sets;
});

export const getTotalWeeklyVolume = vi.fn(() =>
  Object.values(baseState.volumeLandmarks).reduce(
    (sum, m) => sum + (m.current ?? 0),
    0,
  ),
);

// ── convenience reset between specs ─────────────────────────────────
export function resetMockState() {
  vi.clearAllMocks();
  Object.keys(baseState.volumeLandmarks).forEach((m) => {
    baseState.volumeLandmarks[m].current = baseState.volumeLandmarks[m].MEV;
  });
}

// default export so `vi.unstable_mockModule()` can stub it wholesale
export default {
  ...baseState,
  getWeeklySets,
  setWeeklySets,
  getTotalWeeklyVolume,
};
