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

    // Diet phase integration (RP methodology)
    this.dietPhase = "maintenance"; // 'bulk', 'cut', 'maintenance'
    this.originalLandmarks = {}; // Store original values before diet adjustments

    // Store original landmarks before any diet modifications
    this.originalLandmarks = JSON.parse(JSON.stringify(this.volumeLandmarks));

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
  } // Check if deload is needed with adaptive mesocycle logic
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

    // Check 4: Adaptive mesocycle end - adjust length based on progression
    if (this.weekNo >= this.getAdaptiveMesoLength()) return true;

    return false;
  }

  // Calculate adaptive mesocycle length based on progression patterns
  getAdaptiveMesoLength() {
    // Base mesocycle length
    let adaptiveLength = this.mesoLen;

    // Factor 1: Rate of MRV approach
    const musclesNearMRV = Object.keys(this.volumeLandmarks).filter(
      (muscle) => {
        const current = this.getWeeklySets(muscle);
        const mrv = this.volumeLandmarks[muscle].MRV;
        return current >= mrv - 2; // Within 2 sets of MRV
      },
    ).length;

    const totalMuscles = Object.keys(this.volumeLandmarks).length;
    const mrvApproachRate = musclesNearMRV / totalMuscles;

    // Factor 2: Recovery demand
    const recoveryPressure = this.totalMusclesNeedingRecovery / totalMuscles;

    // Factor 3: Training history (advanced trainees need longer mesos)
    const experienceModifier = Math.min(this.blockNo / 10, 0.5); // Cap at 0.5

    // Adjust mesocycle length
    if (mrvApproachRate > 0.6 || recoveryPressure > 0.4) {
      // High fatigue/volume pressure → shorter meso
      adaptiveLength = Math.max(3, this.mesoLen - 1);
    } else if (mrvApproachRate < 0.3 && recoveryPressure < 0.2) {
      // Low pressure → longer meso for advanced trainees
      adaptiveLength = Math.min(
        6,
        this.mesoLen + Math.floor(experienceModifier * 2),
      );
    }

    debugLog(
      `Adaptive meso length: ${adaptiveLength} (base: ${this.mesoLen}, MRV rate: ${mrvApproachRate.toFixed(2)}, recovery pressure: ${recoveryPressure.toFixed(2)})`,
    );
    return adaptiveLength;
  }

  // Check if resensitization is needed (every 3-6 mesos)
  shouldResensitize() {
    return this.blockNo % 4 === 0; // Every 4 blocks (adjustable)
  }
  // Start deload phase with adaptive strategy
  startDeload() {
    // Import deload algorithms dynamically to avoid circular dependency
    import("../algorithms/deload.js")
      .then(({ calculateDeloadStrategy, executeDeload }) => {
        const strategy = calculateDeloadStrategy(this);
        executeDeload(this, strategy);
        debugLog(`Started ${strategy.type} deload: ${strategy.recommendation}`);
      })
      .catch((err) => {
        // Fallback to simple deload if import fails
        debugLog("Deload import failed, using fallback strategy", err);
        this.deloadPhase = true;
        this.loadReduction = 0.5;
        Object.keys(this.volumeLandmarks).forEach((muscle) => {
          const deloadSets = Math.round(this.volumeLandmarks[muscle].MEV * 0.5);
          this.currentWeekSets[muscle] = deloadSets;
        });
        this.saveState();
      });
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

  /**
   * Set diet phase and adjust volume landmarks accordingly
   * @param {string} phase - 'bulk', 'cut', 'maintenance'
   */
  setDietPhase(phase) {
    if (!["bulk", "cut", "maintenance"].includes(phase)) {
      throw new Error(`Invalid diet phase: ${phase}`);
    }

    const previousPhase = this.dietPhase;
    this.dietPhase = phase;

    // Apply landmark adjustments
    this.adjustLandmarksForDiet();

    debugLog(`Diet phase changed from ${previousPhase} to ${phase}`);
    this.saveState();
  }

  /**
   * Adjust volume landmarks based on diet phase
   * RP guidelines: Bulk = less volume needed, Cut = more volume needed but less capacity
   */
  adjustLandmarksForDiet() {
    const phase = this.dietPhase;

    // Reset to original landmarks first
    this.volumeLandmarks = JSON.parse(JSON.stringify(this.originalLandmarks));

    Object.keys(this.volumeLandmarks).forEach((muscle) => {
      const original = this.originalLandmarks[muscle];

      switch (phase) {
        case "bulk":
          // Bulk: MEV * 0.8, MRV * 1.0 (need less volume to grow)
          this.volumeLandmarks[muscle].MEV = Math.round(original.MEV * 0.8);
          this.volumeLandmarks[muscle].MRV = original.MRV; // Keep MRV same
          break;

        case "cut":
          // Cut: MEV * 1.2, MRV * 0.8 (need more volume, can handle less)
          this.volumeLandmarks[muscle].MEV = Math.round(original.MEV * 1.2);
          this.volumeLandmarks[muscle].MRV = Math.round(original.MRV * 0.8);
          break;

        case "maintenance":
        default:
          // Maintenance: use original values
          this.volumeLandmarks[muscle] = { ...original };
          break;
      }

      // Ensure MEV doesn't exceed MRV
      this.volumeLandmarks[muscle].MEV = Math.min(
        this.volumeLandmarks[muscle].MEV,
        this.volumeLandmarks[muscle].MRV - 1,
      );

      // Update MAV to be between MEV and MRV
      const mev = this.volumeLandmarks[muscle].MEV;
      const mrv = this.volumeLandmarks[muscle].MRV;
      this.volumeLandmarks[muscle].MAV = Math.round(mev + (mrv - mev) * 0.7);
    });

    // Update weekly volume tracking with new landmarks
    Object.keys(this.volumeLandmarks).forEach((muscle) => {
      if (this.weeklyVolume[muscle]) {
        this.weeklyVolume[muscle] = {
          current: this.currentWeekSets[muscle],
          ...this.volumeLandmarks[muscle],
        };
      }
    });

    debugLog(`Volume landmarks adjusted for ${phase} phase`);
  }

  /**
   * Get diet phase information and recommendations
   * @returns {Object} - Diet phase details
   */
  getDietPhaseInfo() {
    return {
      current: this.dietPhase,
      landmarks: {
        original: this.originalLandmarks,
        adjusted: this.volumeLandmarks,
      },
      recommendations: this.getDietPhaseRecommendations(),
    };
  }

  /**
   * Get diet-specific training recommendations
   */
  getDietPhaseRecommendations() {
    switch (this.dietPhase) {
      case "bulk":
        return {
          volume:
            "Start conservative with volume - growth stimulus is easier to achieve",
          intensity: "Focus on progressive overload with controlled increases",
          recovery: "Expect better recovery due to caloric surplus",
          progression:
            "Be aggressive with load progression, conservative with volume",
        };

      case "cut":
        return {
          volume: "Higher volume may be needed for muscle retention",
          intensity: "Maintain intensity but expect reduced capacity",
          recovery: "Recovery will be impaired - monitor fatigue closely",
          progression: "Prioritize maintaining strength over gaining",
        };

      case "maintenance":
      default:
        return {
          volume: "Standard RP volume recommendations apply",
          intensity: "Balance volume and intensity progression",
          recovery: "Normal recovery patterns expected",
          progression: "Follow standard progression algorithms",
        };
    }
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

// Export saveState function as requested for handlers
export function saveState() {
  trainingState.saveState();
}

// Also make available globally for legacy compatibility
if (typeof window !== "undefined") {
  window.trainingState = trainingState;
}
