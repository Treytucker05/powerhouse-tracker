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
