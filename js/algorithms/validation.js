/**
 * Training Validation Helpers
 * Provides validation for loads, sets, and training parameters
 */

/**
 * Validate load percentage (1RM)
 * @param {number} loadPercent - Load as percentage of 1RM
 * @param {string} context - Training context (hypertrophy, strength, power)
 * @returns {Object} - Validation result
 */
function validateLoad(loadPercent, context = 'hypertrophy') {
  const load = parseFloat(loadPercent);
  
  if (isNaN(load) || load <= 0) {
    return {
      isValid: false,
      warning: 'Load must be a positive number',
      recommendation: 'Enter a valid load percentage'
    };
  }
  
  // Context-specific load ranges
  const loadRanges = {
    hypertrophy: { min: 30, max: 85, optimal: [65, 80] },
    strength: { min: 70, max: 100, optimal: [85, 95] },
    power: { min: 30, max: 70, optimal: [40, 60] },
    endurance: { min: 20, max: 60, optimal: [30, 50] }
  };
  
  const range = loadRanges[context] || loadRanges.hypertrophy;
  
  let isValid = true;
  let warning = '';
  let recommendation = '';
  let severity = 'normal';
  
  if (load < range.min) {
    isValid = false;
    warning = `Load too light for ${context} (${load}% < ${range.min}%)`;
    recommendation = `Increase to ${range.optimal[0]}-${range.optimal[1]}% for optimal ${context} adaptations`;
    severity = 'high';
  } else if (load > range.max) {
    isValid = false;
    warning = `Load too heavy for ${context} (${load}% > ${range.max}%)`;
    recommendation = `Reduce to ${range.optimal[0]}-${range.optimal[1]}% for safer ${context} training`;
    severity = 'high';
  } else if (load < range.optimal[0]) {
    warning = `Load is light for ${context} (${load}% < ${range.optimal[0]}%)`;
    recommendation = `Consider increasing to ${range.optimal[0]}-${range.optimal[1]}% for better stimulus`;
    severity = 'medium';
  } else if (load > range.optimal[1]) {
    warning = `Load is heavy for ${context} (${load}% > ${range.optimal[1]}%)`;
    recommendation = `Consider reducing to ${range.optimal[0]}-${range.optimal[1]}% for better recovery`;
    severity = 'medium';
  } else {
    recommendation = `Good load for ${context} training`;
  }
  
  return {
    isValid,
    load,
    context,
    warning,
    recommendation,
    severity,
    range,
    isOptimal: load >= range.optimal[0] && load <= range.optimal[1]
  };
}

/**
 * Validate RIR (Reps in Reserve)
 * @param {number} rir - Reps in reserve
 * @param {number} targetRIR - Target RIR for the session
 * @param {string} context - Training context
 * @returns {Object} - Validation result
 */
function validateRIR(rir, targetRIR, context = 'hypertrophy') {
  const actualRIR = parseFloat(rir);
  const target = parseFloat(targetRIR);
  
  if (isNaN(actualRIR) || actualRIR < 0) {
    return {
      isValid: false,
      warning: 'RIR must be 0 or greater',
      recommendation: 'Enter how many more reps you could have done'
    };
  }
  
  if (actualRIR > 10) {
    return {
      isValid: false,
      warning: 'RIR too high (>10) - load likely too light',
      recommendation: 'Increase weight significantly'
    };
  }
  
  const deviation = Math.abs(actualRIR - target);
  let isValid = true;
  let warning = '';
  let recommendation = '';
  let severity = 'normal';
  
  // Tolerance varies by context
  const tolerances = {
    hypertrophy: 1.0,
    strength: 0.5,
    power: 1.5,
    endurance: 2.0
  };
  
  const tolerance = tolerances[context] || tolerances.hypertrophy;
  
  if (deviation <= tolerance) {
    recommendation = `On target (${actualRIR} vs ${target} RIR)`;
  } else if (actualRIR > target) {
    const difference = actualRIR - target;
    warning = `Too easy (${difference.toFixed(1)} RIR above target)`;
    
    if (difference > 2) {
      recommendation = 'Increase weight significantly (10-15%)';
      severity = 'high';
    } else {
      recommendation = 'Increase weight moderately (5-10%)';
      severity = 'medium';
    }
  } else {
    const difference = target - actualRIR;
    warning = `Too hard (${difference.toFixed(1)} RIR below target)`;
    
    if (difference > 2) {
      recommendation = 'Reduce weight significantly (10-15%)';
      severity = 'high';
    } else {
      recommendation = 'Reduce weight slightly (5-10%)';
      severity = 'medium';
    }
  }
  
  return {
    isValid,
    actualRIR,
    targetRIR: target,
    deviation,
    warning,
    recommendation,
    severity,
    isOnTarget: deviation <= tolerance
  };
}

/**
 * Validate set count within volume landmarks
 * @param {number} sets - Proposed set count
 * @param {Object} landmarks - Volume landmarks {MV, MEV, MAV, MRV}
 * @param {boolean} allowOverreach - Allow sets above MRV
 * @returns {Object} - Validation result
 */
function validateSets(sets, landmarks, allowOverreach = false) {
  const setCount = parseInt(sets, 10);
  
  if (isNaN(setCount) || setCount < 0) {
    return {
      isValid: false,
      warning: 'Set count must be 0 or greater',
      recommendation: 'Enter a valid number of sets'
    };
  }
  
  const { MV = 0, MEV, MAV, MRV } = landmarks;
  
  let isValid = true;
  let warning = '';
  let recommendation = '';
  let severity = 'normal';
  let zone = '';
  
  if (setCount < MV) {
    zone = 'below-maintenance';
    warning = `Below maintenance volume (${setCount} < ${MV})`;
    recommendation = 'Increase sets for minimal stimulus';
    severity = 'high';
  } else if (setCount < MEV) {
    zone = 'maintenance';
    warning = `In maintenance zone (${setCount} < ${MEV})`;
    recommendation = 'Increase sets for growth stimulus';
    severity = 'medium';
  } else if (setCount <= MAV) {
    zone = 'optimal';
    recommendation = `Optimal volume zone (${MEV}-${MAV} sets)`;
  } else if (setCount <= MRV) {
    zone = 'high';
    warning = `High volume zone (${setCount} approaching ${MRV})`;
    recommendation = 'Monitor recovery closely';
    severity = 'medium';
  } else {
    zone = 'maximum';
    
    if (!allowOverreach) {
      isValid = false;
      warning = `Above maximum recoverable volume (${setCount} > ${MRV})`;
      recommendation = 'Reduce sets or plan deload';
      severity = 'high';
    } else {
      warning = `Overreaching territory (${setCount} > ${MRV})`;
      recommendation = 'Short-term only - deload soon';
      severity = 'high';
    }
  }
  
  return {
    isValid,
    sets: setCount,
    landmarks,
    zone,
    warning,
    recommendation,
    severity,
    percentage: Math.round((setCount / MRV) * 100)
  };
}

/**
 * Validate training frequency
 * @param {number} frequency - Sessions per week
 * @param {number} weeklyVolume - Total weekly sets
 * @param {string} muscleGroup - Muscle group name
 * @returns {Object} - Validation result
 */
function validateFrequency(frequency, weeklyVolume, muscleGroup = '') {
  const freq = parseInt(frequency, 10);
  const volume = parseInt(weeklyVolume, 10);
  
  if (isNaN(freq) || freq < 1) {
    return {
      isValid: false,
      warning: 'Frequency must be at least 1 session per week',
      recommendation: 'Train each muscle at least once per week'
    };
  }
  
  if (isNaN(volume) || volume < 0) {
    return {
      isValid: false,
      warning: 'Weekly volume must be specified',
      recommendation: 'Enter total weekly sets'
    };
  }
  
  const setsPerSession = volume / freq;
  let isValid = true;
  let warning = '';
  let recommendation = '';
  let severity = 'normal';
  
  // General guidelines for sets per session
  if (setsPerSession > 20) {
    isValid = false;
    warning = `Too many sets per session (${setsPerSession.toFixed(1)})`;
    recommendation = 'Increase frequency or reduce volume';
    severity = 'high';
  } else if (setsPerSession > 12) {
    warning = `High sets per session (${setsPerSession.toFixed(1)})`;
    recommendation = 'Consider increasing frequency';
    severity = 'medium';
  } else if (setsPerSession < 2 && volume >= 6) {
    warning = `Very low sets per session (${setsPerSession.toFixed(1)})`;
    recommendation = 'Consider reducing frequency';
    severity = 'medium';
  } else {
    recommendation = `Good distribution (${setsPerSession.toFixed(1)} sets/session)`;
  }
  
  // Frequency-specific advice
  let frequencyAdvice = '';
  if (freq === 1) {
    frequencyAdvice = 'Once weekly - ensure high quality';
  } else if (freq === 2) {
    frequencyAdvice = 'Twice weekly - good for most goals';
  } else if (freq === 3) {
    frequencyAdvice = 'Three times weekly - high frequency';
  } else if (freq >= 4) {
    frequencyAdvice = 'Very high frequency - monitor recovery';
  }
  
  return {
    isValid,
    frequency: freq,
    weeklyVolume: volume,
    setsPerSession: Math.round(setsPerSession * 10) / 10,
    warning,
    recommendation,
    frequencyAdvice,
    severity,
    muscleGroup
  };
}

/**
 * Validate mesocycle length
 * @param {number} weeks - Mesocycle length in weeks
 * @param {string} goal - Training goal
 * @returns {Object} - Validation result
 */
function validateMesocycleLength(weeks, goal = 'hypertrophy') {
  const mesoLength = parseInt(weeks, 10);
  
  if (isNaN(mesoLength) || mesoLength < 1) {
    return {
      isValid: false,
      warning: 'Mesocycle must be at least 1 week',
      recommendation: 'Enter a valid mesocycle length'
    };
  }
  
  // Goal-specific recommendations
  const recommendations = {
    hypertrophy: { min: 3, max: 6, optimal: 4 },
    strength: { min: 2, max: 8, optimal: 4 },
    power: { min: 2, max: 4, optimal: 3 },
    endurance: { min: 4, max: 12, optimal: 6 }
  };
  
  const rec = recommendations[goal] || recommendations.hypertrophy;
  
  let isValid = true;
  let warning = '';
  let recommendation = '';
  let severity = 'normal';
  
  if (mesoLength < rec.min) {
    warning = `Short mesocycle for ${goal} (${mesoLength} < ${rec.min} weeks)`;
    recommendation = `Consider ${rec.optimal} weeks for better ${goal} adaptations`;
    severity = 'medium';
  } else if (mesoLength > rec.max) {
    warning = `Long mesocycle for ${goal} (${mesoLength} > ${rec.max} weeks)`;
    recommendation = `Consider ${rec.optimal} weeks to prevent overreaching`;
    severity = 'medium';
  } else if (mesoLength === rec.optimal) {
    recommendation = `Optimal length for ${goal} training`;
  } else {
    recommendation = `Good length for ${goal} training`;
  }
  
  return {
    isValid,
    weeks: mesoLength,
    goal,
    warning,
    recommendation,
    severity,
    isOptimal: mesoLength === rec.optimal,
    range: rec
  };
}

/**
 * Validate input ranges for UI components
 * @param {*} value - Input value
 * @param {Object} constraints - Validation constraints
 * @returns {Object} - Validation result
 */
function validateInputRange(value, constraints) {
  const {
    type = 'number',
    min = null,
    max = null,
    step = null,
    required = false,
    customValidator = null
  } = constraints;
  
  // Check if required
  if (required && (value === null || value === undefined || value === '')) {
    return {
      isValid: false,
      warning: 'This field is required',
      recommendation: 'Please enter a value'
    };
  }
  
  // Type validation
  if (type === 'number') {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return {
        isValid: false,
        warning: 'Must be a valid number',
        recommendation: 'Enter a numeric value'
      };
    }
    
    if (min !== null && num < min) {
      return {
        isValid: false,
        warning: `Must be at least ${min}`,
        recommendation: `Enter a value ≥ ${min}`
      };
    }
    
    if (max !== null && num > max) {
      return {
        isValid: false,
        warning: `Must be at most ${max}`,
        recommendation: `Enter a value ≤ ${max}`
      };
    }
    
    if (step !== null && ((num * 100) % (step * 100)) !== 0) {
      return {
        isValid: false,
        warning: `Must be in increments of ${step}`,
        recommendation: `Use multiples of ${step}`
      };
    }
  }
  
  // Custom validation
  if (customValidator && typeof customValidator === 'function') {
    const customResult = customValidator(value);
    if (!customResult.isValid) {
      return customResult;
    }
  }
  
  return {
    isValid: true,
    value,
    recommendation: 'Valid input'
  };
}

/**
 * Create comprehensive validation summary
 * @param {Object} formData - Complete form data
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} - Comprehensive validation result
 */
function validateTrainingSession(formData, validationRules = {}) {
  const results = {};
  const errors = [];
  const warnings = [];
  
  Object.keys(formData).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    if (rules) {
      let result;
      
      switch (rules.type) {
        case 'load':
          result = validateLoad(value, rules.context);
          break;
        case 'rir':
          result = validateRIR(value, rules.target, rules.context);
          break;
        case 'sets':
          result = validateSets(value, rules.landmarks, rules.allowOverreach);
          break;
        case 'frequency':
          result = validateFrequency(value, rules.volume, rules.muscle);
          break;
        case 'meso':
          result = validateMesocycleLength(value, rules.goal);
          break;
        default:
          result = validateInputRange(value, rules);
      }
      
      results[field] = result;
      
      if (!result.isValid) {
        errors.push(`${field}: ${result.warning}`);
      } else if (result.warning) {
        warnings.push(`${field}: ${result.warning}`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    hasWarnings: warnings.length > 0,
    errors,
    warnings,
    fieldResults: results,
    summary: errors.length === 0 ? 
      (warnings.length === 0 ? 'All inputs valid' : 'Valid with warnings') :
      `${errors.length} validation error(s)`
  };
}

export {
  validateLoad,
  validateSets,
  validateMesocycleLength
};
