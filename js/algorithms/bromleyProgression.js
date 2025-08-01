/**
 * Bromley Base Strength Integration
 * Implements Alex Bromley's SRN Framework and Wave Periodization
 * Integration with PowerHouse goal-first training system
 */

// SRN Framework: Specificity, Recovery, Novelty
export const SRN_FRAMEWORK = {
    // Specificity: Match training to goal
    SPECIFICITY: {
        strength: {
            compatible_systems: ['5/3/1', 'conjugate', 'linear'],
            phase_focus: 'peak',
            intensity_range: [80, 100],
            exercise_type: 'competition_specific'
        },
        hypertrophy: {
            compatible_systems: ['RP', 'bodybuilding', 'high_volume'],
            phase_focus: 'base',
            intensity_range: [65, 75],
            exercise_type: 'non_specific_variations'
        },
        powerlifting: {
            compatible_systems: ['5/3/1', 'conjugate', 'bulgarian'],
            phase_focus: 'peak',
            intensity_range: [85, 100],
            exercise_type: 'competition_lifts'
        },
        motor_control: {
            compatible_systems: ['linear', 'functional'],
            phase_focus: 'base',
            intensity_range: [55, 70],
            exercise_type: 'movement_quality'
        },
        weight_loss: {
            compatible_systems: ['RP', 'circuit', 'hybrid'],
            phase_focus: 'base',
            intensity_range: [60, 70],
            exercise_type: 'metabolic_focus'
        },
        general_fitness: {
            compatible_systems: ['hybrid', 'circuit'],
            phase_focus: 'alternating',
            intensity_range: [60, 80],
            exercise_type: 'balanced'
        },
        athletic_performance: {
            compatible_systems: ['conjugate', 'block'],
            phase_focus: 'peak',
            intensity_range: [70, 95],
            exercise_type: 'sport_specific'
        }
    },

    // Recovery: Experience-based recovery protocols
    RECOVERY: {
        novice: {
            wave_structure: 'high_frequency_waves',
            frequency: '3x_per_week',
            deload_frequency: 'every_3_weeks',
            adaptation_rate: 'fast'
        },
        intermediate: {
            wave_structure: 'weekly_waves',
            frequency: '2x_per_week',
            deload_frequency: 'every_4_weeks',
            adaptation_rate: 'moderate'
        },
        advanced: {
            wave_structure: 'block_waves',
            frequency: '1x_per_week',
            deload_frequency: 'every_6_weeks',
            adaptation_rate: 'slow'
        }
    },

    // Novelty: Plateau-breaking strategies
    NOVELTY: {
        base_phase: {
            strategy: 'exercise_variation',
            variations: ['grip_changes', 'stance_changes', 'tempo_changes'],
            frequency: 'every_mesocycle'
        },
        peak_phase: {
            strategy: 'specificity_focus',
            variations: ['competition_commands', 'competition_timing'],
            frequency: 'minimal'
        },
        plateau: {
            strategy: 'SRN_reset',
            changes: ['new_exercise', 'new_rep_range', 'new_frequency'],
            duration: '2-4_weeks'
        }
    }
};

// Phase Structure: Base vs Peak
export const BROMLEY_PHASES = {
    BASE_PHASE: {
        name: 'Base Building',
        duration_weeks: [6, 12],
        intensity_percent: [55, 80],
        volume: 'high',
        exercises: 'non_specific_variations',
        rep_ranges: [8, 12],
        sets_range: [3, 5],
        progression_type: 'volumizing_waves',
        primary_goals: ['muscle_mass', 'work_capacity', 'movement_base'],
        characteristics: [
            'High volume training',
            'Lower intensity work',
            'Exercise variety',
            'General preparedness',
            'Foundation building'
        ]
    },

    PEAK_PHASE: {
        name: 'Peaking/Realization',
        duration_weeks: [3, 6],
        intensity_percent: [80, 100],
        volume: 'low',
        exercises: 'competition_specific',
        rep_ranges: [1, 6],
        sets_range: [3, 5],
        progression_type: 'intensifying_waves',
        primary_goals: ['max_strength', 'neural_adaptation', 'competition_prep'],
        characteristics: [
            'Low volume training',
            'High intensity work',
            'Exercise specificity',
            'Skill refinement',
            'Performance peaking'
        ]
    }
};

// Wave Progression Algorithms
export class BromleyWaveProgression {

    /**
     * Volumizing Wave: Add sets/reps while maintaining intensity
     * Example: 3x12@65% → 4x10@67.5% → 5x8@70%
     */
    static volumizingWave(startingSets, startingReps, startingPercent) {
        return [
            {
                week: 1,
                sets: startingSets,
                reps: startingReps,
                percent: startingPercent,
                rpe_target: [6, 7],
                description: 'Easy week - establish baseline'
            },
            {
                week: 2,
                sets: startingSets + 1,
                reps: Math.max(startingReps - 2, 6),
                percent: startingPercent + 2.5,
                rpe_target: [7, 8],
                description: 'Medium week - increase volume and intensity'
            },
            {
                week: 3,
                sets: startingSets + 2,
                reps: Math.max(startingReps - 4, 5),
                percent: startingPercent + 5,
                rpe_target: [8, 9],
                description: 'Hard week - peak volume'
            }
        ];
    }

    /**
     * Intensifying Wave: Drop reps while increasing intensity
     * Example: 5x5@75% → 4x4@80% → 3x3@85%
     */
    static intensifyingWave(startingSets, startingReps, startingPercent) {
        return [
            {
                week: 1,
                sets: startingSets,
                reps: startingReps,
                percent: startingPercent,
                rpe_target: [7, 8],
                description: 'Build week - moderate intensity'
            },
            {
                week: 2,
                sets: startingSets,
                reps: Math.max(startingReps - 1, 2),
                percent: startingPercent + 5,
                rpe_target: [8, 9],
                description: 'Intensify week - higher load'
            },
            {
                week: 3,
                sets: startingSets,
                reps: Math.max(startingReps - 2, 1),
                percent: startingPercent + 10,
                rpe_target: [9, 10],
                description: 'Peak week - maximum intensity'
            }
        ];
    }

    /**
     * Calculate Bromley Tonnage
     * Total volume = Sets × Reps × Weight
     */
    static calculateTonnage(sets, reps, weight) {
        return sets * reps * weight;
    }

    /**
     * Progressive Wave Tonnage calculation
     * Accounts for increasing intensity offsetting rep reductions
     */
    static calculateWaveTonnage(oneRepMax, waveProgression) {
        return waveProgression.map(week => {
            const weight = oneRepMax * (week.percent / 100);
            const tonnage = this.calculateTonnage(week.sets, week.reps, weight);
            return {
                ...week,
                weight: Math.round(weight * 2) / 2, // Round to nearest 2.5lbs
                tonnage: Math.round(tonnage),
                effective_volume: week.sets * week.reps
            };
        });
    }
}

// Bromley Assessment Protocols
export const BROMLEY_ASSESSMENTS = {
    // Baseline Testing via AMRAP
    BASELINE_TESTING: {
        method: 'AMRAP_at_percentage',
        test_percentages: [65, 70, 75],
        rep_max_coefficients: {
            5: 1.15,
            6: 1.20,
            8: 1.28,
            10: 1.33,
            12: 1.37,
            15: 1.45
        },

        // Calculate 1RM from AMRAP result
        calculate1RM(weight, reps) {
            const coefficient = this.rep_max_coefficients[reps] ||
                (1 + (reps / 30)); // Fallback formula for unusual rep counts
            return Math.round(weight * coefficient);
        }
    },

    // Readiness Monitoring
    READINESS_MONITORING: {
        rpe_range: [6, 9],
        optimal_rpe: {
            week_1: [6, 7], // Easy week
            week_2: [7, 8], // Medium week  
            week_3: [8, 9]  // Hard week
        },

        fatigue_indicators: [
            'stalled_wave_progression',
            'reduced_AMRAP_performance',
            'joint_discomfort',
            'elevated_resting_HR',
            'poor_sleep_quality'
        ],

        recovery_markers: [
            'DOMS_resolution',
            'improved_wave_performance',
            'energy_levels',
            'motivation_levels',
            'HRV_normalization'
        ]
    }
};

// Integration with existing PowerHouse systems
export const POWERHOUSE_BROMLEY_INTEGRATION = {
    // Enhanced goal-system compatibility
    enhanceGoalSelector(currentGoals) {
        return currentGoals.map(goal => ({
            ...goal,
            bromley_phase: SRN_FRAMEWORK.SPECIFICITY[goal.id]?.phase_focus || 'base',
            wave_type: goal.primary_goal === 'strength' ? 'intensifying' : 'volumizing',
            recovery_protocol: 'intermediate' // Default, should be assessed
        }));
    },

    // Integration with RP system
    customizeRPSystem(goal, experience_level) {
        const specificity = SRN_FRAMEWORK.SPECIFICITY[goal];
        const recovery = SRN_FRAMEWORK.RECOVERY[experience_level];

        return {
            phase_structure: specificity.phase_focus,
            intensity_range: specificity.intensity_range,
            wave_structure: recovery.wave_structure,
            deload_frequency: recovery.deload_frequency,
            exercise_selection: specificity.exercise_type
        };
    },

    // Integration with 5/3/1 system  
    enhance531System(currentProgram) {
        return {
            ...currentProgram,
            wave_periodization: true,
            base_phase_option: true,
            bromley_assessments: BROMLEY_ASSESSMENTS.BASELINE_TESTING
        };
    }
};

export default {
    SRN_FRAMEWORK,
    BROMLEY_PHASES,
    BromleyWaveProgression,
    BROMLEY_ASSESSMENTS,
    POWERHOUSE_BROMLEY_INTEGRATION
};
