import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

const InjuryScreeningStep = () => {
  const { state, actions } = useProgramContext();
  const [responses, setResponses] = useState(state.injuryScreen?.responses || {});

  // ============================================
  // ENHANCED INJURY-EXERCISE MAPPING MATRIX
  // ============================================
  const injuryExerciseMatrix = {
    // Shoulder Injuries
    shoulder_impingement: {
      exclude: ['barbell_ohp', 'behind_neck_press', 'upright_row', 'lateral_raise_above_90'],
      modify: {
        'db_shoulder_press': {
          modification: 'neutral_grip_45_degree',
          romLimit: '90_degrees',
          tempoAdjust: '3-0-1-0'
        },
        'bench_press': {
          modification: 'reduce_rom_2_inches',
          gripWidth: 'narrow_1.5x_shoulder',
          angleAdjust: 'slight_decline'
        }
      },
      volumeReduction: 0.7,
      intensityCap: 0.85,
      frequencyMax: 2,
      warmupProtocol: 'extended_shoulder_specific',
      adaptability: { rp: 'excellent', '531': 'moderate', linear: 'good', josh_bryant: 'good' }
    },

    shoulder_instability: {
      exclude: ['dips', 'wide_grip_bench', 'behind_neck_anything', 'flyes'],
      modify: {
        'all_pressing': {
          modification: 'floor_press_variation',
          stabilityFocus: true,
          tempoAdjust: '2-2-1-0'
        }
      },
      volumeReduction: 0.6,
      intensityCap: 0.75,
      frequencyMax: 2,
      adaptability: { rp: 'excellent', linear: 'excellent', '531': 'poor', josh_bryant: 'moderate' }
    },

    // Lower Back Injuries
    lower_back_flexion_intolerant: {
      exclude: ['conventional_deadlift', 'goodmorning', 'jefferson_curl', 'situps'],
      modify: {
        'deadlift': {
          modification: 'trap_bar_high_handle',
          startPosition: 'elevated_blocks',
          braceProtocol: 'mcgill_enhanced'
        },
        'squat': {
          modification: 'box_squat',
          depth: 'above_parallel',
          stance: 'wider_reduced_flexion'
        }
      },
      volumeReduction: 0.65,
      intensityCap: 0.8,
      coreProtocol: 'mcgill_big_3',
      adaptability: { rp: 'excellent', linear: 'excellent', '531': 'poor', josh_bryant: 'moderate' }
    },

    lower_back_extension_intolerant: {
      exclude: ['overhead_press', 'back_extensions', 'superman'],
      modify: {
        'all_overhead': {
          modification: 'seated_supported',
          angleLimit: '75_degrees',
          supportType: 'high_back'
        }
      },
      volumeReduction: 0.7,
      intensityCap: 0.85,
      adaptability: { rp: 'excellent', linear: 'good', '531': 'moderate', josh_bryant: 'good' }
    },

    // Knee Injuries
    knee_patellofemoral: {
      exclude: ['full_depth_squat', 'lunges_forward', 'leg_extension', 'plyometrics'],
      modify: {
        'squat': {
          modification: 'box_squat_above_90',
          stance: 'wide_toes_out',
          kneeTracking: 'band_assisted'
        },
        'single_leg': {
          modification: 'reverse_lunge_only',
          elevation: 'deficit_for_reduced_flexion'
        }
      },
      volumeReduction: 0.75,
      intensityCap: 0.8,
      vmoPrehab: true,
      adaptability: { rp: 'excellent', linear: 'excellent', '531': 'good', josh_bryant: 'moderate' }
    },

    // Hip Injuries
    hip_impingement: {
      exclude: ['deep_squats', 'sumo_deadlift', 'leg_press_deep', 'butterfly_stretch'],
      modify: {
        'squat': {
          modification: 'high_box_squat',
          stance: 'narrow_parallel',
          toeAngle: 'minimal_15_degrees'
        },
        'deadlift': {
          modification: 'romanian_partial',
          rangeLimit: 'knee_to_mid_shin'
        }
      },
      volumeReduction: 0.7,
      intensityCap: 0.85,
      mobilityFocus: 'capsule_not_stretch',
      adaptability: { rp: 'excellent', linear: 'good', '531': 'moderate', josh_bryant: 'good' }
    },

    // Elbow/Wrist
    tennis_elbow: {
      exclude: ['straight_bar_curls', 'close_grip_bench', 'heavy_rows'],
      modify: {
        'all_curls': {
          modification: 'hammer_or_neutral',
          loadReduction: 0.7,
          repIncrease: 1.5
        },
        'pressing': {
          modification: 'neutral_grip_preferred',
          wristPosition: 'neutral_maintained'
        }
      },
      volumeReduction: 0.8,
      intensityCap: 0.75,
      eccentric_protocol: true,
      adaptability: { rp: 'excellent', linear: 'good', '531': 'moderate', josh_bryant: 'good' }
    }
  };

  // ============================================
  // PROGRESSIVE RETURN PROTOCOL
  // ============================================
  const returnToTrainingProtocol = {
    phases: {
      phase1_foundation: {
        weeks: '1-4',
        volume: 0.4,
        intensity: 0.6,
        complexity: 'basic',
        exercisePool: 'fundamental_only',
        setsPerMuscle: '6-10',
        repsRange: '12-20',
        progression: 'reps_before_weight',
        focusAreas: ['movement_quality', 'pain_free_rom', 'base_conditioning']
      },

      phase2_rebuilding: {
        weeks: '5-8',
        volume: 0.6,
        intensity: 0.75,
        complexity: 'moderate',
        exercisePool: 'add_compounds',
        setsPerMuscle: '10-16',
        repsRange: '8-15',
        progression: 'small_load_increases',
        focusAreas: ['strength_endurance', 'movement_confidence', 'volume_tolerance']
      },

      phase3_strengthening: {
        weeks: '9-12',
        volume: 0.8,
        intensity: 0.85,
        complexity: 'advanced',
        exercisePool: 'near_full',
        setsPerMuscle: '16-20',
        repsRange: '6-12',
        progression: 'normal_progression',
        focusAreas: ['strength_return', 'power_reintroduction', 'sport_specific']
      },

      phase4_optimization: {
        weeks: '13+',
        volume: 1.0,
        intensity: 1.0,
        complexity: 'full',
        exercisePool: 'unrestricted',
        setsPerMuscle: 'goal_dependent',
        repsRange: 'goal_dependent',
        progression: 'full_progression',
        focusAreas: ['performance', 'prevention', 'optimization']
      }
    }
  };

  // ============================================
  // SYSTEM-INJURY COMPATIBILITY MATRIX
  // ============================================
  const systemInjuryCompatibility = {
    'rp': {
      injuryAdaptability: 'excellent',
      volumeControl: true,
      exerciseFlexibility: 'high',
      intensityControl: true,
      pros: [
        'Volume landmarks allow precise load management',
        'MEV/MRV concepts perfect for reduced capacity',
        'Flexible exercise selection',
        'Built-in fatigue management'
      ],
      cons: [
        'Requires good self-awareness',
        'Complex for beginners'
      ],
      injuryModifications: {
        useMinimalVolume: true,
        startAtMEV: true,
        extendedDeloads: true,
        reducedFrequency: true
      }
    },

    'linear': {
      injuryAdaptability: 'excellent',
      volumeControl: true,
      exerciseFlexibility: 'high',
      intensityControl: true,
      pros: [
        'Simple progression model',
        'Easy to modify loads',
        'Great for rehab transitions',
        'Predictable programming'
      ],
      cons: [
        'May progress too slowly for some',
        'Less variety'
      ],
      injuryModifications: {
        microLoading: true,
        extendedPhases: true,
        regressionProtocol: true
      }
    },

    '531': {
      injuryAdaptability: 'moderate',
      volumeControl: false,
      exerciseFlexibility: 'moderate',
      intensityControl: false,
      pros: [
        'SubMax training good for injuries',
        'Flexible assistance work',
        'Built-in progression'
      ],
      cons: [
        'Fixed percentages difficult to modify',
        'May be too much volume',
        'Limited exercise substitution for main lifts'
      ],
      injuryModifications: {
        trainingMaxReduction: 0.8,
        limitedJokerSets: true,
        modifiedTemplates: ['5s_PRO', 'FSL_reduced'],
        assistanceOnly: 'option_for_severe'
      }
    },

    'josh_bryant': {
      injuryAdaptability: 'good',
      volumeControl: true,
      exerciseFlexibility: 'high',
      intensityControl: true,
      pros: [
        'PHA reduces local fatigue',
        'Flexible programming',
        'Body composition focus good for deload'
      ],
      cons: [
        'High volume might be problematic',
        'Intensity techniques risky'
      ],
      injuryModifications: {
        reducedIntensityTechniques: true,
        modifiedPHA: true,
        extendedRest: true
      }
    }
  };

  // Comprehensive injury screening questionnaire for algorithmic processing
  const injuryQuestions = {
    // 1️⃣ GENERAL INJURY STATUS
    generalStatus: {
      question: "Current Injury Status:",
      type: "radio",
      options: [
        { value: "none", label: "No current injuries", intensityCap: 100, volumeMultiplier: 1.0 },
        { value: "minor", label: "Minor discomfort (can train with modifications)", intensityCap: 85, volumeMultiplier: 0.9 },
        { value: "active", label: "Active injury (under professional care)", intensityCap: 60, volumeMultiplier: 0.6 },
        { value: "post_rehab", label: "Post-rehab (cleared with restrictions)", intensityCap: 75, volumeMultiplier: 0.7 },
        { value: "chronic", label: "Chronic condition (ongoing management)", intensityCap: 80, volumeMultiplier: 0.8 }
      ]
    },

    // 2️⃣ INJURY LOCATION MATRIX (Enhanced)
    injuryLocations: {
      question: "Select ALL current/recent injury areas:",
      type: "checkbox",
      options: [
        {
          value: "neck",
          label: "Neck/Cervical",
          injuryType: 'cervical_dysfunction',
          excludes: ["overhead_press", "heavy_shrugs", "behind_neck_movements"],
          modifications: { 'shoulder_press': 'seated_support', 'rows': 'light_weight_only' }
        },
        {
          value: "shoulder_left",
          label: "Shoulder (Left)",
          injuryType: 'shoulder_impingement',
          excludes: ["overhead_press", "lateral_raises", "behind_neck_press"],
          modifications: { 'bench_press': 'reduce_rom', 'shoulder_press': 'neutral_grip_45deg' }
        },
        {
          value: "shoulder_right",
          label: "Shoulder (Right)",
          injuryType: 'shoulder_impingement',
          excludes: ["overhead_press", "lateral_raises", "behind_neck_press"],
          modifications: { 'bench_press': 'reduce_rom', 'shoulder_press': 'neutral_grip_45deg' }
        },
        {
          value: "lower_back",
          label: "Lower Back",
          injuryType: 'lower_back_flexion',
          excludes: ["conventional_deadlift", "good_mornings", "bent_over_rows"],
          modifications: { 'deadlift': 'sumo_or_trap_bar', 'rows': 'chest_supported', 'squats': 'high_bar' }
        },
        {
          value: "knee_left",
          label: "Knee (Left)",
          injuryType: 'knee_patellofemoral',
          excludes: ["deep_squats", "lunges", "jumping"],
          modifications: { 'squats': 'partial_rom_90deg', 'leg_press': 'limited_flexion' }
        },
        {
          value: "knee_right",
          label: "Knee (Right)",
          injuryType: 'knee_patellofemoral',
          excludes: ["deep_squats", "lunges", "jumping"],
          modifications: { 'squats': 'partial_rom_90deg', 'leg_press': 'limited_flexion' }
        }
      ]
    },

    // 3️⃣ PAIN SCALE ASSESSMENT (Enhanced)
    painScale: {
      question: "Rate pain during training (0-10):",
      type: "radio",
      options: [
        { value: "0-1", label: "0-1 (No pain)", modifier: 1.0, action: "proceed", monitoring: "standard" },
        { value: "2-3", label: "2-3 (Mild discomfort)", modifier: 0.95, action: "proceed_caution", monitoring: "weekly" },
        { value: "4-5", label: "4-5 (Moderate, manageable)", modifier: 0.7, action: "modify_load", monitoring: "daily" },
        { value: "6-7", label: "6-7 (Significant, limiting)", modifier: 0.5, action: "refer_out", monitoring: "session" },
        { value: "8-10", label: "8-10 (Severe, stop training)", modifier: 0.0, action: "medical_clearance", monitoring: "continuous" }
      ]
    },

    // 4️⃣ MOVEMENT LIMITATIONS (Enhanced)
    movementLimitations: {
      question: "Which movements cause discomfort?",
      type: "checkbox",
      options: [
        { value: "overhead_pressing", label: "Overhead pressing", pattern: "vertical_push", severity: 'moderate' },
        { value: "horizontal_pressing", label: "Horizontal pressing", pattern: "horizontal_push", severity: 'mild' },
        { value: "vertical_pulling", label: "Vertical pulling", pattern: "vertical_pull", severity: 'mild' },
        { value: "horizontal_pulling", label: "Horizontal pulling", pattern: "horizontal_pull", severity: 'mild' },
        { value: "squatting", label: "Squatting", pattern: "squat", severity: 'moderate' },
        { value: "hip_hinging", label: "Hip hinging", pattern: "hinge", severity: 'moderate' },
        { value: "lunging", label: "Lunging", pattern: "lunge", severity: 'mild' },
        { value: "rotation", label: "Rotation", pattern: "rotation", severity: 'moderate' },
        { value: "loaded_carries", label: "Loaded carries", pattern: "carry", severity: 'mild' }
      ]
    },

    // 5️⃣ INJURY TIMELINE (Enhanced)
    injuryTimeline: {
      question: "When did injury occur?",
      type: "radio",
      options: [
        { value: "current", label: "Current (0-2 weeks)", progressionRate: 0.5, phase: 'acute', protocol: 'week1_4' },
        { value: "recent", label: "Recent (2-6 weeks)", progressionRate: 0.7, phase: 'subacute', protocol: 'week5_8' },
        { value: "subacute", label: "Subacute (6-12 weeks)", progressionRate: 0.85, phase: 'chronic', protocol: 'week9_12' },
        { value: "chronic", label: "Chronic (3+ months)", progressionRate: 0.9, phase: 'stable', protocol: 'week13_plus' },
        { value: "historical", label: "Historical (fully resolved)", progressionRate: 1.0, phase: 'resolved', protocol: 'week13_plus' }
      ]
    },

    // 6️⃣ PROFESSIONAL CLEARANCE
    professionalClearance: {
      question: "Medical professional status:",
      type: "radio",
      options: [
        { value: "not_seen", label: "Not seen", clearance: "self_managed", systemRestrictions: [] },
        { value: "in_treatment", label: "Currently in treatment", clearance: "restricted", systemRestrictions: ['high_intensity'] },
        { value: "cleared_restricted", label: "Cleared with restrictions", clearance: "modified", systemRestrictions: ['full_intensity'] },
        { value: "fully_cleared", label: "Fully cleared", clearance: "full", systemRestrictions: [] },
        { value: "awaiting", label: "Awaiting clearance", clearance: "hold", systemRestrictions: ['all_systems'] }
      ]
    },

    // 7️⃣ RECOVERY STATUS (Enhanced) — duplicate removed below

    // 7️⃣ LOWER BACK SPECIFIC
    lowerBackSpecific: {
      question: "Lower back symptoms:",
      type: "radio",
      condition: "lower_back", // Only show if lower back selected
      options: [
        { value: "no_issues", label: "No issues", restrictions: [] },
        { value: "morning_stiffness", label: "Morning stiffness only", restrictions: ["extended_warmup"] },
        { value: "flexion_pain", label: "Pain with flexion", restrictions: ["deadlifts", "rows"] },
        { value: "extension_pain", label: "Pain with extension", restrictions: ["overhead", "back_extensions"] },
        { value: "radiating", label: "Radiating symptoms", restrictions: ["all_spinal_loading"] }
      ]
    },

    // 8️⃣ SHOULDER SPECIFIC
    shoulderSpecific: {
      question: "Shoulder symptoms:",
      type: "radio",
      condition: "shoulder", // Only show if shoulder selected
      options: [
        { value: "no_issues", label: "No issues", restrictions: [] },
        { value: "front_pain", label: "Front of shoulder pain", restrictions: ["bench_press", "dips"] },
        { value: "side_pain", label: "Side (impingement) pain", restrictions: ["lateral_raises", "overhead"] },
        { value: "instability", label: "Instability feeling", restrictions: ["heavy_pressing", "unstable_surface"] },
        { value: "frozen", label: "Frozen/restricted ROM", restrictions: ["full_rom", "overhead"] }
      ]
    },

    // 9️⃣ KNEE SPECIFIC
    kneeSpecific: {
      question: "Knee symptoms:",
      type: "radio",
      condition: "knee", // Only show if knee selected
      options: [
        { value: "no_issues", label: "No issues", restrictions: [] },
        { value: "under_kneecap", label: "Pain under kneecap", restrictions: ["deep_squats", "lunges"] },
        { value: "inside_knee", label: "Inside knee pain", restrictions: ["wide_stance", "lateral_movements"] },
        { value: "outside_knee", label: "Outside knee pain", restrictions: ["narrow_stance", "adduction"] },
        { value: "behind_knee", label: "Behind knee pain", restrictions: ["hamstring_work", "deep_flexion"] },
        { value: "instability", label: "Instability/giving way", restrictions: ["single_leg", "plyometrics"] }
      ]
    },

    // 🔟 RECOVERY STATUS
    recoveryStatus: {
      question: "Recovery from injury:",
      type: "radio",
      options: [
        { value: "0-25", label: "0-25% recovered", volumeMultiplier: 0.4 },
        { value: "25-50", label: "25-50% recovered", volumeMultiplier: 0.5 },
        { value: "50-75", label: "50-75% recovered", volumeMultiplier: 0.6 },
        { value: "75-90", label: "75-90% recovered", volumeMultiplier: 0.8 },
        { value: "90-100", label: "90-100% recovered", volumeMultiplier: 1.0 }
      ]
    }
  };

  const handleResponseChange = (questionKey, value, isMultiple = false) => {
    let newResponses = { ...responses };

    if (isMultiple) {
      // Handle checkbox (multiple selection)
      if (!newResponses[questionKey]) {
        newResponses[questionKey] = [];
      }

      if (newResponses[questionKey].includes(value)) {
        newResponses[questionKey] = newResponses[questionKey].filter(v => v !== value);
      } else {
        newResponses[questionKey] = [...newResponses[questionKey], value];
      }
    } else {
      // Handle radio (single selection)
      newResponses[questionKey] = value;
    }

    setResponses(newResponses);
    updateAlgorithmicResults(newResponses);
  };

  const updateAlgorithmicResults = (currentResponses) => {
    const algorithmicResults = generateAlgorithmicResults(currentResponses);

    actions.updateInjuryScreen({
      responses: currentResponses,
      algorithmicResults,
      timestamp: new Date().toISOString()
    });
  };

  const generateAlgorithmicResults = (responses) => {
    // Initialize base results
    const results = {
      volumeMultiplier: 1.0,
      intensityCap: 100,
      excludedPatterns: [],
      excludedExercises: [],
      exerciseModifications: {},
      progressionRate: 1.0,
      warmupExtension: 0,
      restMultiplier: 1.0,
      specialRestrictions: [],
      clearanceLevel: "full",
      overallRisk: "low",
      returnToTrainingPhase: "phase4_optimization",
      systemCompatibility: {},
      monitoringProtocol: "standard"
    };

    // ============================================
    // MULTI-INJURY COMPOUND ALGORITHM
    // ============================================

    // Collect active injuries based on responses
    const activeInjuries = [];

    // Map injury locations to injury types
    if (responses.injuryLocations && responses.injuryLocations.length > 0) {
      responses.injuryLocations.forEach(location => {
        const injuryOption = injuryQuestions.injuryLocations.options.find(opt => opt.value === location);
        if (injuryOption && injuryOption.injuryType) {
          activeInjuries.push(injuryOption.injuryType);
        }
      });
    }

    // Add specific condition injuries
    if (responses.lowerBackSpecific && responses.lowerBackSpecific !== 'no_issues') {
      if (responses.lowerBackSpecific === 'flexion_pain') {
        activeInjuries.push('lower_back_flexion_intolerant');
      } else if (responses.lowerBackSpecific === 'extension_pain') {
        activeInjuries.push('lower_back_extension_intolerant');
      }
    }

    if (responses.shoulderSpecific && responses.shoulderSpecific !== 'no_issues') {
      if (responses.shoulderSpecific === 'side_pain') {
        activeInjuries.push('shoulder_impingement');
      } else if (responses.shoulderSpecific === 'instability') {
        activeInjuries.push('shoulder_instability');
      }
    }

    if (responses.kneeSpecific && responses.kneeSpecific !== 'no_issues') {
      if (responses.kneeSpecific === 'under_kneecap') {
        activeInjuries.push('knee_patellofemoral');
      }
    }

    // Process multiple injuries using most restrictive approach
    if (activeInjuries.length > 0) {
      const injuryData = activeInjuries.map(injury => injuryExerciseMatrix[injury]).filter(Boolean);

      if (injuryData.length > 0) {
        // Take most restrictive for safety
        results.volumeMultiplier = Math.min(...injuryData.map(i => i.volumeReduction || 1.0));
        results.intensityCap = Math.min(...injuryData.map(i => i.intensityCap || 100));

        // Combine all exclusions
        const allExclusions = injuryData.flatMap(i => i.exclude || []);
        results.excludedExercises = [...new Set(allExclusions)];

        // Merge exercise modifications (most restrictive wins)
        injuryData.forEach(injury => {
          if (injury.modify) {
            Object.entries(injury.modify).forEach(([exercise, modification]) => {
              if (!results.exerciseModifications[exercise] ||
                (injury.volumeReduction < (results.exerciseModifications[exercise].sourceInjuryVolumeReduction || 1.0))) {
                results.exerciseModifications[exercise] = {
                  ...modification,
                  sourceInjury: injury,
                  sourceInjuryVolumeReduction: injury.volumeReduction
                };
              }
            });
          }
        });

        // Calculate compound risk
        const riskScore = activeInjuries.length * 0.3 +
          (activeInjuries.includes('lower_back_flexion_intolerant') ? 0.3 : 0) +
          (activeInjuries.includes('shoulder_instability') ? 0.2 : 0);

        if (riskScore >= 0.7) results.overallRisk = 'high';
        else if (riskScore >= 0.4) results.overallRisk = 'moderate';
        else results.overallRisk = 'low';

        // System compatibility analysis
        ['rp', 'linear', '531', 'josh_bryant'].forEach(system => {
          const compatibilityScores = injuryData.map(injury => {
            const adaptability = injury.adaptability?.[system] || 'moderate';
            return adaptability === 'excellent' ? 3 : adaptability === 'good' ? 2 : adaptability === 'moderate' ? 1 : 0;
          });

          const avgScore = compatibilityScores.reduce((a, b) => a + b, 0) / compatibilityScores.length;
          results.systemCompatibility[system] = {
            score: avgScore,
            rating: avgScore >= 2.5 ? 'excellent' : avgScore >= 1.5 ? 'good' : avgScore >= 0.5 ? 'moderate' : 'poor',
            modifications: systemInjuryCompatibility[system]?.injuryModifications || {}
          };
        });
      }
    }

    // ============================================
    // ENHANCED RESPONSE PROCESSING
    // ============================================

    // Process General Status with enhanced logic
    if (responses.generalStatus) {
      const option = injuryQuestions.generalStatus.options.find(opt => opt.value === responses.generalStatus);
      if (option) {
        results.intensityCap = Math.min(results.intensityCap, option.intensityCap);
        results.volumeMultiplier *= option.volumeMultiplier;
      }
    }

    // Process Pain Scale with monitoring protocol
    if (responses.painScale) {
      const option = injuryQuestions.painScale.options.find(opt => opt.value === responses.painScale);
      if (option) {
        results.volumeMultiplier *= option.modifier;
        results.monitoringProtocol = option.monitoring || 'standard';

        if (option.action === "refer_out" || option.action === "medical_clearance") {
          results.clearanceLevel = "medical_required";
        }
      }
    }

    // Process Movement Limitations
    if (responses.movementLimitations && responses.movementLimitations.length > 0) {
      responses.movementLimitations.forEach(movement => {
        const option = injuryQuestions.movementLimitations.options.find(opt => opt.value === movement);
        if (option) {
          results.excludedPatterns.push(option.pattern);
        }
      });
    }

    // Process Timeline for return protocol
    if (responses.injuryTimeline) {
      const option = injuryQuestions.injuryTimeline.options.find(opt => opt.value === responses.injuryTimeline);
      if (option) {
        results.progressionRate = option.progressionRate;
        results.returnToTrainingPhase = option.protocol || 'phase4_optimization';
      }
    }

    // Process Professional Clearance
    if (responses.professionalClearance) {
      const option = injuryQuestions.professionalClearance.options.find(opt => opt.value === responses.professionalClearance);
      if (option) {
        results.clearanceLevel = option.clearance;
        if (option.systemRestrictions) {
          results.specialRestrictions.push(...option.systemRestrictions);
        }
      }
    }

    // Process Recovery Status with return protocol
    if (responses.recoveryStatus) {
      const option = injuryQuestions.recoveryStatus.options.find(opt => opt.value === responses.recoveryStatus);
      if (option) {
        results.volumeMultiplier *= option.volumeMultiplier;
        results.returnToTrainingPhase = option.returnProtocol || 'phase4_optimization';
      }
    }

    // ============================================
    // FINAL RISK AND PROTOCOL CALCULATIONS
    // ============================================

    // Recalculate overall risk considering all factors
    if (results.intensityCap < 70 || results.volumeMultiplier < 0.6 || results.clearanceLevel === 'medical_required') {
      results.overallRisk = "high";
    } else if (results.intensityCap < 85 || results.volumeMultiplier < 0.8) {
      results.overallRisk = "moderate";
    }

    // Adjust protocols based on risk
    if (results.overallRisk === "high") {
      results.warmupExtension = 15;
      results.restMultiplier = 1.5;
      results.monitoringProtocol = "daily";
    } else if (results.overallRisk === "moderate") {
      results.warmupExtension = 10;
      results.restMultiplier = 1.25;
      results.monitoringProtocol = "weekly";
    }

    // Add return to training phase details
    if (returnToTrainingProtocol.phases[results.returnToTrainingPhase]) {
      results.returnToTrainingDetails = returnToTrainingProtocol.phases[results.returnToTrainingPhase];
    }

    // Ensure minimum values
    results.volumeMultiplier = Math.max(results.volumeMultiplier, 0.2);
    results.intensityCap = Math.max(results.intensityCap, 40);

    return results;
  };

  const shouldShowQuestion = (questionKey) => {
    const question = injuryQuestions[questionKey];
    if (!question.condition) return true;

    // Check if condition is met (e.g., only show lower back specific if lower back is selected)
    if (question.condition === "lower_back") {
      return responses.injuryLocations && responses.injuryLocations.includes("lower_back");
    }
    if (question.condition === "shoulder") {
      return responses.injuryLocations && (
        responses.injuryLocations.includes("shoulder_left") ||
        responses.injuryLocations.includes("shoulder_right")
      );
    }
    if (question.condition === "knee") {
      return responses.injuryLocations && (
        responses.injuryLocations.includes("knee_left") ||
        responses.injuryLocations.includes("knee_right")
      );
    }

    return true;
  };

  const renderQuestion = (questionKey, question) => {
    return (
      <div key={questionKey} className="injury-question">
        <h4 className="question-title">{question.question}</h4>
        <div className={`question-options ${question.type === "checkbox" ? "checkbox-grid" : "radio-list"}`}>
          {question.options.map((option, index) => (
            <label key={option.value} className="option-label">
              <input
                type={question.type}
                name={questionKey}
                value={option.value}
                checked={
                  question.type === "checkbox"
                    ? (responses[questionKey] || []).includes(option.value)
                    : responses[questionKey] === option.value
                }
                onChange={(e) => handleResponseChange(questionKey, option.value, question.type === "checkbox")}
              />
              <span className="option-text">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="injury-screening-step">
      <div className="step-header">
        <h2>🏥 Algorithmic Injury Screening</h2>
        <p className="step-description">
          Structured assessment for automated program modification
        </p>
      </div>

      <div className="injury-questionnaire">
        {Object.entries(injuryQuestions).map(([questionKey, question]) =>
          shouldShowQuestion(questionKey) && renderQuestion(questionKey, question)
        )}
      </div>

      {/* Algorithmic Results Summary */}
      {state.injuryScreen?.algorithmicResults && (
        <div className="content-section">
          <h3>💻 Algorithm Output</h3>
          <div className="algorithm-results">

            <div className="results-grid">
              <div className="result-section risk-overview">
                <h5>Risk Assessment</h5>
                <div className={`risk-level ${state.injuryScreen.algorithmicResults.overallRisk}`}>
                  Risk Level: {state.injuryScreen.algorithmicResults.overallRisk.charAt(0).toUpperCase() + state.injuryScreen.algorithmicResults.overallRisk.slice(1)}
                </div>
                <div className="clearance-level">
                  Clearance: {state.injuryScreen.algorithmicResults.clearanceLevel}
                </div>
                <div className="monitoring-protocol">
                  Monitoring: {state.injuryScreen.algorithmicResults.monitoringProtocol}
                </div>
              </div>

              <div className="result-section training-parameters">
                <h5>Training Parameters</h5>
                <div className="parameter">
                  <span>Volume Multiplier:</span>
                  <span className="value">{(state.injuryScreen.algorithmicResults.volumeMultiplier * 100).toFixed(0)}%</span>
                </div>
                <div className="parameter">
                  <span>Intensity Cap:</span>
                  <span className="value">{state.injuryScreen.algorithmicResults.intensityCap}%</span>
                </div>
                <div className="parameter">
                  <span>Progression Rate:</span>
                  <span className="value">{(state.injuryScreen.algorithmicResults.progressionRate * 100).toFixed(0)}%</span>
                </div>
                <div className="parameter">
                  <span>Rest Multiplier:</span>
                  <span className="value">{state.injuryScreen.algorithmicResults.restMultiplier}x</span>
                </div>
                <div className="parameter">
                  <span>Warmup Extension:</span>
                  <span className="value">+{state.injuryScreen.algorithmicResults.warmupExtension} min</span>
                </div>
              </div>

              <div className="result-section return-protocol">
                <h5>Return to Training Protocol</h5>
                <div className="protocol-phase">
                  <strong>Current Phase: {state.injuryScreen.algorithmicResults.returnToTrainingPhase?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
                </div>
                {state.injuryScreen.algorithmicResults.returnToTrainingDetails && (
                  <div className="protocol-details">
                    <div className="parameter">
                      <span>Duration:</span>
                      <span className="value">{state.injuryScreen.algorithmicResults.returnToTrainingDetails.duration}</span>
                    </div>
                    <div className="parameter">
                      <span>Volume Target:</span>
                      <span className="value">{state.injuryScreen.algorithmicResults.returnToTrainingDetails.volumeRange}</span>
                    </div>
                    <div className="parameter">
                      <span>Intensity Target:</span>
                      <span className="value">{state.injuryScreen.algorithmicResults.returnToTrainingDetails.intensityRange}</span>
                    </div>
                  </div>
                )}
              </div>

              {state.injuryScreen.algorithmicResults.systemCompatibility && Object.keys(state.injuryScreen.algorithmicResults.systemCompatibility).length > 0 && (
                <div className="result-section system-compatibility">
                  <h5>System Compatibility</h5>
                  {Object.entries(state.injuryScreen.algorithmicResults.systemCompatibility).map(([system, data]) => (
                    <div key={system} className="compatibility-item">
                      <span className="system-name">{system.toUpperCase()}:</span>
                      <span className={`compatibility-rating ${data.rating}`}>
                        {data.rating} ({data.score.toFixed(1)}/3.0)
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {state.injuryScreen.algorithmicResults.excludedExercises && state.injuryScreen.algorithmicResults.excludedExercises.length > 0 && (
                <div className="result-section excluded-exercises">
                  <h5>Exercise Exclusions</h5>
                  <div className="exclusion-list">
                    {state.injuryScreen.algorithmicResults.excludedExercises.map((exercise, index) => (
                      <span key={index} className="exclusion-tag">{exercise}</span>
                    ))}
                  </div>
                </div>
              )}

              {state.injuryScreen.algorithmicResults.exerciseModifications && Object.keys(state.injuryScreen.algorithmicResults.exerciseModifications).length > 0 && (
                <div className="result-section exercise-modifications">
                  <h5>Exercise Modifications</h5>
                  {Object.entries(state.injuryScreen.algorithmicResults.exerciseModifications).map(([exercise, mod]) => (
                    <div key={exercise} className="modification-item">
                      <strong>{exercise}:</strong>
                      <div className="modification-details">
                        {mod.rom_restriction && <span className="mod-tag">ROM: {mod.rom_restriction}</span>}
                        {mod.load_restriction && <span className="mod-tag">Load: {mod.load_restriction}</span>}
                        {mod.volume_reduction && <span className="mod-tag">Volume: -{((1 - mod.volume_reduction) * 100).toFixed(0)}%</span>}
                        {mod.tempo_modification && <span className="mod-tag">Tempo: {mod.tempo_modification}</span>}
                        {mod.special_equipment && <span className="mod-tag">Equipment: {mod.special_equipment}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {state.injuryScreen.algorithmicResults.excludedPatterns && state.injuryScreen.algorithmicResults.excludedPatterns.length > 0 && (
                <div className="result-section excluded-patterns">
                  <h5>Movement Pattern Restrictions</h5>
                  <div className="pattern-list">
                    {state.injuryScreen.algorithmicResults.excludedPatterns.map((pattern, index) => (
                      <span key={index} className="pattern-tag">{pattern}</span>
                    ))}
                  </div>
                </div>
              )}

              {state.injuryScreen.algorithmicResults.specialRestrictions && state.injuryScreen.algorithmicResults.specialRestrictions.length > 0 && (
                <div className="result-section special-restrictions">
                  <h5>Special Restrictions</h5>
                  <div className="restriction-list">
                    {state.injuryScreen.algorithmicResults.specialRestrictions.map((restriction, index) => (
                      <div key={index} className="restriction-item">{restriction}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="step-navigation">
        <button
          className="btn-secondary"
          onClick={() => actions.setCurrentStep(3)}
        >
          ← Back
        </button>

        <button
          className="btn-primary"
          onClick={() => actions.setCurrentStep(5)}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default InjuryScreeningStep;
