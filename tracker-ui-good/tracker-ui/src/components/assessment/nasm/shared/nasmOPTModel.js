/**
 * NASM OPT Model Implementation for 4-Phase PowerHouse Workflow
 * 
 * Complete NASM Optimum Performance Training model including:
 * - Postural distortion patterns and muscle imbalances
 * - Movement assessment protocols (Overhead Squat, Single-leg, Push/Pull)
 * - Corrective exercise prescriptions
 * - OPT phase progressions with acute variables
 * - Population-specific modifications
 * - Performance testing protocols
 */

// ===== POSTURAL DISTORTION PATTERNS (NASM Ch. 6) =====

export const nasmPosturalDistortions = {
    'pronation_distortion': {
        name: 'Pronation Distortion Syndrome',
        description: 'Foot pronation leading to kinetic chain compensations',
        shortOveractive: [
            'gastrocnemius', 'soleus', 'peroneals', 'adductors',
            'hip_flexor_complex', 'biceps_femoris_short_head'
        ],
        lengthenedUnderactive: [
            'anterior_tibialis', 'posterior_tibialis', 'vastus_medialis',
            'gluteus_medius', 'gluteus_maximus', 'hip_external_rotators'
        ],
        alteredMechanics: [
            'foot_pronation', 'knee_adduction', 'knee_internal_rotation',
            'foot_external_rotation', 'decreased_ankle_dorsiflexion', 'decreased_inversion'
        ],
        commonInjuries: [
            'plantar_fasciitis', 'posterior_tibialis_tendonitis', 'shin_splints',
            'patellar_tendonitis', 'low_back_pain'
        ],
        correctiveStrategy: {
            smr: ['calves', 'peroneals', 'biceps_femoris'],
            staticStretch: ['calf_stretch', 'standing_hip_flexor'],
            activation: ['single_leg_balance_reach', 'tube_walking']
        }
    },

    'lower_crossed': {
        name: 'Lower Crossed Syndrome',
        description: 'Hip flexor tightness and glute weakness pattern',
        shortOveractive: [
            'gastrocnemius', 'soleus', 'hip_flexor_complex', 'adductors',
            'latissimus_dorsi', 'erector_spinae'
        ],
        lengthenedUnderactive: [
            'anterior_tibialis', 'posterior_tibialis', 'gluteus_maximus',
            'gluteus_medius', 'transversus_abdominis', 'internal_oblique'
        ],
        alteredMechanics: [
            'increased_lumbar_extension', 'decreased_hip_extension'
        ],
        commonInjuries: [
            'hamstring_strains', 'anterior_knee_pain', 'low_back_pain'
        ],
        correctiveStrategy: {
            smr: ['hip_flexors', 'quads', 'lats'],
            staticStretch: ['hip_flexor_stretch', 'lat_stretch_on_ball'],
            activation: ['glute_bridges', 'quadruped_arm_opposite_leg']
        }
    },

    'upper_crossed': {
        name: 'Upper Crossed Syndrome',
        description: 'Forward head posture and rounded shoulders',
        shortOveractive: [
            'upper_trapezius', 'levator_scapulae', 'sternocleidomastoid', 'scalenes',
            'latissimus_dorsi', 'teres_major', 'subscapularis', 'pectorals'
        ],
        lengthenedUnderactive: [
            'deep_cervical_flexors', 'serratus_anterior', 'rhomboids',
            'mid_trapezius', 'lower_trapezius', 'teres_minor', 'infraspinatus'
        ],
        alteredMechanics: [
            'increased_cervical_extension', 'scapular_protraction', 'scapular_elevation',
            'decreased_shoulder_extension', 'decreased_external_rotation'
        ],
        commonInjuries: [
            'headaches', 'biceps_tendonitis', 'rotator_cuff_impingement',
            'thoracic_outlet_syndrome'
        ],
        correctiveStrategy: {
            smr: ['upper_traps', 'lats', 'pectorals'],
            staticStretch: ['upper_trap_stretch', 'pectoral_wall_stretch'],
            activation: ['ball_cobra', 'chin_tuck', 'squat_to_row']
        }
    }
};

// ===== MOVEMENT ASSESSMENT PROTOCOLS =====

export const nasmMovementAssessments = {
    'overhead_squat': {
        name: 'Overhead Squat Assessment',
        purpose: 'Assess dynamic flexibility, core strength, balance, and neuromuscular control',
        procedure: {
            setup: 'Feet shoulder-width apart, toes forward, shoes off preferred',
            position: 'Arms overhead, elbows fully extended, arms bisect torso',
            movement: 'Squat to chair height and return, perform 5 reps',
            views: ['anterior', 'lateral', 'posterior']
        },
        compensations: {
            'feet_flatten_turn_out': {
                overactive: ['soleus', 'lateral_gastrocnemius', 'biceps_femoris_short'],
                underactive: ['medial_gastrocnemius', 'medial_hamstrings', 'gracilis', 'sartorius'],
                corrections: {
                    smr: ['calves', 'biceps_femoris'],
                    stretch: ['calf_stretch', 'hamstring_stretch'],
                    activation: ['single_leg_balance_reach']
                }
            },
            'knees_move_inward': {
                overactive: ['adductors', 'tfl', 'vastus_lateralis', 'biceps_femoris_short'],
                underactive: ['gluteus_medius', 'gluteus_maximus', 'vastus_medialis_oblique'],
                corrections: {
                    smr: ['adductors', 'tfl_it_band'],
                    stretch: ['adductor_stretch', 'tfl_stretch'],
                    activation: ['tube_walking_side_to_side', 'clamshells']
                }
            },
            'excessive_forward_lean': {
                overactive: ['soleus', 'gastrocnemius', 'hip_flexor_complex', 'abdominal_complex'],
                underactive: ['anterior_tibialis', 'gluteus_maximus', 'erector_spinae'],
                corrections: {
                    smr: ['calves', 'quads'],
                    stretch: ['calf_stretch', 'hip_flexor_stretch'],
                    activation: ['quadruped_arm_opposite_leg', 'ball_wall_squat']
                }
            },
            'low_back_arch': {
                overactive: ['hip_flexor_complex', 'erector_spinae', 'latissimus_dorsi'],
                underactive: ['gluteus_maximus', 'hamstrings', 'intrinsic_core_stabilizers'],
                corrections: {
                    smr: ['quads', 'lats'],
                    stretch: ['hip_flexor_stretch', 'lat_stretch_on_ball'],
                    activation: ['quadruped_arm_opposite_leg', 'ball_wall_squat']
                }
            },
            'arms_fall_forward': {
                overactive: ['latissimus_dorsi', 'teres_major', 'pectorals'],
                underactive: ['mid_trapezius', 'lower_trapezius', 'rhomboids', 'rotator_cuff'],
                corrections: {
                    smr: ['thoracic_spine', 'lats'],
                    stretch: ['lat_stretch_on_ball', 'pectoral_wall_stretch'],
                    activation: ['squat_to_row']
                }
            }
        }
    },

    'single_leg_squat': {
        name: 'Single-Leg Squat Assessment',
        purpose: 'Assess unilateral lower extremity strength and stability',
        procedure: {
            setup: 'Hands on hips, stance foot points straight, LPHC neutral',
            movement: 'Squat to comfortable level and return, ≤5 reps per leg',
            observation: 'Knee tracking and pelvic stability'
        },
        compensations: {
            'knee_moves_inward': {
                overactive: ['adductors', 'biceps_femoris_short', 'tfl', 'vastus_lateralis'],
                underactive: ['gluteus_medius', 'gluteus_maximus', 'vastus_medialis_oblique'],
                corrections: {
                    smr: ['adductors', 'tfl_it_band'],
                    stretch: ['adductor_stretch', 'tfl_stretch'],
                    activation: ['tube_walking', 'single_leg_glute_bridge']
                }
            }
        }
    },

    'pushing_assessment': {
        name: 'Pushing Assessment',
        purpose: 'Assess upper body pushing movement patterns',
        procedure: {
            setup: 'Split stance, abdomen drawn-in',
            movement: 'Press cable/band handles forward up to 20 reps',
            observation: 'Maintain neutral spine and level shoulders'
        },
        compensations: {
            'low_back_arch': {
                overactive: ['hip_flexors', 'erector_spinae'],
                underactive: ['intrinsic_core_stabilizers'],
                corrections: {
                    smr: ['hip_flexors'],
                    stretch: ['hip_flexor_stretch'],
                    activation: ['planks', 'quadruped_arm_opposite_leg']
                }
            },
            'shoulder_elevation': {
                overactive: ['upper_trapezius', 'levator_scapulae'],
                underactive: ['mid_trapezius', 'lower_trapezius'],
                corrections: {
                    smr: ['upper_trapezius'],
                    stretch: ['upper_trap_stretch'],
                    activation: ['ball_cobra']
                }
            }
        }
    },

    'pulling_assessment': {
        name: 'Pulling Assessment',
        purpose: 'Assess upper body pulling movement patterns',
        procedure: {
            setup: 'Split stance, abdomen drawn-in',
            movement: 'Row handles toward torso up to 20 reps',
            observation: 'Spine alignment and scapular movement'
        },
        compensations: {
            'low_back_arch': {
                overactive: ['hip_flexors', 'latissimus_dorsi'],
                underactive: ['intrinsic_core_stabilizers', 'gluteus_maximus'],
                corrections: {
                    smr: ['hip_flexors', 'lats'],
                    stretch: ['hip_flexor_stretch', 'lat_stretch'],
                    activation: ['planks', 'glute_bridges']
                }
            },
            'head_forward': {
                overactive: ['sternocleidomastoid', 'scalenes'],
                underactive: ['deep_cervical_flexors'],
                corrections: {
                    smr: ['upper_traps'],
                    stretch: ['levator_scapulae_stretch'],
                    activation: ['chin_tuck']
                }
            }
        }
    }
};

// ===== POPULATION-SPECIFIC MODIFICATIONS =====

export const nasmPopulationModifications = {
    'pregnancy_2nd_3rd_trimester': {
        assessmentModifications: [
            'avoid_power_speed_tests',
            'modify_pushups_to_knees',
            'substitute_balance_for_single_leg_squat',
            'reduce_overhead_squat_depth'
        ],
        exerciseModifications: [
            'avoid_supine_after_16_weeks',
            'monitor_diastasis_recti',
            'avoid_valsalva_maneuver',
            'modify_core_exercises'
        ]
    },
    'obesity': {
        assessmentModifications: [
            'use_rockport_walk_test',
            'substitute_balance_for_single_leg_squat',
            'pushups_on_bench_or_knees',
            'monitor_joint_stress'
        ],
        exerciseModifications: [
            'low_impact_cardio',
            'supported_movements',
            'avoid_high_intensity_initially'
        ]
    },
    'low_back_pain_history': {
        assessmentModifications: [
            'monitor_pelvic_rotation',
            'pushups_from_knees_or_bench',
            'assess_movement_quality_first'
        ],
        exerciseModifications: [
            'emphasize_core_stability',
            'avoid_spinal_flexion_under_load',
            'progress_conservatively'
        ]
    },
    'shoulder_injury_history': {
        assessmentModifications: [
            'limit_overhead_rom',
            'monitor_scapular_elevation',
            'avoid_high_stress_positions'
        ],
        exerciseModifications: [
            'emphasize_scapular_stability',
            'avoid_behind_neck_movements',
            'progress_overhead_gradually'
        ]
    }
};

// ===== PERFORMANCE ASSESSMENTS =====

export const nasmPerformanceTests = {
    'pushup_test': {
        name: 'Push-Up Test',
        purpose: 'Measure upper-body muscular endurance',
        procedure: {
            setup: 'Standard or kneeling push-up position',
            alignment: 'Ankles-knees-hips-shoulders aligned',
            protocol: 'Lower chest to fist/floor, max reps in 60s or to fatigue'
        },
        scoring: 'Rep count with form standards',
        retest: 'Expect increased rep count'
    },

    'davies_test': {
        name: 'Davies Test',
        purpose: 'Upper-extremity agility and stabilization',
        procedure: {
            setup: 'Two tape strips 36in/91cm apart, push-up plank position',
            protocol: 'Alternate hand touches across gap for 15s, 3 trials'
        },
        contraindications: 'Limited shoulder stability',
        scoring: 'Total touches recorded'
    },

    'shark_skill_test': {
        name: 'Shark Skill Test',
        purpose: 'Lower-extremity agility and neuromuscular control',
        procedure: {
            setup: 'Single-leg stance in center of 3x3 grid',
            protocol: 'Hop through pattern, always return to center'
        },
        scoring: 'Time with 0.10s penalty per fault',
        faults: ['non-hopping leg touch', 'hands off hips', 'wrong square']
    },

    'one_rm_estimation': {
        'bench_press': {
            purpose: 'Estimate upper-body max strength',
            warmup: '8-10 reps light load',
            progression: '+5-10%/10-20lb each set, 3-5 reps, 1-2min rest',
            termination: 'At 2-10RM, use chart to predict 1RM'
        },
        'squat': {
            purpose: 'Estimate lower-body max strength',
            warmup: '8-10 reps light load',
            progression: '+10-20%/30-40lb each set, 3-5 reps, 1-2min rest',
            termination: 'At 2-10RM, use chart to predict 1RM'
        }
    }
};

// ===== FLEXIBILITY & CORRECTIVE EXERCISE PROTOCOLS =====

export const nasmFlexibilityProtocols = {
    definitions: {
        flexibility: 'Normal extensibility of soft tissue permitting full ROM',
        dynamic_rom: 'Flexibility plus neuromuscular control through motion',
        neuromuscular_efficiency: 'Nervous system coordination of agonists, antagonists, stabilizers'
    },

    mechanoreceptors: {
        muscle_spindle: {
            sensitive_to: 'Change and rate of length',
            effect: 'Triggers stretch reflex, over-activity causes micro-spasms'
        },
        golgi_tendon_organ: {
            sensitive_to: 'Tension and rate',
            effect: 'Autogenic inhibition - prolonged tension >30s relaxes muscle'
        }
    },

    continuum: {
        corrective_phase1: {
            type: 'SMR + Static stretching',
            duration: '~30s per muscle',
            purpose: 'Improve muscle imbalances and joint ROM'
        },
        active_phases2_4: {
            type: 'SMR + Active-isolated stretching',
            duration: '1-2s holds, 5-10 reps',
            purpose: 'Improve neuromuscular efficiency through motor unit recruitment'
        },
        functional_phase5: {
            type: 'SMR + Dynamic stretching',
            duration: '10-15 reps sport-specific',
            purpose: 'Prepare tissues for explosive movement'
        }
    }
};

// ===== UPDATED HRMAX FORMULA =====
export const nasmCardiorespiratoryFormulas = {
    hrmax_updated: {
        formula: 'HRmax = 208 - 0.7 × age',
        note: 'Updated from 220 - age formula for improved accuracy'
    }
};

// ===== NASM METHODOLOGY CONFIGURATION =====

export const nasmMethodologyConfig = {
    name: 'NASM OPT Model',
    description: 'Evidence-based periodization system with integrated movement assessment',
    icon: 'nasm-logo',
    features: [
        'Movement assessment-driven program design',
        '5-phase OPT model progression',
        'Goal-specific pathways',
        'Corrective exercise integration',
        'Special population adaptations'
    ],

    systemConfiguration: {
        assessmentProtocol: 'NASM Movement Screens',
        programmingModel: 'OPT Periodization',
        phaseStructure: '5-phase system',
        acuteVariables: 'NASM-specific',
        corrective: 'integrated',
        progressionModels: ['linear', 'adaptive', 'rules_engine']
    }
};

// ===== NASM GOAL PATHWAYS =====

export const nasmGoalPathways = {
    'fat_loss': {
        name: 'Body Fat Reduction',
        description: 'Maximize caloric expenditure while preserving lean mass',
        phases: ['Phase_1', 'Phase_2'],
        cycling: 'alternating',
        cardio: 'high_priority',
        optional: ['Phase_3'],
        timeline: 'Phase 1 (4 weeks) → Phase 2 (4 weeks) → repeat cycling',
        expectedOutcomes: 'Steady fat loss, improved endurance, movement quality'
    },

    'hypertrophy': {
        name: 'Muscle Hypertrophy',
        description: 'Maximize muscle growth through progressive overload',
        phases: ['Phase_1', 'Phase_2', 'Phase_3', 'Phase_4'],
        cycling: 'progressive_with_cycles',
        emphasis: 'Phase_3',
        timeline: 'Phase 1 (4w) → Phase 2 (4w) → Phase 3 (4w) → Phase 4 (4w) → cycle 2-3-4',
        expectedOutcomes: 'Increased muscle mass, strength, work capacity'
    },

    'max_strength': {
        name: 'Maximal Strength',
        description: 'Increase maximal force production and neural adaptations',
        phases: ['Phase_1', 'Phase_2', 'Phase_4'],
        cycling: 'strength_focused',
        emphasis: 'Phase_4',
        optional: ['Phase_3'],
        timeline: 'Phase 1 (4w) → Phase 2 (4w) → Phase 4 (4w) → deload → repeat',
        expectedOutcomes: 'Increased 1RM lifts, neural efficiency, power base'
    },

    'sports_performance': {
        name: 'Athletic Performance',
        description: 'Improve power, agility, and sport-specific performance',
        phases: ['Phase_1', 'Phase_2', 'Phase_5'],
        cycling: 'undulating',
        emphasis: 'Phase_5',
        optional: ['Phase_4'],
        timeline: 'Linear first 2 months → undulating weekly (1,2,5) thereafter',
        expectedOutcomes: 'Enhanced power, speed, agility, injury prevention'
    },

    'general_fitness': {
        name: 'General Fitness & Health',
        description: 'Overall health, functional movement, and fitness improvement',
        phases: ['Phase_1', 'Phase_2'],
        cycling: 'alternating',
        cardio: 'moderate_priority',
        optional: ['Phase_3'],
        timeline: 'Phase 1 (4-6w) → Phase 2 (4w) → repeat with variations',
        expectedOutcomes: 'Improved movement quality, endurance, strength, overall health'
    }
};

// ===== NASM EXPERIENCE LEVEL MAPPING =====

export const nasmExperienceMapping = {
    'beginner': {
        startingPhase: 'Phase_1',
        duration: '6-8 weeks in Phase 1',
        progression: 'Extended stabilization focus',
        modifications: 'More corrective work, slower progression',
        assessmentFrequency: 'Every 2 weeks'
    },

    'intermediate': {
        startingPhase: 'Phase_1',
        duration: '4 weeks in Phase 1',
        progression: 'Standard OPT progression',
        modifications: 'Standard acute variables',
        assessmentFrequency: 'Every 4 weeks'
    },

    'advanced': {
        startingPhase: 'Phase_1_or_2',
        duration: '2-4 weeks in Phase 1',
        progression: 'May skip stabilization if excellent movement',
        modifications: 'Can handle undulating models sooner',
        assessmentFrequency: 'Every 4-6 weeks'
    }
};

// ===== COMPLETE OPT PHASE SPECIFICATIONS =====

export const nasmOPTPhases = {
    'Phase_1': {
        name: 'Stabilization Endurance',
        level: 'Stabilization',
        acuteVariables: {
            reps: '12-20',
            sets: '1-3',
            intensity: '50-70% 1RM',
            tempo: '4/2/1 (slow)',
            rest: '0-90 seconds',
            frequency: '2-4 sessions/week'
        },
        focus: 'Improve stability, muscular endurance, neuromuscular coordination',
        exerciseSelection: {
            characteristics: 'Unstable yet controllable environments',
            examples: ['stability_ball_exercises', 'single_leg_movements', 'balance_challenges'],
            progression: 'Increase proprioceptive challenge before adding load'
        },
        duration: '4-6 weeks',
        assessmentCriteria: ['improved_balance', 'reduced_compensations', 'form_mastery'],
        cardio: {
            type: 'Stage I - Aerobic Base',
            intensity: '65-75% HRmax',
            duration: '12-20 minutes',
            progression: 'Increase duration before intensity'
        }
    },

    'Phase_2': {
        name: 'Strength Endurance',
        level: 'Strength',
        acuteVariables: {
            reps: '8-12 (strength) + 12-20 (stability)',
            sets: '2-4',
            intensity: '70-80% 1RM (strength) + bodyweight (stability)',
            tempo: '2/0/2 (strength) + 4/2/1 (stability)',
            rest: '0-60 seconds',
            frequency: '2-4 sessions/week'
        },
        focus: 'Enhance stabilization endurance and prime-mover strength',
        exerciseSelection: {
            characteristics: 'Supersets: strength exercise + stabilization exercise',
            examples: ['bench_press + stability_ball_pushup', 'leg_press + single_leg_squat'],
            progression: 'Increase weight on strength exercises, complexity on stability'
        },
        duration: '4 weeks',
        assessmentCriteria: ['strength_endurance_improved', 'superset_completion', 'form_maintained'],
        cardio: {
            type: 'Stage II - Aerobic Efficiency',
            intensity: '76-85% HRmax intervals',
            duration: '20-30 minutes',
            progression: 'Add interval complexity'
        }
    },

    'Phase_3': {
        name: 'Hypertrophy',
        level: 'Strength',
        acuteVariables: {
            reps: '6-12',
            sets: '3-5',
            intensity: '75-85% 1RM',
            tempo: '2/0/2 (moderate)',
            rest: '0-60 seconds',
            frequency: '3-6 sessions/week'
        },
        focus: 'Achieve maximal muscle growth through high volume',
        exerciseSelection: {
            characteristics: 'High volume, multiple exercises per muscle group',
            examples: ['bodybuilding_splits', 'isolation_exercises', 'machine_work'],
            progression: 'Increase volume (sets/exercises), then intensity'
        },
        duration: '4 weeks',
        assessmentCriteria: ['muscle_growth', 'volume_tolerance', 'recovery_capacity'],
        optional: true,
        applicableGoals: ['hypertrophy'],
        cardio: {
            type: 'Stage II - Optional',
            intensity: '76-85% HRmax',
            duration: '20-30 minutes',
            progression: 'Minimize to support recovery'
        }
    },

    'Phase_4': {
        name: 'Maximal Strength',
        level: 'Strength',
        acuteVariables: {
            reps: '1-5',
            sets: '4-6',
            intensity: '85-100% 1RM',
            tempo: 'X/X/X (explosive intent)',
            rest: '3-5 minutes',
            frequency: '2-4 sessions/week'
        },
        focus: 'Increase maximal force production and neural adaptations',
        exerciseSelection: {
            characteristics: 'Heavy compound lifts, maximal loads',
            examples: ['barbell_squats', 'deadlifts', 'bench_press', 'overhead_press'],
            progression: 'Increase load while maintaining form'
        },
        duration: '4 weeks',
        assessmentCriteria: ['1rm_improvements', 'neural_efficiency', 'form_under_load'],
        optional: true,
        applicableGoals: ['max_strength', 'hypertrophy', 'sports_performance'],
        cardio: {
            type: 'Stage I - Recovery focused',
            intensity: '65-75% HRmax',
            duration: '12-20 minutes',
            progression: 'Keep minimal to support strength gains'
        }
    },

    'Phase_5': {
        name: 'Power',
        level: 'Power',
        acuteVariables: {
            reps: '1-5 (strength) + 8-10 (power)',
            sets: '3-5',
            intensity: '85-100% 1RM (strength) + 30-45% 1RM (power)',
            tempo: 'X/X/X (explosive)',
            rest: '1-2 min between exercises, 3-5 min between circuits',
            frequency: '2-4 sessions/week'
        },
        focus: 'Enhance rate of force production (speed × strength)',
        exerciseSelection: {
            characteristics: 'Supersets: heavy strength + explosive power',
            examples: ['squat + jump_squat', 'bench + med_ball_throw', 'deadlift + broad_jump'],
            progression: 'Increase strength loads, power complexity/velocity'
        },
        duration: '4 weeks',
        assessmentCriteria: ['power_output', 'explosive_capacity', 'speed_improvements'],
        optional: true,
        applicableGoals: ['sports_performance'],
        cardio: {
            type: 'Stage III - Anaerobic Power',
            intensity: '86-95% HRmax intervals',
            duration: '12-20 minutes',
            progression: 'Sport-specific energy system training'
        }
    }
};

// ===== NASM PROGRESSION MODELS =====

export const nasmProgressionModels = {
    'linear': {
        name: 'Linear Progression',
        description: 'Fixed 4-week phases in predetermined order',
        implementation: {
            phaseAdvancement: 'time_based',
            duration: '4 weeks per phase',
            flexibility: 'low',
            structure: 'Phase 1 → Phase 2 → Phase 3 → etc.',
            reassessment: 'end_of_phase',
            bestFor: 'beginners, structured programs'
        }
    },

    'adaptive': {
        name: 'Adaptive Progression',
        description: 'Criteria-based advancement when benchmarks are met',
        implementation: {
            phaseAdvancement: 'criteria_based',
            duration: '2-8 weeks per phase (varies)',
            flexibility: 'medium',
            structure: 'Advance when ready, extend if needed',
            reassessment: 'weekly_progress_checks',
            bestFor: 'individualized training, varying fitness levels'
        }
    },

    'rules_engine': {
        name: 'Rules Engine Auto-Regulation',
        description: 'Real-time adjustments based on performance and recovery',
        implementation: {
            phaseAdvancement: 'dynamic_auto_regulation',
            duration: 'flexible_based_on_data',
            flexibility: 'high',
            structure: 'Continuous micro-adjustments',
            reassessment: 'daily_readiness_continuous_monitoring',
            bestFor: 'advanced athletes, coached programs'
        }
    }
};

// ===== CORE TRAINING PROTOCOLS (NASM Ch. 9) =====

export const nasmCoreTraining = {
    purpose: 'LPHC stability to protect spine and transfer force between upper/lower extremities',

    phases: {
        stabilization_phase1: {
            exercise_type: 'Core-stabilization',
            exercises: '1-4',
            sets: '1-4',
            reps: '12-20',
            tempo: 'Slow 4-2-1',
            rest: '0-90s',
            examples: ['marching', 'floor_bridge', 'floor_prone_cobra', 'prone_iso_ab_plank']
        },
        strength_phases2_4: {
            exercise_type: 'Core-strength',
            exercises: '0-4',
            sets: '2-3',
            reps: '8-12',
            tempo: 'Medium',
            rest: '0-60s',
            examples: ['ball_crunch', 'back_extension', 'cable_rotation']
        },
        power_phase5: {
            exercise_type: 'Core-power',
            exercises: '0-2',
            sets: '2-3',
            reps: '8-12',
            tempo: 'Explosive (hold landing 3-5s)',
            rest: '0-60s',
            examples: ['rotation_chest_pass', 'ball_mb_pullover_throw', 'front_mb_oblique_throw', 'soccer_throw']
        }
    },

    programming_notes: [
        'Core training precedes load & velocity work',
        'Ensure proper stabilization first',
        'Match exercise type to client OPT phase'
    ]
};

// ===== BALANCE TRAINING PROTOCOLS (NASM Ch. 10) =====

export const nasmBalanceTraining = {
    definitions: {
        balance: 'Body in equilibrium with no linear or angular motion',
        dynamic_balance: 'Ability to move and change direction without loss of postural control',
        limit_of_stability: 'Furthest distance client can control COG over BOS'
    },

    benefits: [
        'Corrects altered joint mechanics',
        'Reduces injury risk (ankle sprain, ACL, low-back pain)',
        'Improves neuromuscular efficiency',
        'Reduces ground-contact time in sport movements'
    ],

    progression_variables: [
        'stable → unstable surface',
        'eyes open → closed',
        'bilateral → unilateral',
        'slow → fast'
    ],

    surfaces: ['floor', 'balance_beam', 'half_foam_roll', 'foam_pad', 'balance_disc', 'wobble_board', 'bosu'],

    phases: {
        stabilization_phase1: {
            exercise_type: 'Balance-stabilization',
            exercises: '1-3',
            sets: '1-3',
            reps: '12-20 / 6-10 single-leg',
            tempo: 'Slow 4-2-1',
            rest: '0-90s',
            examples: ['single_leg_balance', 'balance_reach', 'hip_rotation', 'lift_and_chop', 'throw_and_catch']
        },
        strength_phases2_4: {
            exercise_type: 'Balance-strength',
            exercises: '0-4',
            sets: '2-3',
            reps: '8-12',
            tempo: 'Medium',
            rest: '0-60s',
            examples: ['single_leg_squat', 'squat_touchdown', 'romanian_deadlift', 'multiplanar_step_up_to_balance', 'multiplanar_lunge_to_balance']
        },
        power_phase5: {
            exercise_type: 'Balance-power',
            exercises: '0-2',
            sets: '2-3',
            reps: '8-12',
            tempo: 'Controlled: stick 3-5s',
            rest: '0-60s',
            examples: ['multiplanar_hop_with_stabilization', 'single_leg_box_hop_up', 'single_leg_box_hop_down']
        }
    },

    implementation_tips: [
        'Introduce in Core/Balance/Plyometric block',
        'Progress surface OR visual challenge, not both simultaneously',
        'Maintain knee alignment over 2nd/3rd toe during single-leg tasks',
        'Use as active recovery between strength sets for general fitness'
    ]
};

// ===== WARM-UP & COOL-DOWN TEMPLATES =====

export const nasmWarmUpCoolDown = {
    warmup_templates: {
        stabilization_phase1: 'SMR + static stretch tight muscles → 5-10 min cardio low-moderate intensity',
        strength_phases2_4: 'SMR + active-isolated stretch → 5-10 min cardio',
        power_phase5: 'SMR + dynamic stretch circuit → may substitute for separate cardio'
    },

    cooldown_template: '5-10 min light cardio → SMR → static stretch prime movers',

    cardio_warmup: {
        goals: 'Increase HR & respiration, tissue temperature, psychological preparation',
        general: 'Non-specific rhythmic movement (treadmill walk)',
        specific: 'Dynamic movements mimicking activity',
        duration_intensity: '5-10 min at <60% VO2R'
    }
};

// ===== FITTE PRINCIPLE FOR CARDIO =====

export const nasmFITTEPrinciple = {
    frequency: '3-5 days/week moderate-vigorous; daily low-moderate for basic health',
    intensity: {
        methods: ['VO2R', 'HRR', '%HRmax', 'METs', 'RPE', 'Talk_test'],
        hrmax_formula: 'HRmax = 208 - 0.7 × age',
        rpe_guidelines: {
            moderate: '12-13 RPE',
            hard: '14-16 RPE'
        }
    },
    time: '≥150 min/week moderate OR 75 min vigorous; can be ≥10 min bouts',
    type: 'Rhythmic, large-muscle, continuous activities matched to OPT phase',
    enjoyment: 'Align mode with client preferences for adherence'
};

// ===== INTEGRATION TEMPLATES FOR OPT PHASES =====

export const nasmSessionTemplates = {
    phase1_example: {
        core: ['floor_bridge', 'prone_cobra'],
        balance: 'single_leg_balance_reach (2 × 12 reps)',
        flexibility: 'SMR + static stretch based on assessment findings'
    },

    phase3_example: {
        core: 'cable_rotations (3 × 10)',
        balance: 'single_leg_romanian_deadlift (2 × 10)',
        flexibility: 'SMR + active-isolated stretch'
    },

    phase5_example: {
        core_power: 'rotation_chest_pass (2 × 8)',
        balance_power: 'multiplanar_hop_to_stick (2 × 6 each plane)',
        flexibility: 'SMR + dynamic stretch circuit'
    }
};

// ===== PLYOMETRIC (REACTIVE) TRAINING CONCEPTS (NASM Ch. 11) =====

export const nasmPlyometricTraining = {
    purpose: 'Enhance rate of force production and neuromuscular control through stretch-shortening cycle',

    phases: {
        stabilization_phase1: {
            focus: 'Establish landing mechanics and postural control',
            exercises: '0-2',
            sets: '1-3',
            reps: '5-8',
            tempo: '3-5s hold on landing',
            rest: '0-90s',
            examples: [
                'squat_jump_to_stabilize',
                'box_jump_down_with_stabilization',
                'multiplanar_jump_to_stabilization'
            ],
            emphasis: 'Perfect landing mechanics, joint stability'
        },
        strength_phases2_4: {
            focus: 'Repetitive jumps with short ground contact time',
            exercises: '0-4',
            sets: '2-3',
            reps: '8-10',
            tempo: 'Repeating (minimize ground contact)',
            rest: '0-60s',
            examples: [
                'tuck_jumps',
                'butt_kicks',
                'power_step_ups',
                'ice_skaters',
                'single_leg_hops'
            ],
            emphasis: 'Force production, reactive strength'
        },
        power_phase5: {
            focus: 'Explosive, multidirectional movements',
            exercises: '0-2',
            sets: '2-3',
            reps: '8-12',
            tempo: 'Explosive',
            rest: '0-60s',
            examples: [
                'single_leg_box_hop_up',
                'depth_jumps',
                'multiplanar_bounds',
                'medicine_ball_explosive_throws'
            ],
            emphasis: 'Maximal power output, sport-specific patterns'
        }
    },

    safety_guidelines: {
        depth_jump_prerequisite: 'Client must squat ≥1.5× body weight',
        recovery_time: '48-72h between same muscle group power plyometrics',
        surface_progression: 'Stable → unstable surface progression',
        landing_technique: 'Soft landing, heel-to-toe, knees aligned'
    }
};

// ===== SPEED, AGILITY & QUICKNESS (SAQ) TRAINING (NASM Ch. 12) =====

export const nasmSAQTraining = {
    definitions: {
        speed: 'Distance ÷ time = stride rate × stride length',
        agility: 'Ability to accelerate, decelerate, stabilize & change direction quickly',
        quickness: 'Ability to react & change body position with maximal rate of force',
        frontside_mechanics: 'Triple flexion (ankle, knee, hip) during drive phase',
        backside_mechanics: 'Triple extension during support/recovery phase'
    },

    program_design: {
        stabilization_phase1: {
            drills: '4-6 low-inertia',
            sets: '1-2',
            reps: '2-3 each',
            rest: '0-60s',
            examples: [
                'marching_in_place',
                'heel_kicks',
                'straight_leg_march',
                'side_shuffle',
                'carioca'
            ]
        },
        strength_phases2_4: {
            drills: '6-8 moderate intensity',
            sets: '3-4',
            reps: '3-5 each',
            rest: '0-60s',
            examples: [
                'high_knees',
                'butt_kicks',
                'power_skips',
                '5-10-5_drill',
                'T_drill',
                'ladder_drills'
            ]
        },
        power_phase5: {
            drills: '6-10 high-velocity',
            sets: '3-5',
            reps: '3-5 each',
            rest: '0-90s',
            examples: [
                'flying_sprints',
                'resisted_sprints',
                'reaction_drills',
                'sport_specific_patterns',
                'plyometric_bounds'
            ]
        }
    },

    technique_checkpoints: {
        feet: 'Dorsiflexed and straight',
        knees: 'Track in line with toes',
        pelvis: 'Neutral position',
        head: 'In line with LPHC',
        arms: 'Reciprocal swing, 90-degree elbow angle'
    },

    population_applications: {
        youth: ['red_light_green_light', 'follow_the_snake', 'animal_movements'],
        weight_loss: ['jump_rope_cone_shuttle_circuits', 'ladder_combinations'],
        seniors: ['cone_step_overs', 'stand_up_to_figure_8', 'reaction_drills']
    }
};

// ===== RESISTANCE TRAINING CONCEPTS (NASM Ch. 13) =====

export const nasmResistanceTraining = {
    adaptation_principles: {
        general_adaptation_syndrome: {
            alarm: 'Initial shock/stress response to training',
            resistance_development: 'Body adapts and becomes stronger',
            exhaustion: 'Overtraining - performance decreases'
        },
        SAID_principle: {
            mechanical_specificity: 'Weight and movement pattern',
            neuromuscular_specificity: 'Contraction speed and exercise selection',
            metabolic_specificity: 'Work/rest ratios and energy system training'
        }
    },

    key_adaptations: {
        stabilization: {
            focus: 'Joint alignment and postural control',
            characteristics: 'High reps, low-moderate load, slow tempo'
        },
        muscular_endurance: {
            focus: 'Sustain force production',
            characteristics: 'High reps (12-20), moderate load (50-70%)'
        },
        hypertrophy: {
            focus: 'Increase cross-sectional area',
            characteristics: 'Moderate reps (6-12), progressive overload (75-85%)'
        },
        strength: {
            focus: 'Maximal force production',
            characteristics: 'Low reps (1-5), high load (85-100%)'
        },
        power: {
            focus: 'Force × velocity',
            characteristics: 'Heavy/light supersets, explosive movement'
        }
    },

    training_systems: {
        single_set: 'One set per exercise',
        multiple_set: 'Multiple sets per exercise',
        pyramid: 'Light→heavy or heavy→light progression',
        superset: 'Same or antagonist muscle pairs back-to-back',
        drop_set: 'Reduce weight and continue reps to failure',
        circuit: 'Multiple exercises with minimal rest',
        peripheral_heart_action: 'Upper/lower body alternating exercises',
        split_routine: 'Different body parts on different days',
        vertical_loading: 'Cycle through different exercises/body parts',
        horizontal_loading: 'Complete all sets of one exercise before moving'
    }
};

// ===== ACUTE TRAINING VARIABLES & PROGRAM DESIGN (NASM Ch. 14) =====

export const nasmAcuteVariables = {
    variable_definitions: {
        repetitions: {
            role: 'Time-under-tension; dictates energy system & motor unit recruitment',
            manipulation: '1-5 (max strength), 6-12 (hypertrophy), 12-20 (endurance)'
        },
        sets: {
            role: 'Total exposure to stimulus',
            manipulation: 'Inversely related to reps/intensity'
        },
        intensity: {
            role: '% of 1RM or load relative to effort',
            manipulation: '50-70% (endurance), 75-85% (hypertrophy), 85-100% (max strength)'
        },
        tempo: {
            role: 'Controls muscle action emphasis',
            manipulation: '4/2/1 (stabilization), 2/0/2 (hypertrophy), x/x/x (strength/power)'
        },
        rest: {
            role: 'ATP-PC recovery & hormonal response',
            manipulation: '0-90s (endurance), 0-60s (hypertrophy), 3-5min (strength/power)'
        }
    },

    program_design_continuum: {
        endurance_stabilization: {
            reps: '12-20',
            sets: '1-3',
            intensity: '50-70%',
            tempo: '4-2-1',
            rest: '0-90s'
        },
        hypertrophy: {
            reps: '6-12',
            sets: '3-5',
            intensity: '75-85%',
            tempo: '2-0-2',
            rest: '0-60s'
        },
        max_strength: {
            reps: '1-5',
            sets: '4-6',
            intensity: '85-100%',
            tempo: 'x/x/x',
            rest: '3-5min'
        },
        power: {
            reps: '1-10',
            sets: '3-6',
            intensity: '30-45% (weight) / 10% BW (medicine ball)',
            tempo: 'explosive',
            rest: '3-5min'
        }
    },

    atp_pc_recovery: {
        '20-30s': '50% restoration',
        '40s': '75% restoration',
        '60s': '85-90% restoration',
        '3min': '100% restoration'
    }
};

// ===== PERIODIZATION & PROGRAM PLANNING =====

export const nasmPeriodization = {
    macrocycle: {
        definition: 'Annual plan (12 months)',
        structure: 'Stabilization → Strength → Power blocks',
        example: '4wk Ph1 → 8wk Ph2-3 → 6wk Ph4, deload, 4wk Ph5'
    },
    mesocycle: {
        definition: 'Monthly plan (4 weeks)',
        structure: 'Phase-specific focus',
        example: 'Ph1 Stabilization Endurance → Ph2 Strength Endurance'
    },
    microcycle: {
        definition: 'Weekly plan',
        structure: 'Day-to-day phase distribution',
        example: 'M Ph2; T Cardio & Core; W Ph2; F Ph1 recovery'
    },
    undulating: {
        definition: 'Integrate Ph1/3/5 within same week after base established',
        application: 'Advanced clients, variety, avoid plateaus'
    }
};

// ===== STABILIZATION & SURFACE PROGRESSION =====

export const nasmProgressionProtocols = {
    lower_body_surfaces: [
        'floor',
        'sport_beam',
        'half_foam_roll',
        'foam_pad',
        'balance_disc',
        'wobble_board',
        'bosu'
    ],
    upper_body_grip_progression: [
        'two_arm',
        'alternating_arms',
        'single_arm',
        'single_arm_with_trunk_rotation'
    ],
    programming_checklist: [
        'assess_goals_readiness_movement',
        'select_phase_per_opt_hierarchy',
        'choose_exercises_matching_phase_compensations',
        'dial_acute_variables',
        'layout_micro_to_macro_cycles',
        'monitor_and_reassess_every_4_6_weeks'
    ]
};

// ===== INTEGRATION TEMPLATES FOR COMPLETE OPT SESSIONS =====

export const nasmCompleteSessionTemplates = {
    phase1_stabilization: {
        warmup: {
            cardio: '5-10min low-moderate intensity',
            flexibility: 'SMR + static stretch tight muscles',
            activation: 'corrective exercises based on assessment'
        },
        core_balance_plyometric: {
            core: 'stabilization exercises (1-4 exercises, 1-4 sets, 12-20 reps)',
            balance: 'stabilization exercises (1-3 exercises, 1-3 sets, 12-20 reps)',
            plyometric: 'stabilization exercises (0-2 exercises, 1-3 sets, 5-8 reps)'
        },
        saq: 'low-inertia drills (4-6 drills, 1-2 sets, 2-3 reps each)',
        resistance: {
            total_body: 'stabilization exercises',
            chest: 'stabilization exercises',
            back: 'stabilization exercises',
            shoulders: 'stabilization exercises',
            biceps: 'stabilization exercises',
            triceps: 'stabilization exercises',
            legs: 'stabilization exercises'
        },
        cooldown: {
            cardio: '5-10min light activity',
            flexibility: 'SMR + static stretch prime movers'
        }
    },

    phase3_hypertrophy: {
        warmup: {
            cardio: '5-10min moderate intensity',
            flexibility: 'SMR + active-isolated stretch',
            activation: 'movement preparation exercises'
        },
        core_balance_plyometric: {
            core: 'strength exercises (0-4 exercises, 2-3 sets, 8-12 reps)',
            balance: 'strength exercises (0-4 exercises, 2-3 sets, 8-12 reps)',
            plyometric: 'strength exercises (0-4 exercises, 2-3 sets, 8-10 reps)'
        },
        saq: 'moderate intensity drills (6-8 drills, 3-4 sets, 3-5 reps each)',
        resistance: {
            structure: 'strength superset (strength + stabilization)',
            chest: 'strength + stabilization superset',
            back: 'strength + stabilization superset',
            shoulders: 'strength + stabilization superset',
            biceps: 'strength + stabilization superset',
            triceps: 'strength + stabilization superset',
            legs: 'strength + stabilization superset'
        },
        cooldown: {
            cardio: '5-10min light activity',
            flexibility: 'SMR + static stretch prime movers'
        }
    },

    phase5_power: {
        warmup: {
            cardio: '5-10min sport-specific movements',
            flexibility: 'SMR + dynamic stretch circuit',
            activation: 'movement preparation + neural activation'
        },
        core_balance_plyometric: {
            core: 'power exercises (0-2 exercises, 2-3 sets, 8-12 reps)',
            balance: 'power exercises (0-2 exercises, 2-3 sets, 8-12 reps)',
            plyometric: 'power exercises (0-2 exercises, 2-3 sets, 8-12 reps)'
        },
        saq: 'high-velocity drills (6-10 drills, 3-5 sets, 3-5 reps each)',
        resistance: {
            structure: 'power superset (strength + power)',
            chest: 'strength + power superset',
            back: 'strength + power superset',
            shoulders: 'strength + power superset',
            legs: 'strength + power superset'
        },
        cooldown: {
            cardio: '5-10min light activity',
            flexibility: 'SMR + static stretch prime movers'
        }
    }
};

// ===== STARTING PHASE DETERMINATION =====

export const determineNASMStartingPhase = (assessmentResults, experienceLevel) => {
    if (!assessmentResults) {
        return {
            phase: 'Phase_1',
            duration: '4 weeks',
            focus: 'Foundation building',
            reason: 'No assessment data - default to Phase 1'
        };
    }

    const compensationCount = assessmentResults.compensationCount || 0;
    const riskLevel = assessmentResults.riskLevel || 'Low';

    // Rules for starting phase based on movement assessment
    if (compensationCount >= 3 || riskLevel === 'High') {
        return {
            phase: 'Phase_1',
            duration: '6-8 weeks',
            focus: 'Extensive corrective work',
            reason: 'Multiple significant compensations detected'
        };
    }

    if (compensationCount >= 1 || riskLevel === 'Moderate' || experienceLevel === 'beginner') {
        return {
            phase: 'Phase_1',
            duration: '4-6 weeks',
            focus: 'Standard stabilization with correctives',
            reason: 'Movement compensations present or new to training'
        };
    }

    if (experienceLevel === 'advanced' && compensationCount === 0 && riskLevel === 'Low') {
        return {
            phase: 'Phase_2',
            duration: '4 weeks',
            focus: 'Strength endurance with movement validation',
            reason: 'Excellent movement quality and training experience'
        };
    }

    // Default
    return {
        phase: 'Phase_1',
        duration: '4 weeks',
        focus: 'Foundation building',
        reason: 'Standard OPT model entry point'
    };
};

// ===== NASM TIMELINE PLANNING =====

export const nasmTimelinePlanning = {
    macrocycle: {
        duration: '12 months',
        structure: 'Annual periodization plan',
        phases: 'Mapped across year based on goal'
    },

    mesocycle: {
        duration: '4-6 weeks',
        structure: 'Individual OPT phases',
        focus: 'Single adaptation emphasis'
    },

    microcycle: {
        duration: '1 week',
        structure: '2-6 sessions per week',
        planning: 'Daily workout scheduling'
    },

    // Goal-specific annual plans
    annualPlans: {
        fat_loss: 'Jan(P1) → Feb(P2) → Mar(P1) → Apr(P2) → repeat alternating',
        hypertrophy: 'Jan(P1) → Feb(P2) → Mar(P3) → Apr(P4) → May(P2) → Jun(P3) → Jul(P4)',
        max_strength: 'Jan(P1) → Feb(P2) → Mar(P4) → Apr(P1) → May(P2) → Jun(P4)',
        sports_performance: 'Jan(P1) → Feb(P2) → Mar(P5) → Apr+(undulating P1,P2,P5 weekly)',
        general_fitness: 'Jan(P1) → Feb(P2) → Mar(P1) → Apr(P2) → May(variation) → repeat'
    }
};

// ===== NASM PROGRAM GENERATION ENGINE =====

export const generateNASMProgram = (clientData) => {
    const {
        goal,
        assessmentResults,
        experienceLevel,
        timeline,
        progressionModel = 'linear',
        populationType = null
    } = clientData;

    // Step 1: Determine goal pathway
    const pathway = nasmGoalPathways[goal] || nasmGoalPathways['general_fitness'];

    // Step 2: Determine starting phase from assessments
    const startingPhase = determineNASMStartingPhase(assessmentResults, experienceLevel);

    // Step 3: Generate corrective strategies from existing muscle lookup
    const correctiveStrategies = assessmentResults?.analysis ?
        generateCorrectiveStrategies(assessmentResults.analysis) : null;

    // Step 4: Create phase progression plan
    const phasePlan = createNASMPhasePlan({
        pathway,
        startingPhase,
        timeline,
        progressionModel,
        populationType
    });

    // Step 5: Generate workouts with OPT acute variables
    const workouts = generateNASMWorkouts({
        phasePlan,
        correctiveStrategies,
        pathway,
        populationType
    });

    // Step 6: Create reassessment schedule
    const reassessmentSchedule = generateReassessmentPlan(phasePlan);

    return {
        methodology: 'NASM',
        goal,
        pathway,
        startingPhase,
        correctiveStrategies,
        phasePlan,
        workouts,
        reassessmentSchedule,
        progressionModel,
        populationType
    };
};

// ===== HELPER FUNCTIONS =====

const generateCorrectiveStrategies = (analysis) => {
    if (!analysis || (!analysis.overactive && !analysis.underactive)) {
        return null;
    }

    return {
        overactive: analysis.overactive || [],
        underactive: analysis.underactive || [],
        priority: analysis.priority || [],
        warmupCorrectives: generateWarmupCorrectives(analysis),
        cooldownCorrectives: generateCooldownCorrectives(analysis)
    };
};

const generateWarmupCorrectives = (analysis) => {
    const warmup = [];

    // Add inhibition exercises for overactive muscles
    if (analysis.overactive) {
        analysis.overactive.forEach(muscle => {
            warmup.push({
                type: 'inhibition',
                exercise: `${muscle.muscle} SMR`,
                duration: '30-60 seconds',
                reason: muscle.reason
            });
        });
    }

    // Add activation exercises for underactive muscles
    if (analysis.underactive) {
        analysis.underactive.forEach(muscle => {
            warmup.push({
                type: 'activation',
                exercise: `${muscle.muscle} activation`,
                duration: '10-15 reps',
                reason: muscle.reason
            });
        });
    }

    return warmup;
};

const generateCooldownCorrectives = (analysis) => {
    const cooldown = [];

    // Add lengthening exercises for overactive muscles
    if (analysis.overactive) {
        analysis.overactive.forEach(muscle => {
            cooldown.push({
                type: 'lengthening',
                exercise: `${muscle.muscle} static stretch`,
                duration: '30 seconds',
                reason: muscle.reason
            });
        });
    }

    return cooldown;
};

const createNASMPhasePlan = ({ pathway, startingPhase, timeline, progressionModel, populationType }) => {
    const plan = {
        totalDuration: timeline?.weeks || 12,
        progression: progressionModel,
        startingPhase: startingPhase.phase,
        phases: [],
        populationModifications: populationType ? getPopulationModifications(populationType) : null
    };

    // Create phase sequence based on goal pathway
    let currentWeek = 1;
    const phaseSequence = pathway.phases;

    phaseSequence.forEach((phaseId, index) => {
        const phase = nasmOPTPhases[phaseId];
        const duration = index === 0 ? parseInt(startingPhase.duration.split(' ')[0]) : 4;

        plan.phases.push({
            id: phaseId,
            name: phase.name,
            startWeek: currentWeek,
            endWeek: currentWeek + duration - 1,
            duration,
            focus: phase.focus,
            acuteVariables: phase.acuteVariables,
            assessmentCriteria: phase.assessmentCriteria
        });

        currentWeek += duration;
    });

    return plan;
};

const generateNASMWorkouts = ({ phasePlan, correctiveStrategies, pathway, populationType }) => {
    const workouts = [];

    phasePlan.phases.forEach(phase => {
        const phaseSpec = nasmOPTPhases[phase.id];

        // Generate weekly workout structure
        for (let week = phase.startWeek; week <= phase.endWeek; week++) {
            const weeklyWorkouts = generateWeeklyNASMWorkouts({
                phase: phaseSpec,
                week,
                correctiveStrategies,
                populationType
            });

            workouts.push({
                week,
                phase: phase.id,
                workouts: weeklyWorkouts
            });
        }
    });

    return workouts;
};

const generateWeeklyNASMWorkouts = ({ phase, week, correctiveStrategies, populationType }) => {
    const frequency = parseInt(phase.acuteVariables.frequency.split('-')[0]) || 3;
    const workouts = [];

    for (let day = 1; day <= frequency; day++) {
        const workout = {
            day,
            phase: phase.name,
            warmup: generateNASMWarmup(correctiveStrategies, populationType),
            main: generateNASMMainWorkout(phase, populationType),
            cooldown: generateNASMCooldown(correctiveStrategies, populationType)
        };

        workouts.push(workout);
    }

    return workouts;
};

const generateNASMWarmup = (correctiveStrategies, populationType) => {
    const warmup = [
        { exercise: 'General warm-up', duration: '5-10 minutes', type: 'cardio' }
    ];

    if (correctiveStrategies?.warmupCorrectives) {
        warmup.push(...correctiveStrategies.warmupCorrectives);
    }

    // Add population-specific warm-up modifications
    if (populationType) {
        warmup.push(...getPopulationWarmupModifications(populationType));
    }

    return warmup;
};

const generateNASMMainWorkout = (phase, populationType) => {
    // This would contain the main workout based on phase specifications
    // For now, return basic structure
    return {
        type: 'main_workout',
        phase: phase.name,
        acuteVariables: phase.acuteVariables,
        exerciseSelection: phase.exerciseSelection,
        populationModifications: populationType ? getPopulationExerciseModifications(populationType) : null
    };
};

const generateNASMCooldown = (correctiveStrategies, populationType) => {
    const cooldown = [
        { exercise: 'Cool-down cardio', duration: '5-10 minutes', type: 'cardio' }
    ];

    if (correctiveStrategies?.cooldownCorrectives) {
        cooldown.push(...correctiveStrategies.cooldownCorrectives);
    }

    return cooldown;
};

const generateReassessmentPlan = (phasePlan) => {
    const schedule = [];

    phasePlan.phases.forEach(phase => {
        schedule.push({
            week: phase.endWeek,
            type: 'phase_completion_assessment',
            assessments: ['movement_screen', 'performance_metrics'],
            criteria: phase.assessmentCriteria
        });
    });

    return schedule;
};

// ===== POPULATION MODIFICATIONS =====

const getPopulationModifications = (populationType) => {
    const modifications = {
        'pregnancy': {
            restrictions: ['supine_exercises_after_first_trimester', 'high_impact_movements'],
            modifications: ['avoid_valsalva_maneuver', 'monitor_heart_rate', 'pelvic_floor_focus'],
            specialConsiderations: ['hydration_emphasis', 'temperature_regulation']
        },
        'elderly': {
            restrictions: ['high_impact_plyometrics', 'maximal_loads'],
            modifications: ['extended_warm_up', 'balance_emphasis', 'fall_prevention_focus'],
            specialConsiderations: ['medication_interactions', 'bone_density_considerations']
        },
        'injury': {
            restrictions: ['depends_on_injury_type'],
            modifications: ['pain_free_range_of_motion', 'progressive_loading'],
            specialConsiderations: ['clearance_from_healthcare_provider', 'symptom_monitoring']
        }
    };

    return modifications[populationType] || null;
};

const getPopulationWarmupModifications = (populationType) => {
    const modifications = {
        'pregnancy': [
            { exercise: 'Pelvic tilts', duration: '10 reps', type: 'mobility' },
            { exercise: 'Cat-cow stretches', duration: '10 reps', type: 'mobility' }
        ],
        'elderly': [
            { exercise: 'Joint mobility sequence', duration: '5 minutes', type: 'mobility' },
            { exercise: 'Balance challenges', duration: '3 minutes', type: 'stability' }
        ],
        'injury': [
            { exercise: 'Specific injury warm-up', duration: 'as tolerated', type: 'therapeutic' }
        ]
    };

    return modifications[populationType] || [];
};

const getPopulationExerciseModifications = (populationType) => {
    const modifications = {
        'pregnancy': {
            avoid: ['prone_exercises', 'supine_exercises_after_16_weeks', 'contact_sports'],
            modify: ['reduce_intensity_as_pregnancy_progresses', 'focus_on_functional_movements'],
            add: ['pelvic_floor_exercises', 'postural_exercises']
        },
        'elderly': {
            avoid: ['high_impact_exercises', 'ballistic_movements'],
            modify: ['slower_movement_speeds', 'assisted_exercises_if_needed'],
            add: ['balance_training', 'fall_prevention_exercises', 'bone_loading_exercises']
        },
        'injury': {
            avoid: ['pain_provoking_movements', 'exercises_contradicted_by_healthcare_provider'],
            modify: ['pain_free_range_of_motion', 'reduced_loads_initially'],
            add: ['corrective_exercises', 'therapeutic_exercises']
        }
    };

    return modifications[populationType] || null;
};

export default {
    nasmMethodologyConfig,
    nasmGoalPathways,
    nasmExperienceMapping,
    nasmOPTPhases,
    nasmProgressionModels,
    determineNASMStartingPhase,
    nasmTimelinePlanning,
    generateNASMProgram
};
