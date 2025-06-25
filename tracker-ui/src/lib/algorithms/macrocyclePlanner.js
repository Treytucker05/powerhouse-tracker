import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a yearly macrocycle training plan based on user profile
 */
export function createYearlyPlan(userProfile) {
  const isSpecialization = userProfile.specialization?.enabled && 
                          userProfile.trainingAge === 'advanced';
  
  if (isSpecialization) {
    return createSpecializationPlan(userProfile);
  } else {
    return createLinearPlan(userProfile);
  }
}

/**
 * Creates a linear progression macrocycle
 */
export function createLinearPlan(userProfile) {
  const totalWeeks = userProfile.totalWeeks || 16;
  const dietPhase = userProfile.dietPhase || 'maintain';
  
  const phases = [];
  let currentWeek = 1;

  // Calculate phase distribution based on total weeks
  const phaseDistribution = calculatePhaseDistribution(totalWeeks);
  
  // Accumulation Phase
  if (phaseDistribution.accumulation > 0) {
    phases.push({
      id: uuidv4(),
      title: "Accumulation Phase",
      type: "accum",
      lengthWeeks: phaseDistribution.accumulation,
      diet: dietPhase,
      focus: userProfile.priorityMuscles || [],
      volumeModifier: getVolumeModifier(userProfile.volumeTolerance, 'accum'),
      description: "Build training volume and work capacity"
    });
    currentWeek += phaseDistribution.accumulation;
  }

  // Intensification Phase
  if (phaseDistribution.intensification > 0) {
    phases.push({
      id: uuidv4(),
      title: "Intensification Phase",
      type: "accum", // High intensity accumulation
      lengthWeeks: phaseDistribution.intensification,
      diet: dietPhase,
      focus: ["strength", "neural adaptation"],
      volumeModifier: getVolumeModifier(userProfile.volumeTolerance, 'intensification'),
      description: "Focus on higher intensity training"
    });
    currentWeek += phaseDistribution.intensification;
  }

  // Peak/Test Phase (if enough weeks)
  if (phaseDistribution.peak > 0) {
    phases.push({
      id: uuidv4(),
      title: "Peak Phase",
      type: "maintain",
      lengthWeeks: phaseDistribution.peak,
      diet: dietPhase,
      focus: ["performance", "testing"],
      volumeModifier: 0.7,
      description: "Peak performance and testing"
    });
    currentWeek += phaseDistribution.peak;
  }

  // Deload Phase
  phases.push({
    id: uuidv4(),
    title: "Deload Phase",
    type: "deload",
    lengthWeeks: phaseDistribution.deload,
    diet: dietPhase,
    focus: ["recovery"],
    volumeModifier: 0.5,
    description: "Recovery and preparation for next cycle"
  });

  return {
    id: uuidv4(),
    totalWeeks,
    phases,
    createdAt: new Date(),
    planType: 'linear'
  };
}

/**
 * Creates a specialization-focused macrocycle
 */
export function createSpecializationPlan(userProfile) {
  const totalWeeks = userProfile.totalWeeks || 16;
  const dietPhase = userProfile.dietPhase || 'maintain';
  const focusMuscles = userProfile.specialization.focusMuscles || [];
  const intensityLevel = userProfile.specialization.intensityLevel || 'moderate';
  
  const phases = [];
  
  // Calculate specialization phase distribution
  const specPhaseLength = Math.max(6, Math.floor(totalWeeks * 0.6)); // 60% for specialization
  const maintainPhaseLength = Math.max(2, Math.floor(totalWeeks * 0.25)); // 25% for maintenance
  const deloadLength = totalWeeks - specPhaseLength - maintainPhaseLength;

  // Specialization Accumulation Phase
  phases.push({
    id: uuidv4(),
    title: "Specialization Phase",
    type: "specialization",
    lengthWeeks: specPhaseLength,
    diet: dietPhase,
    focus: focusMuscles,
    volumeModifier: intensityLevel === 'high' ? 1.5 : 1.2,
    description: `High-volume focus on ${focusMuscles.join(' and ')}`
  });

  // Maintenance Phase
  phases.push({
    id: uuidv4(),
    title: "Maintenance Phase",
    type: "maintain",
    lengthWeeks: maintainPhaseLength,
    diet: dietPhase,
    focus: ["overall maintenance"],
    volumeModifier: 0.8,
    description: "Maintain gains while recovering from specialization"
  });

  // Deload Phase
  if (deloadLength > 0) {
    phases.push({
      id: uuidv4(),
      title: "Deload Phase",
      type: "deload",
      lengthWeeks: deloadLength,
      diet: dietPhase,
      focus: ["recovery"],
      volumeModifier: 0.5,
      description: "Recovery and preparation for next cycle"
    });
  }

  return {
    id: uuidv4(),
    totalWeeks,
    phases,
    createdAt: new Date(),
    planType: 'specialization'
  };
}

/**
 * Calculate phase distribution based on total weeks
 */
function calculatePhaseDistribution(totalWeeks) {
  if (totalWeeks <= 8) {
    const deload = Math.min(2, Math.max(1, totalWeeks - 4));
    const accumulation = totalWeeks - deload;
    return {
      accumulation,
      intensification: 0,
      peak: 0,
      deload
    };
  } else if (totalWeeks <= 12) {
    const accumulation = Math.floor(totalWeeks * 0.6);
    const intensification = Math.floor(totalWeeks * 0.25);
    const deload = totalWeeks - accumulation - intensification; // Ensure exact total
    return {
      accumulation,
      intensification,
      peak: 0,
      deload
    };
  } else {
    const accumulation = Math.floor(totalWeeks * 0.5);
    const intensification = Math.floor(totalWeeks * 0.3);
    const peak = Math.floor(totalWeeks * 0.1);
    const deload = totalWeeks - accumulation - intensification - peak; // Ensure exact total
    return {
      accumulation,
      intensification,
      peak,
      deload
    };
  }
}

/**
 * Get volume modifier based on tolerance and phase type
 */
function getVolumeModifier(volumeTolerance, phaseType) {
  const baseModifiers = {
    'accum': { low: 0.8, moderate: 1.0, high: 1.2 },
    'intensification': { low: 0.7, moderate: 0.8, high: 0.9 },
    'maintain': { low: 0.6, moderate: 0.7, high: 0.8 },
    'deload': { low: 0.4, moderate: 0.5, high: 0.6 }
  };

  return baseModifiers[phaseType]?.[volumeTolerance] || 1.0;
}
