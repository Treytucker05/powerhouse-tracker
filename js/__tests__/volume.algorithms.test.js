import { autoSetIncrement, processWeeklyVolumeProgression } from "../algorithms/volume.js";

function createMockState() {
  return {
    volumeLandmarks: {
      Chest: { MV: 4, MEV: 6, MAV: 16, MRV: 20 },
      Back: { MV: 6, MEV: 10, MAV: 20, MRV: 25 },
    },
    currentWeekSets: { Chest: 2, Back: 10 },
    lastWeekSets: { Chest: 2, Back: 10 },
    mrvHits: 0,
    deloadStarted: false,
    getWeeklySets(m) {
      return this.currentWeekSets[m] || 0;
    },
    addSets(m, d) {
      this.currentWeekSets[m] = (this.currentWeekSets[m] || 0) + d;
    },
    getVolumeStatus(m) {
      const s = this.getWeeklySets(m);
      const l = this.volumeLandmarks[m];
      if (s < l.MV) return "low";
      if (s < l.MEV) return "suboptimal";
      if (s < l.MAV) return "optimal";
      if (s < l.MRV) return "high";
      return "maximum";
    },
    hitMRV() {
      this.mrvHits++;
    },
    shouldDeload() {
      return this.mrvHits >= 2;
    },
    startDeload() {
      this.deloadStarted = true;
    },
    repStrengthDrop(m, lastLoad) {
      return m === "Back" && lastLoad < 100;
    },
  };
}

describe("autoSetIncrement", () => {
  test("adds a set when volume low and stimulus poor", () => {
    const state = createMockState();
    const result = autoSetIncrement(
      "Chest",
      { stimulus: { mmc: 1, pump: 1, disruption: 1 }, recoveryMuscle: "recovered" },
      state,
    );
    expect(result).toEqual({ add: true, delta: 1 });
  });
});

describe("processWeeklyVolumeProgression", () => {
  test("processes sample weekly feedback", () => {
    const state = createMockState();
    const feedback = {
      Chest: {
        stimulus: { mmc: 1, pump: 1, disruption: 1 },
        pump: 1,
        disruption: 1,
        soreness: 0,
        jointAche: 0,
        perfChange: 1,
        recoveryMuscle: "recovered",
      },
      Back: {
        stimulus: { mmc: 1, pump: 0, disruption: 1 },
        pump: 0,
        disruption: 1,
        soreness: 3,
        jointAche: 2,
        perfChange: -1,
        lastLoad: 90,
      },
    };
    const result = processWeeklyVolumeProgression(feedback, state);
    expect(result.deloadTriggered).toBe(false);
    expect(result.mrvHits).toBe(1);
    expect(state.currentWeekSets.Chest).toBe(3);
    expect(result.progressionLog.Back.status).toBe("optimal");
  });
});
