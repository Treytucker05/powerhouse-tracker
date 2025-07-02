import {
  MACROCYCLE_TEMPLATES,
  calculateVolumeProgression,
  calculateRIRProgression,
  calculatePhaseDuration,
  shouldDeload
} from "../constants/rpConstants";

const DEBUG_MODE = process.env.NODE_ENV === "development" || true;

const debugLog = (category, data, level = "info") => {
  if (!DEBUG_MODE) return;

  const timestamp = new Date().toISOString();
  const styles = {
    info: "color: #3b82f6; font-weight: bold;",
    warn: "color: #f59e0b; font-weight: bold;",
    error: "color: #ef4444; font-weight: bold;",
    success: "color: #10b981; font-weight: bold;"
  };

  console.group(`%c🔍 [${category}] ${timestamp}`, styles[level]);
  console.log(data);
  console.groupEnd();
};

const validateRPCompliance = (mesocycles, programData) => {
  debugLog("RP Compliance Check", { mesocycles, programData }, "info");

  const compliance = {
    volumeLandmarks: true,
    rirProgression: true,
    phaseDurations: true,
    warnings: []
  };

  mesocycles.forEach((phase, index) => {
    if (phase.volumeLandmarks) {
      Object.entries(phase.volumeLandmarks).forEach(([muscle, landmarks]) => {
        if (landmarks.mev < 4 || landmarks.mrv > 30) {
          compliance.volumeLandmarks = false;
          compliance.warnings.push(`${muscle} landmarks outside reasonable range: MEV=${landmarks.mev}, MRV=${landmarks.mrv}`);
        }
      });
    }

    if (phase.rirProgression && phase.rirProgression.length > 0) {
      const firstRIR = phase.rirProgression[0].targetRIR;
      if (firstRIR < 4) {
        compliance.rirProgression = false;
        compliance.warnings.push(`Phase ${index + 1} RIR starts below 4: ${firstRIR}`);
      }
    }

    if (phase.weeks < 1 || phase.weeks > 12) {
      compliance.phaseDurations = false;
      compliance.warnings.push(`Phase ${index + 1} duration outside constraints: ${phase.weeks} weeks`);
    }
  });

  debugLog(
    "RP Compliance Results",
    compliance,
    compliance.warnings.length > 0 ? "warn" : "success"
  );
  return compliance;
};

export const generateMesocycles = (templateKey, programData) => {
    const generationStart = performance.now();
    debugLog('Mesocycle Generation Start', {
      templateKey,
      programData,
      templateData: MACROCYCLE_TEMPLATES[templateKey]
    }, 'info');

    const templateData = MACROCYCLE_TEMPLATES[templateKey];
    if (!templateData) {
      debugLog('Template Error', { templateKey, availableTemplates: Object.keys(MACROCYCLE_TEMPLATES) }, 'error');
      return [];
    }

    const mesocycles = [];
    let currentWeekTracker = 1;
    const startDate = new Date(programData.startDate || new Date());

    templateData.blocks.forEach((block, index) => {
      // 🐛 DEBUG: Log each block processing
      debugLog(`Processing Block ${index + 1}`, {
        blockType: block.block_type,
        originalDuration: block.duration_weeks,
        focus: block.focus
      }, 'info');

      // Calculate dynamic phase duration using RP research
      const dynamicDuration = calculatePhaseDuration(
        block.block_type === 'accumulation' ? 'hypertrophy' :
          block.block_type === 'intensification' ? 'strength' :
            block.block_type === 'realization' ? 'peak' : 'foundation',
        programData.trainingAge,
        programData.goal,
        programData.recoveryScore
      );

      // 🐛 DEBUG: Log phase duration calculation
      debugLog(`Phase Duration Calculation`, {
        blockType: block.block_type,
        originalDuration: block.duration_weeks,
        dynamicDuration,
        trainingAge: programData.trainingAge,
        goal: programData.goal,
        recoveryScore: programData.recoveryScore
      }, 'info');

      // Use dynamic duration but respect templateKey minimums
      const finalDuration = Math.max(block.duration_weeks, dynamicDuration);

      // Calculate real volume progression for this phase
      const chestData = calculateVolumeProgression('chest', finalDuration, programData.trainingAge);
      const backData = calculateVolumeProgression('back', finalDuration, programData.trainingAge);
      const quadsData = calculateVolumeProgression('quads', finalDuration, programData.trainingAge);

      // 🐛 DEBUG: Log volume calculations
      debugLog(`Volume Progression Calculations`, {
        phaseDuration: finalDuration,
        trainingAge: programData.trainingAge,
        chestLandmarks: chestData.landmarks,
        backLandmarks: backData.landmarks,
        quadsLandmarks: quadsData.landmarks,
        chestProgression: chestData.progression,
        backProgression: backData.progression,
        quadsProgression: quadsData.progression
      }, 'info');

      // Calculate real RIR progression
      const exerciseType = block.block_type === 'accumulation' ? 'compound' : 'compound';
      const rirProgression = calculateRIRProgression(finalDuration, exerciseType);

      // 🐛 DEBUG: Log RIR progression calculations
      debugLog(`RIR Progression Calculations`, {
        phaseDuration: finalDuration,
        exerciseType,
        rirProgression,
        startsAt: rirProgression[0]?.targetRIR,
        endsAt: rirProgression[rirProgression.length - 1]?.targetRIR
      }, 'info');

      // Determine current status and progress
      const blockStartWeek = currentWeekTracker;
      const blockEndWeek = currentWeekTracker + finalDuration - 1;
      const status = getBlockStatus(blockStartWeek, blockEndWeek, currentWeek);
      const progress = calculateBlockProgress(blockStartWeek, finalDuration, currentWeek);

      // Calculate deload recommendation for this phase
      const currentVolumeExample = chestData.landmarks.mev + (chestData.landmarks.mrv - chestData.landmarks.mev) * 0.7;
      const deloadCheck = shouldDeload({
        currentVolume: currentVolumeExample,
        mrvThreshold: chestData.landmarks.mrv,
        fatigueScore: 5, // Default moderate fatigue
        performanceDrop: 0,
        weeksSinceDeload: Math.min(currentWeekTracker - 1, 6),
        sleepQuality: 6,
        motivationLevel: 7,
        jointPain: 3
      });

      // 🐛 DEBUG: Log deload calculations
      debugLog(`Deload Recommendation`, {
        currentVolume: currentVolumeExample,
        mrvThreshold: chestData.landmarks.mrv,
        deloadCheck,
        weeksSinceDeload: Math.min(currentWeekTracker - 1, 6)
      }, 'info');

      const blockData = {
        id: index + 1,
        name: getBlockName(block.block_type, block.focus),
        weeks: finalDuration,
        originalWeeks: block.duration_weeks,
        status,
        progress,
        icon: getBlockIcon(block.block_type),
        gradient: getBlockGradient(block.block_type),
        borderColor: getBlockBorderColor(block.block_type),
        glowColor: getBlockGlowColor(block.block_type),
        startDate: calculateStartDate(blockStartWeek, startDate),
        endDate: calculateEndDate(blockEndWeek, startDate),
        objectives: getBlockObjectives(block.block_type, programData.goal),
        keyMetrics: calculateDynamicKeyMetrics(block, programData, chestData, finalDuration),
        rirProgression,
        volumeProgression: {
          chest: chestData.progression,
          back: backData.progression,
          quads: quadsData.progression
        },
        volumeLandmarks: {
          chest: chestData.landmarks,
          back: backData.landmarks,
          quads: quadsData.landmarks
        },
        deloadRecommendation: deloadCheck,
        blockType: block.block_type,
        researchBased: true
      };

      mesocycles.push(blockData);
      currentWeekTracker += finalDuration;

      // 🐛 DEBUG: Log completed block data
      debugLog(`Block ${index + 1} Complete`, {
        blockData: {
          name: blockData.name,
          weeks: blockData.weeks,
          status: blockData.status,
          progress: blockData.progress,
          startWeek: blockStartWeek,
          endWeek: blockEndWeek
        },
        nextWeekTracker: currentWeekTracker
      }, 'success');
    });

    // 🐛 DEBUG: Log final mesocycle generation results
    const generationEnd = performance.now();
    const generationTime = generationEnd - generationStart;

    debugLog('Mesocycle Generation Complete', {
      totalPhases: mesocycles.length,
      totalWeeks: currentWeekTracker - 1,
      generationTime: `${generationTime.toFixed(2)}ms`,
      phases: mesocycles.map(m => ({ name: m.name, weeks: m.weeks, type: m.blockType }))
    }, 'success');

    // 🐛 DEBUG: Validate RP compliance
    const compliance = validateRPCompliance(mesocycles, programData);
    if (compliance.warnings.length > 0) {
      debugLog('RP Compliance Warnings', compliance.warnings, 'warn');
    }

    return mesocycles;
  };

  // Helper functions for dynamic mesocycle generation
  const getBlockName = (blockType, focus) => {
    const nameMap = {
      accumulation: 'Volume Accumulation',
      intensification: 'Strength Intensification',
      realization: 'Peak Performance',
      deload: 'Recovery & Adaptation',
      maintenance: 'Maintenance Phase'
    };
    return nameMap[blockType] || blockType;
  };

  const getBlockStatus = (blockStart, blockEnd, currentWeek) => {
    if (currentWeek > blockEnd) return 'completed';
    if (currentWeek >= blockStart && currentWeek <= blockEnd) return 'current';
    return 'planned';
  };

  const calculateBlockProgress = (blockStart, blockLength, currentWeek) => {
    if (currentWeek < blockStart) return 0;
    if (currentWeek > blockStart + blockLength - 1) return 100;
    const weeksCompleted = currentWeek - blockStart + 1;
    return Math.round((weeksCompleted / blockLength) * 100);
  };

  const getBlockIcon = (blockType) => {
    const iconMap = {
      accumulation: '💪',
      intensification: '🔥',
      realization: '⚡',
      deload: '🛡️',
      maintenance: '⚖️'
    };
    return iconMap[blockType] || '🎯';
  };

  const getBlockGradient = (blockType) => {
    const gradientMap = {
      accumulation: 'from-green-600 to-green-800',
      intensification: 'from-orange-600 to-red-700',
      realization: 'from-purple-600 to-purple-800',
      deload: 'from-blue-600 to-blue-800',
      maintenance: 'from-gray-600 to-gray-800'
    };
    return gradientMap[blockType] || 'from-gray-600 to-gray-800';
  };

  const getBlockBorderColor = (blockType) => {
    const borderMap = {
      accumulation: 'border-green-500/50',
      intensification: 'border-orange-500/50',
      realization: 'border-purple-500/50',
      deload: 'border-blue-500/50',
      maintenance: 'border-gray-500/50'
    };
    return borderMap[blockType] || 'border-gray-500/50';
  };

  const getBlockGlowColor = (blockType) => {
    const glowMap = {
      accumulation: 'green',
      intensification: 'orange',
      realization: 'purple',
      deload: 'blue',
      maintenance: 'gray'
    };
    return glowMap[blockType] || 'gray';
  };

  const calculateStartDate = (weekNumber, programStart) => {
    const startDate = new Date(programStart);
    startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    return startDate.toISOString().split('T')[0];
  };

  const calculateEndDate = (weekNumber, programStart) => {
    const endDate = new Date(programStart);
    endDate.setDate(endDate.getDate() + weekNumber * 7 - 1);
    return endDate.toISOString().split('T')[0];
  };

  const getBlockObjectives = (blockType, goal) => {
    const objectiveMap = {
      accumulation: {
        hypertrophy: ['Maximize training volume', 'Progressive overload focus', 'Muscle growth emphasis'],
        strength: ['Build work capacity', 'Volume accumulation', 'Movement quality'],
        powerbuilding: ['Balanced volume/intensity', 'Compound lift focus', 'Accessory integration']
      },
      intensification: {
        hypertrophy: ['Maintain volume', 'Increase intensity', 'Advanced techniques'],
        strength: ['Heavy compound focus', '85-95% 1RM training', 'Skill refinement'],
        powerbuilding: ['Strength emphasis', 'Competition prep', 'Peak loading']
      },
      realization: {
        hypertrophy: ['Peak performance', 'Volume tapering', 'Recovery optimization'],
        strength: ['Competition peaking', '95-105% attempts', 'Skill expression'],
        powerbuilding: ['Testing maxes', 'Performance validation', 'Peak conditioning']
      },
      deload: ['Active recovery', 'Adaptation consolidation', 'Fatigue dissipation'],
      maintenance: ['Maintain gains', 'Lifestyle integration', 'Long-term adherence']
    };

    return objectiveMap[blockType]?.[goal] || objectiveMap[blockType] || ['Phase-specific training'];
  };

  const calculateDynamicKeyMetrics = (block, programData, chestData, weeks) => {
    const metrics = {};

    if (block.block_type === 'accumulation') {
      // Real volume progression from RP research
      metrics.volume = `${chestData.landmarks.mev}-${chestData.landmarks.mrv} sets`;
      metrics.intensity = '65-80% 1RM';
      metrics.frequency = `${programData.availableDays || 4}x/week`;
      metrics.focus = 'Volume Accumulation';

      // Calculate actual volume increase
      const volumeIncrease = Math.round(((chestData.landmarks.mrv - chestData.landmarks.mev) / chestData.landmarks.mev) * 100);
      metrics.progression = `+${volumeIncrease}% volume`;

    } else if (block.block_type === 'intensification') {
      // Intensity-focused metrics
      metrics.intensity = '80-95% 1RM';
      metrics.volume = `${Math.round(chestData.landmarks.mev * 0.8)}-${Math.round(chestData.landmarks.mev * 1.1)} sets`;
      metrics.frequency = `${Math.max(3, programData.availableDays - 1)}x/week`;
      metrics.focus = 'Strength Building';
      metrics.progression = '+15-25% load';

    } else if (block.block_type === 'realization') {
      // Peak performance metrics
      metrics.intensity = '95-105% 1RM';
      metrics.volume = `${Math.round(chestData.landmarks.mev * 0.6)}-${Math.round(chestData.landmarks.mev * 0.8)} sets`;
      metrics.tapering = 'Active';
      metrics.focus = 'Performance Peak';
      metrics.progression = 'Peak Testing';

    } else if (block.block_type === 'deload') {
      // Deload metrics
      metrics.intensity = '50-70% 1RM';
      metrics.volume = `${Math.round(chestData.landmarks.mev * 0.4)}-${Math.round(chestData.landmarks.mev * 0.6)} sets`;
      metrics.recovery = 'Primary';
      metrics.focus = 'Recovery';
      metrics.progression = 'Restoration';

    } else {
      // Maintenance metrics
      metrics.intensity = '70-85% 1RM';
      metrics.volume = `${chestData.landmarks.mev}-${Math.round(chestData.landmarks.mev * 1.2)} sets`;
      metrics.frequency = `${Math.max(2, programData.availableDays - 1)}x/week`;
      metrics.focus = 'Maintenance';
      metrics.progression = 'Sustain Gains';
    }

    return metrics;
  };

  // Calculate current week based on program start date
  const calculateCurrentWeek = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(diffDays / 7));
  };

export {
  getBlockName,
  getBlockStatus,
  calculateBlockProgress,
  getBlockIcon,
  getBlockGradient,
  getBlockBorderColor,
  getBlockGlowColor,
  calculateStartDate,
  calculateEndDate,
  getBlockObjectives,
  calculateDynamicKeyMetrics,
  calculateCurrentWeek
};
