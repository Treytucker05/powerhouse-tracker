/**
 * TrainingState Singleton - Renaissance Periodization Implementation
 * Manages all training state including volume landmarks, meso progression, and deload logic
 */
import { debugLog } from "../utils/debug.js";

class TrainingState {
  constructor(opts = {}) {
    if (TrainingState.instance) {
      return TrainingState.instance;
    }

    // Settings and feature flags
    this.settings = {
      enableAdvancedDashboard: false,
      ...opts.settings,
    };

    // Core RP Volume Landmarks (defaults from RP literature)
    this.volumeLandmarks = {
      Chest: { MV: 4, MEV: 6, MAV: 16, MRV: 22 },
      Back: { MV: 6, MEV: 10, MAV: 20, MRV: 25 },
      Quads: { MV: 6, MEV: 10, MAV: 16, MRV: 20 },
      Glutes: { MV: 0, MEV: 2, MAV: 12, MRV: 25 },
      Hamstrings: { MV: 4, MEV: 6, MAV: 16, MRV: 20 },
      Shoulders: { MV: 4, MEV: 8, MAV: 16, MRV: 20 },
      Biceps: { MV: 4, MEV: 6, MAV: 14, MRV: 20 },
      Triceps: { MV: 4, MEV: 6, MAV: 14, MRV: 18 },
      Calves: { MV: 6, MEV: 8, MAV: 16, MRV: 22 },
      Abs: { MV: 0, MEV: 6, MAV: 16, MRV: 25 },
      Forearms: { MV: 2, MEV: 4, MAV: 10, MRV: 16 },
      Neck: { MV: 0, MEV: 2, MAV: 8, MRV: 12 },
      Traps: { MV: 2, MEV: 4, MAV: 12, MRV: 16 },
    };

    // Training progression state
    this.weekNo = 1;
    this.mesoLen = 4;
    this.blockNo = 1;
    this.deloadPhase = false;
    this.resensitizationPhase = false;
    this.loadReduction = 1;

    // Current week data
    this.currentWeekSets = {};
    this.lastWeekSets = {};

    // Baseline strength tracking for fatigue detection
    this.baselineStrength = {};

    // Initialize current week sets at MEV and baseline strength
    Object.keys(this.volumeLandmarks).forEach((muscle) => {
      this.currentWeekSets[muscle] = this.volumeLandmarks[muscle].MEV;
      this.lastWeekSets[muscle] = this.volumeLandmarks[muscle].MEV;
      this.baselineStrength[muscle] = 100; // Default baseline load (kg)
    });

    this.weeklyVolume = {};
    Object.keys(this.volumeLandmarks).forEach((m) => {
      this.weeklyVolume[m] = {
        current: this.currentWeekSets[m],
        ...this.volumeLandmarks[m],
      };
    });

    // Performance tracking for deload detection
    this.consecutiveMRVWeeks = 0;

    this.recoverySessionsThisWeek = 0;
    this.totalMusclesNeedingRecovery = 0;

    TrainingState.instance = this;
    this.loadState();
  }
  // Calculate target RIR based on meso progression
  getTargetRIR() {
    const startRIR = 3.0;
    const endRIR = 0.5;
    const progressionRate = (startRIR - endRIR) / (this.mesoLen - 1);
    const targetRIR = startRIR - progressionRate * (this.weekNo - 1);
    return Math.max(endRIR, Math.min(startRIR, targetRIR));
  }

  // Get volume status for a muscle
  getVolumeStatus(muscle, sets = null) {
    const currentSets = sets !== null ? sets : this.currentWeekSets[muscle];
    const landmarks = this.volumeLandmarks[muscle];

    if (currentSets < landmarks.MV) return "under-minimum";
    if (currentSets < landmarks.MEV) return "maintenance";
    if (currentSets < landmarks.MAV) return "optimal";
    if (currentSets < landmarks.MRV) return "high";
    return "maximum";
  }

  // Get volume zone color for charting
  getVolumeColor(muscle, sets = null) {
    const status = this.getVolumeStatus(muscle, sets);
    const colors = {
      "under-minimum": "#ff4444", // Red
      maintenance: "#ffaa00", // Orange
      optimal: "#44ff44", // Green
      high: "#ffff44", // Yellow
      maximum: "#ff4444", // Red
    };
    return colors[status];
  }

  // Update weekly sets for a muscle
  updateWeeklySets(muscle, sets) {
    this.currentWeekSets[muscle] = Math.max(0, sets);
    if (this.weeklyVolume[muscle])
      this.weeklyVolume[muscle].current = this.currentWeekSets[muscle];
    this.saveState();
    if (typeof window !== "undefined" && window.updateAllDisplays)
      window.updateAllDisplays();
  }

  // Add sets to a muscle
  addSets(muscle, additionalSets) {
    this.currentWeekSets[muscle] += additionalSets;
    this.currentWeekSets[muscle] = Math.max(0, this.currentWeekSets[muscle]);
    if (this.weeklyVolume[muscle])
      this.weeklyVolume[muscle].current = this.currentWeekSets[muscle];
    this.saveState();
    if (typeof window !== "undefined" && window.updateAllDisplays)
      window.updateAllDisplays();
  }
  // Check if deload is needed
  shouldDeload() {
    // Check 1: Consecutive weeks at MRV
    if (this.consecutiveMRVWeeks >= 2) return true;

    // Check 2: Most muscles need recovery
    const totalMuscles = Object.keys(this.volumeLandmarks).length;
    if (this.totalMusclesNeedingRecovery >= Math.ceil(totalMuscles / 2))
      return true;

    // Check 3: Enhanced fatigue detection - if ≥1 major muscle hit MRV via fatigue this week
    const majorMuscles = ["Chest", "Back", "Quads", "Shoulders"];
    const fatigueBasedMRV = majorMuscles.some(
      (muscle) =>
        this.currentWeekSets[muscle] >= this.volumeLandmarks[muscle].MRV &&
        this.totalMusclesNeedingRecovery > 0,
    );
    if (fatigueBasedMRV) return true;

    // Check 4: End of meso
    if (this.weekNo >= this.mesoLen) return true;

    return false;
  }

  // Check if resensitization is needed (every 3-6 mesos)
  shouldResensitize() {
    return this.blockNo % 4 === 0; // Every 4 blocks (adjustable)
  }

  // Start deload phase
  startDeload() {
    this.deloadPhase = true;
    this.loadReduction = 0.5;
    // Reduce all sets to 50% of MEV
    Object.keys(this.volumeLandmarks).forEach((muscle) => {
      const deloadSets = Math.round(this.volumeLandmarks[muscle].MEV * 0.5);
      this.currentWeekSets[muscle] = deloadSets;
    });
    this.saveState();
  }

  // Start resensitization phase
  startResensitization() {
    this.resensitizationPhase = true;
    this.loadReduction = 1;
    // Set all muscles to MV
    Object.keys(this.volumeLandmarks).forEach((muscle) => {
      this.currentWeekSets[muscle] = this.volumeLandmarks[muscle].MV;
    });
    this.saveState();
  }

  // Progress to next week
  nextWeek() {
    // Store last week's data
    this.lastWeekSets = { ...this.currentWeekSets };

    // Check for MRV breach
    const mrvBreaches = Object.keys(this.volumeLandmarks).filter(
      (muscle) =>
        this.currentWeekSets[muscle] >= this.volumeLandmarks[muscle].MRV,
    );

    if (mrvBreaches.length > 0) {
      this.consecutiveMRVWeeks++;
    } else {
      this.consecutiveMRVWeeks = 0;
    }

    // Progress week
    this.weekNo++;

    // End deload after one week
    if (this.deloadPhase) {
      this.deloadPhase = false;
      this.loadReduction = 1;
    }

    // Check for meso completion
    if (this.weekNo > this.mesoLen) {
      this.weekNo = 1;
      this.blockNo++;
      this.consecutiveMRVWeeks = 0;
    }

    // Reset weekly counters
    this.recoverySessionsThisWeek = 0;
    this.totalMusclesNeedingRecovery = 0;

    this.saveState();
  }

  // Reset week (for testing/corrections)
  resetWeek() {
    Object.keys(this.volumeLandmarks).forEach((muscle) => {
      this.currentWeekSets[muscle] = this.volumeLandmarks[muscle].MEV;
    });
    this.saveState();
  }

  // Auto-progression methods

  // Mark muscle as hitting MRV for deload tracking
  hitMRV(muscle) {
    this.totalMusclesNeedingRecovery++;
    // Check if this muscle has been at MRV for consecutive weeks
    const atMRV =
      this.currentWeekSets[muscle] >= this.volumeLandmarks[muscle].MRV;
    if (atMRV) {
      this.consecutiveMRVWeeks++;
    }
    this.saveState();
  }

  // Get current weekly sets for a muscle
  getWeeklySets(muscle) {
    return this.currentWeekSets[muscle] || this.volumeLandmarks[muscle].MEV;
  }

  // Initialize muscle at MEV (for new week or reset)
  initializeMuscleAtMEV(muscle) {
    this.currentWeekSets[muscle] = this.volumeLandmarks[muscle].MEV;
    this.saveState();
  }

  // Check if most muscles are at MRV (deload trigger)
  mostMusclesAtMRV() {
    const muscles = Object.keys(this.volumeLandmarks);
    const mrvCount = muscles.filter(
      (muscle) =>
        this.currentWeekSets[muscle] >= this.volumeLandmarks[muscle].MRV,
    ).length;
    return mrvCount >= Math.ceil(muscles.length * 0.5);
  }

  // Set baseline strength for a muscle (typically week 1 top set)
  setBaselineStrength(muscle, load) {
    this.baselineStrength[muscle] = load;
    this.saveState();
  }

  // Check for rep strength drop (fatigue indicator)
  repStrengthDrop(muscle, lastLoad) {
    const baseline = this.baselineStrength[muscle];
    if (!baseline || !lastLoad) return false;

    // Consider significant drop if last load < 97% of baseline
    const strengthDropThreshold = 0.97;
    return lastLoad < baseline * strengthDropThreshold;
  }

  // Update volume landmarks for a muscle
  updateVolumeLandmarks(muscle, landmarks) {
    this.volumeLandmarks[muscle] = {
      ...this.volumeLandmarks[muscle],
      ...landmarks,
    };
    this.saveState();
  }

  // Calculate recovery volume
  getRecoveryVolume(muscle, hasIllness = false) {
    const landmarks = this.volumeLandmarks[muscle];
    const midpoint = Math.round((landmarks.MEV + landmarks.MRV) / 2);
    const adjustment = hasIllness ? 2 : 1;
    const recoveryVolume = midpoint - adjustment;
    return Math.max(recoveryVolume, Math.ceil(landmarks.MEV * 0.5));
  }

  // Save state to localStorage
  saveState() {
    const state = {
      volumeLandmarks: this.volumeLandmarks,
      weekNo: this.weekNo,
      mesoLen: this.mesoLen,
      blockNo: this.blockNo,
      deloadPhase: this.deloadPhase,
      resensitizationPhase: this.resensitizationPhase,
      loadReduction: this.loadReduction,
      currentWeekSets: this.currentWeekSets,
      lastWeekSets: this.lastWeekSets,
      weeklyVolume: this.weeklyVolume,
      consecutiveMRVWeeks: this.consecutiveMRVWeeks,
      recoverySessionsThisWeek: this.recoverySessionsThisWeek,
      totalMusclesNeedingRecovery: this.totalMusclesNeedingRecovery,
    };

    localStorage.setItem("rp-training-state", JSON.stringify(state));
  }

  // Load state from localStorage
  loadState() {
    const saved = localStorage.getItem("rp-training-state");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        Object.assign(this, state);
        if (state.loadReduction !== undefined) {
          this.loadReduction = state.loadReduction;
        }
      } catch (e) {
        console.warn("Failed to load training state, using defaults");
      }
    }
  }

  // Migrate legacy localStorage data
  migrateLegacyData() {
    const muscles = Object.keys(this.volumeLandmarks);
    let hasLegacyData = false;

    muscles.forEach((muscle) => {
      // Check for old format keys
      const oldKey = `week-1-${muscle}`;
      const oldValue = localStorage.getItem(oldKey);

      if (oldValue) {
        this.currentWeekSets[muscle] = parseInt(oldValue, 10);
        localStorage.removeItem(oldKey);
        hasLegacyData = true;
      }

      // Migrate MEV/MRV settings
      const mevKey = `${muscle}-MEV`;
      const mrvKey = `${muscle}-MRV`;
      const mevValue = localStorage.getItem(mevKey);
      const mrvValue = localStorage.getItem(mrvKey);

      if (mevValue || mrvValue) {
        this.volumeLandmarks[muscle] = {
          ...this.volumeLandmarks[muscle],
          MEV: mevValue
            ? parseInt(mevValue, 10)
            : this.volumeLandmarks[muscle].MEV,
          MRV: mrvValue
            ? parseInt(mrvValue, 10)
            : this.volumeLandmarks[muscle].MRV,
        };
        if (mevValue) localStorage.removeItem(mevKey);
        if (mrvValue) localStorage.removeItem(mrvKey);
        hasLegacyData = true;
      }
    });

    if (hasLegacyData) {
      this.saveState();
      debugLog("Legacy data migrated to new RP training state");
    }
  }

  // Get current state summary
  getStateSummary() {
    return {
      week: this.weekNo,
      meso: this.mesoLen,
      block: this.blockNo,
      targetRIR: this.getTargetRIR(),
      deloadRecommended: this.shouldDeload(),
      resensitizationRecommended: this.shouldResensitize(),
      currentPhase: this.deloadPhase
        ? "deload"
        : this.resensitizationPhase
          ? "resensitization"
          : "accumulation",
    };
  }
}

// Export singleton instance
const trainingState = new TrainingState();
// Initialize advanced features conditionally
if (trainingState.settings.enableAdvancedDashboard) {
  import("../ui/dataVisualization.js")
    .then(({ default: AdvancedDataVisualizer }) => {
      trainingState.dataVisualizer = new AdvancedDataVisualizer();
      debugLog("Advanced dashboard initialized");
    })
    .catch((err) => console.error("Dashboard init failed:", err));
}
export default trainingState;

// Also make available globally for legacy compatibility
if (typeof window !== "undefined") {
  window.trainingState = trainingState;
}
