/**
 * Status Panel UI Manager
 * Handles display of training status including fatigue indicators
 */

import trainingState from "../core/trainingState.js";
import { calculateSystemicFatigue } from "../algorithms/fatigue.js";
import { debugLog } from "../utils/debug.js";

/**
 * Initialize status panel with all indicators
 */
export function initStatusPanel() {
  updateAllStatusIndicators();
  
  // Update status panel whenever training state changes
  if (typeof window !== "undefined") {
    window.addEventListener('trainingStateChanged', updateAllStatusIndicators);
  }
}

/**
 * Update all status indicators in the panel
 */
export function updateAllStatusIndicators() {
  updateBasicStatus();
  updateFatigueIndicator();
  updateAdaptiveMesoIndicator();
}

/**
 * Update basic training status (week, meso, block, etc.)
 */
function updateBasicStatus() {
  const elements = {
    currentWeek: trainingState.weekNo,
    currentMeso: trainingState.getAdaptiveMesoLength ? trainingState.getAdaptiveMesoLength() : trainingState.mesoLen,
    currentBlock: trainingState.blockNo,
    targetRIR: trainingState.getTargetRIR(),
    currentPhase: getCurrentPhase()
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });
}

/**
 * Update fatigue indicator with color coding
 */
export function updateFatigueIndicator() {
  try {
    const fatigueLevel = calculateSystemicFatigue(trainingState);
    const fatiguePercentage = Math.round(fatigueLevel * 100);
    
    // Update fatigue score display
    const fatigueScoreElement = document.getElementById('fatigueScore');
    if (fatigueScoreElement) {
      fatigueScoreElement.textContent = `${fatiguePercentage}%`;
    }
    
    // Update fatigue indicator styling based on level
    const fatigueIndicator = document.getElementById('fatigueIndicator');
    if (fatigueIndicator) {
      // Remove existing fatigue classes
      fatigueIndicator.classList.remove('fatigue-low', 'fatigue-moderate', 'fatigue-high');
      
      // Add appropriate class based on fatigue level
      if (fatiguePercentage < 60) {
        fatigueIndicator.classList.add('fatigue-low');
      } else if (fatiguePercentage < 80) {
        fatigueIndicator.classList.add('fatigue-moderate');
      } else {
        fatigueIndicator.classList.add('fatigue-high');
      }
    }
    
    // Show/hide fatigue warning
    const fatigueWarning = document.getElementById('fatigueWarning');
    if (fatigueWarning) {
      if (fatiguePercentage >= 80) {
        fatigueWarning.style.display = 'block';
        fatigueWarning.textContent = fatiguePercentage >= 90 
          ? 'Deload strongly recommended!' 
          : 'Consider deload if above 80%';
      } else {
        fatigueWarning.style.display = 'none';
      }
    }
    
    debugLog(`Fatigue indicator updated: ${fatiguePercentage}%`);
    
  } catch (error) {
    console.warn('Error updating fatigue indicator:', error);
    
    // Fallback display
    const fatigueScoreElement = document.getElementById('fatigueScore');
    if (fatigueScoreElement) {
      fatigueScoreElement.textContent = 'N/A';
    }
  }
}

/**
 * Update adaptive mesocycle length indicator
 */
function updateAdaptiveMesoIndicator() {
  const mesoElement = document.getElementById('currentMeso');
  if (mesoElement && trainingState.getAdaptiveMesoLength) {
    const adaptiveLength = trainingState.getAdaptiveMesoLength();
    const baseLength = trainingState.mesoLen;
    
    if (adaptiveLength !== baseLength) {
      mesoElement.textContent = `${adaptiveLength}* (${baseLength})`;
      mesoElement.title = 'Adaptive mesocycle length based on progression patterns';
    } else {
      mesoElement.textContent = adaptiveLength;
    }
  }
}

/**
 * Get current training phase based on week and progression
 */
function getCurrentPhase() {
  if (trainingState.deloadPhase) {
    return "Deload";
  }
  
  if (trainingState.resensitizationPhase) {
    return "Resensitization";
  }
  
  // Determine phase based on week progression
  const weekRatio = trainingState.weekNo / (trainingState.getAdaptiveMesoLength ? trainingState.getAdaptiveMesoLength() : trainingState.mesoLen);
  
  if (weekRatio <= 0.5) {
    return "Accumulation";
  } else if (weekRatio <= 0.8) {
    return "Intensification";
  } else {
    return "Realization";
  }
}

/**
 * Get fatigue status summary for other components
 * @returns {Object} - Fatigue status information
 */
export function getFatigueStatus() {
  try {
    const fatigueLevel = calculateSystemicFatigue(trainingState);
    const fatiguePercentage = Math.round(fatigueLevel * 100);
    
    return {
      level: fatigueLevel,
      percentage: fatiguePercentage,
      status: fatiguePercentage < 60 ? 'low' : fatiguePercentage < 80 ? 'moderate' : 'high',
      recommendation: getPhaseRecommendation(fatiguePercentage),
      deloadRecommended: fatiguePercentage >= 80
    };
  } catch (error) {
    console.warn('Error getting fatigue status:', error);
    return {
      level: 0,
      percentage: 0,
      status: 'unknown',
      recommendation: 'Unable to assess fatigue',
      deloadRecommended: false
    };
  }
}

/**
 * Get phase recommendation based on fatigue level
 */
function getPhaseRecommendation(fatiguePercentage) {
  if (fatiguePercentage >= 90) {
    return "Immediate deload required - very high systemic fatigue";
  } else if (fatiguePercentage >= 80) {
    return "Deload recommended - high systemic fatigue";
  } else if (fatiguePercentage >= 60) {
    return "Monitor closely - moderate fatigue building";
  } else {
    return "Continue progression - fatigue levels manageable";
  }
}

/**
 * Force update of all status indicators (for external calls)
 */
export function refreshStatusPanel() {
  updateAllStatusIndicators();
}

// Initialize on load if DOM is ready
if (typeof document !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStatusPanel);
} else if (typeof document !== "undefined") {
  initStatusPanel();
}
