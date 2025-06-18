<<<<<<< HEAD
/* ---------------------------------------------------------------------------
 * Legacy RP Toolkit algorithm bridges
 * Expose functions that ui/globals.js still imports until those modules
 * are fully refactored to the new API.
 * -------------------------------------------------------------------------*/

import {
  scoreStimulus,
  setProgressionAlgorithm,
  getVolumeProgression,
  analyzeDeloadNeed,
  autoSetIncrement,
  processWeeklyVolumeProgression,
} from "../algorithms/volume.js";

import {
  analyzeFrequency,
  calculateOptimalFrequency,
  isHighFatigue,
} from "../algorithms/fatigue.js";

export {
  scoreStimulus,
  setProgressionAlgorithm,
  getVolumeProgression,
  analyzeDeloadNeed,
  autoSetIncrement,
  processWeeklyVolumeProgression,
  analyzeFrequency,
  calculateOptimalFrequency,
  isHighFatigue,
};
=======
export * from "../algorithms/volume.js";
export {
  calculateOptimalFrequency,
  analyzeFrequency,
  isHighFatigue,
} from "../algorithms/fatigue.js";
>>>>>>> 5a1c01a59fbf0b5865cb43f9ef7c52c73314e3af
